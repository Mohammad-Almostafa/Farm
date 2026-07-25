import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CropService } from '../../services/crop-service';
import { ImproveCrop } from '../../Models/improve-crop';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatIcon } from "@angular/material/icon";
import { MatFormField, MatLabel, MatOption, MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-update-crop',
  imports: [MatButtonModule, MatDialogTitle, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, MatProgressSpinner, MatIcon, MatDialogActions, MatFormField, MatLabel, MatDialogContent, MatOption],
  providers: [provideNativeDateAdapter()],
  templateUrl: './update-crop.html',
  styleUrl: './update-crop.css',
})
export class UpdateCrop implements OnInit{
  cropForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { cropId: string },
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateCrop>,
    private cropService: CropService,
    private cdr: ChangeDetectorRef
  ) {

    this.cropForm = this.fb.group({
      status: [''],//Planted, Harvested, Fallow, Infested
      yield:[null],
      nextWatered:[''],
      nextFertilization:[''],
      actualHarvestDate:[''],
    });
  }
  ngOnInit(): void {
    const crop = this.cropService.getCropById(this.data.cropId).subscribe((result) => {
      this.cropForm.patchValue({
        status: result.status,
        yield: result.yield,
        nextWatered: result.nextWatered,
        nextFertilization: result.nextFertilization,
        actualHarvestDate: result.actualHarvestDate
    })
    })
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

    const improveCrop = new ImproveCrop({
      status: formValues.status,//Planted, Harvested, Fallow, Infested
      yield: formValues.yield,
      nextWatered: formValues.nextWatered,
      nextFertilization: formValues.nextFertilization,
      actualHarvestDate: formValues.actualHarvestDate,
    });

    this.cropService.improveCrop(this.data.cropId, improveCrop).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.snackBar.open('crop added successfully', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error details:', err);
        console.log(improveCrop)

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
