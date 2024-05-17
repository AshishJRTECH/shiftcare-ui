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
