import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { CropService } from '../../services/crop-service';
import { CropModel } from '../adminModel/cropModel';

@Component({
  selector: 'app-crops',
  imports: [
            CommonModule,
            MatTableModule,
            MatButtonModule,
            MatIconModule,
            MatSnackBarModule,
            FormsModule,
            MatInputModule,
            MatSelectModule,
            MatOptionModule
            ],
  templateUrl: './crops.html',
  styleUrl: './crops.css',
})
export class Crops {
  displayedColumns: string[] = ['id', 'createdAt', 'updatedAt', 'type', 'variety', 'season', 'expectedYield', 'description', 'field', 'farm', 'edit', 'delete'];
  dataSource = signal<CropModel[]>([]);
  editingCropId = signal<string | null>(null);

  constructor(
    private cropService: CropService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadCrops();
  }

  loadCrops(): void {
    this.cropService.getAllCrops().subscribe({
      next: (crops) => {
        this.dataSource.set(crops);
      },
      error: () => {
        this.snackBar.open('Error loading crops', 'Close', { duration: 3000 });
      }
    });
  }

  startEdit(crop: CropModel): void {
    this.editingCropId.set(crop.id || null);
  }

  saveCrop(crop: CropModel): void {
    this.cropService.adminUpdateCrop(crop.id, crop).subscribe({
      next: () => {
        this.snackBar.open('Crop updated successfully', 'Close', { duration: 3000 });
        this.editingCropId.set(null);
        this.updateCropInDataSource(crop);
      },
      error: () => {
        console.log(crop)
        this.snackBar.open('Error updating crop', 'Close', { duration: 3000 });
        this.editingCropId.set(null);
      }
    });
  }

  cancelEdit(): void {
    this.editingCropId.set(null);
    this.loadCrops();
  }

  private updateCropInDataSource(updatedCrop: CropModel): void {
    const currentData = this.dataSource();
    const index = currentData.findIndex(u => u.id === updatedCrop.id);
    if (index !== -1) {
      const newData = [...currentData];
      newData[index] = updatedCrop;
      this.dataSource.set(newData);
    }
  }

  deleteCrop(cropId: string): void {
    if (confirm('Are you sure you want to delete this crop?')) {
      this.cropService.deleteCrop(cropId).subscribe({
        next: () => {
          this.snackBar.open('Crop deleted successfully', 'Close', { duration: 3000 });
          this.loadCrops();
        },
        error: () => {
          this.snackBar.open('Error deleting crop', 'Close', { duration: 3000 });
        }
      });
    }
  }

  isEditing(cropId: string): boolean {
    return this.editingCropId() === cropId;
  }
}
