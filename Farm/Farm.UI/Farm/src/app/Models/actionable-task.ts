export interface ActionableTask {
  id: string;

  taskType: string;// Irrigation, fertilizing, Harvesting

  farmName: string;

  fieldName: string;

  cropName: string;

  taskTime: string | Date;

  isCompleted: boolean;

  createdAt?: string;

  updatedAt?: string;
}
