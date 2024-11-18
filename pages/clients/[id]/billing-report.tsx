import { getBillingReport, getClientFunds } from "@/api/functions/client.api";
import { BillingData } from "@/interface/billingreport.interface";
import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import {
  Box,
  Button,
  Container,
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

const BillingReport = () => {
  const { id } = useParams<{ id: string }>(); // Ensure type for `id` from URL params
  const [startDate, setStartDate] = useState<string>(""); // For start date
  const [endDate, setEndDate] = useState<string>(""); // For end date
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [totalCost, setTotalCost] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const { control } = useForm();
  const [selectedFund, setSelectedFund] = useState("");
  const { data: fundsData, isLoading: isloadings } = useQuery({
    queryKey: ["client-funds", id],
    queryFn: () => getClientFunds({ clientIds: [Number(id)] })
  });

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

      console.log("Fetched Billing Data:", data);
      setTotalCost(data.totalCost);
      setTotalHours(data.totalHours);
      setBillingData(data.billingReports); // Optionally, update the UI with the data
    } catch (error) {
      console.error("Error fetching billing report:", error);
    }
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

          {/* Right Side: Start Date, End Date, and Button */}
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

            {/* Start Date */}
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
                          ? "rgba(255, 165, 0, 0.2)"
                          : "transparent",
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
                        ) : (
                          <Tooltip title="Edit" arrow>
                            <IconButton
                              style={{
                                padding: 4, // Minimal padding
                                margin: 0 // Remove margin
                              }}
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
      </Container>
    </DashboardLayout>
  );
};

export default BillingReport;
