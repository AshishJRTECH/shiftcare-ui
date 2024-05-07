import axiosInstance from "../axiosInstance";
import { endpoints } from "../endpoints";

export const getAllTeams = async () => {
  const res = await axiosInstance.get(endpoints.teams.get_all);
  return res.data;
};
