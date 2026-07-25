import { Component, computed, effect, inject, OnInit, signal} from '@angular/core';
import { SignalRService } from '../../services/signalr-service';
import { AlertService } from '../../services/alerts-service';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-alerts',
  imports: [MatIcon],
  templateUrl: './alerts.html',
  styleUrl: './alerts.css',
})
export class Alerts{

  alertService = inject(AlertService);

}
