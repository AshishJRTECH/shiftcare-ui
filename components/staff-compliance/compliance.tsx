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

function ComplianceTableRow({
  fileName,
  fileType,
  fileSize,
  lastUpdated,
  downloadURL,
  expiryDate,
  expiry,
  status,
  employee,
  documentSubCategory,
  client,
  clientDocumentCategory
}: complianceData) {
  const getStatus = (): {
    status: string;
    color:
      | "error"
      | "success"
      | "warning"
      | "default"
      | "primary"
      | "secondary"
      | "info";
  } => {
    if (expiry) {
      return {
        status: "Expired",
        color: "error"
      };
    }
    if (status && !expiry) {
      return {
        status: "Active",
        color: "success"
      };
    }
    return {
      status: "Not Specified",
      color: "warning"
    };
  };

  return (
    <TableRow>
      <TableCell>{documentSubCategory}</TableCell>
      <TableCell>
        {expiryDate ? moment(expiryDate).format("LL") : "-"}
      </TableCell>
      <TableCell>
        {lastUpdated ? moment(lastUpdated).format("LL") : "-"}
      </TableCell>
      <TableCell>
        <Chip
          label={getStatus().status}
          color={getStatus().color}
          variant="outlined"
        />
      </TableCell>
    </TableRow>
  );
}

export default function Compliance({
  compliance_data
}: {
  compliance_data: complianceData[];
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
        <Typography variant="h5">Compliance</Typography>
        <Button size="small">Manage All</Button>
      </Stack>
      <Divider />
      <StyledBox>
        <Scrollbar ref={ref}>
          <TableContainer sx={{ overflow: "unset" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell>Expires At</TableCell>
                  <TableCell>Last Update</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {compliance_data.map((_data, index) => {
                  return <ComplianceTableRow {..._data} key={index} />;
                })}
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
