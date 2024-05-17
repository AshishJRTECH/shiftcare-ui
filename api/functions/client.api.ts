import { ClientBody } from "@/interface/client.interface";
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
