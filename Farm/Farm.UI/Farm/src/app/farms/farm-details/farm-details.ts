// farm-details-dialog.component.ts
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FarmService } from '../../services/farm-service';
import { GetFarm } from '../../Models/getFarm';
import { FarmMapComponent } from '../../farmMap/farm-map/farm-map';

@Component({
  selector: 'app-farm-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FarmMapComponent
  ],
  templateUrl: './farm-details.html',
  styleUrls: ['./farm-details.css']
})
export class FarmDetails implements OnInit {
  farm: GetFarm;
  nearbyFarms: any[] = [];
  isLoadingNearby: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { farm: GetFarm },
    private farmService: FarmService,
    private dialogRef: MatDialogRef<FarmDetails>,
    private cdr: ChangeDetectorRef
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
}
