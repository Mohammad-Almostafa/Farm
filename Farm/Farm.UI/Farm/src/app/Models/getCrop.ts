export class GetCrop{

  id: string|undefined

  type: string|undefined//نوع

  variety: string|undefined//صنف

  seasonStart: Date|undefined

  seasonEnd: Date|undefined

  actualHarvestDate: Date|undefined

  status?: string|undefined//Planted, Harvested, Fallow, Infested

  yield: number|undefined

  expectedYield: number|undefined

  nextWatered: Date|undefined

  nextFertilization: Date|undefined

  imgUrl?: string|undefined

  createdAt: Date|undefined
}
