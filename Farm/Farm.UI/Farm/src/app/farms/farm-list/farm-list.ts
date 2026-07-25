import { Component, OnInit, ElementRef, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FarmService } from '../../services/farm-service';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../../Models/paginatedResult';
import { GetFarm } from '../../Models/getFarm';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { AddFarm } from '../add-farm/add-farm';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { FarmDetails } from '../farm-details/farm-details';

@Component({
  selector: 'app-farm-list',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatPaginatorModule,
    MatFormFieldModule, MatInputModule, MatIconModule, FormsModule,
    MatSelectModule,
    MatProgressSpinner
],
  templateUrl: './farm-list.html',
  styleUrl: './farm-list.css',
})
export class FarmList implements OnInit, OnDestroy {
  @ViewChild('searchWrapper') searchWrapper!: ElementRef;

  pagedFarmList$!: Observable<PaginatedResult<GetFarm>>;

  searchTerm: string = '';
  sortBy: string = 'name';
  sortDesc: boolean = false;

  searchHistory: string[] = [];
  showHistory: boolean = false;

  private lastSavedSearch: string = '';

  private searchSubject = new Subject<string>();
  private readonly SEARCH_DELAY = 1000;

  pageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 9,
    length: 0,
    previousPageIndex: 0
  };

  openFarmDetails(farm: GetFarm): void {
    this.dialog.open(FarmDetails, {
      data: { farm },
      width: '700px',
      disableClose: false,
      autoFocus: true
    });
  }

  openAddFarmDialog(): void {
    const dialogRef = this.dialog.open(AddFarm, {
      width: '650px',
      disableClose: true,
      autoFocus: true
    });
  }

  constructor(private farmService: FarmService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadSearchHistory();
    this.loadFarms();
    this.setupDelayedSearch();
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

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

    localStorage.setItem('farmSearchHistory', JSON.stringify(this.searchHistory));
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

  isLoaded: boolean = false

  loadFarms() {
    this.pagedFarmList$ = this.farmService.getPagedFarms(
      this.pageEvent.pageIndex + 1,
      this.pageEvent.pageSize,
      this.searchTerm || undefined,
      this.sortBy,
      this.sortDesc
    );
    this.isLoaded = true
    this.pagedFarmList$.subscribe({
    next: (result) => {
      this.pageEvent.length = result.metaData.totalCount;
      this.isLoaded = false;
    },
    error: (err) => {
      console.error('Error loading farms:', err);
      this.isLoaded = false;
    }
  });
  }

  onSortChange() {
    this.pageEvent.pageIndex = 0;
    this.loadFarms();
  }

  onPageChange(event: PageEvent) {
    this.pageEvent = event;
    this.loadFarms();
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

}
