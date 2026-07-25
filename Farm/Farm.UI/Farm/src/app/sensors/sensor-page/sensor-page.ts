import { Component, OnInit, signal } from '@angular/core';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from "@angular/material/sidenav";
import { FieldService } from '../../services/field-service';
import { GetFarmWithFields} from '../../Models/getFarmWithFields';
import {MatTreeModule} from '@angular/material/tree';
import { SensorChart } from "../sensor-chart/sensor-chart";
import { SensorService } from '../../services/sensor-service';
import { GetSensorsWithReadings } from '../../Models/getSensorReading';


@Component({
  selector: 'app-sensor-page',
  imports: [MatTreeModule, MatDrawerContainer, MatDrawer, MatDrawerContent, SensorChart],
  templateUrl: './sensor-page.html',
  styleUrl: './sensor-page.css',
})
export class SensorPage implements OnInit{

  farmWithField = signal<GetFarmWithFields[]>([]);

  selectedSensorsData = signal<GetSensorsWithReadings[] | null>(null);

  constructor(
    private fieldService: FieldService,
    private sensorService: SensorService
  ) {}

  ngOnInit(): void {
    this.fieldService.getAllFarmWithFields().subscribe((result) => {
      this.farmWithField.set(result);
    });
  }

  changeField(fieldId: string | undefined) {
    if (!fieldId) return;

    this.sensorService.getSensorsByFieldId(fieldId).subscribe({
      next: (sensorsData) => {
        this.selectedSensorsData.set(sensorsData);
        console.log(sensorsData)
      },
      error: (err) => {
        console.error('Error loading sensors for field:', err);
        this.selectedSensorsData.set(null);
      }
    });
  }

}
