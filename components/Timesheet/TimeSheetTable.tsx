import {
  Paper,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  TooltipProps,
  Typography,
  tooltipClasses
} from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";
import Shift from "./shift";
import styled from "@emotion/styled";
import moment, { Moment } from "moment";
import { Shift as IShift } from "@/interface/shift.interface";
import { Box, Stack, palette } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import AddShift from "../add-shift/add-shift";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { getStaffList } from "@/api/functions/staff.api";
import { IStaff } from "@/interface/staff.interfaces";
import Loader from "@/ui/Loader/Loder";
import { getAllClients } from "@/api/functions/client.api";
import { IClient } from "@/interface/client.interface";
import Link from "next/link";
import { primary } from "@/themes/_muiPalette";

const StyledTable = styled(Table)`
  border: 1px solid #ddd;
  td,
  th {
    &:not(:last-of-type) {
      border-right: 1px solid #ddd;
    }
    border-bottom: 1px solid #ddd;
  }
  tbody {
    td {
      background-color: #fff;
      &.named-cell {
        min-width: 200px;
        max-width: 200px;
        a {
          color: #333;
          text-decoration: none;
        }
      }
      &:not(.named-cell) {
        min-width: 160px;
        max-width: 160px;
        padding: 0;
        padding-block: 5px;
      }
    }
  }
  .add-shift-box {
    height: 100%;
    margin-inline: 5px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .add-shift-text {
      opacity: 0;
      transition: all 0.3s;
      display: flex;
      align-items: center;
    }
    &:hover {
      background-color: #efefef;
      .add-shift-text {
        opacity: 1;
        transition: all 0.3s;
      }
    }
  }
`;

const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    minWidth: "200px",
    backgroundColor: "#fff",
    // color: "rgba(0, 0, 0, 0.87)",
    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
    border: "1px solid #ebebeb",
    borderRadius: "10px",
    fontSize: 11
  }
}));

export const ShiftBox = ({
  shifts = [],
  isClient,
  isMonthly
}: {
  shifts: IShift[];
  isClient?: boolean;
  isMonthly?: boolean;
}) => {
  const otherShifts = (
    <Stack spacing={1.5} sx={{ padding: "10px 5px" }}>
      {shifts.slice(1).map((_shift) => (
        <Shift
          shift={_shift}
          key={_shift.id}
          type={"comfortable"}
          isClient={isClient}
        />
      ))}
    </Stack>
  );

  return (
    <Box
      sx={{
        position: isMonthly ? "static" : "absolute",
        top: "5px",
        left: 0,
        width: "100%"
      }}
    >
      {shifts.slice(0, 1).map((_shift) => (
        <Shift
          shift={_shift}
          key={_shift.id}
          type={"comfortable"}
          isClient={isClient}
        />
      ))}
      <StyledTooltip title={otherShifts}>
        <Typography
          variant="body1"
          style={{
            display: "block",
            marginTop: "5px",
            paddingLeft: "10px",
            fontSize: "15px",
            color: "#0a9797",
            fontWeight: "500",
            cursor: "pointer"
          }}
        >
          {shifts.length > 1 && `+ ${shifts.length - 1} more`}
        </Typography>
      </StyledTooltip>
    </Box>
  );
};

export default function TimeSheetTable({
  day,
  type,
  view,
  shifts
}: {
  day: Moment;
  type: string;
  view: string;
  shifts: IShift[];
}) {
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null);

  const router = useRouter();

  const { data: staffs, isLoading } = useQuery({
    queryKey: ["user_list"],
    queryFn: getStaffList
  });

  const { data: clients, isLoading: isClientLoading } = useQuery({
    queryKey: ["client_list"],
    queryFn: () => getAllClients()
  });

  const times = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23
  ];

  const dates = useMemo(
    () =>
      Array.from({ length: 7 }).map((_: unknown, index: number) =>
        moment(day).add(index, "day")
      ),
    [day]
  );

  const renderStaffs = staffs?.map((_carer: IStaff) => {
    let hours = 0;
    shifts.forEach((_shift) => {
      if (type === "daily") {
        if (
          day.format("DD/MM/YYYY") ===
            moment(_shift.startDate).format("DD/MM/YYYY") &&
          _shift.employee.id === _carer.id
        ) {
          hours += _shift.shiftHours;
        }
      } else {
        const startOfWeek = parseInt(day.format("x"));
        const endOfWeek = parseInt(moment(day).endOf("isoWeek").format("x"));
        const currentDay = _shift.startDate;

        if (
          startOfWeek <= currentDay &&
          currentDay <= endOfWeek &&
          _shift.employee.id === _carer.id
        ) {
          hours += _shift.shiftHours;
        }
      }
    });
    return (
      <TableRow key={_carer.id}>
        <TableCell className="named-cell">
          <Link href={`/staff/${_carer.id}/view`}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "500",
                fontSize: "15px",
                marginBottom: "5px"
              }}
            >
              {_carer.name}
            </Typography>
          </Link>
          {hours} Hours
        </TableCell>
        {type === "daily"
          ? times.map((_time) => {
              const shifts_based_on_time = shifts.find(
                (_shift) =>
                  moment(_shift.startDate).format("DD/MM/YYYY") ===
                    day.format("DD/MM/YYYY") &&
                  _time >= _shift.startTime[0] &&
                  (_shift.isShiftEndsNextDay || _time < _shift.endTime[0]) &&
                  _carer.id === _shift.employee.id
              );

              const pastDayOverflowingShift = shifts.find(
                (_shift) =>
                  moment(_shift.shiftEndDate).format("DD/MM/YYYY") ===
                    day.format("DD/MM/YYYY") &&
                  _shift.isShiftEndsNextDay &&
                  _time < _shift.endTime[0] &&
                  _carer.id === _shift.employee.id
              );

              const exactShift = shifts.find(
                (_shift) =>
                  moment(_shift.startDate).format("DD/MM/YYYY") ===
                    day.format("DD/MM/YYYY") &&
                  _shift.startTime[0] === _time &&
                  _carer.id === _shift.employee.id
              );

              const colSpanByShift = exactShift
                ? (exactShift?.isShiftEndsNextDay
                    ? 24
                    : exactShift?.endTime[0]) - exactShift?.startTime[0]
                : 1;

              return !shifts_based_on_time || exactShift ? (
                <TableCell
                  key={_time}
                  colSpan={colSpanByShift}
                  sx={{ minWidth: "150px" }}
                >
                  {exactShift ? (
                    <Shift
                      shift={exactShift}
                      key={exactShift?.id}
                      type={"comfortable"}
                    />
                  ) : null}
                </TableCell>
              ) : null;
            })
          : dates.map((_date, index) => {
              const carerShiftsByDate = shifts.filter(
                (_shift) =>
                  moment(_shift.startDate).format("DD/MM/YYYY") ===
                    _date.format("DD/MM/YYYY") &&
                  _carer.id === _shift.employee.id
              );
              const prevCarerShiftsByDate = shifts.filter(
                (_shift) =>
                  moment(_shift.startDate).format("DD/MM/YYYY") ===
                    dates[index !== 0 ? index - 1 : 0].format("DD/MM/YYYY") &&
                  _carer.id === _shift.employee.id
              );

              return prevCarerShiftsByDate[0]?.isShiftEndsNextDay &&
                prevCarerShiftsByDate[0]?.id !==
                  carerShiftsByDate[0]?.id ? null : (
                <TableCell
                  width={100}
                  key={_date.unix()}
                  height={120}
                  sx={{
                    position: "relative",
                    minHeight: "100px",
                    backgroundColor:
                      moment().format("DD/MM/YYYY") ===
                      _date.format("DD/MM/YYYY")
                        ? "rgb(24, 119, 242,0.08) !important"
                        : "rgb(249, 250, 251)"
                  }}
                  colSpan={
                    carerShiftsByDate[0]?.isShiftEndsNextDay &&
                    index !== dates.length - 1
                      ? 2
                      : 1
                  }
                >
                  {carerShiftsByDate.length > 0 ? (
                    <ShiftBox shifts={carerShiftsByDate} />
                  ) : (
                    <Box
                      className="add-shift-box"
                      onClick={() => {
                        router.replace(
                          {
                            query: {
                              staff: _carer.id
                            }
                          },
                          undefined,
                          { shallow: true }
                        );
                        setSelectedDate(_date);
                      }}
                    >
                      <Typography variant="body1" className="add-shift-text">
                        <AddIcon sx={{ marginRight: "10px" }} /> Shift
                      </Typography>
                    </Box>
                  )}
                </TableCell>
              );
            })}
      </TableRow>
    );
  });

  const renderClients = clients?.map((_client: IClient) => {
    let hours = 0;
    shifts.forEach((_shift) => {
      if (type === "daily") {
        if (
          day.format("DD/MM/YYYY") ===
            moment(_shift.startDate).format("DD/MM/YYYY") &&
          _shift.client.id === _client.id
        ) {
          hours += _shift.shiftHours;
        }
      } else {
        const startOfWeek = parseInt(day.format("x"));
        const endOfWeek = parseInt(moment(day).endOf("isoWeek").format("x"));
        const currentDay = _shift.startDate;

        if (
          startOfWeek <= currentDay &&
          currentDay <= endOfWeek &&
          _shift.client.id === _client.id
        ) {
          hours += _shift.shiftHours;
        }
      }
    });
    return (
      <TableRow key={_client.id}>
        <TableCell className="named-cell">
          <Link href={`/participants/${_client.id}/view`}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "500",
                fontSize: "15px",
                marginBottom: "5px"
              }}
            >
              {_client.displayName}
            </Typography>
          </Link>
          {hours} Hours
        </TableCell>
        {type === "daily"
          ? times.map((_time) => {
              const shifts_based_on_time = shifts.find((_shift) => {
                return (
                  _time >= _shift.startTime[0] &&
                  (_shift.isShiftEndsNextDay || _time < _shift.endTime[0]) &&
                  _client.id === _shift.client.id
                );
              });

              const pastDayOverflowingShift = shifts.find(
                (_shift) =>
                  _shift.isShiftEndsNextDay &&
                  _time < _shift.endTime[0] &&
                  _client.id === _shift.client.id
              );

              const exactShift = shifts.find(
                (_shift) =>
                  _shift.startTime[0] === _time &&
                  _client.id === _shift.client.id
              );

              const colSpanByShift = exactShift
                ? (exactShift?.isShiftEndsNextDay
                    ? 24
                    : exactShift?.endTime[0]) - exactShift?.startTime[0]
                : 1;

              return !shifts_based_on_time || exactShift ? (
                <TableCell
                  key={_time}
                  colSpan={colSpanByShift}
                  sx={{ minWidth: "150px" }}
                >
                  {exactShift ? (
                    <Shift
                      shift={exactShift}
                      key={exactShift?.id}
                      type={"comfortable"}
                      isClient
                    />
                  ) : null}
                </TableCell>
              ) : null;
            })
          : dates.map((_date, index) => {
              const carerShiftsByDate = shifts.filter(
                (_shift) =>
                  moment(_shift.startDate).format("DD/MM/YYYY") ===
                    _date.format("DD/MM/YYYY") &&
                  _client.id === _shift.client.id
              );
              const prevCarerShiftsByDate = shifts.filter(
                (_shift) =>
                  moment(_shift.startDate).format("DD/MM/YYYY") ===
                    dates[index !== 0 ? index - 1 : 0].format("DD/MM/YYYY") &&
                  _client.id === _shift.client.id
              );

              return prevCarerShiftsByDate[0]?.isShiftEndsNextDay &&
                prevCarerShiftsByDate[0]?.id !==
                  carerShiftsByDate[0]?.id ? null : (
                <TableCell
                  width={100}
                  key={_date.unix()}
                  height={120}
                  sx={{
                    position: "relative",
                    minHeight: "100px",
                    backgroundColor:
                      moment().format("DD/MM/YYYY") ===
                      _date.format("DD/MM/YYYY")
                        ? "rgb(24, 119, 242,0.08) !important"
                        : "rgb(249, 250, 251)"
                  }}
                  colSpan={
                    carerShiftsByDate[0]?.isShiftEndsNextDay &&
                    index !== dates.length - 1
                      ? 2
                      : 1
                  }
                >
                  {carerShiftsByDate.length > 0 ? (
                    <ShiftBox shifts={carerShiftsByDate} isClient />
                  ) : (
                    <Box
                      className="add-shift-box"
                      onClick={() => {
                        router.replace(
                          {
                            query: {
                              client: _client.id
                            }
                          },
                          undefined,
                          { shallow: true }
                        );
                        setSelectedDate(_date);
                      }}
                    >
                      <Typography variant="body1" className="add-shift-text">
                        <AddIcon sx={{ marginRight: "10px" }} /> Shift
                      </Typography>
                    </Box>
                  )}
                </TableCell>
              );
            })}
      </TableRow>
    );
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <TableContainer>
        <StyledTable sx={{ minHeight: "100vh" }}>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              {type === "daily"
                ? times.map((_time: number) => (
                    <TableCell align="center" key={_time}>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: "14px", fontWeight: "500" }}
                      >
                        {moment(_time, "HH").format("hh:mm a")}
                      </Typography>
                    </TableCell>
                  ))
                : dates.map((_date: Moment) => {
                    return (
                      <TableCell
                        align="center"
                        key={_date.toISOString()}
                        sx={
                          moment().format("DD/MM/YYYY") ===
                          _date.format("DD/MM/YYYY")
                            ? { backgroundColor: primary.main, color: "#fff" }
                            : {}
                        }
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: "14px",
                            fontWeight:
                              moment().format("DD/MM/YYYY") ===
                              _date.format("DD/MM/YYYY")
                                ? "700"
                                : "500",
                            color:
                              moment().format("DD/MM/YYYY") ===
                              _date.format("DD/MM/YYYY")
                                ? "#fff"
                                : "#333"
                          }}
                        >
                          {_date.format("dddd")}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: "14px",
                            fontWeight:
                              moment().format("DD/MM/YYYY") ===
                              _date.format("DD/MM/YYYY")
                                ? "700"
                                : "500",
                            color:
                              moment().format("DD/MM/YYYY") ===
                              _date.format("DD/MM/YYYY")
                                ? "#fff"
                                : "#333"
                          }}
                        >
                          {_date.format("DD MMM, YYYY")}
                        </Typography>
                      </TableCell>
                    );
                  })}
            </TableRow>
          </TableHead>
          <TableBody>
            {view === "staff" ? renderStaffs : renderClients}
            <TableRow>
              <TableCell />
              {type === "daily"
                ? times.map((_time) => <TableCell height="100%" key={_time} />)
                : dates.map((_date) => (
                    <TableCell
                      height="100%"
                      key={_date.toString()}
                      sx={{
                        backgroundColor:
                          moment().format("DD/MM/YYYY") ===
                          _date.format("DD/MM/YYYY")
                            ? "rgb(24, 119, 242,0.08) !important"
                            : "rgb(249, 250, 251)"
                      }}
                    />
                  ))}
            </TableRow>
          </TableBody>
        </StyledTable>
      </TableContainer>
      <AddShift
        open={Boolean(selectedDate)}
        onClose={() => {
          router.replace(
            {
              query: {}
            },
            undefined,
            { shallow: true }
          );
          setSelectedDate(null);
        }}
        selectedDate={selectedDate}
      />
    </>
  );
}
