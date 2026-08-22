import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, signal, SimpleChanges } from '@angular/core';
import { GetSensorsWithReadings} from '../../Models/getSensorReading';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SignalRService } from '../../services/signalr-service';


@Component({
  selector: 'app-sensor-chart',
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './sensor-chart.html',
  styleUrl: './sensor-chart.css',
})
export class SensorChart implements OnChanges, OnDestroy, OnInit {

  @Input() sensorsData: GetSensorsWithReadings[] | null = null;

  chartData = signal<{ name: string; series: { name: string; value: number }[]; extra?: any }[]>([]);
  colorScheme = signal< any>({ domain: [] });

  // ✅ لتخزين معلومات الحساس المحدد
  selectedSensorInfo = signal<{ name: string; serialNumber: string; sensorId: string } | null>(null);

  private signalRSubscription!: Subscription;

  constructor(private signalRService: SignalRService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.signalRSubscription = this.signalRService.sensorDataReceived.subscribe(newReading => {
      this.handleNewSensorReading(newReading);
    }, err => console.log(err));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sensorsData'] && this.sensorsData) {
      this.updateChartData(this.sensorsData);
      this.generateColorScheme(this.sensorsData.length);
    }
    this.selectedSensorInfo.set(null)
  }

  private handleNewSensorReading(newReading: { sensorId: string; value: number; timestamp: Date }): void {
    if (!this.sensorsData) return;

    const sensor = this.sensorsData.find(s => s.id === newReading.sensorId);
    if (!sensor) {
      console.warn(`Sensor with id ${newReading.sensorId} not found`);
      return;
    }

    const newReadingEntry = {
      sensorId: newReading.sensorId,
      value: newReading.value,
      readingTimestamp: newReading.timestamp
    };

    sensor.readings = [...sensor.readings, newReadingEntry];

    this.sensorsData = [...this.sensorsData];

    this.updateChartData(this.sensorsData);
    this.cdr.detectChanges()
  }


  private generateColorScheme(numSensors: number): void {
    const colorPalette = [
      '#4caf50', '#ff9800', '#2196f3', '#f44336', '#9c27b0',
      '#00bcd4', '#ffeb3b', '#795548', '#e91e63', '#3f51b5',
      '#8bc34a', '#ff5722', '#009688', '#673ab7', '#cddc39'
    ];
    const domainColors = [];
    for (let i = 0; i < numSensors; i++) {
      domainColors.push(colorPalette[i % colorPalette.length]);
    }
    this.colorScheme.set({ domain: domainColors });
  }

  private updateChartData(sensors: GetSensorsWithReadings[]): void {
    if (!sensors || sensors.length === 0) {
      this.chartData.set([]);
      return;
    }

    this.chartData.set(sensors.map((sensor) => ({
      name: sensor.type || `Sensor ${sensor.id.substring(0, 6)}`,
      extra: {
        serialNumber: sensor.serialNumber,
        sensorId: sensor.id,
      },
      series: sensor.readings
        .sort((a, b) => new Date(a.readingTimestamp).getTime() - new Date(b.readingTimestamp).getTime())
        .map((reading) => ({
          name: new Date(reading.readingTimestamp).toLocaleString(),
          value: reading.value,
        })),
    })));
  }

  // ✅ دالة تُستدعى عند النقر على أي نقطة في الرسم البياني
  onSelect(event: any): void {
    if (event && event.series) {
      const seriesName = event.series;
      const found = this.chartData().find(item => item.name === seriesName);
      if (found && found.extra) {
        this.selectedSensorInfo.set({
          name: seriesName,
          serialNumber: found.extra.serialNumber,
          sensorId: found.extra.sensorId
        });
      } else {
        this.selectedSensorInfo.set(null);
      }
    }
  }

  ngOnDestroy(): void {
    this.signalRSubscription?.unsubscribe();
  }
}
