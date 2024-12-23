import { getAllClients, getInvoiceList } from "@/api/functions/client.api";
import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import { DatePicker } from "@mui/x-date-pickers";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
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
import { useState } from "react";
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

  // If you need the formatted version, you can do it later, for example:
  const formattedStartDate = startDate?.format("YYYY-MM-DD");
  const formattedEndDate = endDate?.format("YYYY-MM-DD");
  const formattedIssedDate = issuedDate?.format("YYYY-MM-DD");

  const handleInvoiceList = async () => {
    if (!startDate || !endDate) {
      console.log("Please provide both start and end dates.");
      return;
    }

    try {
      const invoicelist = await getInvoiceList({
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        issuedDate: formattedIssedDate,
        status: selectStatus,
        clientName: selectedClient
      });
      setInvoiceData(invoicelist);
      console.log("Fetched Invoice List:", invoicelist);
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

  console.log("Client List:::::", data);

  const handleChange = (e: any) => {
    const value = e.target.value;
    setSelectedClient(value); // Update the selected client ID
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
                onChange={(newValue: Dayjs | null) => setStartDate(newValue)}
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
                onChange={(newValue: Dayjs | null) => setEndDate(newValue)}
                slotProps={{
                  textField: {
                    variant: "outlined",
                    fullWidth: true,
                    sx: { height: "56px" }
                  }
                }}
              />
              <DatePicker
                label="Select Issued Date"
                value={issuedDate || dayjs()} // If issuedDate is null, default to the current date
                onChange={(newValue: Dayjs | null) => setIssuedDate(newValue)}
                slotProps={{
                  textField: {
                    variant: "outlined",
                    fullWidth: true
                  }
                }}
              />

              {/* <Select
                fullWidth
                size="small"
                value={selectedClient}
                onChange={handleChange}
                displayEmpty
                renderValue={selectedClient ? undefined : () => "Select Client"}
                sx={{ height: "56px" }}
              >
                {isLoading ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} />
                    Loading...
                  </MenuItem>
                ) : (
                  data?.map((_data: any) => (
                    <MenuItem value={_data.displayName} key={_data.displayName}>
                      {_data.displayName}
                    </MenuItem>
                  ))
                )}
              </Select> */}

              <Select
                fullWidth
                size="small"
                value={selectedClient}
                onChange={handleChange}
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
                  onChange={(e) => setSelectStatus(e.target.value)}
                  displayEmpty
                  fullWidth
                  sx={{
                    paddingTop: "0px",
                    paddingBottom: "0px"
                    // height: "56px" // You can adjust the height as needed
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

            <Button
              variant="contained"
              onClick={handleInvoiceList}
              sx={{
                height: "56px",
                width: "30%",
                display: "flex", // Add this to align the icon and text
                alignItems: "center", // Center the items vertically
                justifyContent: "center" // Center the items horizontally
              }}
            >
              <FilterAltIcon sx={{ marginRight: "8px" }} /> Filter
            </Button>
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
                  <TableRow key={index}>
                    <TableCell>{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.client}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell>{invoice.tax}</TableCell>
                    <TableCell>{invoice.balance}</TableCell>
                    <TableCell>{invoice.status}</TableCell>
                    <TableCell>{formatDate(invoice.issuedDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </DashboardLayout>
  );
}
