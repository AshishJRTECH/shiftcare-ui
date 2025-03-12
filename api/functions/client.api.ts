import {
  ClientContactBody,
  ClientFundsList
} from "./../../typescript/interface/client.interface";
import {
  ClientBody,
  ClientFund,
  ClientFundBody,
  ClientSettings
} from "@/interface/client.interface";
import axiosInstance from "../axiosInstance";
import { endpoints } from "../endpoints";
import ClientFunds from "@/components/client-funds/funds";
import { BillingDataEdit } from "@/interface/billingreport.interface";
import {
  InvoiceNotesInterface,
  InvoicePayment
} from "@/interface/invoicepayment";
import { IDocumentSubCategory } from "@/interface/staff.interfaces";

export const getAllClients = async () => {
  const res = await axiosInstance.get(endpoints.client.get_all);
  return res.data;
};

export const getAllClientsShiftNote = async (token: string | undefined) => {
  if (!token) {
    throw new Error("Authentication token is missing");
  }

  const res = await axiosInstance.get(endpoints.client.get_all, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.data;
};

export const addClient = async (body: ClientBody) => {
  const res = await axiosInstance.post(endpoints.client.add_client, body);
  return res.data;
};

export const getClientArchivedList = async () => {
  const res = await axiosInstance.get(endpoints.client.get_archieved_clients);
  return res.data;
};

export const unarchiveClient = async (id: number) => {
  const res = await axiosInstance.put(
    `${endpoints.client.unarchive_client}/${id}`
  );
  return res.data;
};

export const deleteClient = async (id: number) => {
  const res = await axiosInstance.put(
    `${endpoints.client.delete_client}/${id}`
  );
  return res.data;
};

export const getClient = async (id: string) => {
  const res = await axiosInstance.get(endpoints.client.get_client(id));
  return res.data;
};

export const getClientSettings = async (id: string) => {
  const res = await axiosInstance.get(endpoints.client.get_client_settngs(id));
  return res.data;
};

export const getClientDocuments = async (id: string) => {
  const res = await axiosInstance.get(
    endpoints.client.get_client_documents(id)
  );
  return res.data;
};

export const getClientAdditionalInformation = async (id: string) => {
  const res = await axiosInstance.get(
    endpoints.client.get_client_additional_information(id)
  );
  return res.data;
};

export const getClientContacts = async (id: string) => {
  const res = await axiosInstance.get(endpoints.client.get_client_contacts(id));
  return res.data;
};

export const updateClientProfilePhoto = async (body: {
  id: string;
  file: FormData;
}) => {
  const res = await axiosInstance.post(
    endpoints.client.update_profile_pic(body.id),
    body.file
  );
  return res.data;
};

export const updateClientProfile = async (body: {
  id: string;
  data: Omit<ClientBody, "prospect">;
}) => {
  const res = await axiosInstance.put(
    endpoints.client.update_profile(body.id),
    body.data
  );
  return res.data;
};

export const updateClientSettings = async (body: {
  id: string;
  data: ClientSettings;
}) => {
  const res = await axiosInstance.put(
    endpoints.client.update_settings(body.id),
    body.data
  );
  return res.data;
};

export const updateAdditionalInformation = async ({
  id,
  data
}: {
  id: string;
  data: { privateInfo: string; reviewDate?: string | null };
}) => {
  const res = await axiosInstance.put(
    endpoints.client.update_additional_information(id),
    data
  );
  return res.data;
};

export const addClientFunds = async ({
  id,
  data
}: {
  id: string;
  data: ClientFundBody;
}) => {
  const res = await axiosInstance.post(endpoints.funds.add_fund(id), data);
  return res.data;
};

export const addClientContact = async ({
  id,
  data
}: {
  id: string;
  data: ClientContactBody;
}) => {
  const res = await axiosInstance.post(
    endpoints.client.add_client_contacts(id),
    data
  );
  return res.data;
};

export const updateClientContact = async ({
  id,
  data
}: {
  id: string;
  data: ClientContactBody;
}) => {
  const res = await axiosInstance.put(
    endpoints.client.update_client_contact(id),
    data
  );
  return res.data;
};

export const deleteClientContact = async ({
  id,
  contact_id
}: {
  id: string;
  contact_id: number;
}) => {
  const res = await axiosInstance.delete(
    endpoints.client.delete_client_contact(id, contact_id)
  );
  return res.data;
};

export const getAllShiftNotes = async ({
  id,
  startDate,
  endDate
}: {
  id?: string;
  startDate?: number | null;
  endDate?: number | null;
}) => {
  const res = await axiosInstance.get(endpoints.shift.notes.get_all_notes(id), {
    params: {
      startDate,
      endDate
    }
  });
  return res.data;
};

export const getAllShiftNotesWithShift = async ({
  id,
  startDate,
  endDate
}: {
  id?: string;
  startDate?: number | null;
  endDate?: number | null;
}) => {
  const res = await axiosInstance.get(
    endpoints.shift.notes.get_all_notes_with_shift(id),
    {
      params: {
        startDate,
        endDate
      }
    }
  );
  return res.data;
};

// export const getClientFunds = async (id: string) => {
//   const res = await axiosInstance.get(endpoints.client.get_client_funds(id));
//   return res.data;
// };

export const getClientFunds = async (body: ClientFundsList) => {
  const res = await axiosInstance.post(endpoints.client.get_client_funds, body);
  return res.data;
};

export const getBillingReport = async ({
  clientid,
  fundId,
  startDate,
  endDate
}: {
  clientid: string;
  fundId: string;
  startDate?: string;
  endDate?: string;
}) => {
  const url = `${endpoints.client.get_billing_report(
    clientid
  )}?startDate=${startDate}&endDate=${endDate}&fundId=${fundId}`;

  // console.log("Request URL:", url); // Log the URL for debugging

  try {
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    // console.error("Error approving timesheet:", error);
    throw error; // Rethrow to allow mutation to handle it
  }
};

export const getBillingList = async ({
  startDate,
  endDate
}: {
  startDate?: string;
  endDate?: string;
}) => {
  const url = `${endpoints.client.get_billing_list()}?startDate=${startDate}&endDate=${endDate}`;

  // console.log("Request URL:", url); // Log the URL for debugging

  try {
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    // console.error("Error approving timesheet:", error);
    throw error; // Rethrow to allow mutation to handle it
  }
};

export const updateBillingReport = async ({
  id,
  data
}: {
  id: string;
  data: BillingDataEdit;
}) => {
  const res = await axiosInstance.put(
    endpoints.client.update_billing_report(id),
    data
  );
  return res.data;
};

//
export const getInvoicePreview = async ({
  clientId,
  startDate,
  endDate,
  billingReportIds,
  taxType
}: {
  clientId?: string;
  startDate?: string;
  endDate?: string;
  billingReportIds: string;
  taxType: string;
}) => {
  // Use the get_invoice_preview string directly in the URL construction
  const url = `${endpoints.client.get_invoice_preview}?clientId=${clientId}&startDate=${startDate}&endDate=${endDate}&billingReportIds=${billingReportIds}&taxType=${taxType}`;

  // console.log("Request URL:", url); // Log the URL for debugging

  try {
    const res = await axiosInstance.post(url);
    return res.data;
  } catch (error) {
    // console.error("Error approving timesheet:", error);
    throw error; // Rethrow to allow mutation to handle it
  }
};

export const generateInvoice = async ({
  clientId,
  startDate,
  endDate,
  billingReportIds,
  taxType
}: {
  clientId?: string;
  startDate?: string;
  endDate?: string;
  billingReportIds: string;
  taxType: string;
}) => {
  // Use the get_invoice_preview string directly in the URL construction
  const url = `${endpoints.client.generate_invoice}?clientId=${clientId}&startDate=${startDate}&endDate=${endDate}&billingReportIds=${billingReportIds}&taxType=${taxType}`;

  // console.log("Request URL:", url); // Log the URL for debugging

  try {
    const res = await axiosInstance.post(url);
    return res.data;
  } catch (error) {
    // console.error("Error approving timesheet:", error);
    throw error; // Rethrow to allow mutation to handle it
  }
};

export const getInvoiceList = async ({
  startDate,
  endDate,
  status,
  clientName
}: {
  startDate?: string;
  endDate?: string;
  status?: string;
  clientName?: string;
}) => {
  // Use the get_invoice_preview string directly in the URL construction
  // const url = `${endpoints.client.get_invoice_list}?startDate=${startDate}&endDate=${endDate}`;

  const url = `${endpoints.client.get_invoice_list}?startDate=${startDate}&endDate=${endDate}&status=${status}&clientName=${clientName}`;

  // console.log("Request URL:", url); // Log the URL for debugging

  try {
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    // console.error("Error approving timesheet:", error);
    throw error; // Rethrow to allow mutation to handle it
  }
};

export const getInvoiceView = async (id: string) => {
  const res = await axiosInstance.get(endpoints.client.get_invoice_view(id));
  return res.data;
};

export const getListVoid = async () => {
  const res = await axiosInstance.get(endpoints.client.get_list_void);
  return res.data;
};

export const createInvoiceVoid = async (id: string) => {
  const res = await axiosInstance.post(
    endpoints.client.create_Invoice_Void(id)
  );
  return res.data;
};

export const addInvoicePayment = async ({
  id,
  data
}: {
  id: string;
  data: InvoicePayment;
}) => {
  const res = await axiosInstance.post(
    endpoints.client.create_invoice_payment(id),
    data
  );
  return res.data;
};

export const getPaymentList = async (clientId: string) => {
  const res = await axiosInstance.get(
    endpoints.client.get_Payment_List(clientId)
  );
  return res.data;
};

export const deleteInvoicePayment = async ({
  invoiceId,
  paymentId
}: {
  invoiceId: string;
  paymentId: string;
}) => {
  const res = await axiosInstance.delete(
    endpoints.client.delete_invoice_payment(invoiceId, paymentId)
  );
  return res.data;
};

export const getTimeLine = async (id: string) => {
  const res = await axiosInstance.get(endpoints.client.get_time_line(id));
  return res.data;
};

export const addInvoiceNotes = async ({
  id,
  data
}: {
  id: string;
  data: InvoiceNotesInterface;
}) => {
  const res = await axiosInstance.post(
    endpoints.client.create_invoice_notes(id),
    data
  );
  return res.data;
};

export const exportNotesToEmail = async ({
  id,
  startDate,
  endDate
}: {
  id: number;
  startDate: string;
  endDate: string;
}) => {
  try {
    const data = new FormData();
    data.append("startDate", startDate);
    data.append("endDate", endDate);

    const res = await axiosInstance.get(endpoints.shift.notes.export(id), {
      params: data
    });

    return res.data;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};
export const exportShiftNotesToEmail = async ({
  id,
  startDate,
  endDate
}: {
  id: number;
  startDate: string;
  endDate: string;
}) => {
  try {
    const data = new FormData();
    data.append("startDate", startDate);
    data.append("endDate", endDate);

    const res = await axiosInstance.get(
      endpoints.shift.notes.shiftNotesExport(id),
      {
        params: data
      }
    );

    return res.data;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

export const exportNotesToPdf = async ({
  id,
  startDate,
  endDate
}: {
  id: number;
  startDate: string;
  endDate: string;
}) => {
  try {
    const data = new FormData();
    data.append("startDate", startDate);
    data.append("endDate", endDate);

    const res = await axiosInstance.get(endpoints.shift.notes.exportpdf(id), {
      params: data
    });

    return res.data;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

export const getAllTemporaryClients = async (token?: string) => {
  const res = await axiosInstance.get(
    endpoints.client.get_all_temorary_client,
    {
      headers: token
        ? {
            Authorization: `Bearer ${token}`
          }
        : {}
    }
  );
  return res.data;
};

export const getAllTemplateDocuments = async () => {
  const res = await axiosInstance.get(
    endpoints.client.get_all_template_documents
  );
  return res.data;
};

export const addClientDocumentSubCategory = async ({
  categoryId,
  data
}: {
  categoryId: string;
  data: IDocumentSubCategory;
}) => {
  const res = await axiosInstance.post(
    endpoints.client.create_client_document_subcategory(categoryId),
    data
  );
  return res.data;
};

export const addTemplateDocument = async ({
  subCategoryId,
  data
}: {
  subCategoryId: string;
  data: FormData;
}) => {
  try {
    const res = await axiosInstance.post(
      endpoints.client.create_template_document(subCategoryId),
      data
    );
    return res.data;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

export const deleteClientDocument = async (id: number) => {
  const res = await axiosInstance.delete(
    `${endpoints.client.delete_client_document}/${id}`
  );
  return res.data;
};

export const getClientCategory = async () => {
  const res = await axiosInstance.get(endpoints.client.get_client_category);
  return res.data;
};

export const getClientDocumentsCategory = async () => {
  const res = await axiosInstance.get(
    endpoints.client.get_client_document_category
  );
  return res.data;
};

export const getClientSub_Category = async () => {
  const res = await axiosInstance.get(endpoints.client.get_client_sub_category);
  return res.data;
};

export const updateClientDocument = async ({
  subCategoryId,
  documentId,
  data
}: {
  subCategoryId: string;
  documentId: string;
  data: FormData;
}) => {
  try {
    const res = await axiosInstance.put(
      endpoints.client.update_client_document(subCategoryId, documentId),
      data
    );
    return res.data;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

export const priceImport = async (body: { file: FormData }) => {
  const res = await axiosInstance.post(
    endpoints.client.create_price_import(),
    body.file
  );
  return res.data;
};

// export const getAllTemporaryClients = async (token?: string) => {
//   const res = await axiosInstance.get(
//     endpoints.client.get_all_temorary_client,
//     {
//       headers: token
//         ? {
//             Authorization: `Bearer ${token}`
//           }
//         : {}
//     }
//   );
//   return res.data;
// };
