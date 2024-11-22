import React, { ReactNode, useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Container,
  Divider,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import { Visibility as ViewIcon } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import { getBillingList } from "@/api/functions/client.api";
import { useRouter } from "next/router";
import { format } from "date-fns";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

interface TableData {
  billingReportCount: ReactNode;
  totalCostWithTax: any;
  billingReports(billingReports: any): void;
  id: string; // Added ID to each record
  client: string;
  clientId: string;
  totalShifts: number;
  to: string;
  purchaseOrder: string;
  dueAt: Dayjs | null;
  tax: number;
  selection: boolean;
  totalCost: number;
  status: string;
  reportLink: string;
}

const Home: React.FC = () => {
  const router = useRouter();
  const [data, setData] = useState<TableData[]>([]);
  //   const [data, setData] = useState<TableData[]>([
  //     {
  //       id: "1",
  //       client: "Client A",
  //       totalShifts: 5,
  //       to: "Client",
  //       purchaseOrder: "",
  //       dueAt: dayjs("2024-11-25"),
  //       selection: false,
  //       tax: true,
  //       totalCost: 1000,
  //       status: "Pending",
  //       reportLink: "/report/client-a"
  //     },
  //     {
  //       id: "2",
  //       client: "Client B",
  //       totalShifts: 3,
  //       to: "Client",
  //       purchaseOrder: "",
  //       dueAt: dayjs("2024-11-28"),
  //       selection: false,
  //       tax: false,
  //       totalCost: 1500,
  //       status: "Completed",
  //       reportLink: "/report/client-b"
  //     },
  //     {
  //       id: "3",
  //       client: "Client C",
  //       totalShifts: 8,
  //       to: "Client",
  //       purchaseOrder: "",
  //       dueAt: dayjs("2024-11-26"),
  //       selection: false,
  //       tax: true,
  //       totalCost: 2000,
  //       status: "Pending",
  //       reportLink: "/report/client-c"
  //     },
  //     {
  //       id: "4",
  //       client: "Client D",
  //       totalShifts: 12,
  //       to: "Client",
  //       purchaseOrder: "",
  //       dueAt: dayjs("2024-12-03"),
  //       selection: false,
  //       tax: false,
  //       totalCost: 3200,
  //       status: "In Progress",
  //       reportLink: "/report/client-d"
  //     },
  //     {
  //       id: "5",
  //       client: "Client E",
  //       totalShifts: 6,
  //       to: "Client",
  //       purchaseOrder: "",
  //       dueAt: dayjs("2024-11-20"),
  //       selection: false,
  //       tax: true,
  //       totalCost: 1200,
  //       status: "Completed",
  //       reportLink: "/report/client-e"
  //     }
  //   ]);

  const [selectAll, setSelectAll] = useState(false); // State to track "select all" checkbox
  const [isGenerateEnabled, setGenerateEnabled] = useState(false); // State to track if the "Generate" button is enabled

  // Update state to toggle the checkbox value of a specific record
  const updateData = (index: number, key: keyof TableData, value: any) => {
    setData((prevData) => {
      const newData = [...prevData];
      newData[index] = { ...newData[index], [key]: value };
      return newData;
    });
  };

  // Handles checkbox change for individual rows
  const handleCheckboxChange = (index: number) => {
    updateData(index, "selection", !data[index].selection);
  };

  // Handle the "Select All" checkbox click
  const handleSelectAll = () => {
    setSelectAll((prev) => !prev); // Toggle select all state
    setData((prevData) =>
      prevData.map((row) => ({
        ...row,
        selection: !selectAll // Toggle all rows based on the current "Select All" state
      }))
    );
  };

  // Generate button click handler
  const handleGenerateClick = () => {
    const selectedRecords = data.filter((row) => row.selection);
    console.log("Selected Records:", selectedRecords);
  };

  const checkIfGenerateEnabled = (updatedData: TableData[]) => {
    // Check if any checkbox is selected
    const anySelected = updatedData.some((row) => row.selection);
    setGenerateEnabled(anySelected);
  };

  useEffect(() => {
    checkIfGenerateEnabled(data);
  }, [data]);

  //   const [startDate, setStartDate] = useState<Dayjs | null>(null);
  //   const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(
    dayjs().startOf("week")
  );
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().endOf("week"));

  // If you need the formatted version, you can do it later, for example:
  const formattedStartDate = startDate?.format("YYYY-MM-DD");
  const formattedEndDate = endDate?.format("YYYY-MM-DD");
  const handleFetchBillingReport = async () => {
    if (!startDate || !endDate) {
      console.log("Please provide both start and end dates.");
      return;
    }

    try {
      const billingdata = await getBillingList({
        startDate: formattedStartDate,
        endDate: formattedEndDate
      });
      setData(billingdata);
      console.log("Fetched Billing Data:", billingdata);
      console.log("DATES:", { formattedStartDate, formattedEndDate });
    } catch (error) {
      console.error("Error fetching billing report:", error);
    }
  };

  useEffect(() => {
    handleFetchBillingReport();
    console.log("From Use Effect");
  }, [formattedStartDate, formattedEndDate]);

  //   useEffect(() => {
  //     console.log("----------------: Dynamic Data :---------------", data);
  //   }, [data]);

  function viewReport(
    billingReports: any,
    clientId: any,
    startDate: Dayjs | null,
    endDate: Dayjs | null,
    router: ReturnType<typeof useRouter>
  ) {
    // Convert Dayjs to YYYY-MM-DD format if not null, else pass an empty string or default value
    const formattedStartDate = startDate ? startDate.format("YYYY-MM-DD") : "";
    const formattedEndDate = endDate ? endDate.format("YYYY-MM-DD") : "";

    // Redirect to the billing report with start and end date as query parameters
    router.push(
      `/clients/${clientId}/billing-report?start_Date=${formattedStartDate}&end_Date=${formattedEndDate}`
    );
  }

  const handleViewReport = (billingReports: any, clientId: any) => {
    viewReport(billingReports, clientId, startDate, endDate, router);
  };

  const handleSelectionChange = (isSelected: boolean, rowId: string) => {
    setData((prevRows: any) =>
      prevRows.map((row: any) =>
        row.id === rowId ? { ...row, selection: isSelected } : row
      )
    );
  };

  return (
    <DashboardLayout>
      <Container>
        <div>
          <h2>Invoices</h2>
          <div style={{ marginBottom: "25px" }}></div>
          {/* Date Filter Section */}
          <Grid item xs={12} md={12}>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
              sx={{ height: "100%" }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Select Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  slotProps={{
                    textField: { variant: "outlined", fullWidth: true }
                  }}
                />
                <DatePicker
                  label="Select End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  slotProps={{
                    textField: { variant: "outlined", fullWidth: true }
                  }}
                />
                {/* <Button
                  variant="contained"
                  onClick={handleGenerateClick}
                  disabled={!isGenerateEnabled}
                  sx={{ height: "100%", width: "30%" }}
                >
                  Generate
                </Button> */}
              </LocalizationProvider>
            </Stack>
          </Grid>

          {/* Table Section */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {/* <TableCell>
                    <Checkbox
                      checked={selectAll}
                      onChange={handleSelectAll}
                      inputProps={{ "aria-label": "select all" }}
                    />
                  </TableCell> */}
                  <TableCell>Client</TableCell>
                  <TableCell>Total Shifts</TableCell>
                  <TableCell>To</TableCell>
                  <TableCell>Purchase Order</TableCell>
                  <TableCell>Due At</TableCell>
                  <TableCell>Tax</TableCell>
                  <TableCell>Total Cost</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={row.id}>
                    {/* <TableCell>
                      <Checkbox
                        checked={row.selection}
                        onChange={() => handleCheckboxChange(index)}
                        inputProps={{ "aria-label": `select row ${row.id}` }}
                      />
                    </TableCell> */}
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {row.client}
                    </TableCell>
                    <TableCell>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between", // Distributes space evenly between items
                          width: "100%",
                          cursor: "pointer"
                        }}
                      >
                        <Typography
                          style={{
                            flex: 1, // Ensures the Typography takes equal space
                            textOverflow: "ellipsis",
                            overflow: "hidden", // Prevents overflowing text
                            whiteSpace: "nowrap", // Prevents text from wrapping
                            border: "1px solid rgb(184 209 235)", // Adds a border around the text
                            padding: "0px 6px", // Adds padding to make the border appear square
                            borderRadius: "4px", // Optional: Adds rounded corners to the square
                            textAlign: "center",
                            marginRight: "8px",
                            backgroundColor: "rgb(219 233 247)"
                          }}
                        >
                          {row.billingReportCount}
                        </Typography>

                        <a
                          href={row.reportLink}
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                            flex: 1, // Ensures the link takes equal space
                            textAlign: "center", // Centers the text in the link
                            whiteSpace: "nowrap"
                          }}
                          onClick={() =>
                            handleViewReport(row.billingReports, row.clientId)
                          }
                        >
                          View Report
                        </a>

                        <IconButton
                          href={row.reportLink}
                          style={{
                            marginLeft: "8px",
                            padding: "4px", // Smaller padding for a compact look
                            flex: 1 // Ensures the IconButton takes equal space
                          }}
                          onClick={() =>
                            handleViewReport(row.billingReports, row.clientId)
                          }
                        >
                          <OpenInNewIcon style={{ fontSize: "22px" }} />{" "}
                        </IconButton>
                      </div>
                    </TableCell>

                    <TableCell>{row.to}</TableCell>
                    <TableCell>
                      <TextField
                        value={row.purchaseOrder}
                        onChange={(e) =>
                          updateData(index, "purchaseOrder", e.target.value)
                        }
                        fullWidth
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Due Date"
                          value={row.dueAt}
                          onChange={(newDate) =>
                            updateData(index, "dueAt", newDate)
                          }
                          slotProps={{
                            textField: {
                              variant: "outlined",
                              fullWidth: true
                            }
                          }}
                        />
                      </LocalizationProvider>
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={row.selection}
                        onChange={(e) =>
                          handleSelectionChange(e.target.checked, row.id)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      ${row.selection ? row.totalCostWithTax : row.totalCost}
                    </TableCell>
                    <TableCell>{row.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Container>
    </DashboardLayout>
  );
};

export default Home;
