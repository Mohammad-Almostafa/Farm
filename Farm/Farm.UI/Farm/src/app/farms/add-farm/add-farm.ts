import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FarmService } from '../../services/farm-service';
import { FarmMapComponent } from '../../farmMap/farm-map/farm-map';
import { FarmInfo } from '../../Models/farm-Info';
import {MatTimepickerModule} from '@angular/material/timepicker';
import { MatSelect, MatOption } from "@angular/material/select";
import { provideNativeDateAdapter } from '@angular/material/core';


@Component({
  selector: 'app-add-farm',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    FarmMapComponent,
    MatTimepickerModule,
    MatSelect,
    MatOption
],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-farm.html',
  styleUrl: './add-farm.css',
})
export class AddFarm{
  farmForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  selectedImageFile: File | null = null;
  imagePreviewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private farmService: FarmService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AddFarm>,
    private cdr: ChangeDetectorRef
  ) {
    this.farmForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      area:[null, Validators.required],
      location: [''],
      latitude: [null, [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: [null, [Validators.required, Validators.min(-180), Validators.max(180)]],
      description:[''],
      formattedAddress: [''],
      ownerId:[''],
      waterSource:[''],
      startWork:['',Validators.required],
      endWork:['',Validators.required]
    });
  }

  onLocationSelected(event: { lat: number; lng: number; address: string }) {
    let loc = event.address.split(',')
    loc.reverse()
    this.farmForm.patchValue({
      latitude: event.lat,
      longitude: event.lng,
      formattedAddress: event.address,
      location: loc[0] + ', ' + loc[1]
    });
    console.log(this.farmForm)
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
  saveFarm() {
    // التحقق من صحة النموذج
    if (this.farmForm.invalid) {
      this.farmForm.markAllAsTouched();
      this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const formValues = this.farmForm.value;
    const startTime = formValues.startWork.toString().split(' ')[4].split(':')
    const endTime = formValues.endWork.toString().split(' ')[4].split(':')
    // if(startTime[0][0] === '0')startTime[0][0]=''
    const farmInfo = new FarmInfo({
      name: formValues.name,
      area: formValues.area,
      location: formValues.location,
      description: formValues.description,
      latitude: formValues.latitude,
      longitude: formValues.longitude,
      formattedAddress: formValues.formattedAddress,
      waterSource: formValues.waterSource,
      workingHours: startTime[0] + ':' + startTime[1] + ' - ' + endTime[0] + ':' + endTime[1],
      imgFile: this.selectedImageFile,
      ownerId: localStorage.getItem('sub') || ''
    });

    this.farmService.addFarm(farmInfo).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.snackBar.open('Farm added successfully', 'Close', { duration: 3000 });
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
          this.errorMessage = 'An error occurred while adding the farm';
        }

        this.snackBar.open(this.errorMessage!, 'Close', { duration: 5000 });
      }
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
