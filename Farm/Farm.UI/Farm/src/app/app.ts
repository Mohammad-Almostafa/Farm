import { Component, Inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { HomePage } from "./home-page/home-page";
import {MatDialog} from '@angular/material/dialog';
import { Profile } from './profile/profile/profile';
import { AccountService } from './services/account-service';
import {MatSidenavModule} from '@angular/material/sidenav';
import { SignalRService } from './services/signalr-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule, HomePage, RouterLinkWithHref, MatSidenavModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  constructor(private signalRService: SignalRService, private router : Router, private dialog: MatDialog, private accountService: AccountService){}

  ngOnInit(): void {
    this.signalRService.startConnection();
  }

  isLoggedIn(): boolean{
    return !!localStorage.getItem('username')
  }


  OnSigninClick() {
    this.router.navigate(['/signin'])
  }

  openProfileDialog() {
    const dialogRef = this.dialog.open(Profile);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  OnHomeClick() {
    this.router.navigate(['/home'])
  }

  protected readonly title = signal('Farm');
}
