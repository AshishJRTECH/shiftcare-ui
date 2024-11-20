import { Shift } from "@/interface/shift.interface";
import { Box } from "@mui/system";
import moment from "moment";
import { useMemo, useState } from "react";
import TimeSheetTable from "./TimeSheetTable";
import Toolbar from "./Toolbar";
import { useQuery } from "@tanstack/react-query";
import { getAllShifts } from "@/api/functions/shift.api";

export default function Timesheet({ shifts }: { shifts: Shift[] }) {
  // Set locale to start the week on Monday
  moment.updateLocale("en", {
    week: {
      dow: 1 // Monday is the first day of the week
    }
  });

  const [date, setDate] = useState(moment());
  const week = useMemo(
    () => [moment(date).startOf("week"), moment(date).endOf("week")],
    [date]
  );
  const [type, setType] = useState("weekly");
  const [view, setView] = useState("staff");
  const [zoomLevel, setZoomLevel] = useState(1);

  const { data } = useQuery({
    queryKey: ["all_shifts", week[0], week[1], type, date],
    queryFn: () =>
      getAllShifts(
        type === "weekly"
          ? {
              startDate: week[0].format("YYYY-MM-DDT00:00:00.000"),
              endDate: week[1].format("YYYY-MM-DDT23:59:59.999")
            }
          : {
              startDate: date.startOf("day").format("YYYY-MM-DDT00:00:00.000"),
              endDate: date.endOf("day").format("YYYY-MM-DDT23:59:59.999")
            }
      ),
    initialData: shifts
  });

  console.log("Shift Data:::::::::::::::::::::::::::::::", data);

  const zoomIn = () => {
    setZoomLevel((prev) => {
      const newZoomLevel = Math.min(prev + 0.1, 2.5); // Max zoom level 2
      document.body.style.transform = `scale(${newZoomLevel})`;
      document.body.style.transformOrigin = "0 0"; // Set origin to top-left
      return newZoomLevel;
    });
  };

  const zoomOut = () => {
    setZoomLevel((prev) => {
      const newZoomLevel = Math.max(prev - 0.1, 0.5); // Min zoom level 0.5
      (document.body.style as any).zoom = `${newZoomLevel}`; // Use type assertion to avoid TypeScript error
      return newZoomLevel;
    });
  };

  return (
    <Box>
      <Toolbar
        week={week}
        setDate={setDate}
        date={date}
        type={type}
        setType={setType}
        view={view}
        setView={setView}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
      />
      <TimeSheetTable
        day={type === "daily" ? date : week[0]}
        type={type}
        shifts={data}
        view={view}
      />
    </Box>
  );
}
