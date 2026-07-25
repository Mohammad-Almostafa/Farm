import { Component } from '@angular/core';
import { MatDialog, MatDialogActions, MatDialogContent } from "@angular/material/dialog";
import { AccountService } from '../../services/account-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [MatDialogActions, MatDialogContent],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

  userName: any = ''
  email: any = ''

  logOut(){
    this.accountService.logout()
    this.dialog.closeAll()
    this.router.navigate(['/statistics'])
  }

  constructor(private accountService: AccountService, private router : Router, private dialog: MatDialog){
    this.userName = localStorage.getItem('username')
    this.email = localStorage.getItem('email')
  }
}
