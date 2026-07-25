import { Component, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FarmStatistics } from '../../Models/statistics';
import { StatisticService } from '../../services/statistic-service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './statistics.html',
  styleUrls: ['./statistics.css']
})
export class Statistics implements OnChanges {
  @Input() farmId!: string | undefined;

  stats = signal<FarmStatistics | null>(null);
  isLoading = false;


  // بيانات الرسم البياني المتقدم
  pieChartData: { name: string; value: number }[] = [];

  constructor(private statsService: StatisticService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['farmId'] && this.farmId) {
      this.loadStatistics();
    }
  }

  loadStatistics(): void {
    this.isLoading = true;
    this.statsService.getDashboardStats(this.farmId).subscribe({
      next: (data) => {
        this.stats.set(data);
        this.pieChartData = data.cropDistribution
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }
}
