export class GetFarm{

id: string|undefined

name: string|undefined

area: number|undefined

location: string|undefined

imgUrl: string|undefined

description: string|undefined

latitude: number|undefined

longitude: number|undefined

formattedAddress: string|undefined

waterSource: string|undefined

workingHours: string|undefined

soilType: string|undefined

createdAt: Date|undefined

  constructor(value: GetFarm){
    Object.assign(this, value)
  }
}
