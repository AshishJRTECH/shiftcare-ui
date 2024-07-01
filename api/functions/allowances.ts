import { AllowanceBody } from "@/interface/settings.interfaces";
import axiosInstance from "../axiosInstance";
import { endpoints } from "../endpoints";

export const getAllAllowances = async () => {
  const res = await axiosInstance.get(
    endpoints.settings.allowances.get_all_allowances
  );
  return res.data;
};

export const addAllowance = async (body: AllowanceBody) => {
  const res = await axiosInstance.post(
    endpoints.settings.allowances.add_allowance,
    body
  );
  return res.data;
};

export const updateAllowance = async ({
  id,
  body
}: {
  id: number;
  body: AllowanceBody;
}) => {
  const res = await axiosInstance.put(
    endpoints.settings.allowances.update_allowance(id),
    body
  );
  return res.data;
};

export const deleteAllowance = async (id: number) => {
  const res = await axiosInstance.delete(
    endpoints.settings.allowances.delete_allowance(id)
  );
  return res.data;
};
