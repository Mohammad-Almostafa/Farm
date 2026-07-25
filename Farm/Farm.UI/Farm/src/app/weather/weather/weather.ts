import { Component, input, signal, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FarmService } from '../../services/farm-service';
import { MatProgressSpinner } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinner],
  templateUrl: './weather.html',
  styleUrls: ['./weather.css'],
})
export class Weather implements OnChanges {
  // إحداثيات المزرعة المختارة
  latitude = input<number | undefined>();
  longitude = input<number | undefined>();
  farmName = input<string | undefined>();
  farmLocation = input<string | undefined>();

  // حالة البيانات
  weatherData = signal<any>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor(private farmService: FarmService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['latitude'] || changes['longitude']) {
      const lat = this.latitude();
      const lon = this.longitude();
      if (lat && lon) {
        this.loadWeather(lat, lon);
      }
    }
  }

  loadWeather(lat: number, lon: number): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.farmService.getFarmWithWeather(lat, lon).subscribe({
      next: (data) => {
        this.weatherData.set(data);
        this.isLoading.set(false);
        console.log(data)
      },
      error: (err) => {
        console.error('Weather error:', err);
        this.error.set('Unable to load weather data');
        this.isLoading.set(false);
      },
    });
  }
}
