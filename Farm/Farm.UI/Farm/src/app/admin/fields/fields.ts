import { Component, signal } from '@angular/core';
import { FieldService } from '../../services/field-service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FieldModel } from '../adminModel/fieldModel';
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-fields',
  imports: [CommonModule,
            MatTableModule,
            MatButtonModule,
            MatIconModule,
            MatSnackBarModule,
            FormsModule,
            MatInputModule,
            MatSelectModule,
            MatOptionModule,
            MatCheckboxModule],
  templateUrl: './fields.html',
  styleUrl: './fields.css',
})
export class Fields {
  displayedColumns: string[] = ['id', 'createdAt', 'updatedAt', 'name', 'isPasture', 'area', 'location', 'irrigationType', 'soilQuality', 'locatedInFarm', 'edit', 'delete'];
  dataSource = signal<FieldModel[]>([]);
  editingFieldId = signal<string | null>(null);

  constructor(
    private fieldService: FieldService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadFields();
  }

  loadFields(): void {
    this.fieldService.getAllFieldsWithFarm().subscribe({
      next: (fields) => {
        this.dataSource.set(fields);
      },
      error: () => {
        this.snackBar.open('Error loading fields', 'Close', { duration: 3000 });
      }
    });
  }

  startEdit(field: FieldModel): void {
    this.editingFieldId.set(field.id || null);
  }

  saveField(field: FieldModel): void {
    this.fieldService.adminUpdateField(field.id, field).subscribe({
      next: () => {
        this.snackBar.open('Field updated successfully', 'Close', { duration: 3000 });
        this.editingFieldId.set(null);
        this.updateFieldInDataSource(field);
      },
      error: () => {
        console.log(field)
        this.snackBar.open('Error updating field', 'Close', { duration: 3000 });
        this.editingFieldId.set(null);
      }
    });
  }

  cancelEdit(): void {
    this.editingFieldId.set(null);
    this.loadFields();
  }

  private updateFieldInDataSource(updatedField: FieldModel): void {
    const currentData = this.dataSource();
    const index = currentData.findIndex(u => u.id === updatedField.id);
    if (index !== -1) {
      const newData = [...currentData];
      newData[index] = updatedField;
      this.dataSource.set(newData);
    }
  }

  deleteField(fieldId: string): void {
    if (confirm('Are you sure you want to delete this field?')) {
      this.fieldService.deleteField(fieldId).subscribe({
        next: () => {
          this.snackBar.open('Field deleted successfully', 'Close', { duration: 3000 });
          this.loadFields();
        },
        error: () => {
          this.snackBar.open('Error deleting field', 'Close', { duration: 3000 });
        }
      });
    }
  }

  isEditing(fieldId: string): boolean {
    return this.editingFieldId() === fieldId;
  }
}
