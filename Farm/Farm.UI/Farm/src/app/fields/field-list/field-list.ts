import { Component, ElementRef, HostListener, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { FieldService } from '../../services/field-service';
import { GetFarmWithFields, GetField} from '../../Models/getFarmWithFields';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatLabel, MatFormField, MatSelect, MatOption } from "@angular/material/select";
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FarmDetails } from '../../farms/farm-details/farm-details';
import { FarmService } from '../../services/farm-service';
import { CropService } from '../../services/crop-service';
import { CropDetails } from '../../Crops/crop-details/crop-details';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AddField } from '../add-field/add-field';
import { AddCrop } from '../../Crops/add-crop/add-crop';
import { UpdateCrop } from '../../Crops/update-crop/update-crop';

@Component({
  selector: 'app-field-list',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatInput,
    MatLabel,
    MatFormFieldModule,
    MatSelect,
    MatOption
],
  templateUrl: './field-list.html',
  styleUrl: './field-list.css',
})
export class FieldList implements OnInit , OnDestroy{


  farms = signal<GetFarmWithFields[]>([]);
  isLoading = signal(false);
  pageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 4,
    length: 0,
    previousPageIndex: 0
  };


  constructor(private farmService: FarmService,
              private fieldService: FieldService,
              private dialog: MatDialog,
              private cropService: CropService) {}


  ngOnInit(): void {
    this.loadSearchHistory();
    this.loadFarms();
    this.setupDelayedSearch();
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }


  //search
  //start
  searchHistory: string[] = [];
  showHistory: boolean = false;

  private lastSavedSearch: string = '';
  private searchSubject = new Subject<string>();
  private readonly SEARCH_DELAY = 1000;
  @ViewChild('searchWrapper') searchWrapper!: ElementRef;

  searchTerm = '';
  sortBy = 'name';
  sortDesc = false;

  private setupDelayedSearch(): void {
    this.searchSubject.pipe(
      debounceTime(this.SEARCH_DELAY),
      distinctUntilChanged()
    ).subscribe(() => {
      this.performActualSearch();
    });
  }

  private performActualSearch(): void {
    if (this.searchTerm?.trim()) {
      this.saveToHistory(this.searchTerm.trim());
    }
    this.pageEvent.pageIndex = 0;
    this.loadFarms();
  }

  private saveToHistory(term: string): void {
    if (!term || term.trim() === '') return;

    if (term === this.lastSavedSearch) return;

    const filtered = this.searchHistory.filter(t => t !== term);
    filtered.unshift(term);
    this.searchHistory = filtered.slice(0, 10);

    localStorage.setItem('fieldSearchHistory', JSON.stringify(this.searchHistory));
    this.lastSavedSearch = term;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (this.searchWrapper && !this.searchWrapper.nativeElement.contains(event.target)) {
      this.showHistory = false;
    }
  }

  get filteredSearchHistory(): string[] {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      return this.searchHistory;
    }
    return this.searchHistory.filter(term =>
      term.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  private loadSearchHistory(): void {
    const saved = localStorage.getItem('farmSearchHistory');
    if (saved) {
      this.searchHistory = JSON.parse(saved);
      if (this.searchHistory.length > 0) {
        this.lastSavedSearch = this.searchHistory[0];
      }
    }
  }

  selectFromHistory(term: string): void {
    this.searchTerm = term;
    this.showHistory = false;
    if (this.searchTerm.trim()) {
      this.saveToHistory(this.searchTerm.trim());
    }
    this.pageEvent.pageIndex = 0;
    this.loadFarms();
  }

  removeFromHistory(term: string, event: Event): void {
    event.stopPropagation();
    this.searchHistory = this.searchHistory.filter(t => t !== term);
    localStorage.setItem('farmSearchHistory', JSON.stringify(this.searchHistory));

    if (this.lastSavedSearch === term && this.searchHistory.length > 0) {
      this.lastSavedSearch = this.searchHistory[0];
    } else if (this.searchHistory.length === 0) {
      this.lastSavedSearch = '';
    }

    if (this.searchHistory.length === 0) {
      this.showHistory = false;
    }
  }

  clearAllHistory(): void {
    this.searchHistory = [];
    this.lastSavedSearch = '';
    localStorage.removeItem('farmSearchHistory');
    this.showHistory = false;
  }

  toggleHistory(): void {
    if (this.filteredSearchHistory.length > 0) {
      this.showHistory = true;
      this.setupDelayedSearch()
    }
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);

    if (this.searchTerm?.trim()) {
      this.toggleHistory();
    }
  }

  highlightMatch(term: string): string {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      return term;
    }
    const searchPattern = new RegExp(`(${this.escapeRegex(this.searchTerm)})`, 'gi');
    return term.replace(searchPattern, `<mark class="highlight">$1</mark>`);
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  //end search

  openFarmDetails(farm: GetFarmWithFields): void {
    const farmDetails = this.farmService.getFarmById(farm.id)
    farmDetails.subscribe((farm) => {
      this.dialog.open(FarmDetails, {
        data: { farm },
        width: '700px',
        disableClose: false,
        autoFocus: true
      })
      console.log(farm)
    })
  }
  openCropDetails(field: GetField): void {
    const cropDetails = this.cropService.getCropById(field.cropId)
    this.dialog.open(CropDetails, {
      data: { cropDetails },
      width: '700px',
      disableClose: false,
      autoFocus: true
    });
  }
  openAddCrop(fieldId: string|undefined) : void {
    const dialogRef = this.dialog.open(AddCrop, {
      data: { fieldId },
      width: '650px',
      disableClose: true,
      autoFocus: true
    });
  }

  openUpdateCrop(cropId: string|undefined) {
    const dialogRef = this.dialog.open(UpdateCrop, {
      data: { cropId },
      width: '650px',
      disableClose: true,
      autoFocus: true
    });
  }

  openAddField(farmId: string) : void {
    const dialogRef = this.dialog.open(AddField, {
      data: {farmId},
      width: '650px',
      disableClose: true,
      autoFocus: true
    });
  }

  onPageChange(event: PageEvent) {
    this.pageEvent = event
    this.loadFarms();
  }

  onSearch() {
    this.pageEvent.pageIndex = 0;
    this.loadFarms();
  }

  onSortChange() {
    this.pageEvent.pageIndex = 0;
    this.loadFarms();
  }

  loadFarms() {
    this.isLoading.set(true);
    this.fieldService.getPagedFarmWithFields(
      this.pageEvent.pageIndex + 1,
      this.pageEvent.pageSize,
      this.searchTerm || undefined,
      this.sortBy,
      this.sortDesc
    )
    .subscribe({
      next: (result) => {
        this.farms.set(result.items);
        this.pageEvent.length = result.metaData.totalCount;
        this.isLoading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.isLoading.set(false);
        }
      });
    }
  }
