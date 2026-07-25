import { ChangeDetectorRef, Component, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { AccountService } from '../../services/account-service';
import { LoginInfo } from '../../Models/login-Info';
import { CommonModule } from '@angular/common';
import { jwtDecode } from "jwt-decode";
import { TokenInfo } from '../../Models/token-Info';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, CommonModule, MatProgressSpinner, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  loginForm!: FormGroup

  loginInfo!: LoginInfo

  errorMessage: string = ''

  isInLoad: boolean = true

  constructor(private fb: FormBuilder,
              private router : Router,
              private accountService: AccountService,
              private _snackBar: MatSnackBar,
              private cdr: ChangeDetectorRef){
    this.loginForm = fb.group({
      username_email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  login() {
    this.isInLoad = false
    this.loginInfo = new LoginInfo(this.loginForm.value)

    this.accountService.logIn(this.loginInfo).subscribe((response: any) => {
      console.log(response)
      localStorage.setItem('token', response.token)
      localStorage.setItem('username', jwtDecode<TokenInfo>(response.token).name)
      localStorage.setItem('email', jwtDecode<TokenInfo>(response.token).email)
      localStorage.setItem('role', jwtDecode<TokenInfo>(response.token).nameid)
      localStorage.setItem('sub', jwtDecode<TokenInfo>(response.token).sub)
      this.router.navigate(['/home'])
      this._snackBar.open('LoggedIn successfully', '✅', { duration: 2000 })
    },(err) => {
      this.isInLoad = true
      this.errorMessage = err.error
      console.log(err.error)
      this.cdr.detectChanges()
    })
  }

  OnSignUpClick() {
    this.router.navigate(['/signup'])
  }
}
