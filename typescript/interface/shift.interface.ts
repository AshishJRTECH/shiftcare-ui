import { Dayjs } from "dayjs";

export interface Task {
  taskId?: number;
  task: string;
  isTaskMandatory: boolean;
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
  clientId: number | string | null;
  employeeIds: number[];
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
  clientId: number;
  employeeIds: number[];
}

export interface ShiftUser {
  id: number;
  displayName: string;
}

export interface Shift {
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
}

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
