import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FieldInfo } from '../../Models/field-Info';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatOption, MatSelect } from '@angular/material/select';
import { FieldService } from '../../services/field-service';
import { FarmService } from '../../services/farm-service';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { Observable } from 'rxjs';
import { GetFarm } from '../../Models/getFarm';

@Component({
  selector: 'app-add-field',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTimepickerModule,
    MatSelect,
    MatOption,
    MatCheckboxModule],
  templateUrl: './add-field.html',
  styleUrl: './add-field.css',
})
export class AddField {
  fieldForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  selectedImageFile: File | null = null;
  imagePreviewUrl: string | null = null;
  farmList$!: Observable<GetFarm[]>

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { farmId: string },
    private fb: FormBuilder,
    private fieldService: FieldService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AddField>,
    private farmService: FarmService,
    private cdr: ChangeDetectorRef,
  ) {
    this.fieldForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      isPasture: ['', Validators.required],
      area:[null, Validators.required],
      location: ['', Validators.required],//North, North-West, West, South-West, South, South-East, East, North-East, Mid
      irrigationType: ['', Validators.required],//Drip, Sprinkler, Flood, CenterPivot
      soilQuality:  ['', Validators.required],//Excellent, Good, Moderate, Poor
      aFarmId: [''],
      cropId: [''],
    });
  }

  isImageLoading: boolean = false

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        this.snackBar.open('Please select a valid image file (jpg, png, ...)', 'Close', { duration: 3000 });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        this.snackBar.open('Image size must not exceed 10MB', 'Close', { duration: 3000 });
        return;
      }

      this.selectedImageFile = file;

      this.isImageLoading = true

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviewUrl = e.target?.result as string;
        this.isImageLoading = false
        this.cdr.detectChanges()
      };

      reader.onerror = () => {
        this.isImageLoading = false;
        console.log(this.isImageLoading)
        this.snackBar.open('Error loading image', 'Close', { duration: 3000 });
      };

      reader.readAsDataURL(file);
    }
  }

  // إزالة الصورة المختارة
  removeSelectedImage() {
    this.selectedImageFile = null;
    this.imagePreviewUrl = null;
  }

  // حفظ المزرعة الجديدة
  saveField() {
    // التحقق من صحة النموذج
    if (this.fieldForm.invalid) {
      this.fieldForm.markAllAsTouched();
      this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const formValues = this.fieldForm.value;
    const farmInfo = new FieldInfo({
      name: formValues.name,
      isPasture: formValues.isPasture,
      area: formValues.area,
      location: formValues.location,
      irrigationType: formValues.irrigationType,
      soilQuality: formValues.soilQuality,
      aFarmId: this.data.farmId,
      imgFile: this.selectedImageFile,
    });

    this.fieldService.addField(farmInfo).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.snackBar.open('Field added successfully', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error details:', err);

        if (err.error && typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else if (err.message) {
          this.errorMessage = err.message;
        } else {
          this.errorMessage = 'An error occurred while adding the field';
        }

        this.snackBar.open(this.errorMessage!, 'Close', { duration: 5000 });
        this.cdr.detectChanges()
      }
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
