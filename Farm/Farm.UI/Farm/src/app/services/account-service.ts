import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterInfo } from '../Models/register-Info';
import { LoginInfo } from '../Models/login-Info';
import { SignalRService } from './signalr-service';
import { AlertService } from './alerts-service';
import { UserModel } from '../admin/adminModel/userModel';


@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private httpClient: HttpClient, private signalRService: SignalRService, private alertService: AlertService){}

  accountApiUrl: string = "http://localhost:5052/api/v1/account"

  addUser(data: RegisterInfo){
    return this.httpClient.post<RegisterInfo>(`${this.accountApiUrl}/signup`, data)
  }

  logIn(data: LoginInfo){
    if(!this.signalRService.isConnected())
      this.signalRService.startConnection()
    return this.httpClient.post<LoginInfo>(`${this.accountApiUrl}/login`, data)
  }

  logout(){
    localStorage.clear()
    this.signalRService.stopConnection();
    this.alertService.clearAlerts()
  }

  //admin

  logInAdmin(data: LoginInfo){
    return this.httpClient.post<LoginInfo>(`${this.accountApiUrl}/loginAdmin`, data)
  }

  updateUser(id: string|undefined, data: UserModel){
    return this.httpClient.put(`${this.accountApiUrl}/${id}`, data)
  }

  deleteUser(id: string){
    return this.httpClient.delete(`${this.accountApiUrl}/${id}`)
  }

  getUsers(): Observable<UserModel[]>{
    return this.httpClient.get<UserModel[]>(`${this.accountApiUrl}`)
  }

  getUserById(userId: string | undefined): Observable<UserModel[]>{
    return this.httpClient.get<UserModel[]>(`${this.accountApiUrl}/${userId}`)
  }


}
