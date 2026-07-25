export class FarmModel{

  id: string|undefined

  createdAt: Date| undefined

  updatedAt: Date| undefined

  name: string|undefined

  location: string|undefined

  area: number|undefined

  description: string|undefined

  latitude: number|undefined

  longitude: number|undefined

  formattedAddress: string|undefined

  waterSource: string|undefined

  workingHours: string|undefined

  soilType: string|undefined

  owner: Owner|undefined

  ownerId: string|undefined

  constructor(value: FarmModel){
    Object.assign(this, value)
  }
}
export class Owner{

  id: string|undefined

  name: string|undefined

  email: string|undefined

  constructor(value: Owner){
    Object.assign(this, value)
  }
}
