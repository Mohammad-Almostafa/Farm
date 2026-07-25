export interface GetSensorReading {
    sensorId: string;
    value: number;
    readingTimestamp: Date;
}

export interface GetSensorsWithReadings {
    id: string;
    type: string;
    serialNumber: string;
    readings: GetSensorReading[];
}
