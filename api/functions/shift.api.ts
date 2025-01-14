import { ShiftRepeat, ShiftType, SwapShift } from "@/interface/shift.interface";
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

export const exportShiftNotes = async (id: number) => {
  const res = await axiosInstance.get(endpoints.shift.notes.export(id));
  return res.data;
};

// -------------------- To Cancel Shift in Bulk --------------------
export const cancelShiftInBulk = async (shiftIds: number[]) => {
  const body = { shiftIds };
  const res = await axiosInstance.put(
    endpoints.shift.cancel_shift_in_bulk,
    body
  );
  return res.data;
};

export const getAllShiftsIdList = async ({ token }: { token?: string }) => {
  const res = await axiosInstance.get(endpoints.shift.get_all_shift_id, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`
        }
      : {}
  });
  return res.data;
};

export const repeatShift = async (body: ShiftRepeat) => {
  const res = await axiosInstance.post(endpoints.shift.repeat_shift, body);
  return res.data;
};

export const rebookShift = async (shiftid: number) => {
  const res = await axiosInstance.put(endpoints.shift.rebook_shift(shiftid));
  return res.data;
};

export const applyShift = async (id: number) => {
  const res = await axiosInstance.post(endpoints.shift.apply_shift(id));
  return res.data;
};

// To approve the applied shift
export const appliedShiftApprove = async ({
  applicationId,
  data
}: {
  applicationId: number;
  data: FormData;
}) => {
  try {
    const res = await axiosInstance.patch(
      endpoints.shift.applied_shift_approve(applicationId),
      data
    );
    return res.data;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

export const getAllAppliedShift = async ({ shiftId }: { shiftId: number }) => {
  const res = await axiosInstance.get(
    endpoints.shift.get_applied_shift_list(shiftId)
  );
  return res.data;
};

export const swapShift = async (body: SwapShift) => {
  const res = await axiosInstance.put(endpoints.shift.swap_shift, body);
  return res.data;
};