export class GetCropRef{

  id: string|undefined

  name: string|undefined

  season: string|undefined

  yield: string|undefined

  description: string|undefined

  variety_Refs?: GetVarietyRef[]
}

export class GetVarietyRef{

  id: string|undefined

  name: string|undefined
}
