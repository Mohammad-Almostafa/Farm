export class CropInfo{

  type: string|undefined

  variety: string|undefined//صنف

  season: string|undefined

  expectedYield: string|undefined

  description: string|undefined

  actualHarvestDate?: Date|undefined

  status?: string|undefined//Planted, Harvested, Fallow, Infested

  yield?: number|undefined

  nextWatered?: Date|undefined

  nextFertilization?: Date|undefined

  fieldId?: string|undefined

  imgFile?: File|null

  constructor(value: CropInfo){
    Object.assign(this, value)
  }
}
