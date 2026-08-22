export interface GetFarmsWithFieldsWithSensors {

  id: string

  name: string|undefined

  location: string|undefined

  Area: number|undefined

  fields: GetFields[];
}


export interface GetFields{

  id: string|undefined

  name: string|undefined

  sensors: GetSensors[]
}

export class GetSensors{

  id: string|undefined

  type: string|undefined
}
