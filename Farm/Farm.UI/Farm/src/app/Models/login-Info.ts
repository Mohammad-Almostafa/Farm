export class LoginInfo{
  username_email: string|undefined
  password: string|undefined

  constructor(value: LoginInfo){
    Object.assign(this, value)
  }
}
