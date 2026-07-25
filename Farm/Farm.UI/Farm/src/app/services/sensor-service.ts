import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GetSensorsWithReadings } from "../Models/getSensorReading";

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
}
