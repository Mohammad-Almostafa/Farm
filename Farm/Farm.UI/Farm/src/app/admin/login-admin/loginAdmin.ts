import { CommonModule } from "@angular/common"
import { ChangeDetectorRef, Component } from "@angular/core"
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from "@angular/forms"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinner } from "@angular/material/progress-spinner"
import { MatPrefix } from "@angular/material/select"
import { MatSnackBar } from "@angular/material/snack-bar"
import { RouterLink, Router } from "@angular/router"
import { jwtDecode } from "jwt-decode"
import { LoginInfo } from "../../Models/login-Info"
import { TokenInfo } from "../../Models/token-Info"
import { AccountService } from "../../services/account-service"

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, CommonModule, MatProgressSpinner,MatIconModule, CommonModule, MatPrefix],
  templateUrl: './loginAdmin.html',
  styleUrl: './loginAdmin.css',
})
export class LoginAdmin {

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

    this.accountService.logInAdmin(this.loginInfo).subscribe((response: any) => {
      console.log(response)
      localStorage.setItem('token', response.token)
      localStorage.setItem('username', jwtDecode<TokenInfo>(response.token).name)
      localStorage.setItem('email', jwtDecode<TokenInfo>(response.token).email)
      localStorage.setItem('role', jwtDecode<TokenInfo>(response.token).nameid)
      localStorage.setItem('sub', jwtDecode<TokenInfo>(response.token).sub)
      this.router.navigate(['/adminPage'])
      this._snackBar.open('LoggedIn successfully', '✅', { duration: 2000 })
    },(err) => {
      this.isInLoad = true
      this.errorMessage = err.error
      console.log(err.error)
      this.cdr.detectChanges()
    })
  }
}
