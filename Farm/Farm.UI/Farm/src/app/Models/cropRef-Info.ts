export class CropRefInfo{

  name: string|undefined

  season: string|undefined

  yield: string|undefined

  description: string|undefined

  variety_Refs?: VarietyRefInfo[]

  constructor(value: CropRefInfo){
    Object.assign(this, value)
  }
}

export class VarietyRefInfo{

  name: string|undefined

  constructor(value: VarietyRefInfo){
    Object.assign(this, value)
  }
}
