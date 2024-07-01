export interface Price {
  id: number | string | null;
  days: string;
  daysOfWeek: string[];
  startTime?: number[];
  startTimeHours: number;
  endTime?: number[];
  endTimeHours: number;
  ratePerHour: number;
  referenceNumberInHours: string | null;
  ratePerKM: number;
  referenceNUmberInKM: string | null;
  date: number[] | null;
  isDelete?: boolean;
  fixedPrice?: number;
  referenceNumberFixedPrice?: string | null;
}

export interface IPriceBook {
  id: number;
  priceBookName: string;
  externalId: string;
  isProviderTravel: boolean;
  isFixedPriceOnly: boolean;
  price: Price[];
}

export interface PriceItem {
  id: number;
  daysOfWeek: string[];
  days: string;
  startTime?: number[];
  endTime?: number[];
  date: number[] | null;
  externalId: string;
  startTimeHours: number;
  endTimeHours: number;
  isDelete?: boolean;
}

export interface PayGroup {
  id: number;
  payGroupName: string;
  company: string | null;
  payItems: PriceItem[];
}

export interface Allowance {
  id: number;
  allowancesName: string;
  allowancesType: string;
  value: number;
  externalId: string;
}

export type AllowanceBody = {
  allowancesName: string;
  allowancesType: string;
  value: number;
  externalId: string;
};
