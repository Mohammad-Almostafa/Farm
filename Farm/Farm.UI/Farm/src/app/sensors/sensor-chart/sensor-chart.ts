import { ChangeDetectionStrategy, ChangeDetectorRef, Component, input, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.Eager
})
export class SensorChart implements OnChanges, OnDestroy {
  @Input() sensorsData: GetSensorsWithReadings[] | null = null;

  chartData: { name: string; series: { name: string; value: number }[]; extra?: any }[] = [];
  colorScheme: any = { domain: [] };

  // ✅ لتخزين معلومات الحساس المحدد
  selectedSensorInfo: { name: string; serialNumber: string; sensorId: string } | null = null;

  private signalRSubscription!: Subscription;

  constructor(private signalRService: SignalRService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sensorsData'] && this.sensorsData) {
      this.updateChartData(this.sensorsData);
      this.generateColorScheme(this.sensorsData.length);
      this.setupRealTimeUpdates();

    }
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
    this.colorScheme = { domain: domainColors };
  }

  private updateChartData(sensors: GetSensorsWithReadings[]): void {
    if (!sensors || sensors.length === 0) {
      this.chartData = [];
      return;
    }

    this.chartData = sensors.map((sensor) => ({
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
    }));
  }

  // ✅ دالة تُستدعى عند النقر على أي نقطة في الرسم البياني
  onSelect(event: any): void {
    if (event && event.series) {
      const seriesName = event.series;
      const found = this.chartData.find(item => item.name === seriesName);
      if (found && found.extra) {
        this.selectedSensorInfo = {
          name: seriesName,
          serialNumber: found.extra.serialNumber,
          sensorId: found.extra.sensorId
        };
      } else {
        this.selectedSensorInfo = null;
      }
    }
  }

  private setupRealTimeUpdates(): void {
    if (this.signalRSubscription) {
      this.signalRSubscription.unsubscribe();
    }

    this.signalRSubscription = this.signalRService.sensorDataReceived.subscribe((newReading) => {
      if (!this.chartData || this.chartData.length === 0) return;

      const seriesIndex = this.chartData.findIndex(series =>
        series.name.includes(newReading.sensorId) ||
        this.sensorsData?.find(s => s.id === newReading.sensorId)?.type === series.name
      );

      if (seriesIndex !== -1) {
        const updatedSeries = [...this.chartData[seriesIndex].series];
        updatedSeries.push({
          name: new Date(newReading.timestamp).toLocaleString(),
          value: newReading.value,
        });
        if (updatedSeries.length > 50) updatedSeries.shift();

        const updatedChartData = [...this.chartData];
        updatedChartData[seriesIndex] = {
          ...updatedChartData[seriesIndex],
          series: updatedSeries
        };
        this.chartData = updatedChartData;
      }
    });
  }

  ngOnDestroy(): void {
    this.signalRSubscription?.unsubscribe();
  }
}
