import { ClientBody, ClientSettings } from "@/interface/client.interface";
import axiosInstance from "../axiosInstance";
import { endpoints } from "../endpoints";

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

export const getClientFunds = async (id: string) => {
  const res = await axiosInstance.get(endpoints.client.get_client_funds(id));
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
