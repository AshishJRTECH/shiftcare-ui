/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable no-unused-vars */

export enum HttpStatusCode {
  Continue = 100,
  SwitchingProtocols = 101,
  Processing = 102,
  Ok = 200,
  Created = 201,
  Accepted = 202,
  NonAuthoritativeInformation = 203,
  NoContent = 204,
  ResetContent = 205,
  PartialContent = 206,
  MultiStatus = 207,
  AlreadyReported = 208,
  ImUsed = 226,
  MultipleChoices = 300,
  MovedPermanently = 301,
  Found = 302,
  SeeOther = 303,
  NotModified = 304,
  UseProxy = 305,
  SwitchProxy = 306,
  TemporaryRedirect = 307,
  PermanentRedirect = 308,
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthenticationRequired = 407,
  RequestTimeout = 408,
  Conflict = 409,
  Gone = 410,
  LengthRequired = 411,
  PreconditionFailed = 412,
  PayloadTooLarge = 413,
  UriTooLong = 414,
  UnsupportedMediaType = 415,
  RangeNotSatisfiable = 416,
  ExpectationFailed = 417,
  IAmATeapot = 418,
  MisdirectedRequest = 421,
  UnprocessableEntity = 422,
  Locked = 423,
  FailedDependency = 424,
  UpgradeRequired = 426,
  PreconditionRequired = 428,
  TooManyRequests = 429,
  RequestHeaderFieldsTooLarge = 431,
  UnavailableForLegalReasons = 451,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  HttpVersionNotSupported = 505,
  VariantAlsoNegotiates = 506,
  InsufficientStorage = 507,
  LoopDetected = 508,
  NotExtended = 510,
  NetworkAuthenticationRequired = 511
}

export type StatusCodes = `${Extract<
  HttpStatusCode,
  number
>}` extends `${infer N extends number}`
  ? N
  : never;
export interface BaseApiResponse {
  message: string;
  status: StatusCodes;
  type: string;
  token: string;
}

export type ActiveInactiveStatus = "Inactive" | "Active";

export type IRole = {
  id: number;
  name: string;
};

export type UserData = {
  name: string;
  email: string;
  address: string;
  company: string;
  dateOfBirth: string;
  employmentType: string;
  gender: string;
  mobileNo: string;
  phoneNo: string;
  role: IRole[];
  salutation: string;
  typeOfUser: string;
} | null;

export interface complianceData {
  fileName: string;
  fileType: string;
  fileSize: number;
  lastUpdated: number;
  downloadURL: string;
  expiryDate: number;
  expiry: boolean;
  status: boolean;
  employee: number;
  documentSubCategory: string;
  client: number;
  clientDocumentCategory: string;
}

export interface documents {
  fileName: string;
  fileType: string;
  fileSize: number;
  lastUpdated: number;
  downloadURL: string;
  expiryDate: number;
  expiry: boolean;
  status: boolean;
  employee: number;
  documentSubCategory: string;
  client: number;
  clientDocumentCategory: string;
}
export interface staffAllDocuments {
  Competencies: documents[];
  Qualifications: documents[];
  Compliance: documents[];
  KPI: documents[];
  Other: documents[];
}

export interface ClientDocuments {
  documentId: number | null;
  fileName: string | null;
  fileType: string | null;
  fileSize: number | null;
  lastUpdated: number | null;
  downloadURL: string | null;
  documentName: string | null;
  expiryDate: number | null;
  isExpiryMandatory: boolean | null;
  expiry: boolean;
  status: boolean;
  clientDocumentCategoryId: number;
  clientDocumentSubCategoryId: number;
  clientDocumentSubCategory: string;
  client: number | null;
  clientDocumentCategory: string | null;
  staffVisible: boolean;
}

export interface TenplateAllDocuments {
  MedicationManagement: ClientDocuments[];
  Core: ClientDocuments[];
  StaffHR: ClientDocuments[];
  Governance: ClientDocuments[];
  BehaviourSupport: ClientDocuments[];
  CommunityNursing: ClientDocuments[];
}

export interface PayrollSettingInterface {
  dailyHours: number;
  weeklyHours: number;
  employeeId: string;
  payGroupId: string;
  payGroupName: string;
  allowances: any[]; // Adjust type as needed
  industryAward: string | null;
  awardLevel: string | null;
  awardLevelPayPoint: string | null;
  employeeProfile: any | null; // Adjust type as needed
}

export {};
