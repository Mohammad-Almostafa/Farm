export interface GetFarmWithFields {

  id: string

  name: string|undefined

  location: string|undefined

  Area: number|undefined

  fields: GetField[];
}

export class GetField{

  id: string|undefined

  name: string|undefined

  isPasture: boolean|undefined

  area: string|undefined

  location: string|undefined //North, North-West, West, South-West, South, South-East, East, North-East, Mid

  imgUrl: string|undefined

  irrigationType: string|undefined //Drip, Sprinkler, Flood, CenterPivot

  soilQuality: string|undefined //Excellent, Good, Moderate, Poor

  farmName: string|undefined
  aFarmId: string|undefined

  cropName: string|undefined
  cropId: string|undefined

  createdAt: Date|undefined
}

