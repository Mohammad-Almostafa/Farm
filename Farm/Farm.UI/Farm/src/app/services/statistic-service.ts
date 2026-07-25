import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { FarmStatistics } from "../Models/statistics";

@Injectable({
  providedIn: 'root',
})
export class StatisticService {
  private apiUrl = 'http://localhost:5052/api/v1/statistic';

  constructor(private http: HttpClient) { }

  getDashboardStats(farmId: string | undefined): Observable<FarmStatistics> {
    return this.http.get<FarmStatistics>(`${this.apiUrl}/${farmId}`);
  }
}
