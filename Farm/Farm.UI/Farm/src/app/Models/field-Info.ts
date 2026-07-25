export class FieldInfo{

  name: string|undefined

  isPasture: boolean|undefined

  area: number|undefined

  location: string|undefined//North, North-West, West, South-West, South, South-East, East, North-East, Mid

  imgFile?: File|null

  irrigationType: string|undefined//Drip, Sprinkler, Flood, CenterPivot

  soilQuality: string|undefined//Excellent, Good, Moderate, Poor

  aFarmId: string|undefined

  cropId?: string|undefined

  constructor(value: FieldInfo){
    Object.assign(this, value)
  }
}
