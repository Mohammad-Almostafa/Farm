export interface FarmStatistics {
  farmArea: number;
  totalFields: number;
  totalSensors: number;
  pendingTasks: number;
  cropDistribution: { name: string; value: number }[];
}
