export interface IClient {}

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
