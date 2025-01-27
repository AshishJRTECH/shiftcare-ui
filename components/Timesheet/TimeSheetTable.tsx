"use client"; // To make this component from server to client

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormHelperText,
  Grid,
  MenuItem,
  Paper,
  Popover,
  Select,
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
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Shift from "./shift";
import styled from "@emotion/styled";
import moment, { Moment } from "moment";
import { Shift as IShift, SwapShift } from "@/interface/shift.interface";
import { Box, Stack } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import AddShift from "../add-shift/add-shift";
import { useRouter } from "next/router";
import { getStaffList } from "@/api/functions/staff.api";
import { IStaff } from "@/interface/staff.interfaces";
import Loader from "@/ui/Loader/Loder";
import { getAllClients } from "@/api/functions/client.api";
import { IClient } from "@/interface/client.interface";
import Link from "next/link";
import { Button } from "@mui/material";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import CancelIcon from "@mui/icons-material/Cancel";
import CancelShiftIcon from "@mui/icons-material/CancelOutlined";
import { ButtonGroup } from "@mui/material";
import { cancelShiftInBulk, swapShift } from "@/api/functions/shift.api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "pages/_app";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getAllShiftsIdList } from "@/api/functions/shift.api";
import { parseCookies } from "nookies";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

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
        min-width: 160px;
        max-width: 160px;
        a {
          color: #333;
          text-decoration: none;
        }
      }
      &:not(.named-cell) {
        min-width: 118px;
        max-width: 118px;
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
  .css-dsbshu {
    padding: 16px;
    padding-left: 10px;
    width: 94%;
    background-color: #f0f0f0;
    cursor: pointer;
    border-radius: 10px;
    margin: 5px;
    border: 1px solid #16b0b1;
  }
  /* .css-z2uvy6-MuiTable-root tbody td:not(.named-cell) {
    min-width: 112px !important;
    max-width: 112px !important;
    padding: 5px;
    padding-block: 5px;
  } */

  // To make the ShiftBox display all in table Cell
  .css-1qajr08 {
    position: relative;
    top: 5px;
    left: 0;
    width: 100%;
    margin-bottom: 10px;
  }

  .css-10g438z {
    padding: 16px;
    padding-left: 10px;
    width: 100%;
    background-color: #f0f0f0cf;
    cursor: pointer;
    padding: 16px;
    padding-left: 10px;
    width: auto;
    border: 0.5px solid #cecece;
    border-radius: 3px;
    margin: 3px 5px;
    padding: 1px 10px;
    border-bottom: 2px solid #aeaeae;
    /* background: repeating-linear-gradient(
      45deg,
      #d9d9d9,
      #ffffff 1px,
      #ffffff 2px,
      #ffffff 3px
    ); */

    /* background: repeating-linear-gradient(
      136deg,
      #b6dde3,
      #ffffffc4 15px,
      #ffffff 0px,
      #ffffff 14px
    ); */
  }

  .new-shift-title {
    font-size: 11px;
    color: #000000;
  }

  .new-shift-box {
    border: 1px solid #d1d1d1;
    margin: 5px;
    text-align: center;
    font-size: 12px;
    border-radius: 3px;
    cursor: pointer;
    background-color: #ffffff;
  }

  .new-shift-box:hover {
    border: 1px solid #8a8a8a;
    margin: 5px;
    text-align: center;
    border-radius: 3px;
    cursor: pointer;
    background-color: #1877f2;
    font-weight: bold;
    color: #ffffff;

    .new-shift-title {
      font-size: 11px;
      color: #ffffff;
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
  isMonthly,
  bulkaction,
  selectall
}: {
  shifts: IShift[];
  isClient?: boolean;
  isMonthly?: boolean;
  bulkaction?: boolean;
  selectall?: boolean;
}) => {
  const otherShifts = (
    <Stack spacing={1.5} sx={{ padding: "10px 5px" }}>
      {shifts.slice(1).map((_shift) => (
        <Shift
          shift={_shift}
          key={_shift.id}
          type={"comfortable"}
          isClient={isClient}
          bulkaction={bulkaction}
          selectall={selectall}
        />
      ))}
    </Stack>
  );

  // useEffect(() => {
  //   console.log(
  //     "---------------------: All Shift List :----------------------",
  //     shifts
  //   );
  // }, [shifts]);

  return (
    <Box
      sx={{
        position: isMonthly ? "static" : "absolute",
        top: "5px",
        left: 0,
        width: "100%"
      }}
    >
      {shifts.map((_shift) => (
        <Shift
          shift={_shift}
          key={_shift.id}
          type={"comfortable"}
          isClient={isClient}
          bulkaction={bulkaction}
          selectall={selectall}
        />
      ))}
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
  const [error, setError] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null);
  const [allSelectedData, setAllselecteddata] = useState<number[]>([]);
  const router = useRouter();
  const [openStaffListModal, setOpenStaffListModal] = useState(false);
  const handleCloseStaffListModal = () => {
    setOpenStaffListModal(false);
  };
  const handleOpenStaffListModal = () => {
    setOpenStaffListModal(true);
  };

  const handleChange = (event: any) => {
    setEmployeeId(event.target.value);
    setError(""); // Clear any previous error
  };

  const { mutate: saveSwapShift } = useMutation({
    mutationFn: swapShift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all_shifts"] });
    }
  });

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (!employeeId) {
      setError("Please select a carer");
      return;
    }

    setOpenStaffListModal(false);

    const savedIds = sessionStorage.getItem("shiftIds");
    const validShiftIds: string[] = savedIds ? JSON.parse(savedIds) : [];

    const formattedData: SwapShift = {
      shiftIds: validShiftIds,
      employeeId: employeeId
    };
    saveSwapShift(formattedData); // Mutate

    // console.log("Selected Employee ID:", employeeId);
    // console.log("Selected Shift Ids:", savedIds);
    // console.log("SUBMITTED DATA:", formattedData);

    // Add your form submission logic here
  };

  const { data: staffs, isLoading } = useQuery({
    queryKey: ["user_list"],
    queryFn: getStaffList
  });

  const { data: clients, isLoading: isClientLoading } = useQuery({
    queryKey: ["client_list"],
    queryFn: () => getAllClients()
  });

  // console.log("####################################Client Information", staffs);

  const cookies = parseCookies();
  const token: string = cookies[process.env.NEXT_APP_TOKEN_NAME!];

  const { data: ShiftIdList } = useQuery({
    queryKey: ["shift_id_list"],
    queryFn: () => getAllShiftsIdList({ token })
  });
  // console.log(":::::::::::::TOKEN::::::::::::", token);

  useEffect(() => {
    if (
      ShiftIdList &&
      ShiftIdList.shiftIds &&
      ShiftIdList.shiftIds.length > 0
    ) {
      const formattedShiftIds = ShiftIdList.shiftIds.map(
        (id: any, index: number) => index + 1
      );
      setAllselecteddata(formattedShiftIds);
      // console.log("Shift Id List is here::::::::::::", formattedShiftIds);
      console.log("Shift Id List is here::::::::::::", allSelectedData);
      sessionStorage.setItem(
        "shiftIdsList",
        JSON.stringify(ShiftIdList.shiftIds)
      );
    } else {
      // console.log("ShiftIdList or shiftIds is empty or undefined");
    }
  }, [ShiftIdList]); // Only runs when ShiftIdList changes

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

  const [bulkaction, setBulkAction] = useState(false);
  const [selectall, setSelectAll] = useState(false);

  useEffect(() => {
    // console.log("selectAll after update:", selectall); // This will log the correct updated value
  }, [selectall]);

  const { mutate, isPending } = useMutation({
    mutationFn: cancelShiftInBulk
    // onSuccess: () => {}
  });

  const cancelBulkShift = () => {
    // Read the current array from session storage
    const savedIds = sessionStorage.getItem("shiftIds");

    if (selectall === true) {
      if (savedIds) {
        const shiftIdsArray = JSON.parse(savedIds) as number[];
        mutate(shiftIdsArray);

        sessionStorage.removeItem("shiftIds");

        sessionStorage.setItem("shiftIds", JSON.stringify([]));
      }
    } else {
      if (savedIds) {
        const shiftIdsArray = JSON.parse(savedIds) as number[];
        mutate(shiftIdsArray);
        // console.log("Cancel the selected Shift:", shiftIdsArray);

        // Uncomment the below code once the above function begin to work fine
        // // Clear the session storage
        sessionStorage.removeItem("shiftIds");

        // // Optionally, you could save an empty array to the session storage (not strictly necessary)
        sessionStorage.setItem("shiftIds", JSON.stringify([]));

        // // Update the component state to reflect the cleared array
        // setShiftIds([]);
      }
    }
  };

  // ----------------- CODE FOR STAFFs --------------------
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
      // ------------------ FIRST COLUMN OF ROSTER START HERE -----------------
      <TableRow key={_carer.id}>
        {/* <TableCell className="named-cell">
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
        </TableCell> */}

        <TableCell className="named-cell">
          <Link href={`/staff/${_carer.id}/view`}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "500",
                fontSize: "15px",
                marginBottom: "5px",
                color: _carer.name === "Open Shift" ? "red" : "#000000",
                textTransform:
                  _carer.name === "Open Shift" ? "uppercase" : "none"
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
                    // --------------- Alloted Shift start here --------------
                    <Shift
                      shift={exactShift}
                      key={exactShift?.id}
                      type={"comfortable"}
                    />
                  ) : // --------------- Alloted Shift end here --------------
                  null}
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
                        ? "rgba(0, 169, 169, 0.08) !important"
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
                    <>
                      <ShiftBox
                        shifts={carerShiftsByDate}
                        bulkaction={bulkaction}
                        selectall={selectall}
                      />
                      <Box
                        className="new-shift-box"
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
                        <Typography variant="body1" className="new-shift-title">
                          {/* <AddIcon sx={{ marginRight: "10px" }} /> Shift */}
                          Add more shift
                        </Typography>
                      </Box>
                    </>
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

  // ----------------- CODE FOR CLIENTs --------------------
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
                    // ----------------- CLIENT Alloted Shift Start Here --------------
                    <Shift
                      shift={exactShift}
                      key={exactShift?.id}
                      type={"comfortable"}
                      isClient
                    />
                  ) : // ----------------- CLIENT Alloted Shift Start Here --------------
                  null}
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
                        ? "rgba(0, 169, 169, 0.08) !important"
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
                    <ShiftBox
                      shifts={carerShiftsByDate}
                      bulkaction={bulkaction}
                      selectall={selectall}
                      isClient
                    />
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

  // const handleBulkActionClick = () => {
  //   setBulkAction(true);
  //   console.log("Bulk Action Button Status:::::", bulkaction);
  // };
  return (
    <>
      {/* {bulkaction ? (
        <Button
          variant="contained"
          color="error" // This makes the button red
          startIcon={<CancelIcon />}
          onClick={() => {
            setBulkAction(false); // Set bulkAction to false on click
            console.log("bulkaction after click:", bulkaction);
          }}
          sx={{ marginBottom: "10px" }}
        >
          Cancel Bulk Action
        </Button>
      ) : (
        <Button
          variant="contained"
          startIcon={<SelectAllIcon />}
          onClick={() => {
            setBulkAction(true); // Set bulkAction to true on click
            console.log("bulkaction after click:", bulkaction);
          }}
          sx={{ marginBottom: "10px" }}
        >
          Bulk Action
        </Button>
      )} */}
      {bulkaction ? (
        <ButtonGroup>
          <Button
            // variant="contained"
            color="error" // This makes the button red
            startIcon={<ArrowBackIcon />}
            onClick={() => {
              setBulkAction(false); // Set bulkaction to false on click
              // console.log("bulkaction after click:", bulkaction);
            }}
            sx={{ marginBottom: "10px" }}
          >
            Close Bulk Action
          </Button>
          {!selectall ? (
            <Button
              color="info"
              startIcon={<SelectAllIcon />}
              onClick={() => {
                setSelectAll(true);
              }}
              sx={{ marginBottom: "10px" }}
            >
              Select All Shift
            </Button>
          ) : (
            <Button
              color="info"
              startIcon={<CancelIcon />} // You can replace this with an appropriate icon
              onClick={() => {
                setSelectAll(false);
              }}
              sx={{ marginBottom: "10px" }}
            >
              Unselect All Shift
            </Button>
          )}
          <Button
            // variant="contained"
            color="warning" // You can choose a different color if desired
            startIcon={<CancelShiftIcon />}
            onClick={() => cancelBulkShift()}
            sx={{ marginBottom: "10px" }}
          >
            Cancel Shift
          </Button>
          <Button
            // variant="contained"
            color="success" // You can choose a different color if desired
            startIcon={<SwapHorizIcon />}
            onClick={() => handleOpenStaffListModal()}
            sx={{ marginBottom: "10px" }}
          >
            Swap Shift
          </Button>
        </ButtonGroup>
      ) : (
        <ButtonGroup>
          <Button
            // variant="contained"
            startIcon={<SelectAllIcon />}
            onClick={() => {
              setBulkAction(true); // Set bulkaction to true on click
              // console.log("bulkaction after click:", bulkaction);
            }}
            sx={{ marginBottom: "10px" }}
          >
            Bulk Action
          </Button>
        </ButtonGroup>
      )}

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
                            ? { backgroundColor: "#1877F2", color: "#fff" }
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
            {/* ----------------- Staff and Participant Switching --------------------- */}
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
                            ? "rgba(0, 169, 169, 0.08) !important"
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
      <Dialog
        open={openStaffListModal}
        onClose={handleCloseStaffListModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Swap Swift</DialogTitle>
        <Divider />
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid item lg={8} md={6} sm={12} xs={12}>
              <Box>
                <Select
                  fullWidth
                  size="small"
                  value={employeeId}
                  onChange={handleChange}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Select Carer</em>
                  </MenuItem>
                  {isLoading ? (
                    <MenuItem disabled>Loading...</MenuItem>
                  ) : (
                    staffs?.map((staff: IStaff) => (
                      <MenuItem value={staff.id} key={staff.id}>
                        {staff.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {error && <FormHelperText error>{error}</FormHelperText>}
              </Box>
            </Grid>
            {/* <button type="submit">Submit</button> */}
          </DialogContent>
          <DialogActions>
            {/* <Button variant="contained" onClick={handleCloseDocumentDeleteModal}>
            Cancel
          </Button> */}
            <Button
              variant="contained"
              color="error"
              onClick={handleCloseStaffListModal}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}