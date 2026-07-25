import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from "@angular/material/sidenav";
import { MatIcon } from "@angular/material/icon";
import { MatListModule, MatNavList } from '@angular/material/list';
import { FarmMapComponent } from "../farmMap/farm-map/farm-map";
import { FarmList } from "../farms/farm-list/farm-list";
import { RouterLinkWithHref, RouterOutlet } from "@angular/router";
import { MatExpansionModule } from '@angular/material/expansion';
import {MatBadgeModule} from '@angular/material/badge';
import { Alerts } from '../tasks/alerts/alerts';
import { AlertService } from '../services/alerts-service';


@Component({
  selector: 'app-home-page',
  imports: [MatBadgeModule, MatExpansionModule, RouterLinkWithHref, MatDrawerContainer, MatDrawer, MatDrawerContent, MatIcon, MatNavList, MatListModule, FarmMapComponent, FarmList, RouterOutlet],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
  providers: [Alerts]
})
export class HomePage{

  alertService = inject(AlertService);

}
