import {
  Button,
  MenuItem,
  Paper,
  Popover,
  Select,
  Typography
} from "@mui/material";
import { Stack } from "@mui/system";
import moment, { Moment } from "moment";
import React, { SetStateAction, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import styled from "@emotion/styled";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import AddIcon from "@mui/icons-material/Add";
import AddShift from "../add-shift/add-shift";

const StyledButton = styled(Button)`
  background-color: #fff;
  color: #555;
  box-shadow: none;
  border: 1px solid #ccc;
  &:hover {
    background-color: #ececec;
    box-shadow: none;
  }
`;

export default function Toolbar({
  week,
  date,
  setDate,
  type,
  setType,
  view,
  setView
}: {
  week: Moment[];
  date: Moment;
  setDate: React.Dispatch<SetStateAction<Moment>>;
  type: string;
  setType: React.Dispatch<SetStateAction<string>>;
  view: string;
  setView: React.Dispatch<SetStateAction<string>>;
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const [shiftModal, setShiftModal] = useState(false);

  const open = Boolean(anchorEl);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      gap={2}
      flexWrap="wrap"
      sx={{ paddingBottom: "30px" }}
    >
      <Stack direction="row" marginRight="auto" gap={1}>
        <StyledButton onClick={() => setDate(moment())} variant="contained">
          Today
        </StyledButton>
        <StyledButton
          onClick={() =>
            setDate((prev) =>
              type === "daily"
                ? moment(prev.subtract(1, "day"))
                : moment(prev.subtract(1, "week"))
            )
          }
          variant="contained"
        >
          <ArrowBackIosNewIcon />
        </StyledButton>
        <StyledButton
          onClick={() =>
            setDate((prev) =>
              type === "daily"
                ? moment(prev.add(1, "day"))
                : moment(prev.add(1, "week"))
            )
          }
          variant="contained"
        >
          <ArrowForwardIosIcon />
        </StyledButton>
        <StyledButton
          variant="contained"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl(event.currentTarget);
          }}
        >
          <CalendarMonthIcon />
        </StyledButton>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
        >
          <Paper>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateCalendar
                value={date}
                onChange={(newValue) => {
                  setDate(newValue);
                  setAnchorEl(null);
                }}
              />
            </LocalizationProvider>
          </Paper>
        </Popover>
      </Stack>
      <Typography variant="h5" marginRight="auto">
        {type === "weekly"
          ? week[0].format("M") === week[1].format("M")
            ? week[0].format("MMMM YYYY")
            : `${week[0].format("MMMM")} - ${week[1].format("MMMM YYYY")}`
          : date.format("DD MMMM, YYYY")}
      </Typography>
      <Select
        size="small"
        value={view}
        onChange={(e) => setView(e.target.value)}
        sx={{ backgroundColor: "#fff", minWidth: "150px" }}
      >
        <MenuItem value="staff">Staff</MenuItem>
        <MenuItem value="client">Client</MenuItem>
      </Select>
      <Select
        size="small"
        value={type}
        onChange={(e) => setType(e.target.value)}
        sx={{ backgroundColor: "#fff", minWidth: "150px" }}
      >
        <MenuItem value="weekly">Weekly</MenuItem>
        <MenuItem value="daily">Daily</MenuItem>
      </Select>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setShiftModal(true)}
      >
        Shift
      </Button>
      <AddShift open={shiftModal} onClose={() => setShiftModal(false)} />
    </Stack>
  );
}
