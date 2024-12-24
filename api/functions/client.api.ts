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

export const getAllClients = async () => {
  const res = await axiosInstance.get(endpoints.client.get_all);
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
