import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GetSensorsWithReadings } from "../Models/getSensorReading";
import { SensorReadingInfo } from "../Models/sensor-reading-info";
import { GetFarmsWithFieldsWithSensors } from "../Models/getFarmsWithFieldsWithSensors";

@Injectable({
  providedIn: 'root',
})
export class SensorService {
  private apiUrl = 'http://localhost:5052/api/v1/sensor';

  constructor(private http: HttpClient) { }

  getSensorHistory(fieldId: string, from: Date, to: Date): Observable<GetSensorsWithReadings[]> {
    const params = {
      from: from.toISOString(),
      to: to.toISOString()
    };
    return this.http.get<GetSensorsWithReadings[]>(`${this.apiUrl}/${fieldId}`, { params });
  }

  getSensorsByFieldId(fieldId: string): Observable<GetSensorsWithReadings[]> {
    return this.http.get<GetSensorsWithReadings[]>(`${this.apiUrl}/${fieldId}`);
  }

  //mock
  addSensorReading(data: SensorReadingInfo): Observable<SensorReadingInfo> {
    return this.http.post<SensorReadingInfo>(`${this.apiUrl}/addReading`, data);
  }

  getFarmsWithFieldsWithSensors(): Observable<GetFarmsWithFieldsWithSensors[]>{
    return this.http.get<GetFarmsWithFieldsWithSensors[]>(`${this.apiUrl}`)
  }
}
