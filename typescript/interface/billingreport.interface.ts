export interface BillingData {
  length: number;
  billingReports: Array<{
    id: number;
    date: [number, number, number]; // [year, month, day]
    startTime: [number, number]; // [hour, minute]
    finishTime: [number, number]; // [hour, minute]
    hourlyRate: number;
    hours: number;
    hourlyCost: number;
    additionalCost: number;
    distanceRate: number;
    distance: number;
    distanceCost: number;
    runningTotal: number;
    cost: number;
    totalHours: number;
    totalCost: number;
    isFundsSelected: boolean;
    runningTotalForFundId: number;
    invoice: string | null;
  }>;
}

export interface BillingDataEdit {
  date: string;
  startTime: string;
  finishTime: string;
  priceBookId: number;
  hourlyRate: number;
  hours: number;
  hourlyCost: number;
  additionalCost: number;
  distanceRate: number;
  distance: number;
  distanceCost: number;
  isShiftUpdated: boolean;
  shiftDto: any;
  isFundsSelected: boolean;
  isAbsent: boolean;
  fundIds: number;
}
