export class UserModel{

  id: string|undefined

  createdAt: Date| undefined

  updatedAt: Date|undefined

  userName: string|undefined

  email: string|undefined

  password: string|undefined

  role: string|undefined

  constructor(value: UserModel){
    Object.assign(this, value)
  }
}
