export class ImproveCrop{
  actualHarvestDate: Date|undefined

  status?: string|undefined//Planted, Harvested, Fallow, Infested

  yield?: number|undefined

  nextWatered?: Date|undefined

  nextFertilization?: Date|undefined

  constructor(value: ImproveCrop){
    Object.assign(this, value)
  }
}
