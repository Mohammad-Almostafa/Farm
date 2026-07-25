// farm-details-dialog.component.ts
import { ChangeDetectorRef, Component, inject, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FarmMapComponent } from '../../../farmMap/farm-map/farm-map';
import { FarmModel } from '../../adminModel/farmModel';
import { FarmService } from '../../../services/farm-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatOption, MatSelect, MatLabel, MatPrefix } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AccountService } from '../../../services/account-service';
import { UserModel } from '../../adminModel/userModel';

@Component({
  selector: 'app-farm-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSnackBarModule,
    MatTimepickerModule,
    MatFormFieldModule,
    MatSelect,
    MatOption,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FarmMapComponent,
    MatLabel,
    MatPrefix
],
  providers: [provideNativeDateAdapter()],
  templateUrl: './admin-farm-details.html',
  styleUrls: ['./admin-farm-details.css']
})
export class AdminFarmDetails implements OnInit {
  farm: FarmModel
  nearbyFarms: any[] = [];
  isLoadingNearby: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { farm: FarmModel },
    private farmService: FarmService,
    private dialogRef: MatDialogRef<AdminFarmDetails>,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private accountService: AccountService,
  ) {
    this.farm = data.farm;
  }

  ngOnInit(): void {
    this.loadNearbyFarms();
  }

  loadNearbyFarms(): void {
    this.isLoadingNearby = true;

    this.farmService.getNearbyFarms(
      this.farm.latitude!,
      this.farm.longitude!,
      10
    ).subscribe({
      next: (farms) => {
        // استبعاد المزرعة الحالية من القائمة
        this.nearbyFarms = farms.filter(f => f.id !== this.farm.id);
        this.isLoadingNearby = false;
        this.cdr.detectChanges()
      },
      error: (err) => {
        console.error('Error loading nearby farms:', err);
        this.isLoadingNearby = false;
        this.cdr.detectChanges()
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  //edit
  isEditing = signal<boolean>(false)
  startWork!: string|undefined
  endWork!: string|undefined

  users = signal<UserModel[]>([])
  startEdit() {
    this.isEditing.set(true);
    this.accountService.getUsers().subscribe({
      next:(users) => {
        this.users.set(users)
      },
      error:() => {
        console.log('error getting users')
      }
    })
    this.cdr.detectChanges()
  }

  saveFarm(): void {
    const startTime = this.startWork?.toString().split(' ')[4].split(':')
    const endTime = this.endWork?.toString().split(' ')[4].split(':')
    this.farm.workingHours = startTime?.[0] + ':' + startTime?.[1] + ' - ' + endTime?.[0] + ':' + endTime?.[1]
    console.log(this.farm)
    this.farmService.adminUpdateFarm(this.farm.id, this.farm).subscribe({
      next: () => {
        this.snackBar.open('Farm updated successfully', 'Close', { duration: 3000 });
        this.farm = this.data.farm;
        this.isEditing.set(false);
      },
      error: () => {
        this.snackBar.open('Error updating farm', 'Close', { duration: 3000 });
        this.isEditing.set(false);
      }
    });
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }
}
