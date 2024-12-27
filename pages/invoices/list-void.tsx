import { getListVoid } from "@/api/functions/client.api";
import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import React, { useState } from "react";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";

// InvoiceTable Component
const InvoiceTable = ({ data }: { data: any[] }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter data based on search
  const filteredData = data.filter(
    (item) =>
      item.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      item.clientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Paper sx={{ padding: 2, marginTop: 2 }}>
      {/* Search Bar */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
        <TextField
          label="Search Invoice"
          variant="outlined"
          size="small"
          fullWidth
          value={search}
          onChange={handleSearch}
          sx={{ marginRight: 1 }}
        />
        <IconButton>
          <SearchIcon />
        </IconButton>
      </div>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Invoice Number</b>
              </TableCell>
              <TableCell>
                <b>Issue Date</b>
              </TableCell>
              <TableCell>
                <b>Due Date</b>
              </TableCell>
              <TableCell>
                <b>Total Cost</b>
              </TableCell>
              <TableCell>
                <b>Total with Tax</b>
              </TableCell>
              <TableCell>
                <b>Status</b>
              </TableCell>
              <TableCell>
                <b>Client Name</b>
              </TableCell>
              {/* <TableCell>
                <b>Actions</b>
              </TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.invoiceNumber}</TableCell>
                  <TableCell>{row.issueDate}</TableCell>
                  <TableCell>{row.dueDate}</TableCell>
                  <TableCell>{row.totalCost}</TableCell>
                  <TableCell>{row.totalCostWithTax}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.clientName}</TableCell>
                  {/* <TableCell>
                    <Tooltip title="View Details">
                      <IconButton>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell> */}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

// Main ListVoid Component
export default function ListVoid() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["get_list_void"],
    queryFn: getListVoid
  });

  useEffect(() => {
    if (data) {
      console.log("The list of Void invoices is as below::::::", data);
    }
  }, [data]);

  return (
    <DashboardLayout>
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          List of Void Invoices {id}
        </Typography>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <InvoiceTable data={data || []} />
        )}
      </Container>
    </DashboardLayout>
  );
}
