import { ShiftType } from "@/interface/shift.interface";
import axiosInstance from "../axiosInstance";
import { endpoints } from "../endpoints";

export const createShift = async (body: ShiftType) => {
  const res = await axiosInstance.post(endpoints.shift.create_shift, body);
  return res.data;
};

export const editShift = async (body: ShiftType) => {
  const res = await axiosInstance.put(
    endpoints.shift.edit_shift(body.id),
    body
  );
  return res.data;
};

export const cancelShift = async (id: number) => {
  const res = await axiosInstance.put(endpoints.shift.cancel_shift(id));
  return res.data;
};

export const getAllShifts = async ({
  token,
  startDate = "",
  endDate = ""
}: {
  token?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const res = await axiosInstance.get(endpoints.shift.get_all_shifts, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`
        }
      : {},
    params: {
      startDate,
      endDate
    }
  });
  return res.data;
};

export const getAllShiftsForClient = async ({
  id,
  startDate = "",
  endDate = ""
}: {
  id: string;
  startDate?: string;
  endDate?: string;
}) => {
  const res = await axiosInstance.get(
    endpoints.shift.get_shifts_for_client(id),
    {
      params: {
        startDate,
        endDate
      }
    }
  );
  return res.data;
};

export const getAllShiftsForStaff = async ({
  id,
  startDate = "",
  endDate = ""
}: {
  id: string;
  startDate?: string;
  endDate?: string;
}) => {
  const res = await axiosInstance.get(
    endpoints.shift.get_shifts_for_staff(id),
    {
      params: {
        startDate,
        endDate
      }
    }
  );
  return res.data;
};

export const getAllDirectShiftsNotes = async ({
  startDate,
  endDate
}: {
  startDate?: number | null;
  endDate?: number | null;
}) => {
  const res = await axiosInstance.get(
    endpoints.shift.notes.get_all_shift_notes,
    {
      params: {
        startDate,
        endDate
      }
    }
  );
  return res.data;
};

export const addShiftNote = async (body: FormData) => {
  const res = await axiosInstance.post(endpoints.shift.notes.add_note, body);
  return res.data;
};

export const exportShiftNotes = async (id: string) => {
  const res = await axiosInstance.get(endpoints.shift.notes.export(id));
  return res.data;
};
