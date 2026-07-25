import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private alerts = signal<string[]>([]);

  public readonly alertsList = this.alerts.asReadonly();
  public readonly alertsCount = computed(() => this.alerts().length);

  addAlert(message: string) {
    this.alerts.update(list => [message, ...list]);
  }

  clearAlerts() {
    this.alerts.set([]);
  }
}
