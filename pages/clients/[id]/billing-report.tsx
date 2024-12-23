import {
  generateInvoice,
  getBillingReport,
  getClientFunds,
  getInvoicePreview
} from "@/api/functions/client.api";
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
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
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
import Tooltip from "@mui/material/Tooltip";
import { useRouter } from "next/router";
import EditBillForm from "./edit-bill-section";
import BlockIcon from "@mui/icons-material/Block";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import { CheckCircleOutline, Download, Print } from "@mui/icons-material";
import jsPDF from "jspdf"; // Import jsPDF for PDF generation
import * as XLSX from "xlsx";
import NewInvoice from "./new-invoice";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

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
  // const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [billingData, setBillingData] = useState<any | null>(null);
  const [totalCost, setTotalCost] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const { control } = useForm();
  const [selectedFund, setSelectedFund] = useState("");
  const [selectedBillId, setSelectedBillId] = useState("");
  const { data: fundsData, isLoading: isloadings } = useQuery({
    queryKey: ["client-funds", id],
    queryFn: () => getClientFunds({ clientIds: [Number(id)] })
  });

  // ---------------------START----------------------
  const router = useRouter();

  // Get the query parameters from the URL
  const { start_Date, end_Date } = router.query;

  const [openModal, setModal] = useState(false);
  const [openModalNewInvoice, setModalNewInvoice] = useState(false);
  const [openModalMessage, setModalMessage] = useState(false);

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

  const handleModal = (selectedData: any) => {
    setSelectedBillId(selectedData.id);
    setModal(true);
    console.log(
      "----------------: Selected Bill :----------------",
      selectedData.id
    );
  };

  const handleCloseModal = () => {
    setModal(false);
  };
  const handleCloseModalNewInvoice = () => {
    setModalNewInvoice(false);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Perform your update logic here, such as form validation and API calls
    console.log("Form Data:", e);
  };

  // Table Bottom Stuffs start here--------------------------
  const [newInvoice, setNewInvoice] = useState(""); // To track selected rows
  const [selectedTaxType, setSelectedTaxType] = useState<string>(""); // To track selected rows
  const [selectedRowsSingle, setSelectedRowsSingle] = useState<number>(0); // To track selected rows
  const [selectedRows, setSelectedRows] = useState<number[]>([]); // To track selected rows
  const [selectedRowsTotalCost, setSelectedRowsTotalCost] = useState<number>(0); // Default to 0
  const [taxType, setTaxType] = useState<string>(""); // For Tax Inclusive / Tax Exclusive
  const [isDropdownEnabled, setIsDropdownEnabled] = useState<boolean>(false); // Dropdown enablement state
  const [responseData, setResponseData] = useState<{
    invoiceNumber: string;
    message: string;
  } | null>(null);

  // Sample table data
  const tableData = billingData;

  const handleRowSelect = (data: any) => {
    console.log("Clicked on the Row");

    if (selectedRows.includes(data.id)) {
      setSelectedRows(selectedRows.filter((row) => row !== data.id));
      setSelectedRowsTotalCost((prevTotal) => prevTotal - data.totalCost);

      // If there's only one row selected, set to the id; otherwise, set to 0
      // if (selectedRows.length === 1) {
      //   setSelectedRowsSingle(0);
      // } else {
      //   setSelectedRowsSingle(0);
      // }

      console.log("Deselected Row:", data.id);
      console.log(
        "Updated Total Cost After Deselect:",
        selectedRowsTotalCost - data.totalCost
      );
    } else {
      if (data.isInvoiceGenerated !== true) {
        setSelectedRows([...selectedRows, data.id]);
        setSelectedRowsTotalCost((prevTotal) => prevTotal + data.totalCost);
        setSelectedRowsSingle(data.id);
      }

      // console.log("Selected Row:", data.id);
      // console.log(
      //   "Updated Total Cost After Select:",
      //   selectedRowsTotalCost + data.totalCost
      // );
    }
  };

  useEffect(() => {
    console.log("Selected Row Single Id Status:", selectedRowsSingle);
  }, [selectedRowsSingle]);

  // const handleSelectAll = () => {
  //   // Check if all IDs are already selected
  //   const allIds = tableData.map((row: any) => row.id);
  //   const isAllSelected = allIds.every((id: number) =>
  //     selectedRows.includes(id)
  //   );

  //   if (isAllSelected) {
  //     // Clear all selections
  //     setSelectedRows([]);
  //   } else {
  //     // Select all rows
  //     setSelectedRows(allIds);
  //   }

  //   console.log("Updated Selected Rows:", selectedRows);
  // };

  // const handleSelectAll = () => {
  //   // Get all row IDs and their total costs from tableData
  //   const allIds = tableData.map((row: any) => row.id);
  //   const allCosts = tableData.reduce(
  //     (total: number, row: any) => total + row.totalCost,
  //     0
  //   );

  //   // Check if all rows are already selected
  //   const isAllSelected = allIds.every((id: number) =>
  //     selectedRows.includes(id)
  //   );

  //   if (isAllSelected) {
  //     // Clear all selections and reset total cost
  //     setSelectedRows([]);
  //     setSelectedRowsTotalCost(0);

  //     console.log("Deselected All Rows");
  //     console.log("Updated Total Cost After Deselect All:", 0);
  //   } else {
  //     // Select all rows and calculate total cost
  //     setSelectedRows(allIds);
  //     setSelectedRowsTotalCost(allCosts);

  //     // console.log("Selected All Rows");
  //     // console.log("Updated Total Cost After Select All:", allCosts);
  //   }

  //   console.log("Updated Selected Rows:", selectedRows);
  // };

  const handleSelectAll = () => {
    // Filter out rows with isInvoiceGenerated === true
    const selectableRows = tableData.filter(
      (row: any) => !row.isInvoiceGenerated
    );
    const selectableIds = selectableRows.map((row: any) => row.id);
    const totalSelectableCost = selectableRows.reduce(
      (total: number, row: any) => total + row.totalCost,
      0
    );

    // Check if all selectable rows are already selected
    const isAllSelected = selectableIds.every((id: number) =>
      selectedRows.includes(id)
    );

    if (isAllSelected) {
      // Clear all selections and reset total cost
      setSelectedRows([]);
      setSelectedRowsTotalCost(0);

      console.log("Deselected All Rows");
      console.log("Updated Total Cost After Deselect All:", 0);
    } else {
      // Select only rows where isInvoiceGenerated is false
      setSelectedRows(selectableIds);
      setSelectedRowsTotalCost(totalSelectableCost);

      console.log(
        "Selected Rows (Excluding Invoice-Generated):",
        selectableIds
      );
      console.log("Updated Total Cost After Select All:", totalSelectableCost);
    }

    console.log("Updated Selected Rows:", selectedRows);
  };

  const handleDownload = () => {
    // Prepare the data for Excel
    const tableDataFormatted = tableData.map(
      (
        row: {
          date: any[];
          startTime: any[];
          finishTime: any[];
          hourlyRate: any;
          hours: any;
          hourlyCost: any;
          additionalCost: any;
          distance: any;
          distanceCost: any;
          runningTotal: any;
          cost: any;
          totalHours: any;
          totalCost: any;
        },
        index: any
      ) => ({
        // Row: index + 1,
        Date: Array.isArray(row.date) ? row.date.join("-") : row.date,
        "Start Time": Array.isArray(row.startTime)
          ? row.startTime.join(":")
          : row.startTime,
        "Finish Time": Array.isArray(row.finishTime)
          ? row.finishTime.join(":")
          : row.finishTime,
        "Hourly Rate": row.hourlyRate,
        Hours: row.hours,
        "Hourly Cost": row.hourlyCost,
        "Additional Cost": row.additionalCost,
        Distance: row.distance,
        "Distance Cost": row.distanceCost,
        "Running Total": row.runningTotal,
        Cost: row.cost,
        "Total Hours": row.totalHours,
        "Total Cost": row.totalCost
      })
    );

    // Create a worksheet
    const ws = XLSX.utils.json_to_sheet(tableDataFormatted);

    // Create a workbook with the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Table Data");

    // Download the Excel file
    XLSX.writeFile(wb, "table-content.xlsx");
  };

  const handlePrint = () => {
    // Temporarily hide all elements except the table
    const originalContents = document.body.innerHTML;
    const tableContent = document.getElementById("table-container")?.innerHTML; // Using optional chaining

    // If tableContent is null, exit the function
    if (!tableContent) return;

    // Set the body to contain only the table
    document.body.innerHTML = `<div>${tableContent}</div>`;

    // Trigger the print functionality
    window.print();

    // Restore the original body content after printing
    document.body.innerHTML = originalContents;
  };

  // const handleTaxTypeChange = (event: SelectChangeEvent<string>) => {
  //   const value = event.target.value; // The selected value
  //   // Handle the value change
  //   setSelectedTaxType(value);
  //   let selected_billingReportIds;
  //   if (selectedRows.length === 1) {
  //     selected_billingReportIds = selectedRowsSingle;
  //   } else {
  //     selected_billingReportIds = 0;
  //   }
  //   console.log("--------SELECTED TAX--------", {
  //     value,
  //     startDate,
  //     endDate,
  //     selected_billingReportIds
  //   });
  // };

  const handleTaxTypeChange = async (event: SelectChangeEvent<string>) => {
    const value = event.target.value; // The selected value for tax type
    // Handle the value change
    setSelectedTaxType(value);

    let selected_billingReportIds = [];
    // if (selectedRows.length === 1) {
    //   selected_billingReportIds = selectedRowsSingle; // Assuming selectedRowsSingle holds the billing report ID
    // } else {
    //   selected_billingReportIds = "0"; // Default to '0' if no or multiple rows selected
    // }

    selected_billingReportIds = selectedRows;

    console.log("--------SELECTED TAX--------", {
      id,
      value,
      startDate,
      endDate,
      selected_billingReportIds
    });

    try {
      // Call the API with the current values of startDate, endDate, selected_billingReportIds, and value (taxType)
      const response = await getInvoicePreview({
        clientId: id,
        startDate,
        endDate,
        billingReportIds: selected_billingReportIds.toString(),
        taxType: value
      });

      // Handle the response here (e.g., update state or display preview)
      console.log("Invoice Preview Response:", response);
      setNewInvoice(response);
      setModalNewInvoice(true);
      // router.push(`/clients/${id}/new-invoice`);
    } catch (error) {
      // Handle any errors here (e.g., display an error message to the user)
      console.error("Error fetching invoice preview:", error);
    }
  };

  const rowStyle = (rowId: number) => {
    return selectedRows.includes(rowId)
      ? { backgroundColor: "#FFEB3B" } // Light yellow/orange for selected rows
      : {};
  };
  // Table Bottom Stuffs end here--------------------------
  const handleCloseModalMesssage = () => {
    setModalMessage(false);
  };
  const handleOpenModalMesssage = (data: {
    invoiceNumber: string;
    message: string;
  }) => {
    setResponseData(data);
    setModalMessage(true);
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
          <>
            <TableContainer
              component={Paper}
              sx={{ marginTop: 4 }}
              id="table-container"
            >
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
                          backgroundColor: selectedRows.includes(dataRow.id)
                            ? "rgba(255, 182, 193, 0.6)" // Light pink for selected rows
                            : dataRow.shiftCanceled
                            ? "rgba(255, 165, 0, 0.2)" // Orange for canceled shifts
                            : dataRow.isInvoiceGenerated
                            ? "rgba(187, 255, 199, 0.63)" // Light blue for invoice generated
                            : "transparent", // Default background
                          height: "32px" // Set a fixed row height
                        }}
                        // onClick={() => handleRowSelect(dataRow.id)}
                        onClick={() => handleRowSelect(dataRow)}
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
                                onClick={() => handleModal(dataRow)}
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
            <Grid container justifyContent="flex-end" spacing={1}>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handlePrint}
                  startIcon={<Print />}
                >
                  Print
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleDownload}
                  startIcon={<Download />}
                >
                  Download
                </Button>
              </Grid>

              <Grid item>
                <Button
                  variant="contained"
                  color="inherit"
                  onClick={handleSelectAll}
                  startIcon={<CheckCircleOutline />}
                >
                  Select All
                </Button>
              </Grid>

              {/* {selectedRows.length !== 0 &&
              selectedRows.every((id) => {
                const record = billingData.find(
                  (item: { id: number }) => item.id === id
                );
                return record && !record.isInvoiceGenerated;
              }) ? ( */}
              {selectedRows.length !== 0 ? (
                <>
                  <FormControl variant="outlined" style={{ width: "auto" }}>
                    <Select
                      value={taxType || "INVOICE"} // Use 'INVOICE' as a special placeholder
                      onChange={handleTaxTypeChange}
                      style={{
                        backgroundColor: isDropdownEnabled ? "#f0f0f0" : "",
                        height: "38px",
                        width: "190px",
                        padding: "6px 5px",
                        fontSize: "14px",
                        lineHeight: "normal",
                        marginTop: "8px",
                        marginLeft: "8px",
                        background: "#5cb85c",
                        color: "#ffffff"
                      }}
                      IconComponent={(props) => (
                        <KeyboardArrowDownIcon
                          {...props}
                          style={{ color: "#ffffff" }}
                        />
                      )}
                      renderValue={(selected) =>
                        selected === "INVOICE"
                          ? `Invoice: A$ ${selectedRowsTotalCost || "00"}`
                          : selected === "INCLUSIVE"
                          ? "Tax Inclusive"
                          : "Tax Exclusive"
                      }
                    >
                      <MenuItem value="INCLUSIVE">Tax Inclusive</MenuItem>
                      <MenuItem value="EXCLUSIVE">Tax Exclusive</MenuItem>
                    </Select>
                  </FormControl>
                </>
              ) : (
                <Typography></Typography>
              )}
            </Grid>
          </>
        ) : (
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            No data available!
          </Typography>
        )}

        {/* ---------------: Edit Billing Report start here :--------------- */}
        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>Billing Report Edit</DialogTitle>
          <Divider />
          <DialogContent>
            <EditBillForm
              onClose={handleCloseModal}
              selectedBillId={selectedBillId}
            />
          </DialogContent>
        </Dialog>
        {/* ---------------: Edit Billing Report start here :--------------- */}
        {/* ---------------: New Invoice start here :--------------- */}
        <Dialog
          open={openModalNewInvoice}
          onClose={handleCloseModalNewInvoice}
          fullWidth
          maxWidth="lg"
        >
          <DialogTitle>
            New Invoice
            <IconButton
              aria-label="close"
              onClick={handleCloseModalNewInvoice}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500]
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <NewInvoice
              onCloseModel={handleCloseModalNewInvoice}
              onResponse={handleOpenModalMesssage}
              invoiceData={newInvoice}
              id={id}
              selectedTaxType={selectedTaxType}
              startDate={startDate}
              endDate={endDate}
              selectedRows={selectedRows}
            />
          </DialogContent>
        </Dialog>
        {/* ---------------:  New Invoice start here :--------------- */}

        {/* ---------------- Message Box start here ---------------- */}
        <Dialog
          open={openModalMessage}
          onClose={handleCloseModalMesssage}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Message Box</DialogTitle>
          <Divider />
          <DialogContent>
            <Typography>
              {/* <Typography>Message Box Content</Typography> */}
              {responseData && (
                <>
                  <Typography>
                    <strong>Invoice Number:</strong>{" "}
                    {responseData.invoiceNumber}
                  </Typography>
                  <Typography>
                    <strong>Message:</strong> {responseData.message}
                  </Typography>
                </>
              )}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button
                variant="contained"
                color="error"
                onClick={handleCloseModalMesssage}
              >
                Close
              </Button>
              {/* <Button variant="contained" color="success">
              Update
            </Button> */}
            </Box>
          </DialogActions>
        </Dialog>
        {/* ---------------- Message Box end here ---------------- */}
      </Container>
    </DashboardLayout>
  );
};

export default BillingReport;
