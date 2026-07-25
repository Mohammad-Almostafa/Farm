import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FarmInfo } from '../Models/farm-Info';
import { PaginatedResult } from '../Models/paginatedResult';
import { GetFarmWithFields} from '../Models/getFarmWithFields';
import { FieldInfo } from '../Models/field-Info';
import { FieldModel } from '../admin/adminModel/fieldModel';


@Injectable({
  providedIn: 'root',
})
export class FieldService {
  constructor(private httpClient: HttpClient){}

  fieldApiUrl: string = "http://localhost:5052/api/v1/field"

  getPagedFarmWithFields(
    pageNumber: number = 1,
    pageSize: number = 20,
    search?: string,
    sortBy?: string,
    sortDesc: boolean = false
  ): Observable<PaginatedResult<GetFarmWithFields>> {
    let params = new HttpParams()
    .set('pageNumber', pageNumber.toString())
    .set('pageSize', pageSize.toString())
    .set('sortDescending', sortDesc.toString());

    if (search) params = params.set('searchTerm', search);
    if (sortBy) params = params.set('sortBy', sortBy);

    return this.httpClient.get<PaginatedResult<GetFarmWithFields>>(`${this.fieldApiUrl}/pagedfields`, { params, timeout: 60000});
  }

  getAllFarmWithFields(): Observable<GetFarmWithFields[]> {

    return this.httpClient.get<GetFarmWithFields[]>(`${this.fieldApiUrl}/all`, { timeout: 60000});
  }

  addField(data: FieldInfo): Observable<FarmInfo> {
    const formData = this.convertToFormData(data);
    return this.httpClient.post<FarmInfo>(`${this.fieldApiUrl}/create-field`, formData);
  }

  updateField(id: string, data: FieldInfo): Observable<FieldInfo> {
    const formData = this.convertToFormData(data);
    return this.httpClient.put<FieldInfo>(`${this.fieldApiUrl}/${id}`, formData);
  }

  private convertToFormData(data: FieldInfo): FormData {
    const formData = new FormData();

    formData.append('name', data.name || '');
    formData.append('location', data.location || '');
    formData.append('area', data.area?.toString() || '');
    formData.append('irrigationType', data.irrigationType || '');
    formData.append('soilQuality', data.soilQuality || '');
    formData.append('aFarmId', data.aFarmId || '');
    formData.append('cropId', data.cropId || '');

    if (data.imgFile && data.imgFile instanceof File) {
      formData.append('imgFile', data.imgFile, data.imgFile.name);
    }

    return formData;
  }
  //admin
  adminUpdateField(id: string|undefined, data: FieldModel): Observable<FieldModel> {
    return this.httpClient.put<FieldModel>(`${this.fieldApiUrl}/${id}`, data);
  }

  getAllFieldsWithFarm(): Observable<FieldModel[]> {
    return this.httpClient.get<FieldModel[]>(`${this.fieldApiUrl}/allfieldwithfarm`, { timeout: 60000});
  }
  
  deleteField(id: string|undefined){
    return this.httpClient.delete(`${this.fieldApiUrl}/${id}`)
  }
}
