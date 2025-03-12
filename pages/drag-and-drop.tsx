import { useState } from "react";
import {
  Calendar,
  Event,
  EventProps,
  Views,
  dateFnsLocalizer
} from "react-big-calendar";
import withDragAndDrop, {
  EventInteractionArgs
} from "react-big-calendar/lib/addons/dragAndDrop";
import { format, getDay, parse, startOfWeek } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { Stack, styled } from "@mui/system";

const StyledBox = styled(Box)`
  padding: 20px 10px;
  h4 {
    margin-bottom: 40px;
  }

  .rbc-day-slot .rbc-event,
  .rbc-day-slot .rbc-background-event {
    border: 1px solid #dddddd;
    display: flex;
    max-height: 100%;
    min-height: 20px;
    flex-flow: column wrap;
    align-items: flex-start;
    overflow: hidden;
    position: absolute;
  }

  .rbc-event,
  .rbc-day-slot .rbc-background-event {
    border: none;
    box-sizing: border-box;
    box-shadow: none;
    margin: 0;
    padding: 3px 5px;
    background-color: #f0f0f0;
    border-radius: 5px;
    color: #000000;
    cursor: pointer;
    width: 100%;
    text-align: left;
  }
  .rbc-event.rbc-selected,
  .rbc-day-slot .rbc-selected.rbc-background-event {
    background-color: #f0f0f0;
  }
  .rbc-day-slot .rbc-event-label {
    flex: none;
    padding-right: 5px;
    width: auto;
    display: none;
  }

  .css-1k7tmz4-MuiTypography-root {
    margin: 0;
    line-height: 1.5714285714285714;
    color: #333;
    font-size: 0.875rem;
    font-family: Inter, sans-serif;
    font-weight: 400 !important;
  }

  .css-ulg2zn .css-1k7tmz4-MuiTypography-root {
    margin: 0;
    line-height: 1.5714285714285714;
    color: #333;
    font-size: 0.875rem;
    font-family: Inter, sans-serif;
    font-weight: 400 !important;
    margin-top: -4px;
  }

  .rbc-time-view .rbc-row {
    box-sizing: border-box;
    /* min-height: 20px; */
  }
`;

const locales = {
  "en-US": require("date-fns/locale/en-US")
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

interface ShiftEvent extends Event {
  id: any;
  start: Date;
  end: Date;
  location?: string;
  employee?: string;
}

const DragAndDropCalendar = withDragAndDrop<ShiftEvent>(Calendar);

const CustomEvent = ({ event }: EventProps<ShiftEvent>) => (
  <Box
    sx={{
      p: 1,
      backgroundColor: "#f0f0f0",
      color: "#333",
      borderRadius: "4px",
      minHeight: "40px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      whiteSpace: "normal",
      overflowWrap: "break-word",
      wordBreak: "break-word",
      textAlign: "left",
      border: "none",
      padding: "6px"
    }}
  >
    <Typography variant="body2">
      {format(event.start, "hh:mm a")}
      <br></br> To <br></br>
      {format(event.end, "hh:mm a")}
    </Typography>

    <Typography variant="body2" style={{ fontWeight: "bold", fontSize: 12 }}>
      {event.employee}
    </Typography>
  </Box>
);

const CustomWeekHeader = ({ date }: { date: Date }) => (
  <Stack sx={{ textAlign: "center", fontWeight: "bold", p: 1 }} spacing={0.5}>
    <Box>{format(date, "EEEE")}</Box>
    <Box>{format(date, "dd MMM")}</Box>
    <Box>{format(date, "yyyy")}</Box>
  </Stack>
);

export default function Scheduler() {
  const [view, setView] = useState<keyof typeof Views>("WEEK");
  const [events, setEvents] = useState<ShiftEvent[]>([
    {
      title: "Midnight Server Maintenance",
      start: new Date(2025, 2, 9, 0, 0), // March 9, 12 AM
      end: new Date(2025, 2, 9, 1, 0),
      location: "Data Center",
      employee: "Afaque Ahmed",
      allDay: false,
      id: 1
    },
    {
      title: "System Backup",
      start: new Date(2025, 2, 10, 1, 0), // March 10, 1 AM
      end: new Date(2025, 2, 10, 2, 0),
      location: "Server Room",
      employee: "John Doe",
      allDay: false,
      id: 2
    },
    {
      title: "Security Check",
      start: new Date(2025, 2, 11, 2, 0), // March 11, 2 AM
      end: new Date(2025, 2, 11, 3, 0),
      location: "Office Building",
      employee: "Ashish Singh",
      allDay: false,
      id: 3
    },
    {
      title: "Data Synchronization",
      start: new Date(2025, 2, 12, 3, 0), // March 12, 3 AM
      end: new Date(2025, 2, 12, 4, 0),
      location: "Cloud Server",
      employee: "Shahid Akhtar",
      allDay: false,
      id: 4
    },
    {
      title: "Team Meeting",
      start: new Date(2025, 2, 13, 10, 0), // March 13, 10 AM
      end: new Date(2025, 2, 13, 11, 0),
      location: "Conference Room A",
      employee: "Johnson Willium",
      allDay: false,
      id: 5
    },
    {
      title: "Project Discussion",
      start: new Date(2025, 2, 14, 14, 0), // March 14, 2 PM
      end: new Date(2025, 2, 14, 15, 30),
      location: "Room 204",
      employee: "Jane Smith",
      allDay: false,
      id: 6
    },
    {
      title: "Lunch Break",
      start: new Date(2025, 2, 15, 12, 0), // March 15, 12 PM
      end: new Date(2025, 2, 15, 13, 0),
      location: "Cafeteria",
      employee: "Abhishek Santra",
      allDay: false,
      id: 7
    }
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [tempEvent, setTempEvent] = useState<ShiftEvent | null>(null);
  const [originalEvent, setOriginalEvent] = useState<ShiftEvent | null>(null);

  const convertToDate = (date: unknown): Date =>
    date instanceof Date ? date : new Date(date as string);

  // const onEventDrop = ({
  //   event,
  //   start,
  //   end
  // }: EventInteractionArgs<ShiftEvent>) => {
  //   setOriginalEvent(event);
  //   setTempEvent({
  //     ...event,
  //     start: convertToDate(start),
  //     end: convertToDate(end)
  //   });
  //   setOpenDialog(true);
  // };

  const onEventDrop = ({
    event,
    start,
    end
  }: EventInteractionArgs<ShiftEvent>) => {
    const startDate = new Date(start); // Ensure it's a Date object
    const endDate = new Date(end); // Ensure it's a Date object

    setEvents((prevEvents) =>
      prevEvents.map((evt) =>
        evt.id === event.id
          ? {
              ...event,
              start: new Date(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate(),
                event.start.getHours(),
                event.start.getMinutes()
              ),
              end: new Date(
                endDate.getFullYear(),
                endDate.getMonth(),
                endDate.getDate(),
                event.end.getHours(),
                event.end.getMinutes()
              )
            }
          : evt
      )
    );
  };

  const handleConfirmReschedule = () => {
    if (tempEvent) {
      setEvents((prevEvents) =>
        prevEvents.map((evt) =>
          evt.title === tempEvent.title ? tempEvent : evt
        )
      );
      console.log("");
    }
    setOpenDialog(false);
    setTempEvent(null);
  };

  const handleUndo = () => {
    if (originalEvent) {
      setEvents((prevEvents) =>
        prevEvents.map((evt) =>
          evt.title === originalEvent.title ? originalEvent : evt
        )
      );
    }
    setOpenDialog(false);
    setTempEvent(null);
  };

  const slotPropGetter = () => ({
    style: { minHeight: "55px", padding: "4px" }
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <Box p={2}>
        {/* Header */}

        {/* Calendar */}
        <Grid container spacing={2} mt={2}>
          <Grid item xs={2}>
            &nbsp;
          </Grid>
          <Grid item xs={10}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h5">March 2025</Typography>
              <Button variant="contained" startIcon={<Add />}>
                Shift
              </Button>
            </Box>
            <StyledBox>
              <DragAndDropCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "500px" }}
                // views={["month", "week", "day"]}
                views={["week", "day"]}
                defaultView="week"
                onEventDrop={onEventDrop}
                draggableAccessor={() => true}
                components={{
                  event: CustomEvent,
                  week: { header: CustomWeekHeader }
                }}
                slotPropGetter={slotPropGetter}
              />
            </StyledBox>
          </Grid>
        </Grid>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleUndo}>
        <DialogTitle>Confirm Schedule Change</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to reschedule{" "}
            <strong>{tempEvent?.employee}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUndo} color="error">
            No
          </Button>
          <Button onClick={handleConfirmReschedule} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </DndProvider>
  );
}
