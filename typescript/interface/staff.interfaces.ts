export interface IStaffPost {
  salutation: string;
  name: string;
  email: string;
  mobileNo: string;
  phoneNo: string;
  typeOfUser: string;
  role: number;
  roleIds?: number[];
  gender: string;
  dateOfBirth: string | null;
  employmentType: string;
  address: string;
}

export interface IStaff {
  id: number;
  salutation: string;
  name: string;
  email: string;
  mobileNo: string;
  phoneNo: string;
  typeOfUser: string;
  roleIds: number[];
  rolesName: string[];
  gender: string;
  dateOfBirth: string;
  employmentType: string;
  photoDownloadURL: string;
  address: string;
  languagesSpoken: string[];
  teamName: string;
  company: string;
  verified: boolean;
  deleted: boolean;
}

export interface StaffTeam {
  id: number;
  teamName: string;
  employees: { id: number; name: string }[];
  employeeCount: number;
}

export interface StaffTeamBody {
  teamName: string;
  employeeIds: number[];
}

export interface ISettings {
  id: number;
  roleId: number;
  roleName: string;
  teams: StaffTeam[];
  teamIds: number[];
  isNotifyTimesheetApproval: boolean;
  isSubscribeToNotifications: boolean;
  subscribedEmailCategories: number[];
  isAvailableForRostering: boolean;
  isReadAndWriteClientPrivateNotes: boolean;
  isReadAndWriteStaffPrivateNotes: boolean;
  isAccess: boolean;
  isAccountOwner: boolean;
  employeeId: number;
}

export interface IUpdateSettings {
  roleId: number;
  teamIds: number[];
  isNotifyTimesheetApproval: boolean;
  isSubscribeToNotifications: boolean;
  subscribedEmailCategories: number[];
  isAvailableForRostering: boolean;
  isReadAndWriteClientPrivateNotes: boolean;
  isReadAndWriteStaffPrivateNotes: boolean;
  isAccess: boolean;
  isAccountOwner: boolean;
}

export interface documentInterface {
  id: number;
  fileName: string;
  fileType: string;
  data: string;
  downloadURL: string;
  lastUpdated: number;
  expiryDate: number;
  expiry: boolean;
  status: boolean;
}

export interface Client {
  clientId: number;
  clientName: string;
}

export interface Shift {
  shiftId: number;
  shiftType: string;
}
export interface Allowance {
  allowanceId: number;
  allowanceName: string;
}

export interface ITimesheet {
  id: number;
  date: number[];
  startTime: number[];
  finishTime: number[];
  breakTime: number;
  hours: number;
  distance: number;
  expense: number;
  isTimesheetApproved: null;
  shift: Shift[];
  client: Client[];
  allowances: Allowance[];
}

export interface IDocumentSubCategory {
  name: string;
}

