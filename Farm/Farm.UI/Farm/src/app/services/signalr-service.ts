import { Injectable, EventEmitter, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { AlertService } from './alerts-service';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private hubConnection!: signalR.HubConnection;

  public sensorDataReceived = new EventEmitter<{ sensorId: string, value: number, timestamp: Date }>();

  constructor(private alertService: AlertService) {}

  startConnection() {
    const token = localStorage.getItem('token');
    const hubApiUrl = `http://localhost:5052/sensorHub?access_token=${token}`
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubApiUrl)
      .withServerTimeout(60000)
      .withKeepAliveInterval(15000)
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          if (retryContext.elapsedMilliseconds < 60_000) {
            return 2000 + Math.random() * 5000;
          }
            return 10_000 + Math.random() * 20_000;
        }})
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connected!'))
      .catch(err => console.error('Error starting SignalR connection: ', err));

    this.hubConnection.on('ReceiveAlert', (message: string) => {
      this.alertService.addAlert(message);
      console.log(message)
    });

    this.hubConnection.on('ReceiveSensorReading', (sensorId: string, value: string, readingTimestamp: string) => {

      this.sensorDataReceived.emit({
        sensorId: sensorId,
        value: parseFloat(value),
        timestamp: new Date(readingTimestamp)
      });
    });
  }

  stopConnection(){
    if (this.hubConnection) {
      this.hubConnection.stop()
        .then(() => console.log('SignalR connection stopped'))
        .catch(err => console.error('Error stopping SignalR connection: ', err));
    }
  }

  isConnected(): boolean{
    return this.hubConnection?.state === signalR.HubConnectionState.Connected
  }
}
