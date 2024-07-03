import { getAllActiveShifts } from "@/api/functions/staff.api";
import CalendarComponent from "@/components/calendarComponent/calendarComponent";
import CalendarToolbar from "@/components/calendarComponent/calendarToolbar";
import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React, { useState } from "react";

export default function StaffRoster() {
  const [date, setDate] = useState(moment());

  const { data, isLoading } = useQuery({
    queryKey: [
      "get_all_active_shifts_carer",
      date.startOf("month").format("X"),
      date.endOf("month").format("X")
    ],
    queryFn: () =>
      getAllActiveShifts({
        startDate: date.startOf("month").format("X"),
        endDate: date.endOf("month").format("X")
      })
  });
  return (
    <DashboardLayout isLoading={isLoading}>
      <CalendarToolbar date={date} setDate={setDate} />
      <CalendarComponent date={date} shifts={data} />
    </DashboardLayout>
  );
}
