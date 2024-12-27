export interface InvoicePayment {
  paymentReference: string;
  paymentDate: string;
  amountReceived: string;
}
export interface ReadInvoicePayment {
  id: string;
  paymentDate: string;
  paymentReference: string;
  amountReceived: string;
}