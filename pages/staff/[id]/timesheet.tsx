import { Box, styled } from "@mui/system";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import {
  approveAllTimesheet,
  approveTimesheet,
  getTimesheet,
  undoAllTimesheet,
  undoTimesheet
} from "@/api/functions/staff.api";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { DatePicker } from "@mui/x-date-pickers";
import TextField from "@mui/material/TextField";
import dayjs, { Dayjs } from "dayjs";
import CheckIcon from "@mui/icons-material/Check";
import { queryClient } from "pages/_app";
import { toast } from "sonner";
import FilterListIcon from "@mui/icons-material/FilterList"; // Icon for Filter
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Icon for Approve All
import UndoIcon from "@mui/icons-material/Undo"; // Icon for Undo All

const StyledUserPage = styled(Box)`
  padding: 20px 10px;
  h4 {
    margin-bottom: 40px;
  }
`;

export default function Index() {
  const getCurrentWeekDates = () => {
    const startDate = dayjs().startOf("week").add(1, "day");
    const endDate = dayjs().endOf("week").add(1, "day");
    // console.log("Auto Selected Dates are as below:", { startDate, endDate });
    return {
      startDate: startDate.unix(),
      endDate: endDate.unix()
    };
  };

  // const { startDate, endDate } = getCurrentWeekDates();
  const { startDate: initialStartDate, endDate: initialEndDate } =
    getCurrentWeekDates();
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  const router = useRouter();
  const { id } = router.query; // Accessing the 'id' parameter

  const [selectedStartDate, setSelectedStartDate] = useState<Dayjs | null>(
    null
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Dayjs | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Adjust as needed

  // const { data = [], isLoading } = useQuery({
  //   queryKey: ["staff", id],
  //   queryFn: () => getTimesheet(id as string)
  // });

  // ---------------- Approval Message box controlling start here ----------------
  const [openModalApprove, setModalApprove] = useState(false);

  const handleModalApprove = () => {
    setModalApprove(true);
  };

  const handleCloseModalApprove = () => {
    setModalApprove(false);
  };
  // ---------------- Approval Message box controlling end here ----------------

  // ---------------- Undo Message box controlling start here ----------------
  const [openModalUndo, setModalUndo] = useState(false);

  const handleModalUndo = () => {
    setModalUndo(true);
  };

  const handleCloseModalUndo = () => {
    setModalUndo(false);
  };
  // ---------------- Undo Message box controlling end here ----------------

  useEffect(() => {
    const startDate = dayjs().startOf("week").add(1, "day");
    const endDate = dayjs().endOf("week").add(1, "day");

    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);
  }, []);

  // ------------------ To fetch data from the database start here ------------------
  // const getCurrentWeekDates = () => {
  //   const startDate = dayjs().startOf("week").add(1, "day");
  //   const endDate = dayjs().endOf("week").add(1, "day");
  //   // console.log("Auto Selected Dates are as below:", { startDate, endDate });
  //   return {
  //     startDate: startDate.unix(),
  //     endDate: endDate.unix()
  //   };
  // };

  // // const { startDate, endDate } = getCurrentWeekDates();
  // const { startDate: initialStartDate, endDate: initialEndDate } =
  //   getCurrentWeekDates();
  // const [startDate, setStartDate] = useState(initialStartDate);
  // const [endDate, setEndDate] = useState(initialEndDate);

  const { data = [], isLoading } = useQuery({
    queryKey: ["staff", id, startDate, endDate], // Include dates in the queryKey for caching
    queryFn: () => getTimesheet(id as string, startDate, endDate)
  });
  // ------------------ To fetch data from the database end here ------------------

  useEffect(() => {
    // console.log("============== Data List =================", data);
  }, [data]);

  // ------------ Filter Function is start here -----------
  // This function now updates the state for filtering
  const handleFilter = (selectedStartDate: any, selectedEndDate: any) => {
    console.log("Selected Dates are as below:", {
      selectedStartDate,
      selectedEndDate
    });

    // Update the state with the selected dates
    setStartDate(selectedStartDate.unix());
    setEndDate(selectedEndDate.unix());
  };
  // ------------ Filter Function is end here -------------

  let transformedData: TransformedItem[] = [];

  if (Array.isArray(data)) {
    transformedData = data.map(
      (item: {
        [x: string]: any;
        id: any;
        date: any[]; // Assuming this is an array [year, month, day]
        shift: { shiftType: any } | null;
        client: { clientName: any } | null;
        startTime: any[]; // Assuming this is an array [hour, minute]
        finishTime: any[]; // Assuming this is an array [hour, minute]
        breakTime: number | null;
        hours: number;
        distance: number | null;
        expense: number | null;
        allowances: any[] | null;
        action: any;
        totalApprovedDistance: any;
        totalApprovedExpenses: any;
        totalApprovedHours: any;
        totalApprovedSleepover: any;
        totalHours: any;
      }) => ({
        id: item.id,
        date:
          item.date?.length === 3
            ? `${item.date[0]}-${item.date[1]}-${item.date[2]}`
            : "", // Ensure the array has at least 3 elements
        shiftType: item.shift?.shiftType || "", // Handle null or undefined
        clientName: item.client?.clientName || "", // Handle null or undefined
        startTime:
          item.startTime?.length === 2
            ? `${item.startTime[0]}:${item.startTime[1] < 10 ? "0" : ""}${
                item.startTime[1]
              }`
            : "", // Ensure the array has 2 elements for hour and minute
        finishTime:
          item.finishTime?.length === 2
            ? `${item.finishTime[0]}:${item.finishTime[1] < 10 ? "0" : ""}${
                item.finishTime[1]
              }`
            : "", // Ensure the array has 2 elements for hour and minute
        breakTime: item.breakTime !== null ? item.breakTime : "", // Handle null
        hours: item.hours.toFixed(2),
        distance: item.distance !== null ? item.distance : "", // Handle null
        expense: item.expense !== null ? item.expense : "", // Handle null
        allowances: Array.isArray(item.allowances)
          ? item.allowances.join(", ")
          : "", // Ensure it's an array
        action: item.action,
        totalApprovedDistance: item.totalApprovedDistance,
        totalApprovedExpenses: item.totalApprovedExpenses,
        totalApprovedHours: item.totalApprovedHours,
        totalApprovedSleepover: item.totalApprovedSleepover,
        totalHours: item.totalHours,
        isTimesheetApproved: item.isTimesheetApproved
      })
    );
  }

  const handleChangePage = (
    event: any,
    newPage: React.SetStateAction<number>
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // --------------------------- Time Sheet Approval Start Here ---------------------------
  const { mutate, isPending } = useMutation({
    mutationFn: approveTimesheet,
    onSuccess: (response) => {
      toast.success(response.message);
      // console.log("Response:", response);
      queryClient.invalidateQueries({ queryKey: ["staff", id] });
    }
  });

  const handleApprove = (time_sheet_id: string) => {
    if (typeof time_sheet_id === "string") {
      console.log("Approved");
      mutate(time_sheet_id);
    } else {
      console.error("Invalid id type. Expected a string.");
    }
  };
  // ---------------------------- Time Sheet Approval End Here ----------------------------
  // ---------------------------- Time Sheet Undo Start Here ----------------------------
  const { mutate: undoTimesheetMutation, isPending: ispendingUndo } =
    useMutation({
      mutationFn: undoTimesheet,
      onSuccess: (response) => {
        toast.success(response.message);
        // console.log("Response:", response);
        queryClient.invalidateQueries({ queryKey: ["staff", id] });
      }
    });
  const handleUndoTimesheet = (time_sheet_id: string) => {
    if (typeof time_sheet_id === "string") {
      // console.log("Undo Timesheet of Id:", time_sheet_id);
      undoTimesheetMutation(time_sheet_id);
    } else {
      console.error("Invalid id type. Expected a string.");
    }
  };
  // ---------------------------- Time Sheet Undo End Here ----------------------------

  // --------------------------- All Time Sheet Approval Start Here ---------------------------
  const { mutate: alltimesheetapproval, isPending: ispending } = useMutation({
    mutationFn: approveAllTimesheet,
    onSuccess: (response) => {
      setModalApprove(false);
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["staff", id] });
    }
  });

  const handleAllApprove = () => {
    // const { startDate, endDate } = getCurrentWeekDates();
    // console.log("Selected Dates of Filter:", { startDate, endDate });
    if (typeof id === "string") {
      // console.log("Approved");
      // Pass the required arguments as a single object to the mutation function
      // console.log("Id, dates::", { id, startDate, endDate });
      alltimesheetapproval({ employeeId: id, startDate, endDate }); // Changed this line
    } else {
      console.error("Invalid id type. Expected a string.");
    }
  };
  // ---------------------------- All Time Sheet Approval End Here ----------------------------

  // --------------------------- All Time Sheet Undo Start Here ---------------------------

  const { mutate: alltimesheetundo, isPending: ispendings } = useMutation({
    mutationFn: undoAllTimesheet,
    onSuccess: (response) => {
      setModalUndo(false);
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["staff", id] });
    }
  });

  const handleAllUndo = () => {
    // const { startDate, endDate } = getCurrentWeekDates();
    // console.log("Selected Dates of Filter:", { startDate, endDate });
    if (typeof id === "string") {
      // console.log("Approved");
      // Pass the required arguments as a single object to the mutation function
      // console.log("Id, dates::", { id, startDate, endDate });
      alltimesheetundo({ employeeId: id, startDate, endDate }); // Changed this line
    } else {
      console.error("Invalid id type. Expected a string.");
    }
  };
  // ---------------------------- All Time Sheet Undo End Here ----------------------------

  return (
    <DashboardLayout isLoading={isLoading}>
      <StyledUserPage>
        <Typography variant="h4">Time Sheet</Typography>
        <Grid container spacing={2} alignItems="stretch">
          {/* First Grid Section */}
          <Grid item xs={12} md={6}>
            {transformedData[0] ? (
              <Stack
                direction="row"
                spacing={1}
                justifyContent="space-between"
                alignItems="center"
                sx={{ height: "100%" }}
              >
                <Chip
                  label={
                    <>
                      <Typography
                        variant="body2"
                        sx={{ margin: 0, padding: 0, color: "white" }}
                      >
                        Sleepover: {transformedData[0].totalApprovedSleepover}
                      </Typography>
                    </>
                  }
                  color="error"
                  sx={{ padding: "4px 8px", height: "auto" }} // Adjust padding as needed
                />
                <Chip
                  label={
                    <>
                      <Typography
                        variant="body2"
                        sx={{ margin: 0, padding: 0, color: "white" }}
                      >
                        Mileage: {transformedData[0].totalApprovedDistance}
                      </Typography>
                    </>
                  }
                  color="secondary"
                  sx={{ padding: "4px 8px", height: "auto" }} // Adjust padding as needed
                />
                <Chip
                  label={
                    <>
                      <Typography
                        variant="body2"
                        sx={{ margin: 0, padding: 0, color: "white" }}
                      >
                        Expenses: {transformedData[0].totalApprovedExpenses}
                      </Typography>
                    </>
                  }
                  color="warning"
                  sx={{ padding: "4px 8px", height: "auto" }} // Adjust padding as needed
                />
                <Chip
                  label={
                    <>
                      <Typography
                        variant="body2"
                        sx={{ margin: 0, padding: 0, color: "white" }}
                      >
                        Approved Hours: {transformedData[0].totalApprovedHours}
                      </Typography>
                    </>
                  }
                  color="success"
                  sx={{ padding: "4px 8px", height: "auto" }} // Adjust padding as needed
                />
                <Chip
                  label={
                    <>
                      <Typography
                        variant="body2"
                        sx={{ margin: 0, padding: 0, color: "white" }}
                      >
                        Total: {transformedData[0].totalHours}
                      </Typography>
                    </>
                  }
                  color="primary"
                  sx={{ padding: "4px 8px", height: "auto" }} // Adjust padding as needed
                />
              </Stack>
            ) : (
              <Typography>No Data</Typography>
            )}
          </Grid>

          {/* Second Grid Section: Date Pickers and Filter Button */}
          <Grid item xs={12} md={12}>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
              sx={{ height: "100%" }}
            >
              <DatePicker
                label="Select Start Date"
                value={selectedStartDate}
                onChange={(newValue) => setSelectedStartDate(newValue)}
                slotProps={{
                  textField: { variant: "outlined", fullWidth: true }
                }}
              />
              <DatePicker
                label="Select End Date"
                value={selectedEndDate}
                onChange={(newValue) => setSelectedEndDate(newValue)}
                slotProps={{
                  textField: { variant: "outlined", fullWidth: true }
                }}
              />
              <Button
                variant="outlined"
                sx={{
                  height: "100%",
                  width: "30%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  whiteSpace: "nowrap"
                }}
                onClick={() => handleFilter(selectedStartDate, selectedEndDate)}
                startIcon={<FilterListIcon />}
              >
                Filter
              </Button>
              <Button
                variant="contained"
                sx={{
                  height: "100%",
                  width: "30%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  whiteSpace: "nowrap"
                }}
                onClick={handleModalApprove}
                startIcon={<CheckIcon />}
              >
                Approve All
              </Button>
              <Button
                variant="contained"
                sx={{
                  height: "100%",
                  width: "30%",
                  backgroundColor: "green",
                  "&:hover": { backgroundColor: "darkgreen" },
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  whiteSpace: "nowrap"
                }}
                onClick={handleModalUndo}
                startIcon={<UndoIcon />}
              >
                Undo All
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <br></br>
        {/* </Grid> */}
        {/* Displaying the Material-UI Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "Date",
                  "Shift",
                  "Clients",
                  "Start Time",
                  "Finish Time",
                  "Break Time (min)",
                  "Hours Worked",
                  "Distance (miles)",
                  "Expenses",
                  "Allowances",
                  "Action"
                ].map((header) => (
                  <TableCell key={header}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {transformedData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.shiftType}</TableCell>
                    <TableCell>{row.clientName}</TableCell>
                    <TableCell>{row.startTime}</TableCell>
                    <TableCell>{row.finishTime}</TableCell>
                    <TableCell>{row.breakTime}</TableCell>
                    <TableCell>{row.hours}</TableCell>
                    <TableCell>{row.distance}</TableCell>
                    <TableCell>{row.expense}</TableCell>
                    <TableCell>{row.allowances}</TableCell>
                    <TableCell>
                      {row.isTimesheetApproved ? (
                        <>
                          <Box display="flex" alignItems="center">
                            <Tooltip title="Already Approved">
                              <IconButton color="primary" aria-label="approved">
                                <CheckIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="To Undo the Timesheet">
                              <IconButton
                                color="success"
                                aria-label="undo"
                                onClick={() =>
                                  handleUndoTimesheet(String(row.id))
                                }
                              >
                                {" "}
                                {/* Change color to success for green */}
                                <UndoIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </>
                      ) : (
                        <Tooltip title="Approve the Timesheet">
                          <Button
                            onClick={() => handleApprove(String(row.id))}
                            aria-label="approve"
                            startIcon={<CheckIcon />}
                            sx={{
                              backgroundColor: "#1877f2",
                              color: "white",
                              "&:hover": {
                                backgroundColor: "#155cb2"
                              }
                            }}
                          >
                            Approve
                          </Button>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination component */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={transformedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        {/* Approve Message Box Start Here  */}
        <Dialog
          open={openModalApprove}
          onClose={handleCloseModalApprove}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Timesheet Approval</DialogTitle>
          <Divider />
          <DialogContent>
            <Typography>
              Are you sure, you want to approve all Timesheet?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="success"
              onClick={handleAllApprove}
            >
              Yes
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleCloseModalApprove}
            >
              No
            </Button>
          </DialogActions>
        </Dialog>
        {/* Approve Message Box End Here  */}

        {/* Undo Message Box Start Here  */}
        <Dialog
          open={openModalUndo}
          onClose={handleCloseModalUndo}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Timesheet Undo</DialogTitle>
          <Divider />
          <DialogContent>
            <Typography>
              Are you sure, you want to undo all Timesheet?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="success" onClick={handleAllUndo}>
              Yes
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleCloseModalUndo}
            >
              No
            </Button>
          </DialogActions>
        </Dialog>
        {/* Undo Message Box End Here  */}
      </StyledUserPage>
    </DashboardLayout>
  );
}
