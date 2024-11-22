import { getBillingReport, getClientFunds } from "@/api/functions/client.api";
import { BillingData } from "@/interface/billingreport.interface";
import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import dayjs from "dayjs"; // Import dayjs
import { AccessTime, AttachMoney } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import Tooltip from "@mui/material/Tooltip";
import { useRouter } from "next/router";
import CheckIcon from "@mui/icons-material/Check";
import EditBillForm from "./edit-bill-section";

const BillingReport = () => {
  const getWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust if today is Sunday
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    // Format dates as YYYY-MM-DD
    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    return {
      startOfWeek: formatDate(monday),
      endOfWeek: formatDate(sunday)
    };
  };

  const { startOfWeek, endOfWeek } = getWeekDates();
  const [startDate, setStartDate] = useState<string>(startOfWeek);
  const [endDate, setEndDate] = useState<string>(endOfWeek);

  const { id } = useParams<{ id: string }>(); // Ensure type for `id` from URL params
  // const [startDate, setStartDate] = useState<string>(""); // For start date
  // const [endDate, setEndDate] = useState<string>(""); // For end date
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [totalCost, setTotalCost] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const { control } = useForm();
  const [selectedFund, setSelectedFund] = useState("");
  const { data: fundsData, isLoading: isloadings } = useQuery({
    queryKey: ["client-funds", id],
    queryFn: () => getClientFunds({ clientIds: [Number(id)] })
  });

  // ---------------------START----------------------
  const router = useRouter();

  // Get the query parameters from the URL
  const { start_Date, end_Date } = router.query;

  const [openModal, setModal] = useState(false);

  useEffect(() => {
    if (start_Date && end_Date) {
      // Check if start_Date is an array, and handle accordingly
      setStartDate(Array.isArray(start_Date) ? start_Date[0] : start_Date);
      setEndDate(Array.isArray(end_Date) ? end_Date[0] : end_Date);
    }
  }, [start_Date, end_Date]);

  useEffect(() => {
    if (fundsData && fundsData.length > 0 && fundsData[0]?.funds) {
      console.log(
        "-------------------: Fund List :-------------------",
        fundsData[0].funds
      );
    } else {
      console.log("Funds data is empty or undefined.");
    }
  }, [id, fundsData]);

  // Function to format the date array [year, month, day] into 'yyyy-mm-dd'
  const formatDate = (date: [number, number, number]): string => {
    return dayjs(new Date(date[0], date[1] - 1, date[2])).format("YYYY-MM-DD");
  };
  const formatDate2 = (date: [number, number, number]): string => {
    return dayjs(new Date(date[0], date[1] - 1, date[2])).format("DD-MM-YYYY");
  };

  // Function to format time array [hour, minute] into 'HH:mm'
  const formatTime = (time: [number, number]): string => {
    return dayjs().set("hour", time[0]).set("minute", time[1]).format("HH:mm");
  };

  let fundids = "";
  useEffect(() => {
    console.log();
    fundids = selectedFund;
  }, [selectedFund]);

  const handleFetchBillingReport = async () => {
    if (!startDate || !endDate) {
      console.log("Please provide both start and end dates.");
      return;
    }

    try {
      const formattedStartDate = formatDate([
        parseInt(startDate.split("-")[0]),
        parseInt(startDate.split("-")[1]),
        parseInt(startDate.split("-")[2])
      ]);
      const formattedEndDate = formatDate([
        parseInt(endDate.split("-")[0]),
        parseInt(endDate.split("-")[1]),
        parseInt(endDate.split("-")[2])
      ]);

      const data = await getBillingReport({
        clientid: id, // client id from URL
        fundId: fundids, // client id from URL
        startDate: formattedStartDate, // Pass the start date as yyyy-mm-dd
        endDate: formattedEndDate // Pass the end date as yyyy-mm-dd
      });

      // console.log("Fetched Billing Data:", data);
      setTotalCost(data.totalCost);
      setTotalHours(data.totalHours);
      setBillingData(data.billingReports); // Optionally, update the UI with the data
      console.error("------------ Billing Report -----------:", data);
    } catch (error) {
      console.error("Error fetching billing report:", error);
    }
  };

  useEffect(() => {
    const fetchingdata = async () => {
      if (start_Date && end_Date) {
        const data = await getBillingReport({
          clientid: id,
          fundId: fundids,
          startDate: start_Date.toString(),
          endDate: end_Date.toString()
        });
        setTotalCost(data.totalCost);
        setTotalHours(data.totalHours);
        setBillingData(data.billingReports); // Optionally, update the UI with the data
      }
    };

    fetchingdata();
  }, [start_Date, end_Date]);

  useEffect(() => {
    const fetchingdata = async () => {
      if (startDate && endDate) {
        const data = await getBillingReport({
          clientid: id,
          fundId: fundids,
          startDate: startDate.toString(),
          endDate: endDate.toString()
        });
        setTotalCost(data.totalCost);
        setTotalHours(data.totalHours);
        setBillingData(data.billingReports); // Optionally, update the UI with the data
        console.log("------------***------------", data);
      }
    };

    fetchingdata();
  }, [startDate, endDate]);

  const handleModal = () => {
    setModal(true);
  };

  const handleCloseModal = () => {
    setModal(false);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Perform your update logic here, such as form validation and API calls
    console.log("Form Data:", e);
  };

  return (
    <DashboardLayout>
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Billing Report
        </Typography>
        {/* <Typography variant="body1" paragraph>
          Select a start and end date to generate the billing report.
        </Typography> */}

        <Grid container spacing={1} alignItems="center">
          {/* Left Side: Total Cost and Total Hours */}
          <Grid item xs={12} sm={6} md={4} container spacing={1}>
            {/* Total Cost Box */}
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "background.paper",
                  borderRadius: 1,
                  padding: 1,
                  boxShadow: 1,
                  justifyContent: "flex-start",
                  textAlign: "left",
                  height: "54px", // Set height to match other components
                  marginTop: 0.9
                }}
              >
                <IconButton color="primary" size="small">
                  <AttachMoney />
                </IconButton>
                <Box sx={{ marginLeft: 1 }}>
                  <Typography variant="body2">Total Cost</Typography>
                  <Typography variant="h6">{totalCost}</Typography>
                </Box>
              </Box>
            </Grid>

            {/* Total Hours Box */}
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "background.paper",
                  borderRadius: 1,
                  padding: 1,
                  boxShadow: 1,
                  justifyContent: "flex-start",
                  textAlign: "left",
                  height: "54px", // Set height to match other components
                  marginTop: 0.9
                }}
              >
                <IconButton color="primary" size="small">
                  <AccessTime />
                </IconButton>
                <Box sx={{ marginLeft: 1 }}>
                  <Typography variant="body2">Total Hours</Typography>
                  <Typography variant="h6">{totalHours}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={6} md={8} container spacing={1}>
            <Grid item xs={12} sm={3}>
              <Controller
                name="fundId"
                control={control}
                render={({ field }) => (
                  <Select
                    fullWidth
                    size="small"
                    {...field}
                    value={field.value || "Select Fund"}
                    sx={{
                      height: "56px",
                      display: "flex",
                      alignItems: "center",
                      marginTop: 2
                    }}
                    onChange={(e) => {
                      const selectedValue = e.target.value;

                      if (selectedValue && selectedValue !== "undefined") {
                        setSelectedFund(selectedValue);
                        console.log("Selected Fund ID:", selectedValue); // Log the selected value directly
                      }

                      // Only update the state if selectedValue is not empty or undefined
                      if (selectedValue && selectedValue !== "Select Fund") {
                        setSelectedFund(selectedValue);
                        {
                          /* Ensure selectedValue is a string */
                        }
                        console.log("Selected Fund ID:", selectedValue); // Log the selected value directly
                      }

                      // Ensure form state is updated
                      field.onChange(e);
                    }}
                  >
                    {/* Default option that will be preselected */}
                    <MenuItem value="Select Fund" disabled>
                      Select Fund
                    </MenuItem>

                    {/* Check if fundsData is available and has funds */}
                    {fundsData?.[0]?.funds?.map((fund: any) => (
                      <MenuItem value={fund.fundId} key={fund.fundId}>
                        {fund.name}
                      </MenuItem>
                    ))}

                    {/* Fallback UI for empty funds data */}
                    {(!fundsData || fundsData[0]?.funds?.length === 0) && (
                      <MenuItem disabled>No funds available</MenuItem>
                    )}
                  </Select>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                fullWidth
                InputLabelProps={{
                  shrink: true
                }}
                margin="normal"
                sx={{ height: "56px" }} // Set height to match other components
              />
            </Grid>

            {/* End Date */}
            <Grid item xs={12} sm={3}>
              <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                fullWidth
                InputLabelProps={{
                  shrink: true
                }}
                margin="normal"
                sx={{ height: "56px" }} // Set height to match other components
              />
            </Grid>

            {/* Button */}
            <Grid item xs={12} sm={3}>
              <Button
                variant="contained"
                onClick={handleFetchBillingReport}
                fullWidth
                sx={{
                  marginTop: 2,
                  height: "54px" // Set height to match other components
                }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {/* Display Fetched Billing Data in a Table */}
        {billingData && billingData.length > 0 ? (
          <TableContainer component={Paper} sx={{ marginTop: 4 }}>
            <Table aria-label="Billing Report Table">
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "0.875rem",
                      color: "black",
                      whiteSpace: "nowrap"
                    }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "0.875rem",
                      color: "black",
                      whiteSpace: "nowrap"
                    }}
                  >
                    Start Time
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "0.875rem",
                      color: "black",
                      whiteSpace: "nowrap"
                    }}
                  >
                    Finish Time
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "0.875rem",
                      color: "black",
                      whiteSpace: "nowrap"
                    }}
                  >
                    Hourly Rate
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "0.875rem",
                      color: "black",
                      whiteSpace: "nowrap"
                    }}
                  >
                    Hours
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "0.875rem",
                      color: "black",
                      whiteSpace: "nowrap"
                    }}
                  >
                    Additional Cost
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "0.875rem",
                      color: "black",
                      whiteSpace: "nowrap"
                    }}
                  >
                    Distance Rate
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "0.875rem",
                      color: "black",
                      whiteSpace: "nowrap"
                    }}
                  >
                    Distance
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "0.875rem",
                      color: "black",
                      whiteSpace: "nowrap"
                    }}
                  >
                    Running Total
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "0.875rem",
                      color: "black",
                      whiteSpace: "nowrap"
                    }}
                  >
                    Total Cost
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "0.875rem",
                      color: "black",
                      whiteSpace: "nowrap"
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {Array.isArray(billingData) &&
                  billingData.map((dataRow: any) => (
                    <TableRow
                      key={dataRow.id}
                      sx={{
                        backgroundColor: dataRow.shiftCanceled
                          ? "rgba(255, 165, 0, 0.2)" // Orange for canceled shifts
                          : dataRow.isInvoiceGenerated
                          ? "rgba(187, 255, 199, 0.63)" // Light blue for invoice generated
                          : "transparent", // Default background
                        height: "32px" // Set a fixed row height
                      }}
                    >
                      <TableCell
                        align="center"
                        sx={{
                          whiteSpace: "nowrap",
                          padding: "4px 8px", // Reduce padding
                          fontSize: "14px" // Smaller font size for more compact rows
                        }}
                      >
                        {formatDate2(dataRow.date)}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          padding: "4px 8px", // Reduce padding
                          fontSize: "14px"
                        }}
                      >
                        {formatTime(dataRow.startTime)}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          padding: "4px 8px", // Reduce padding
                          fontSize: "14px"
                        }}
                      >
                        {formatTime(dataRow.finishTime)}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          padding: "4px 8px", // Reduce padding
                          fontSize: "14px"
                        }}
                      >
                        {dataRow.shiftCanceled && (
                          <Tooltip title="Shift Canceled" arrow>
                            <BlockIcon
                              style={{ fontSize: 15, color: "#f44336" }}
                            />
                          </Tooltip>
                        )}
                        <span>{dataRow.hourlyRate}</span>
                      </TableCell>

                      <TableCell
                        align="center"
                        sx={{
                          padding: "4px 8px", // Reduce padding
                          fontSize: "14px"
                        }}
                      >
                        {dataRow.hours}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          padding: "4px 8px", // Reduce padding
                          fontSize: "14px"
                        }}
                      >
                        {dataRow.additionalCost}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          padding: "4px 8px", // Reduce padding
                          fontSize: "14px"
                        }}
                      >
                        {dataRow.distanceRate}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          padding: "4px 8px", // Reduce padding
                          fontSize: "14px"
                        }}
                      >
                        {dataRow.distance}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          padding: "4px 8px", // Reduce padding
                          fontSize: "14px"
                        }}
                      >
                        {dataRow.runningTotal}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          padding: "4px 8px", // Reduce padding
                          fontSize: "14px"
                        }}
                      >
                        {dataRow.totalCost}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          padding: "4px 8px", // Reduce padding
                          fontSize: "14px"
                        }}
                      >
                        {dataRow.shiftCanceled ? (
                          <Tooltip title="This shift is canceled" arrow>
                            <BlockIcon
                              style={{ fontSize: 20, color: "#f44336" }}
                            />
                          </Tooltip>
                        ) : dataRow.isInvoiceGenerated ? (
                          <Tooltip title="Invoice Generated" arrow>
                            <CheckIcon
                              style={{ fontSize: 20, color: "green" }}
                            />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Edit" arrow>
                            <IconButton
                              style={{
                                padding: 4, // Minimal padding
                                margin: 0 // Remove margin
                              }}
                              onClick={() => handleModal()}
                            >
                              <EditIcon
                                style={{ fontSize: 20, color: "#1877f2" }}
                              />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            No data available!
          </Typography>
        )}

        {/* ---------------: Edit Billing Report :--------------- */}
        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>Billing Report Edit</DialogTitle>
          <Divider />
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <EditBillForm />
            </DialogContent>
            <DialogActions>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleCloseModal}
                >
                  Close
                </Button>
                <Button type="submit" variant="contained" color="success">
                  Update
                </Button>
              </Box>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </DashboardLayout>
  );
};

export default BillingReport;
