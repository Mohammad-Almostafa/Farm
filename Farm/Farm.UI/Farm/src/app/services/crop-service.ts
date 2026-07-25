import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../Models/paginatedResult';
import { GetCrop } from '../Models/getCrop';
import { CropInfo } from '../Models/crop-Info';
import { CropRefInfo } from '../Models/cropRef-Info';
import { GetCropRef } from '../Models/getCropRef';
import { ImproveCrop } from '../Models/improve-crop';
import { CropModel } from '../admin/adminModel/cropModel';


@Injectable({
  providedIn: 'root',
})
export class CropService {
  constructor(private httpClient: HttpClient){}

  cropApiUrl: string = "http://localhost:5052/api/v1/crop"

  getPagedCrops(
    pageNumber: number = 1,
    pageSize: number = 20,
    search?: string,
    sortBy?: string,
    sortDesc: boolean = false
  ): Observable<PaginatedResult<GetCrop>> {
    let params = new HttpParams()
    .set('pageNumber', pageNumber.toString())
    .set('pageSize', pageSize.toString())
    .set('sortDescending', sortDesc.toString());

    if (search) params = params.set('searchTerm', search);
    if (sortBy) params = params.set('sortBy', sortBy);

    return this.httpClient.get<PaginatedResult<GetCrop>>(`${this.cropApiUrl}/pagedCrops`, { params, timeout: 60000});
  }

  getCropById(id: string|undefined): Observable<GetCrop> {
    return this.httpClient.get<GetCrop>(`${this.cropApiUrl}/${id}`);
  }

  addCrop(data: CropInfo): Observable<CropInfo> {
    const formData = this.convertToFormData(data);
    return this.httpClient.post<CropInfo>(`${this.cropApiUrl}/create-crop`, formData);
  }

  updateCrop(id: string|undefined, data: CropInfo): Observable<CropInfo> {
    const formData = this.convertToFormData(data);
    return this.httpClient.put<CropInfo>(`${this.cropApiUrl}/${id}`, formData);
  }

  improveCrop(id: string, data: ImproveCrop): Observable<ImproveCrop> {
    return this.httpClient.put<ImproveCrop>(`${this.cropApiUrl}/update-crop/${id}`, data);
  }

  deleteCrop(id: string){
    return this.httpClient.delete(`${this.cropApiUrl}/${id}`)
  }

  getAllCropRef(){
    return this.httpClient.get<GetCropRef[]>(`${this.cropApiUrl}/allCropRefs`)
  }

  getCropRefById(id: string|undefined){
    return this.httpClient.get<GetCropRef>(`${this.cropApiUrl}/CropRef/${id}`)
  }

  AddCropRef(data: CropRefInfo){
    return this.httpClient.post<CropRefInfo>(`${this.cropApiUrl}/addCropRef`, data)
  }
  private convertToFormData(data: CropInfo): FormData {
    const formData = new FormData();

    formData.append('type', data.type || '');
    formData.append('variety', data.variety || '');
    formData.append('season', data.season || '');
    formData.append('expectedYield', data.expectedYield?.toString() || '0');
    formData.append('description', data.description || '');
    formData.append('status', data.status || '');
    formData.append('nextFertilization', data.nextFertilization?.toString() || '');
    formData.append('lastWatered', data.nextWatered?.toString() || '');
    formData.append('actualHarvestDate', data.actualHarvestDate?.toString() || '');
    formData.append('yield', data.yield?.toString() || '0');
    formData.append('fieldId', data.fieldId || '');

    if (data.imgFile && data.imgFile instanceof File) {
      formData.append('imgFile', data.imgFile, data.imgFile.name);
    }

    return formData;
  }

  //admin
  getAllCrops(){
    return this.httpClient.get<CropModel[]>(`${this.cropApiUrl}/all`)
  }

  adminUpdateCrop(id: string|undefined, data: CropModel): Observable<CropModel> {
    return this.httpClient.put<CropModel>(`${this.cropApiUrl}/${id}`, data);
  }
}
