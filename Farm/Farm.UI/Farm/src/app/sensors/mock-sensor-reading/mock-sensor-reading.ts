import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, ValueChangeEvent } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { SensorService } from '../../services/sensor-service';
import { SensorReadingInfo } from '../../Models/sensor-reading-info';
import { GetFarmsWithFieldsWithSensors, GetFields, GetSensors } from '../../Models/getFarmsWithFieldsWithSensors';

@Component({
  selector: 'app-mock-sensor-reading',
  imports: [
    CommonModule,
    FormsModule,
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
    MatOption
  ],
  templateUrl: './mock-sensor-reading.html',
  styleUrl: './mock-sensor-reading.css',
})
export class MockSensorReading implements OnInit{

  sensorReadingForm: FormGroup
  isLoading = signal<boolean>(false)
  errorMessage: string | null = null
  text1: string|null = null
  text2: string|null = null
  text3: string|null = null
  farmList = signal<GetFarmsWithFieldsWithSensors[]>([])
  fieldList = signal<GetFields[]>([])
  sensorList = signal<GetSensors[]>([])

  constructor(private fb: FormBuilder, private sensorService: SensorService, private snackBar: MatSnackBar) {
    this.sensorReadingForm = this.fb.group({
      sensorId: ['', Validators.required],
      value: ['', Validators.required],
    });
  }

  onFarmSelected(fieldList: GetFields[]){
    this.fieldList.set(fieldList)
  }

  onFieldSelected(sensorList: GetSensors[]){
    this.sensorList.set(sensorList)
  }

  ngOnInit(): void {
    this.sensorService.getFarmsWithFieldsWithSensors().subscribe({
      next:(result) => {
        this.farmList.set(result)
      },
      error:(err) =>{
        this.snackBar.open('error loading farms', 'Close', { duration: 5000 });
      }
    })
  }

  saveField() {
    if (this.sensorReadingForm.invalid) {
      this.sensorReadingForm.markAllAsTouched();
      this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading.set(true);
    this.errorMessage = null;

    const formValues = this.sensorReadingForm.value;
    const sensorReadingInfo = new SensorReadingInfo({
      sensorId: formValues.sensorId,
      value: formValues.value
    });

    this.sensorService.addSensorReading(sensorReadingInfo).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.snackBar.open('reading added to mock-sensor successfully', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Error details:', err);

        if (err.error && typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else if (err.message) {
          this.errorMessage = err.message;
        } else {
          this.errorMessage = 'An error occurred while adding the reading';
        }

        this.snackBar.open(this.errorMessage!, 'Close', { duration: 5000 })
      }
    });
  }
}
