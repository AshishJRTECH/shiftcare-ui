import axiosInstance from "../axiosInstance";
import { endpoints } from "../endpoints";

export const getAllClients = async () => {
  const res = await axiosInstance.get(endpoints.client.get_all);
  return res.data;
};
