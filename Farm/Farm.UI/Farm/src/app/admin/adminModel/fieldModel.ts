export class FieldModel{
  id: string|undefined

  createdAt: Date|undefined

  updatedAt: Date|undefined

  name: string|undefined

  isPasture: boolean|undefined

  area: number|undefined

  location: string|undefined//North, North-West, West, South-West, South, South-East, East, North-East, Mid

  imgUrl: string|undefined

  irrigationType: string|undefined//Drip, Sprinkler, Flood, CenterPivot

  soilQuality: string|undefined//Excellent, Good, Moderate, Poor

  aFarmId: string|undefined

  aFarm: FarmName|undefined

  constructor(value: FieldModel){
    Object.assign(this, value)
  }
}

export class FarmName{
  name: string|undefined
}
