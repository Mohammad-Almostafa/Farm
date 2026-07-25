import { FarmName } from "./fieldModel"

export class CropModel{
  id: string|undefined

  createdAt: Date|undefined

  updatedAt: Date|undefined

  type: string|undefined

  variety: string|undefined

  season: number|undefined

  expectedYield: string|undefined

  description: string|undefined//Drip, Sprinkler, Flood, CenterPivot

  imgUrl: string|undefined

  fieldId: string|undefined

  Field: FieldName|undefined

  constructor(value: CropModel){
    Object.assign(this, value)
  }
}

export class FieldName{
  name: string|undefined

  aFarm: FarmName|undefined
}

