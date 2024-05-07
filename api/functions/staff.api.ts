import {
  ISettings,
  IUpdateSettings
} from "./../../typescript/interface/staff.interfaces";
import { IStaffPost } from "@/interface/staff.interfaces";
import axiosInstance from "../axiosInstance";
import { endpoints } from "../endpoints";

export const addStaff = async (body: IStaffPost) => {
  const res = await axiosInstance.post(endpoints.staff.new, body);
  return res.data;
};

export const getStaffList = async () => {
  const res = await axiosInstance.get(endpoints.staff.list);
  return res.data;
};

export const getStaff = async (id: string) => {
  const res = await axiosInstance.get(`${endpoints.staff.getStaff}/${id}`);
  return res.data;
};

export const updateStaff = async ({ id, data }: { id: string; data: any }) => {
  const res = await axiosInstance.put(
    `${endpoints.staff.update_staff}/${id}`,
    data
  );
  return res.data;
};

export const updateProfilePhoto = async (body: {
  file: FormData;
  user: string;
}) => {
  const res = await axiosInstance.post(
    `${endpoints.staff.update_profile_photo}/${body.user}`,
    body.file
  );
  return res.data;
};

export const getStaffSettings = async (id: string) => {
  const res = await axiosInstance.get(
    `${endpoints.staff.get_staff_settings}/${id}`
  );
  return res.data;
};

export const updateSettings = async ({
  id,
  data
}: {
  id: string;
  data: IUpdateSettings;
}) => {
  const res = await axiosInstance.put(
    `${endpoints.staff.update_settings}/${id}`,
    data
  );
  return res.data;
};

export const getStaffCompliance = async (id: string) => {
  const res = await axiosInstance.get(endpoints.staff.staff_compliance(id));
  return res.data;
};

export const deleteStaff = async (id: number) => {
  const res = await axiosInstance.put(`${endpoints.staff.delete_staff}/${id}`);
  return res.data;
};

export const getNotes = async (id: string) => {
  const res = await axiosInstance.get(`${endpoints.staff.get_note}/${id}`);
  return res.data;
};

export const updateNotes = async ({
  id,
  data
}: {
  id: string;
  data: string;
}) => {
  const res = await axiosInstance.put(endpoints.staff.update_notes(id), data);
  return res.data;
};

export const getArchivedList = async () => {
  const res = await axiosInstance.get(endpoints.staff.get_archieved_staffs);
  return res.data;
};

export const unarchiveStaff = async (id: number) => {
  const res = await axiosInstance.put(
    `${endpoints.staff.unarchive_staff}/${id}`
  );
  return res.data;
};

export const getAllDocuments = async () => {
  const res = await axiosInstance.get(endpoints.staff.get_all_documents);
  return res.data;
};

export const uploadDocument = async (body: FormData) => {
  const res = await axiosInstance.post(endpoints.staff.upload_documents, body);
  return res.data;
};
