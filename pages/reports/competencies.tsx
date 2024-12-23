import { getStaffReports } from "@/api/functions/staff.api";
import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import {
  Box,
  CircularProgress,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { Cancel, CheckCircle } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function Compliance() {
  const {
    data: reportCompliance,
    isLoading: reportIsLoading,
    isError: reportListError
  } = useQuery({
    queryKey: ["compliance_report"],
    queryFn: () => getStaffReports("Competencies")
  });

  useEffect(() => {
    console.log(
      ":::::::::::::::::::: Compliance ::::::::::::::::::::",
      reportCompliance
    );
  }, [reportCompliance]);

  if (reportIsLoading) {
    return (
      <DashboardLayout>
        <Container>
          <Typography variant="h4" component="h1" gutterBottom>
            Compliance
          </Typography>
          <CircularProgress />
        </Container>
      </DashboardLayout>
    );
  }

  if (reportListError) {
    return (
      <DashboardLayout>
        <Container>
          <Typography variant="h4" component="h1" gutterBottom>
            Competencies
          </Typography>
          <Typography variant="body1" color="error">
            Failed to load compliance data.
          </Typography>
        </Container>
      </DashboardLayout>
    );
  }

  const subCategoryHeaders =
    reportCompliance?.[0]?.subCategories.map(
      (sub: any) => sub.subCategoryName
    ) || [];

  return (
    <DashboardLayout>
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Competencies
        </Typography>
        <Box
          sx={{
            marginTop: 2,
            padding: 2,
            backgroundColor: "background.paper",
            borderRadius: 2,
            boxShadow: 3,
            overflow: "hidden"
          }}
        >
          <Box
            sx={{
              maxHeight: 400,
              overflowY: "auto",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Staff Name</TableCell>
                  {subCategoryHeaders.map((header: any, index: any) => (
                    <TableCell key={index}>{header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {reportCompliance?.map((employee: any) => (
                  <TableRow key={employee.employeeId}>
                    <TableCell>{employee.employeeName}</TableCell>
                    {employee.subCategories.map(
                      (subCategory: any, index: any) => (
                        <TableCell key={index}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: 24,
                              height: 24,
                              borderRadius: 2,
                              backgroundColor: subCategory.hasDocument
                                ? "green.100"
                                : "red.100"
                            }}
                          >
                            {subCategory.status === "Not Added" ? (
                              <Typography>-</Typography>
                            ) : subCategory.status === "Valid" ? (
                              <>
                                {/* <CheckCircle
                                  sx={{ color: "green", fontSize: 18 }}
                                /> */}
                                <Typography
                                  sx={{
                                    color: "#ffffff",
                                    whiteSpace: "nowrap",
                                    backgroundColor: "green",
                                    paddingLeft: "5px",
                                    paddingRight: "5px",
                                    borderRadius: "5px",
                                    fontSize: 12,
                                    textAlign: "center"
                                  }}
                                >
                                  {subCategory.status} <br />
                                  {Array.isArray(subCategory.expiryDate)
                                    ? `${subCategory.expiryDate[2]
                                        .toString()
                                        .padStart(
                                          2,
                                          "0"
                                        )}/${subCategory.expiryDate[1]
                                        .toString()
                                        .padStart(2, "0")}/${
                                        subCategory.expiryDate[0]
                                      }`
                                    : ""}
                                </Typography>
                              </>
                            ) : subCategory.status === "Expired" ? (
                              <Typography
                                sx={{
                                  color: "#ffffff",
                                  whiteSpace: "nowrap",
                                  backgroundColor: "red",
                                  paddingLeft: "5px",
                                  paddingRight: "5px",
                                  borderRadius: "5px",
                                  fontSize: 12,
                                  textAlign: "center"
                                }}
                              >
                                {subCategory.status} <br />
                                {Array.isArray(subCategory.expiryDate)
                                  ? `${subCategory.expiryDate[2]
                                      .toString()
                                      .padStart(
                                        2,
                                        "0"
                                      )}/${subCategory.expiryDate[1]
                                      .toString()
                                      .padStart(2, "0")}/${
                                      subCategory.expiryDate[0]
                                    }`
                                  : "Invalid Date"}
                              </Typography>
                            ) : (
                              <Typography
                                sx={{
                                  color: "#ffffff",
                                  whiteSpace: "nowrap",
                                  backgroundColor: "orange",
                                  paddingLeft: "5px",
                                  paddingRight: "5px",
                                  borderRadius: "5px",
                                  fontSize: 12
                                }}
                              >
                                {subCategory.status}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                      )
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Box>
      </Container>
    </DashboardLayout>
  );
}
