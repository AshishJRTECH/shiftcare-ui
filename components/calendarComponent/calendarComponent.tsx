import { Shift } from "@/interface/shift.interface";
import styled from "@emotion/styled";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { Box } from "@mui/system";
import moment, { Moment } from "moment";
import React from "react";
import { ShiftBox } from "../Timesheet/TimeSheetTable";

const StyledContainer = styled(Box)`
  table {
    border: 1px solid #ddd;
    thead {
      th {
        border-bottom-color: #ddd;
        width: 150px;
        &:not(:last-child) {
          border-right: 1px solid #ddd;
        }
      }
    }
  }
  tbody {
    td {
      height: 150px;
      vertical-align: top;
      border-bottom-color: #ddd;
      &:not(:last-child) {
        border-right: 1px solid #ddd;
      }
      p {
        font-size: 14px;
      }
    }
  }
`;

export default function CalendarComponent({
  date,
  shifts
}: {
  date: Moment;
  shifts: Shift[];
}) {
  const startOfMonth = moment(date).startOf("month");
  const endOfMonth = moment(date).endOf("month");
  const firstWeek = startOfMonth.weeks();
  const endWeek = endOfMonth.weeks();
  const numberOfWeeksInMonth = endWeek - firstWeek + 1;

  return (
    <StyledContainer>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sunday</TableCell>
              <TableCell>Monday</TableCell>
              <TableCell>Tuesday</TableCell>
              <TableCell>Wednesday</TableCell>
              <TableCell>Thursday</TableCell>
              <TableCell>Friday</TableCell>
              <TableCell>Saturday</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: numberOfWeeksInMonth }).map((_, index) => {
              const startOfWeek = startOfMonth
                .clone()
                .add(index, "week")
                .startOf("week");
              return (
                <TableRow key={index}>
                  {Array.from({ length: 7 }).map((_, idx) => {
                    const day = startOfWeek.clone().add(idx, "days");
                    const day_unix = parseInt(day.startOf("day").format("x"));
                    const filteredShifts = shifts?.filter(
                      (_shift) =>
                        parseInt(
                          moment(_shift.startDate).startOf("day").format("x")
                        ) === day_unix
                    );
                    return (
                      <TableCell key={day.unix()}>
                        <Typography
                          sx={{
                            color:
                              day.format("MM") === moment(date).format("MM")
                                ? "#333"
                                : "#ccc"
                          }}
                        >
                          {day.format("DD")}
                        </Typography>
                        <ShiftBox shifts={filteredShifts} isMonthly />
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </StyledContainer>
  );
}
