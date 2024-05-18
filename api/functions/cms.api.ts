import axiosInstance from "../axiosInstance";
import { endpoints } from "../endpoints";

export const fetchAboutUs = async () => {
  const res = await axiosInstance.get(endpoints.cms.about);
  return res;
};

// Faq
export const faqQuery = () => {
  const res = axiosInstance.get(endpoints.cms.faq);
  return res;
};

export const getRoles = async () => {
  const res = await axiosInstance.get(endpoints.roles.all);
  return res.data;
};

// export const getClientTypes = async () => {
//   const res = await axiosInstance.get(endpoints.cms.);
//   return res.data
// }
