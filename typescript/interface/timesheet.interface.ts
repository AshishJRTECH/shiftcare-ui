interface TransformedItem {
  shiftDeleted: any;
  isTimesheetApproved: any;
  id: any;
  date: string;
  shiftType: string;
  clientName: string;
  startTime: string;
  finishTime: string;
  breakTime: string | number;
  hours: string;
  distance: string | number;
  expense: string | number;
  allowances: string;
  action: any;
  totalApprovedDistance: any;
  totalApprovedExpenses: any;
  totalApprovedHours: any;
  totalApprovedSleepover: any;
  totalHours: any;
}
