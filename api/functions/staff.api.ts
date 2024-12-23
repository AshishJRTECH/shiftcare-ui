import {
  ISettings,
  IUpdateSettings,
  StaffTeamBody
} from "./../../typescript/interface/staff.interfaces";
import { IStaffPost } from "@/interface/staff.interfaces";
import axiosInstance from "../axiosInstance";
import { endpoints } from "../endpoints";
import dayjs from "dayjs";

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

export const getStaffAllDocuments = async (id: string) => {
  const res = await axiosInstance.get(endpoints.staff.staff_all_documents(id));
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

export const editDocument = async (body: {
  id: number;
  fileData: FormData;
}) => {
  const res = await axiosInstance.put(
    `${endpoints.staff.edit_document}/${body.id}`,
    body.fileData
  );
  return res.data;
};

export const deleteDocument = async (id: number) => {
  const res = await axiosInstance.delete(
    `${endpoints.staff.delete_document}/${id}`
  );
  return res.data;
};

export const getTeam = async (id: string) => {
  const res = await axiosInstance.get(`${endpoints.teams.get_team}/${id}`);
  return res.data;
};

export const createTeam = async (body: StaffTeamBody) => {
  const res = await axiosInstance.post(endpoints.teams.create_team, body);
  return res.data;
};

export const editTeam = async (body: { id: string; data: StaffTeamBody }) => {
  const res = await axiosInstance.put(
    `${endpoints.teams.edit_team}/${body.id}`,
    body.data
  );
  return res.data;
};

export const deleteTeam = async (id: number) => {
  const res = await axiosInstance.delete(
    `${endpoints.teams.delete_team}/${id}`
  );
  return res.data;
};

export const getAllActiveShifts = async ({
  startDate = "",
  endDate = ""
}: {
  startDate?: string;
  endDate?: string;
}) => {
  const res = await axiosInstance.get(endpoints.staff.get_all_shifts, {
    params: {
      startDate,
      endDate
    }
  });
  return res.data;
};

// export const getTimesheet = async (id: string) => {
//   const res = await axiosInstance.get(`${endpoints.staff.timesheet}/${id}`);
//   return res.data;
// };

export const getCategory = async () => {
  const res = await axiosInstance.get(endpoints.staff.get_category);
  return res.data;
};
export const getSub_Category = async () => {
  const res = await axiosInstance.get(endpoints.staff.get_sub_category);
  return res.data;
};

export const addCompliance = async ({
  employeeId,
  subcategoryId,
  data
}: {
  employeeId: string;
  subcategoryId: string;
  data: FormData;
}) => {
  try {
    const res = await axiosInstance.post(
      endpoints.staff.create_compliance(employeeId, subcategoryId),
      data
    );
    return res.data;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

export const updateCompliance = async ({
  employeeId,
  subcategoryId,
  documentId,
  data
}: {
  employeeId: string;
  subcategoryId: string;
  documentId: string;
  data: FormData;
}) => {
  try {
    const res = await axiosInstance.post(
      endpoints.staff.update_compliance(employeeId, subcategoryId, documentId),
      data
    );
    return res.data;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

const getCurrentWeekDates = () => {
  const startDate = dayjs().startOf("week").add(1, "day");
  const endDate = dayjs().endOf("week").add(1, "day");

  return {
    startDate: startDate.unix(),
    endDate: endDate.unix()
  };
};

export const getTimesheet = async (
  id: string,
  startDate?: number,
  endDate?: number
) => {
  // If startDate and endDate are not provided, use the current week's dates
  const { startDate: defaultStartDate, endDate: defaultEndDate } =
    getCurrentWeekDates();

  const res = await axiosInstance.get(`${endpoints.staff.timesheet}/${id}`, {
    params: {
      startDate: startDate || defaultStartDate,
      endDate: endDate || defaultEndDate
    }
  });

  return res.data;
};

export const approveTimesheet = async (id: string) => {
  const res = await axiosInstance.put(endpoints.staff.approve_timesheet(id));
  return res.data;
};

// export const approveAllTimesheet = async ({
//   employeeId,
//   startDate,
//   endDate
// }: {
//   employeeId: string;
//   startDate: number;
//   endDate: number;
// }) => {
//   const requestBody = {
//     startDate,
//     endDate
//   };

//   const res = await axiosInstance.put(
//     endpoints.staff.approve_all_timesheet(employeeId),
//     requestBody
//   );
//   return res.data;
// };

export const approveAllTimesheet = async ({
  employeeId,
  startDate,
  endDate
}: {
  employeeId: string;
  startDate: number;
  endDate: number;
}) => {
  const url = `${endpoints.staff.approve_all_timesheet(
    employeeId
  )}?startDate=${startDate}&endDate=${endDate}`;

  // console.log("Request URL:", url); // Log the URL for debugging

  try {
    const res = await axiosInstance.put(url);
    return res.data;
  } catch (error) {
    // console.error("Error approving timesheet:", error);
    throw error; // Rethrow to allow mutation to handle it
  }
};

export const undoTimesheet = async (id: string) => {
  const res = await axiosInstance.put(endpoints.staff.undo_timesheet(id));
  return res.data;
};

export const undoAllTimesheet = async ({
  employeeId,
  startDate,
  endDate
}: {
  employeeId: string;
  startDate: number;
  endDate: number;
}) => {
  const url = `${endpoints.staff.undo_all_timesheet(
    employeeId
  )}?startDate=${startDate}&endDate=${endDate}`;

  // console.log("Request URL:", url); // Log the URL for debugging

  try {
    const res = await axiosInstance.put(url);
    return res.data;
  } catch (error) {
    // console.error("Error approving timesheet:", error);
    throw error; // Rethrow to allow mutation to handle it
  }
};

export const getStaffReports = async (clientId: string) => {
  const res = await axiosInstance.get(
    endpoints.staff.get_staff_report(clientId)
  );
  return res.data;
};

export const getStaffShiftList = async (
  employeeID: string,
  startDate: string,
  endDate: string
) => {
  const res = await axiosInstance.get(
    endpoints.staff.get_client_shift_list(employeeID),
    {
      params: { startDate, endDate } // Query parameters will be appended to the URL
    }
  );
  return res.data;
};
