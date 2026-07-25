export class RegisterInfo{
  username: string|undefined
  email: string|undefined
  password: string|undefined

  constructor(value: RegisterInfo){
    Object.assign(this, value)
  }
}
