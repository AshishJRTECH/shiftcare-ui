import { IPriceBook, Price } from "@/interface/settings.interfaces";
import axiosInstance from "../axiosInstance";
import { endpoints } from "../endpoints";

export const getAllPriceBooks = async () => {
  const res = await axiosInstance.get(
    endpoints.settings.pricebook.get_all_pricebooks
  );
  return res.data;
};

export const getPriceBooks = async (page: string) => {
  const res = await axiosInstance.get(
    endpoints.settings.pricebook.get_pricebooks,
    {
      params: {
        page: page
      }
    }
  );
  return res.data;
};

export const addPriceBook = async ({
  data
}: {
  data: Omit<IPriceBook, "price" | "id">;
}) => {
  const res = await axiosInstance.post(
    endpoints.settings.pricebook.add_pricebook,
    data
  );
  return res.data;
};

export const editPriceBook = async (body: {
  id: number;
  data: Omit<IPriceBook, "price" | "id">;
}) => {
  const res = await axiosInstance.put(
    endpoints.settings.pricebook.edit_pricebook(body.id),
    body.data
  );
  return res.data;
};

export const deletePriceBook = async (id: number) => {
  const res = await axiosInstance.put(
    endpoints.settings.pricebook.delte_pricebook(id)
  );
  return res.data;
};

export const copyPriceBook = async (id: number) => {
  const res = await axiosInstance.post(
    endpoints.settings.pricebook.copy_pricebook(id)
  );
  return res.data;
};

export const updatePrices = async (body: { id: number; prices: Price[] }) => {
  const res = await axiosInstance.put(
    endpoints.settings.prices.update_prices(body.id),
    body.prices
  );
  return res.data;
};
