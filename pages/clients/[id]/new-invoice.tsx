import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { generateInvoice, getInvoicePreview } from "@/api/functions/client.api";

const NewInvoice = ({
  onCloseModel,
  // onOpenModelMessage,
  invoiceData,
  id,
  selectedTaxType,
  startDate,
  endDate,
  selectedRows,
  onResponse
}: {
  onCloseModel: () => void;
  // onOpenModelMessage: () => void;
  invoiceData: any;
  id: string;
  selectedTaxType: string;
  startDate: string;
  endDate: string;
  selectedRows: number[];
  onResponse: (data: { invoiceNumber: string; message: string }) => void;
}) => {
  const [responseData, setResponseData] = useState<any>(null);

  const formatDate = (dateArray: number[]) => {
    const [year, month, day] = dateArray;
    return `${day.toString().padStart(2, "0")}-${month
      .toString()
      .padStart(2, "0")}-${year}`;
  };

  const handlePrint = () => {
    const printContent = document.getElementById("print-container");
    if (printContent) {
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = printContent.outerHTML;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload(); // Refresh to restore the original UI
    }
  };

  const handleCreate = async () => {
    console.log("Invoice Creating Data:", {
      id,
      selectedTaxType,
      startDate,
      endDate,
      selectedRows
    });

    try {
      // Prepare billingReportIds as a string
      const billingReportIds = selectedRows.join(",");

      // Call the API with the current values
      const response = await generateInvoice({
        clientId: id,
        startDate: startDate,
        endDate: endDate,
        billingReportIds: billingReportIds, // Pass the joined string
        taxType: selectedTaxType
      });

      // Handle the response here (e.g., update state or display preview)
      console.log("Invoice Create Response:", response);
      setResponseData(response);
      onCloseModel();
      const message = "This is a response from the child component.";
      onResponse(response); // Send the message back to the parent
    } catch (error) {
      // Handle any errors here (e.g., display an error message to the user)
      console.error("Error fetching invoice preview:", error);
    }
  };

  return (
    <Grid item xs={12} sm={12} md={12}>
      <Box id="print-container">
        {/* Invoice Content */}
        <Box
          sx={{
            maxWidth: "100%",
            margin: "20px auto",
            padding: 3,
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9"
          }}
        >
          {/* Invoice Header */}
          <Typography
            variant="h4"
            sx={{ textAlign: "center", marginBottom: 2, fontWeight: "bold" }}
          >
            Invoice Preview
          </Typography>
          <Divider />

          {/* Dates (Top-Right) */}
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}
          >
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="body2">
                <strong>Invoice Date:</strong>{" "}
                {formatDate(invoiceData.generatedDate)}
              </Typography>
              <Typography variant="body2">
                <strong>Due Date:</strong> {formatDate(invoiceData.dueDate)}
              </Typography>
            </Box>
          </Box>

          {/* Company and Client Details */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 2
            }}
          >
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {invoiceData.companyName}
              </Typography>
              <Typography variant="body2">Company Address</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Bill To:
              </Typography>
              <Typography variant="body2">{invoiceData.clientName}</Typography>
            </Box>
          </Box>

          {/* Billing Reports Table */}
          <TableContainer component={Paper} sx={{ marginTop: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {/* <TableCell sx={{ fontWeight: "bold" }}>#</TableCell> */}
                  <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>
                    Qnty
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>
                    Rate ($)
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>
                    Tax ($)
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>
                    Cost ($)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoiceData.billingReports.map(
                  (report: any, index: number) => (
                    <React.Fragment key={report.id}>
                      {/* First Row - Hourly */}
                      <TableRow>
                        {/* <TableCell>{index + 1}</TableCell> */}
                        <TableCell>{report.description}</TableCell>
                        <TableCell>Hourly</TableCell>
                        <TableCell sx={{ textAlign: "right" }}>
                          {report.hours}
                        </TableCell>
                        <TableCell sx={{ textAlign: "right" }}>
                          {(report.hourlyRate ?? 0).toFixed(2)}
                        </TableCell>
                        <TableCell sx={{ textAlign: "right" }}>
                          {(report.hourlyTax ?? 0).toFixed(2)}
                        </TableCell>
                        <TableCell sx={{ textAlign: "right" }}>
                          {report.cost.toFixed(2)}
                        </TableCell>
                      </TableRow>

                      {/* Second Row - Additional Cost */}
                      <TableRow>
                        {/* <TableCell>{`${index + 1}a`}</TableCell> */}
                        <TableCell>{report.description}</TableCell>
                        <TableCell>Additional Cost</TableCell>
                        <TableCell sx={{ textAlign: "right" }}>-</TableCell>
                        <TableCell sx={{ textAlign: "right" }}>-</TableCell>
                        <TableCell sx={{ textAlign: "right" }}>
                          {(report.additionalTax ?? 0).toFixed(2)}
                        </TableCell>
                        <TableCell sx={{ textAlign: "right" }}>
                          {(report.additionalCost ?? 0).toFixed(2)}
                        </TableCell>
                      </TableRow>

                      {/* Third Row - Distance */}
                      <TableRow>
                        {/* <TableCell>{`${index + 1}b`}</TableCell> */}
                        <TableCell>{report.description}</TableCell>
                        <TableCell>Distance</TableCell>
                        <TableCell sx={{ textAlign: "right" }}>
                          {report.distance}
                        </TableCell>
                        <TableCell sx={{ textAlign: "right" }}>
                          {(report.distanceRate ?? 0).toFixed(2)}
                        </TableCell>
                        <TableCell sx={{ textAlign: "right" }}>
                          {(report.distanceTax ?? 0).toFixed(2)}
                        </TableCell>
                        <TableCell sx={{ textAlign: "right" }}>
                          {(report.distanceCost ?? 0).toFixed(2)}
                        </TableCell>
                      </TableRow>

                      {/* Separator Row */}
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          sx={{ borderBottom: "1px solid grey" }}
                        ></TableCell>
                      </TableRow>
                    </React.Fragment>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Summary Section */}
          <Box sx={{ marginTop: 3, textAlign: "right" }}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Total Cost: ${invoiceData.totalCost.toFixed(2)}
            </Typography>
            <Typography variant="body1">
              Tax Amount: ${invoiceData.taxAmount.toFixed(2)}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Total with Tax: ${invoiceData.totalCostWithTax.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Actions */}
      <Divider />
      <DialogActions>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="contained" color="error" onClick={onCloseModel}>
            Close
          </Button>
          {/* <Button variant="contained" color="secondary" onClick={handlePrint}>
            Print
          </Button> */}
          <Button variant="contained" color="secondary" onClick={handleCreate}>
            Create
          </Button>
        </Box>
      </DialogActions>
    </Grid>
  );
};

export default NewInvoice;
