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
