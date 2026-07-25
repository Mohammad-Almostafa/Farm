import { CommonModule } from '@angular/common';
import { Component, inject, Injectable, signal} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { FarmModel } from '../adminModel/farmModel';
import { FarmService } from '../../services/farm-service';
import { AccountService } from '../../services/account-service';
import { MatDialog } from '@angular/material/dialog';
import { AdminFarmDetails } from './farm-details/admin-farm-details';

@Component({
  selector: 'app-farms',
  imports: [CommonModule,
            MatTableModule,
            MatButtonModule,
            MatIconModule,
            MatSnackBarModule,
            FormsModule,
            MatInputModule,
            MatSelectModule,
            MatOptionModule],
  templateUrl: './farms.html',
  styleUrl: './farms.css',
})

@Injectable({
  providedIn: 'root',
})

export class Farms {
  displayedColumns: string[] = ['id', 'createdAt', 'updatedAt', 'name', 'area', 'location', 'ownerEmail', 'delete'];
  dataSource = signal<FarmModel[]>([]);
  ownerId = signal<string | undefined>('');

  constructor(
    private farmService: FarmService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}
  userService = inject(AccountService)

  ngOnInit(): void {
    this.dataSource.set([])
    this.loadFarm();
  }

  loadFarm(): void {
    this.farmService.AdminGetAllFarms().subscribe({
      next: (farm) => {
        this.dataSource.set(farm);
      },
      error: () => {
        this.snackBar.open('Error loading Farm', 'Close', { duration: 3000 });
      }
    });
  }

  openFarmDetails(farm: FarmModel): void {
    var dialogRef = this.dialog.open(AdminFarmDetails, {
      data: { farm },
      width: '700px',
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadFarm();
  });
  }

  deleteFarm(farmId: string): void {
    if (confirm('Are you sure you want to delete this farm?')) {
      this.farmService.deleteFarm(farmId).subscribe({
        next: () => {
          this.snackBar.open('Farm deleted successfully', 'Close', { duration: 3000 });
          this.loadFarm();
        },
        error: () => {
          this.snackBar.open('Error deleting farm', 'Close', { duration: 3000 });
        }
      });
    }
  }

}
