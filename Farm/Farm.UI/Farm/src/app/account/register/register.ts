import { ChangeDetectionStrategy, ChangeDetectorRef, Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterInfo } from '../../Models/register-Info';
import { AccountService } from '../../services/account-service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  accountFormsGroup!: FormGroup

  isInLoad: boolean = true

  registerInfo: RegisterInfo | undefined

  constructor(private router: Router,
              private fb: FormBuilder,
              private accountService: AccountService,
              private _snackBar: MatSnackBar,
              private cdr: ChangeDetectorRef){
    this.accountFormsGroup = fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]]
    })
  }

  beInLoad(){
    this.isInLoad = false
  }

  errorMessage = signal<string>('')

  addUser(){
    this.registerInfo = new RegisterInfo(this.accountFormsGroup.value)

    this.accountService.addUser(this.registerInfo).subscribe(() =>{
      this.router.navigate(['/signin'])
      this._snackBar.open('Registered successfully', '✅', { duration: 2000 })
    }, (err) =>{
      this.isInLoad = true
      console.log(err.error)
      this.errorMessage.set(err.error)
      this.cdr.detectChanges()
    })
  }
}
