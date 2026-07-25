import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { MatIcon } from '@angular/material/icon';
import { FarmService } from '../../services/farm-service';
import { GetFarm } from '../../Models/getFarm';
import { Statistics } from '../statistics/statistics';

@Component({
  selector: 'app-statistics-page',
  standalone: true,
  imports: [CommonModule, MatDrawerContainer, MatDrawer, MatDrawerContent, MatIcon, Statistics],
  templateUrl: './statistics-page.html',
  styleUrls: ['./statistics-page.css']
})
export class StatisticsPage implements OnInit {
  farmList = signal<GetFarm[]>([]);
  selectedFarmId = signal<string | undefined>(undefined);

  constructor(private farmService: FarmService) {}

  ngOnInit(): void {
    this.farmService.getAllFarms().subscribe(farms => {
      this.farmList.set(farms);
      if (farms.length > 0) {
        this.selectedFarmId.set(farms[0].id);
      }
    });
  }

  changeFarm(farmId: string | undefined) {
    this.selectedFarmId.set(farmId);
  }
}
