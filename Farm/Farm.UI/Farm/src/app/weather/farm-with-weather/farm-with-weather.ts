import { Component, signal, OnInit } from '@angular/core';
import { MatDrawerContent, MatDrawerContainer, MatDrawer } from "@angular/material/sidenav";
import { Weather } from "../weather/weather";
import { FarmService } from '../../services/farm-service';
import { GetFarm } from '../../Models/getFarm';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-farm-with-weather',
  imports: [MatDrawerContent, Weather, MatDrawerContainer, MatDrawer, MatIcon],
  templateUrl: './farm-with-weather.html',
  styleUrl: './farm-with-weather.css',
})
export class FarmWithWeather implements OnInit {
  farmList = signal<GetFarm[]>([]);
  selectedLat = signal<number | undefined>(undefined);
  selectedLon = signal<number | undefined>(undefined);
  selectedFarmName = signal<string| undefined>('');
  selectedFarmLocation = signal<string| undefined>('');

  constructor(private farmService: FarmService) {}

  ngOnInit(): void {
    this.loadFarms();
  }

  loadFarms(): void {
    this.farmService.getAllFarms().subscribe(farms => {
      this.farmList.set(farms);
    });
  }

  changeFarm(lat: number | undefined, lon: number | undefined, farmName: string|undefined, farmLocation: string|undefined): void {
    if (lat && lon) {
      this.selectedLat.set(lat);
      this.selectedLon.set(lon);
      this.selectedFarmName.set(farmName);
      this.selectedFarmLocation.set(farmLocation);
    }
  }
}
