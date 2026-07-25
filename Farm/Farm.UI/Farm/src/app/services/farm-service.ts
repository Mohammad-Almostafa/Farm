import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FarmInfo } from '../Models/farm-Info';
import { PaginatedResult } from '../Models/paginatedResult';
import { GetFarm } from '../Models/getFarm';
import { FarmModel } from '../admin/adminModel/farmModel';


@Injectable({
  providedIn: 'root',
})
export class FarmService {
  constructor(private httpClient: HttpClient){}

  farmApiUrl: string = "http://localhost:5052/api/v1/farm"

  getPagedFarms(
  pageNumber: number = 1,
  pageSize: number = 20,
  search?: string,
  sortBy?: string,
  sortDesc: boolean = false
  ): Observable<PaginatedResult<GetFarm>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString())
      .set('sortDescending', sortDesc.toString());

    if (search) params = params.set('searchTerm', search);
    if (sortBy) params = params.set('sortBy', sortBy);

    return this.httpClient.get<PaginatedResult<GetFarm>>(`${this.farmApiUrl}/pagedfarms`, { params, timeout: 60000});
  }

  getNearbyFarms(latitude: number, longitude: number, radiusKm: number = 10): Observable<any[]> {
  let params = new HttpParams()
    .set('latitude', latitude.toString())
    .set('longitude', longitude.toString())
    .set('radiusKm', radiusKm.toString());

  return this.httpClient.get<GetFarm[]>(`${this.farmApiUrl}/nearby`, { params });
  }

  getFarmWithWeather(latitude: number, longitude: number): Observable<any[]> {
  let params = new HttpParams()
    .set('latitude', latitude.toString())
    .set('longitude', longitude.toString())

  return this.httpClient.get<GetFarm[]>(`${this.farmApiUrl}/weather`, { params });
  }

  getFarmById(id: string): Observable<GetFarm> {
    return this.httpClient.get<GetFarm>(`${this.farmApiUrl}/${id}`);
  }

  addFarm(data: FarmInfo): Observable<FarmInfo> {
    const formData = this.convertToFormData(data);
    return this.httpClient.post<FarmInfo>(`${this.farmApiUrl}/create-farm`, formData);
  }

  updateFarm(id: string, data: FarmInfo): Observable<FarmInfo> {
    const formData = this.convertToFormData(data);
    return this.httpClient.put<FarmInfo>(`${this.farmApiUrl}/${id}`, formData);
  }

  deleteFarm(id: string){
    return this.httpClient.delete(`${this.farmApiUrl}/${id}`)
  }
  private convertToFormData(data: FarmInfo): FormData {
    const formData = new FormData();

    formData.append('name', data.name || '');
    formData.append('area', data.area?.toString() || '0');
    formData.append('location', data.location || '');
    formData.append('description', data.description || '');
    formData.append('latitude', data.latitude?.toString() || '0');
    formData.append('longitude', data.longitude?.toString() || '0');
    formData.append('workingHours', data.workingHours?.toString() || '0');
    formData.append('waterSource', data.waterSource?.toString() || '0');
    formData.append('OwnerId', localStorage.getItem('sub') || '');
    formData.append('FormattedAddress', data.formattedAddress || '');

    if (data.imgFile && data.imgFile instanceof File) {
      formData.append('imgFile', data.imgFile, data.imgFile.name);
    }

    return formData;
  }
  getAllFarms(): Observable<GetFarm[]> {
    return this.httpClient.get<GetFarm[]>(`${this.farmApiUrl}/all`);
  }

  //admin
  AdminGetAllFarms(): Observable<FarmModel[]> {
    return this.httpClient.get<FarmModel[]>(`${this.farmApiUrl}/allwithowner`);
  }

  adminUpdateFarm(id: string | undefined, data: FarmModel): Observable<FarmModel> {
    console.log(data)
    return this.httpClient.put<FarmModel>(`${this.farmApiUrl}/${id}`, data);
  }
}

