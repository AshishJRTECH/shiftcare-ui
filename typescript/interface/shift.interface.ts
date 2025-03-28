import dayjs, { Dayjs } from "dayjs";

export interface Task {
  taskId?: number;
  task: string;
  isTaskMandatory: boolean;
}
export interface ClientFundsDto {
  fundId: string;
  name: string;
}
export interface payGroupsDTO {
  id: string;
  payGroupName: string;
}
export interface priceBooksDTO {
  id: string;
  priceBookName: string;
}
export interface EmployeePayGroupDto {
  id?: number;
  employeeId: string;
  payGroupId: string;
}
export interface ClientPriceBookDto {
  clientId?: number;
  priceBookIds: string;
  fundIds: string[];
}
export interface ClientPriceBookDtoS {
  clientId?: number;
  priceBookIds: string;
}

export interface ShiftBody {
  startDate: Dayjs;
  isShiftEndsNextDay: boolean;
  startTime: Dayjs;
  endTime: Dayjs;
  breakTimeInMins: number | null;
  // shiftEndDate?: Dayjs;
  isRepeated: boolean;
  address: string;
  apartmentNumber: string;
  shiftType: string;
  recurrance: string;
  repeatNoOfDays: number | string;
  repeatNoOfWeeks: number | string;
  occursOnDays: string[];
  repeatNoOfMonths: number | string;
  occursOnDayOfMonth: number | string;
  endDate: Dayjs;
  isDropOffAddress: boolean;
  dropOffAddress: string;
  dropOffApartmentNumber: string;
  tasks: Task[];
  instruction: string;
  clientIds: number[];
  employeeIds: number[];
  isOpenShift: boolean;
  // priceBookIds: any;
  // fundIds: any;
  employeePayGroups: EmployeePayGroupDto[];
  clientPriceBooks: ClientPriceBookDto[];
}
export interface ShiftBodyS {
  startDate: Dayjs;
  isShiftEndsNextDay: boolean;
  startTime: Dayjs;
  endTime: Dayjs;
  breakTimeInMins: number | null;
  // shiftEndDate?: Dayjs;
  isRepeated: boolean;
  address: string;
  apartmentNumber: string;
  shiftType: string;
  recurrance: string;
  repeatNoOfDays: number | string;
  repeatNoOfWeeks: number | string;
  occursOnDays: string[];
  repeatNoOfMonths: number | string;
  occursOnDayOfMonth: number | string;
  endDate: Dayjs;
  isDropOffAddress: boolean;
  dropOffAddress: string;
  dropOffApartmentNumber: string;
  tasks: Task[];
  instruction: string;
  clientIds: number[];
  employeeIds: number[];
  isOpenShift: boolean;
  // priceBookIds: any;
  // fundIds: any;
  // employeePayGroups: EmployeePayGroupDto[];
  clientPriceBooks: ClientPriceBookDtoS[];
}

export interface ShiftType {
  id?: number;
  startDate: string;
  isShiftEndsNextDay: boolean;
  startTime: string;
  endTime: string;
  breakTimeInMins: number;
  shiftEndDate?: string;
  isRepeated: boolean;
  address: string;
  apartmentNumber: string;
  shiftType: string;
  recurrance: string;
  repeatNoOfDays: number | string;
  repeatNoOfWeeks: number | string;
  occursOnDays: string[];
  repeatNoOfMonths: number | string;
  occursOnDayOfMonth: number | string;
  endDate: string;
  isDropOffAddress: boolean;
  dropOffAddress: string;
  dropOffApartmentNumber: string;
  tasks: Task[];
  instruction: string;
  clientIds: number[];
  employeeIds: number[];
  isOpenShift: boolean;
}

export interface ShiftUser {
  id: number;
  displayName: string;
}

export interface Shift {
  deleted: any;
  isTimesheetApproved: any;
  id: number;
  startDate: number;
  isShiftEndsNextDay: boolean;
  startTime: number[];
  endTime: number[];
  breakTimeInMins: number;
  shiftEndDate: number;
  shiftHours: number;
  isRepeated: boolean;
  address: string;
  apartmentNumber: string;
  shiftType: string;
  recurrance: string;
  repeatNoOfDays: number;
  repeatNoOfWeeks: number;
  occursOnDays: string[];
  repeatNoOfMonths: number;
  occursOnDayOfMonth: number;
  endDate: number;
  isDropOffAddress: boolean;
  dropOffAddress: string;
  dropOffApartmentNumber: string;
  tasks: Task[];
  instruction: string;
  client: ShiftUser;
  employee: ShiftUser;
  employeeStartTime: number[];
  employeeEndTime: number[];
  clientStartTime: number[];
  clientEndTime: number[];
  occurrenceCounter?: boolean;
  isOpenShift: boolean;
  isPickupJob: boolean;
  funds: ClientFundsDto;
  payGroups: payGroupsDTO;
  priceBooks: priceBooksDTO;
  // payGroups: EmployeePayGroupDto[];
  // priceBooks: ClientPriceBookDto[];
}
// export interface ShiftPayPrice {
//   id: number;
//   startDate: number;
//   isShiftEndsNextDay: boolean;
//   startTime: number[];
//   endTime: number[];
//   breakTimeInMins: number;
//   shiftEndDate: number;
//   shiftHours: number;
//   isRepeated: boolean;
//   address: string;
//   apartmentNumber: string;
//   shiftType: string;
//   recurrance: string;
//   repeatNoOfDays: number;
//   repeatNoOfWeeks: number;
//   occursOnDays: string[];
//   repeatNoOfMonths: number;
//   occursOnDayOfMonth: number;
//   endDate: number;
//   isDropOffAddress: boolean;
//   dropOffAddress: string;
//   dropOffApartmentNumber: string;
//   tasks: Task[];
//   instruction: string;
//   client: ShiftUser;
//   employee: ShiftUser;
//   employeeStartTime: number[];
//   employeeEndTime: number[];
//   clientStartTime: number[];
//   clientEndTime: number[];
//   occurrenceCounter?: boolean;
//   isOpenShift: boolean;
//   payGroups: EmployeePayGroupDto[];
//   priceBooks: ClientPriceBookDto[];
// }

export interface Document {
  documentId: any;
  fileName: string;
  fileType: string;
  fileSize: any;
  lastUpdated: any;
  downloadURL: string;
  expiryDate: any;
  expiry: boolean;
  status: boolean;
  employee: any;
  documentSubCategory: any;
  client: any;
  clientDocumentCategory: any;
  staffVisible: boolean;
}

export interface ShiftNotes {
  shiftAssignedTo: string | TrustedHTML;
  shiftStartTimeEpoch: number;
  shiftEndTimeEpoch: number;
  employeeClockInTime: number;
  employeeClockOutTime: number;
  id: number;
  shiftNotesCategories: string;
  date: number[];
  createdAt: number[];
  notes: string;
  addedByEmployee: string;
  clientId: number;
  clientName: string;
  documentDownloadUrls: string[];
  documents: Document[];
  epochDate: number;
  createdAtEpoch: number;
  subject: string;
  notePrivate: boolean;
  email: boolean;
  employeeId: number;
}

export interface ShiftNoteBody {
  shiftNoteCategories: string;
  date: string;
  notes: string;
  subject: string;
  documents: string[];
}

export interface ClientList {
  id: number;
  displayName: string;
  clientMobileNumber: string;
  clientEmail: string;
}

export interface ShiftRepeat {
  // shiftId: number | string;
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
  isRepeated: boolean;
  recurrance: string;
  repeatNoOfDays: number | string;
  repeatNoOfWeeks: number | string;
  repeatNoOfMonths: number | string;
  occursOnDays: string[];
  occursOnDayOfMonth: number | string;
}

export interface GeoLocationCoordinatesTracking {
  shiftId: number;
  shiftStartTime: string;
  shiftEndTime: string;
  shiftLocation: string;
  clockInEpoch: string;
  clockInLatitude: string;
  clockInLongitude: string;
  clockOutEpoch: string;
  clockOutLatitude: string;
  clockOutLongitude: string;
  participantName: string;
}

export interface AppliedShift {
  id: number;
  employeeName: string;
  applicationDate: Date;
  isApplied: boolean;
  isApproved: boolean;
}

export interface SwapShift {
  shiftIds: string[];
  employeeId: string;
}
