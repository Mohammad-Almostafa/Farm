export class SensorReadingInfo{

  sensorId: string|undefined

  value: number|undefined

  constructor(value: SensorReadingInfo){
    Object.assign(this, value)
  }
}
