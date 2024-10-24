export interface IClient {
  id: number;
  salutation: string;
  firstName: string;
  middleName: string;
  lastName: string;
  displayName: string;
  gender: string;
  dateOfBirth: number;
  apartmentNumber: string;
  address: string;
  contactNumber: string;
  mobileNumber: string;
  email: string;
  religion: string;
  maritalStatus: string;
  nationality: string;
  language: string[];
  company: string;
  ndisNumber: string;
  agedCareRecipientID: string;
  customField: string;
  purchaseOrderNumber: string;
  clientType: string;
  priceBookId: number;
  priceBookName: string;
  teamIds: number[];
  teamName: string[];
  isShareProgressNotes: boolean;
  isSMSRemindersEnabled: boolean;
  isInvoiceTravel: boolean;
  prospect: boolean;
  deleted: boolean;
  photoDownloadURL: string | null;
}

export interface ClientBody {
  salutation: string;
  firstName: string;
  middleName: string;
  lastName: string;
  displayName?: string;
  gender: string;
  dateOfBirth: string;
  apartmentNumber: string;
  address: string;
  contactNumber: string;
  mobileNumber: string;
  email: string;
  religion: string;
  maritalStatus: string;
  nationality: string;
  language: string[];
  prospect: boolean;
}

export interface ClientSettings {
  ndisNumber: string;
  agedCareRecipientID: string;
  referenceNumber: boolean;
  customField: string;
  purchaseOrderNumber: string;
  clientType: string;
  priceBookId: number;
  priceBookName?: string;
  teamIds: number[];
  teams?: { teamName: string; id: number }[];
  isShareProgressNotes: boolean;
  isSMSRemindersEnabled?: boolean;
  isInvoiceTravel: boolean;
}

export interface ClientDocument {
  id: number;
  fileName: string;
  clientDocumentCategory: string;
  isStaffVisible: boolean;
  fileType: string;
  downloadURL: string;
  lastUpdated: number;
  expiryDate: number;
  isExpiry: boolean;
  isStatus: boolean;
}

export interface ClientFund {
  id?: number;
  name: string;
  startDate: number[];
  expiryDate: number[];
  amount: number;
  balance: number;
  isDefault: boolean;
  clientId?: number;
}

export interface ClientFundBody {
  name: string;
  startDate: string | null;
  expiryDate: string | null;
  amount: number | null;
  balance: number;
  isDefault: boolean;
}

export interface ClientContact {
  id: number;
  salutation: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  apartmentNumber: string;
  phoneNumber: string;
  mobileNumber: string;
  relationship: string;
  companyName: string;
  companyNumber: string;
  purchaseOrder: string;
  referenceNumber: string;
  customField: string;
  primaryContact: boolean;
  billingContact: boolean;
}

export interface ClientContactBody {
  contactId?: number | null;
  salutation: string | null;
  firstName: string;
  lastName: string | null;
  email: string;
  address: string | null;
  apartmentNumber: string | null;
  phoneNumber: string | null;
  mobileNumber: string | null;
  relationship: string | null;
  companyName: string | null;
  companyNumber: string | null;
  purchaseOrder: string | null;
  referenceNumber: string | null;
  customField: string | null;
  primaryContact: boolean;
  billingContact: boolean;
}

export interface ClientFundsList {
  clientIds: string[]; // if clientIds should be strings
}
