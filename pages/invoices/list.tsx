import {
  getAllClients,
  getInvoiceList,
  getInvoiceView
} from "@/api/functions/client.api";
import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import { DatePicker } from "@mui/x-date-pickers";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Icon,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useParams } from "next/navigation";
import { Key, useEffect, useRef, useState } from "react";
import {
  AccessTime,
  AttachMoney,
  Money,
  Receipt,
  Timelapse
} from "@mui/icons-material"; // Example icons

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { Controller } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Email, LocationOn, Payment, Person, Phone } from "@mui/icons-material";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import PrintIcon from "@mui/icons-material/Print";

export default function ListPage() {
  const { id } = useParams();
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  // const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().endOf("week"));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().endOf("week"));
  // const [issuedDate, setIssuedDate] = useState<Dayjs | null>(dayjs());
  const [issuedDate, setIssuedDate] = useState<Dayjs | null>(dayjs());
  const [invoiceData, setInvoiceData] = useState<any | null>(null);
  const [selectStatus, setSelectStatus] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [invoiceViewData, setInvoiceViewData] = useState<any | null>(null);

  // If you need the formatted version, you can do it later, for example:
  const formattedStartDate = startDate?.format("YYYY-MM-DD");
  const formattedEndDate = endDate?.format("YYYY-MM-DD");
  const formattedIssedDate = issuedDate?.format("YYYY-MM-DD");
  const [openModal, setModal] = useState(false);

  const handleInvoiceList = async () => {
    if (!startDate || !endDate) {
      console.log("Please provide both start and end dates.");
      return;
    }

    try {
      const invoicelist = await getInvoiceList({
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        status: selectStatus,
        clientName: selectedClient
      });
      setInvoiceData(invoicelist);
      // console.log("Fetched Invoice List:", invoicelist);
    } catch (error) {
      console.error("Error fetching invoice list:", error);
    }
  };

  const formatDate = (date: number[]) => {
    return dayjs(new Date(date[0], date[1] - 1, date[2])).format("DD/MM/YYYY");
  };

  const { data, isLoading } = useQuery({
    queryKey: ["client_list"],
    queryFn: () => getAllClients()
  });

  // console.log("Client List:::::", data);

  const handleChange = (e: any) => {
    const value = e.target.value;
    setSelectedClient(value); // Update the selected client ID
  };

  // const handleListView = (data: any) => {
  //   console.log("Selected List View", data.invoiceId);
  // };

  const handleListView = async (data: any) => {
    // console.log("Selected List View ID", data.invoiceId);

    try {
      // Assuming getInvoiceView is a function that accepts invoiceId and returns the invoice view
      const invoiceView = await getInvoiceView(data.invoiceId);
      setModal(true);
      setInvoiceViewData(invoiceView);
    } catch (error) {
      console.error("Error fetching invoice view:", error);
    }
  };

  useEffect(() => {
    console.log("Selected View Data:---------", invoiceViewData);
  }, [invoiceViewData]);

  const handleCloseModal = () => {
    setModal(false);
  };

  useEffect(() => {
    handleInvoiceList();
  }, [startDate, endDate, issuedDate, selectStatus, selectedClient]);

  // Function to print the invoice
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrintPDF = async () => {
    const element = document.getElementById("printable-table");
    if (element) {
      const canvas = await html2canvas(element, {
        scale: 2 // Increase resolution
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Invoice.pdf");
    }
  };

  return (
    <DashboardLayout>
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Invoice List
        </Typography>
        <Grid item xs={12} md={12}>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
            sx={{ height: "auto" }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select Start Date"
                value={startDate}
                onChange={(newValue: Dayjs | null) => {
                  setStartDate(newValue);
                }}
                slotProps={{
                  textField: {
                    variant: "outlined",
                    fullWidth: true,
                    sx: { height: "56px" }
                  }
                }}
              />
              <DatePicker
                label="Select End Date"
                value={endDate}
                onChange={(newValue: Dayjs | null) => {
                  setEndDate(newValue);
                }}
                slotProps={{
                  textField: {
                    variant: "outlined",
                    fullWidth: true,
                    sx: { height: "56px" }
                  }
                }}
              />

              {/* <DatePicker
                label="Select Issued Date"
                value={issuedDate || dayjs()} // If issuedDate is null, default to the current date
                onChange={(newValue: Dayjs | null) => {
                  setIssuedDate(newValue);
                }}
                slotProps={{
                  textField: {
                    variant: "outlined",
                    fullWidth: true
                  }
                }}
              /> */}

              <Select
                fullWidth
                size="small"
                value={selectedClient}
                onChange={(event) => {
                  handleChange(event);
                }}
                displayEmpty
                renderValue={selectedClient ? undefined : () => "Select Client"}
                sx={{ height: "56px" }}
              >
                {/* Static "All" option included in the list */}
                <MenuItem value="" key="all">
                  All
                </MenuItem>

                {/* Loading state */}
                {isLoading ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} />
                    Loading...
                  </MenuItem>
                ) : (
                  // Dynamic data mapping
                  data?.map((_data: any) => (
                    <MenuItem value={_data.displayName} key={_data.displayName}>
                      {_data.displayName}
                    </MenuItem>
                  ))
                )}
              </Select>

              <FormControl fullWidth>
                <Select
                  value={selectStatus}
                  onChange={(e) => {
                    setSelectStatus(e.target.value);
                  }}
                  displayEmpty
                  fullWidth
                  sx={{
                    paddingTop: "0px",
                    paddingBottom: "0px"
                  }}
                >
                  <MenuItem value="" disabled>
                    Select Status
                  </MenuItem>
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="due">Due</MenuItem>
                  <MenuItem value="overdue">Overdue</MenuItem>
                </Select>
              </FormControl>
            </LocalizationProvider>

            {/* <Button
              variant="contained"
              onClick={handleInvoiceList}
              sx={{
                height: "56px",
                width: "30%",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center" 
              }}
            >
              <FilterAltIcon sx={{ marginRight: "8px" }} /> Filter
            </Button> */}
          </Stack>
        </Grid>

        {/* Cards for total values */}
        {invoiceData && (
          <Grid container spacing={2} sx={{ marginTop: 4 }}>
            <Grid item xs={12} md={2.4}>
              <Card sx={{ padding: 1 }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Icon sx={{ fontSize: 30, color: "green" }}>
                    <Money />
                  </Icon>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "0.875rem", fontWeight: "bold" }}
                  >
                    Total Amount
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                    {invoiceData.totalInvoicedAmount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={2.4}>
              <Card sx={{ padding: 1 }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Icon sx={{ fontSize: 30, color: "blue" }}>
                    <AttachMoney />
                  </Icon>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "0.875rem", fontWeight: "bold" }}
                  >
                    Total Tax
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                    {invoiceData.totalTax}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={2.4}>
              <Card sx={{ padding: 1 }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Icon sx={{ fontSize: 30, color: "orange" }}>
                    <Receipt />
                  </Icon>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "0.875rem", fontWeight: "bold" }}
                  >
                    Total Paid
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                    {invoiceData.totalPaid}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={2.4}>
              <Card sx={{ padding: 1 }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Icon sx={{ fontSize: 30, color: "red" }}>
                    <Timelapse />
                  </Icon>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "0.875rem", fontWeight: "bold" }}
                  >
                    Total Unpaid
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                    {invoiceData.totalUnpaid}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={2.4}>
              <Card sx={{ padding: 1 }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Icon sx={{ fontSize: 30, color: "grey" }}>
                    <AccessTime />
                  </Icon>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "0.875rem", fontWeight: "bold" }}
                  >
                    Total Overdue
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                    {invoiceData.totalOverdue}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Table for Invoice List */}
        {invoiceData && (
          <TableContainer component={Paper} sx={{ marginTop: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Invoice Number</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Tax</TableCell>
                  <TableCell>Balance</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Issued Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoiceData.invoices.map((invoice: any, index: number) => (
                  <TableRow
                    key={index}
                    onClick={() => handleListView(invoice)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.client}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell>{invoice.tax}</TableCell>
                    <TableCell>{invoice.balance}</TableCell>
                    <TableCell>{invoice.status}</TableCell>
                    <TableCell>{formatDate(invoice?.issuedDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* List View */}
        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          fullWidth
          maxWidth="lg"
        >
          <DialogTitle>Invoices</DialogTitle>
          <Divider />
          {/* <DialogContent>
            <Typography>Here will be the content.</Typography>
            {invoiceViewData && (
              <Typography>{invoiceViewData.invoiceNumber}</Typography>
            )}
          </DialogContent> */}

          <DialogContent
            sx={{
              padding: 3,
              backgroundColor: "#f4f4f4",
              borderRadius: 2,
              border: "1px solid #e0e0e0" // Light border around the dialog
            }}
          >
            <Box
              id="printable-table"
              sx={{
                padding: 3,
                border: "1px solid #e0e0e0", // Light border around the box
                backgroundColor: "white",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: 2,
                maxWidth: 1000,
                margin: "0 auto",
                fontFamily: "'Roboto', sans-serif",
                fontSize: "0.75rem" // Even smaller font size for a more compact look
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  textAlign: "center",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  borderBottom: "1px solid lightgrey",
                  marginBottom: "20px"
                }}
              >
                INVOICE
              </Typography>
              {/* <Divider></Divider> */}
              {/* Header Section */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 3
                }}
              >
                {/* Left Side (From: Admin) */}
                <Box sx={{ width: "33%" }}>
                  <Typography>From</Typography>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ fontSize: "1rem" }}
                  >
                    <Person
                      sx={{
                        fontSize: 16,
                        verticalAlign: "middle",
                        marginRight: 1
                      }}
                    />
                    {invoiceViewData?.adminName}
                  </Typography>
                  <Typography sx={{ fontSize: "0.875rem" }}>
                    <Email
                      sx={{
                        fontSize: 16,
                        verticalAlign: "middle",
                        marginRight: 1
                      }}
                    />
                    {invoiceViewData?.adminEmail}
                  </Typography>
                  <Typography sx={{ fontSize: "0.875rem" }}>
                    <Phone
                      sx={{
                        fontSize: 16,
                        verticalAlign: "middle",
                        marginRight: 1
                      }}
                    />
                    {invoiceViewData?.adminPhone}
                  </Typography>
                  <Typography sx={{ fontSize: "0.875rem" }}>
                    <LocationOn
                      sx={{
                        fontSize: 16,
                        verticalAlign: "middle",
                        marginRight: 1
                      }}
                    />
                    {invoiceViewData?.adminAddress}
                  </Typography>
                </Box>

                {/* Middle Side (To: Client) */}
                <Box sx={{ width: "33%", textAlign: "left" }}>
                  <Typography>To</Typography>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ fontSize: "1rem" }}
                  >
                    <Person
                      sx={{
                        fontSize: 16,
                        verticalAlign: "middle",
                        marginRight: 1
                      }}
                    />
                    {invoiceViewData?.clientName}
                  </Typography>
                  <Typography sx={{ fontSize: "0.875rem" }}>
                    <Email
                      sx={{
                        fontSize: 16,
                        verticalAlign: "middle",
                        marginRight: 1
                      }}
                    />
                    {invoiceViewData?.clientEmail}
                  </Typography>
                </Box>

                {/* Right Side (Invoice No and Dates) */}
                <Box sx={{ width: "33%", textAlign: "right" }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ fontSize: "1rem" }}
                  >
                    Invoice No: {invoiceViewData?.invoiceNumber}
                  </Typography>
                  <Typography sx={{ fontSize: "0.875rem" }}>
                    Issue Date: {invoiceViewData?.issueDate}
                  </Typography>
                  {/* <Typography sx={{ fontSize: "0.875rem" }}>
                    Due Date: {formatDate(invoiceViewData?.dueDate)}
                  </Typography> */}
                  <Typography sx={{ fontSize: "0.875rem" }}>
                    Due Date: {invoiceViewData?.dueDate}
                  </Typography>
                </Box>
              </Box>

              {/* Divider Between Report and Payment Summary */}
              {/* <Divider
                sx={{ marginTop: 3, marginBottom: 3, borderColor: "#e0e0e0" }}
              /> */}

              {/* Description and Billing Details with Titles */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 2,
                  borderBottom: "1px solid #e0e0e0"
                }}
              >
                <Typography
                  sx={{ width: "50%", fontSize: "0.875rem" }}
                  fontWeight="bold"
                >
                  <Receipt
                    sx={{
                      fontSize: 16,
                      verticalAlign: "middle",
                      marginRight: 1
                    }}
                  />
                  Description
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "50%"
                  }}
                >
                  <Typography sx={{ fontSize: "0.875rem", fontWeight: "bold" }}>
                    Type
                  </Typography>
                  <Typography sx={{ fontSize: "0.875rem", fontWeight: "bold" }}>
                    Quantity
                  </Typography>
                  <Typography sx={{ fontSize: "0.875rem", fontWeight: "bold" }}>
                    Rate
                  </Typography>
                  <Typography sx={{ fontSize: "0.875rem", fontWeight: "bold" }}>
                    Cost
                  </Typography>
                </Box>
              </Box>

              {invoiceViewData?.billingReports?.map(
                (report: any, index: Key | null | undefined) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 3,
                      // borderBottom: "1px solid #e0e0e0",
                      backgroundColor: "#F0F0F0",
                      padding: "8px"
                    }}
                  >
                    <Typography sx={{ width: "50%", fontSize: "0.875rem" }}>
                      {report?.description}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "50%"
                      }}
                    >
                      <Typography sx={{ fontSize: "0.875rem" }}>
                        {report?.typeHour}
                      </Typography>
                      <Typography sx={{ fontSize: "0.875rem" }}>
                        {report?.hour}
                      </Typography>
                      <Typography sx={{ fontSize: "0.875rem" }}>
                        {report?.hourlyRate}
                      </Typography>
                      <Typography sx={{ fontSize: "0.875rem" }}>
                        {report?.totalCost}
                      </Typography>
                    </Box>
                  </Box>
                )
              )}

              {/* Payment Summary */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%"
                }}
              >
                {/* Payment Method Section */}
                <Box sx={{ width: "50%" }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ fontSize: "1rem" }}
                  >
                    {/* <Payment
                      sx={{
                        fontSize: 16,
                        verticalAlign: "middle",
                        marginRight: 1
                      }}
                    /> */}
                    {/* Payment Method */}
                  </Typography>
                </Box>

                {/* Details Section */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "50%"
                  }}
                >
                  {/* Title and Value Sections with Lines Under Titles */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1
                    }}
                  >
                    <Typography
                      sx={{
                        textAlign: "left",
                        fontSize: "0.875rem",
                        fontWeight: "bold",
                        borderBottom: "1px solid #ddd",
                        width: "40%" // Limit width of the title to make the line short
                      }}
                    >
                      Total Cost:
                    </Typography>
                    <Typography
                      sx={{
                        textAlign: "right",
                        fontSize: "0.875rem",
                        width: "60%",
                        borderBottom: "1px solid #ddd"
                      }}
                    >
                      ${invoiceViewData?.totalCost}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1
                    }}
                  >
                    <Typography
                      sx={{
                        textAlign: "left",
                        fontSize: "0.875rem",
                        fontWeight: "bold",
                        borderBottom: "1px solid #ddd",
                        width: "40%" // Limit width of the title to make the line short
                      }}
                    >
                      Tax:
                    </Typography>
                    <Typography
                      sx={{
                        textAlign: "right",
                        fontSize: "0.875rem",
                        width: "60%",
                        borderBottom: "1px solid #ddd"
                      }}
                    >
                      ${invoiceViewData?.tax}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1
                    }}
                  >
                    <Typography
                      sx={{
                        textAlign: "left",
                        fontSize: "0.875rem",
                        fontWeight: "bold",
                        borderBottom: "1px solid #ddd",
                        width: "40%" // Limit width of the title to make the line short
                      }}
                    >
                      Paid:
                    </Typography>
                    <Typography
                      sx={{
                        textAlign: "right",
                        fontSize: "0.875rem",
                        width: "60%",
                        borderBottom: "1px solid #ddd"
                      }}
                    >
                      ${invoiceViewData?.paid}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1
                    }}
                  >
                    <Typography
                      sx={{
                        textAlign: "left",
                        fontSize: "0.875rem",
                        fontWeight: "bold",
                        borderBottom: "1px solid #ddd",
                        width: "40%" // Limit width of the title to make the line short
                      }}
                    >
                      Balance:
                    </Typography>
                    <Typography
                      sx={{
                        textAlign: "right",
                        fontSize: "0.875rem",
                        width: "60%",
                        borderBottom: "1px solid #ddd"
                      }}
                    >
                      ${invoiceViewData?.balance}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Divider Line */}
              {/* <Box sx={{ width: "100%", my: 2 }} /> */}
            </Box>
          </DialogContent>

          <DialogActions>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button
                onClick={handlePrintPDF}
                variant="outlined"
                color="primary"
                startIcon={<PrintIcon />}
              >
                Print
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleCloseModal}
              >
                Close
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
      </Container>
    </DashboardLayout>
  );
}
