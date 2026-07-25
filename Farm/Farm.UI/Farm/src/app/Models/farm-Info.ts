export class FarmInfo{

name: string|undefined

area: number|undefined

location: string|undefined

description: string|undefined

latitude: number|undefined

longitude: number|undefined

formattedAddress: string|undefined

waterSource: string|undefined

workingHours: string|undefined

imgFile?: File | null;

ownerId: string | undefined

  constructor(value: FarmInfo){
    Object.assign(this, value)
  }
}
