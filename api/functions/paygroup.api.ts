import { PriceItem } from "@/interface/settings.interfaces";
import axiosInstance from "../axiosInstance";
import { endpoints } from "../endpoints";

export const getAllPayGroups = async (page: string) => {
  const res = await axiosInstance.get(
    endpoints.settings.pay_groups.get_all_paygroup,
    {
      params: {
        page: page
      }
    }
  );
  return res.data;
};

export const addPayGroup = async (data: { payGroupName: string }) => {
  const res = await axiosInstance.post(
    endpoints.settings.pay_groups.add_paygroup,
    data
  );
  return res.data;
};

export const updatePayGroup = async ({
  id,
  data
}: {
  id: number;
  data: { payGroupName: string };
}) => {
  const res = await axiosInstance.put(
    endpoints.settings.pay_groups.update_paygroup(id),
    data
  );
  return res.data;
};

export const deletePayGroup = async (id: number) => {
  const res = await axiosInstance.put(
    endpoints.settings.pay_groups.delete_paygroup(id)
  );
  return res.data;
};

export const updatePriceItems = async ({
  id,
  payItems
}: {
  id: number;
  payItems: PriceItem[];
}) => {
  const res = await axiosInstance.put(
    endpoints.settings.price_items.update_price_items(id),
    payItems
  );
  return res.data;
};
