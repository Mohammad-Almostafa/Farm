import { ChangeDetectorRef, Component, Inject, OnInit, Signal, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CropInfo } from '../../Models/crop-Info';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/select';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { CropRefInfo, VarietyRefInfo } from '../../Models/cropRef-Info';
import { CropService } from '../../services/crop-service';
import { GetCropRef } from '../../Models/getCropRef';
import {MatAutocompleteModule} from '@angular/material/autocomplete';


@Component({
  selector: 'app-add-crop',
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
    MatOption,
    MatCheckboxModule,
    MatAutocompleteModule],
  templateUrl: './add-crop.html',
  styleUrl: './add-crop.css',
})
export class AddCrop implements OnInit{
  cropForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  selectedImageFile: File | null = null;
  imagePreviewUrl: string | null = null;
  cropRefList = signal<GetCropRef[]>([]);
  cropRef = signal<GetCropRef|undefined>(undefined);
  cropRefId = signal<string>('')
  isCropRefListLoading = signal<boolean>(false);
  isCropRefLoading = signal<boolean>(false);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { fieldId: string },
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AddCrop>,
    private cropService: CropService,
    private cdr: ChangeDetectorRef
  ) {

    this.cropForm = this.fb.group({
      type: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      variety:['', Validators.required],//صنف
      expectedYield: ['', Validators.required],
      season: ['', Validators.required],
      description:[''],
      status: [''],//Planted, Harvested, Fallow, Infested
      yield:[null],
      lastWatered:[''],
      nextFertilization:[''],
      actualHarvestDate:[''],
    });
  }
  ngOnInit(): void {
    this.cropService.getAllCropRef().subscribe((result) => {
      this.cropRefList.set(result)
      this.isCropRefListLoading.set(true)
    })
  }

  loadCropRef(id: string|undefined){
    this.cropService.getCropRefById(id).subscribe((result) =>{
      this.cropRef.set(result)
      this.isCropRefLoading.set(true)
      console.log(result)
    })
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
  saveCrop() {
    // التحقق من صحة النموذج
    if (this.cropForm.invalid) {
      this.cropForm.markAllAsTouched();
      this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const formValues = this.cropForm.value;

    const cropInfo = new CropInfo({
      type: formValues.type,
      variety: formValues.variety,
      expectedYield: formValues.expectedYield,
      season: formValues.season,
      description: formValues.description,
      status: formValues.status,//Planted, Harvested, Fallow, Infested
      yield: formValues.yield,
      nextWatered: formValues.lastWatered,
      nextFertilization: formValues.nextFertilization,
      actualHarvestDate: formValues.actualHarvestDate,
      imgFile: this.selectedImageFile,
      fieldId: this.data.fieldId
    });
    const addCropRef = new CropRefInfo({
      name: formValues.type,
      season: formValues.season,
      yield: formValues.expectedYield,
      description: formValues.description,
      variety_Refs:[
        new VarietyRefInfo({
          name: formValues.variety
        })
      ]
    })

    this.cropService.AddCropRef(addCropRef).subscribe()

    this.cropService.addCrop(cropInfo).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.snackBar.open('crop added successfully', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error details:', err);
        console.log(cropInfo)

        if (err.error && typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else if (err.message) {
          this.errorMessage = err.message;
        } else {
          this.errorMessage = 'An error occurred while adding the crop';
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
