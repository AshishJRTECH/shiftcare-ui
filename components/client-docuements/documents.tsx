import { ClientDocument } from "@/interface/client.interface";
import { complianceData } from "@/interface/common.interface";
import StyledPaper from "@/ui/Paper/Paper";
import Scrollbar from "@/ui/scrollbar";
import styled from "@emotion/styled";
import {
  Button,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import moment from "moment";
import React, { useRef } from "react";

const StyledBox = styled(Box)`
  /* padding-top: 16px; */
  td,
  th {
    text-align: center;
  }
`;

function DocumentTableRow({
  fileName,
  clientDocumentCategory,
  lastUpdated,
  expiryDate,
  isExpiry,
  isStaffVisible
}: ClientDocument) {
  // const getStatus = (): {
  //   status: string;
  //   color:
  //     | "error"
  //     | "success"
  //     | "warning"
  //     | "default"
  //     | "primary"
  //     | "secondary"
  //     | "info";
  // } => {
  //   if (expiry) {
  //     return {
  //       status: "Expired",
  //       color: "error"
  //     };
  //   }
  //   if (status && !expiry) {
  //     return {
  //       status: "Active",
  //       color: "success"
  //     };
  //   }
  //   return {
  //     status: "Not Specified",
  //     color: "warning"
  //   };
  // };

  return (
    <TableRow>
      <TableCell>{fileName}</TableCell>
      <TableCell>{clientDocumentCategory}</TableCell>
      <TableCell>{isStaffVisible}</TableCell>
      <TableCell>
        {expiryDate ? moment(expiryDate).format("LL") : "-"}
      </TableCell>
      <TableCell>{isExpiry}</TableCell>
      <TableCell>
        {lastUpdated ? moment(lastUpdated).format("LL") : "-"}
      </TableCell>
    </TableRow>
  );
}

export default function ClientDocuments({
  document_data
}: {
  document_data: ClientDocument[];
}) {
  const ref = useRef(null);

  return (
    <StyledPaper>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ paddingBottom: "15px" }}
      >
        <Typography variant="h5">Documents</Typography>
        <Button size="small">View All</Button>
      </Stack>
      <Divider />
      <StyledBox>
        <Scrollbar ref={ref}>
          <TableContainer sx={{ overflow: "unset" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Staff Visibility</TableCell>
                  <TableCell>Expires At</TableCell>
                  <TableCell>No Expiration</TableCell>
                  <TableCell>Last Update</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {document_data.length ? (
                  document_data.map((_data, index) => {
                    return <DocumentTableRow {..._data} key={index} />;
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6}>No Data</TableCell>
                  </TableRow>
                )}
                {/* <ComplianceTableRow />
                <ComplianceTableRow />
                <ComplianceTableRow />
                <ComplianceTableRow />
                <ComplianceTableRow /> */}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </StyledBox>
    </StyledPaper>
  );
}
