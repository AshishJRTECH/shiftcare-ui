import { Box, styled } from "@mui/system";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import { getTimesheet } from "@/api/functions/staff.api";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";

const StyledUserPage = styled(Box)`
  padding: 20px 10px;
  h4 {
    margin-bottom: 40px;
  }
`;

export default function Index() {
  const router = useRouter();
  const { id } = router.query; // Accessing the 'id' parameter

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Adjust as needed

  const { data = [], isLoading } = useQuery({
    queryKey: ["staff", id],
    queryFn: () => getTimesheet(id as string)
  });

  useEffect(() => {
    // console.log("============== Data List =================", data);
  }, [data]);

  let transformedData: TransformedItem[] = [];

  if (Array.isArray(data)) {
    transformedData = data.map(
      (item: {
        id: any;
        date: any[]; // Assuming this is an array [year, month, day]
        shift: { shiftType: any } | null;
        client: { clientName: any } | null;
        startTime: any[]; // Assuming this is an array [hour, minute]
        finishTime: any[]; // Assuming this is an array [hour, minute]
        breakTime: number | null;
        hours: number;
        distance: number | null;
        expense: number | null;
        allowances: any[] | null;
        action: any;
        totalApprovedDistance: any;
        totalApprovedExpenses: any;
        totalApprovedHours: any;
        totalApprovedSleepover: any;
        totalHours: any;
      }) => ({
        id: item.id,
        date:
          item.date?.length === 3
            ? `${item.date[0]}-${item.date[1]}-${item.date[2]}`
            : "", // Ensure the array has at least 3 elements
        shiftType: item.shift?.shiftType || "", // Handle null or undefined
        clientName: item.client?.clientName || "", // Handle null or undefined
        startTime:
          item.startTime?.length === 2
            ? `${item.startTime[0]}:${item.startTime[1] < 10 ? "0" : ""}${
                item.startTime[1]
              }`
            : "", // Ensure the array has 2 elements for hour and minute
        finishTime:
          item.finishTime?.length === 2
            ? `${item.finishTime[0]}:${item.finishTime[1] < 10 ? "0" : ""}${
                item.finishTime[1]
              }`
            : "", // Ensure the array has 2 elements for hour and minute
        breakTime: item.breakTime !== null ? item.breakTime : "", // Handle null
        hours: item.hours.toFixed(2),
        distance: item.distance !== null ? item.distance : "", // Handle null
        expense: item.expense !== null ? item.expense : "", // Handle null
        allowances: Array.isArray(item.allowances)
          ? item.allowances.join(", ")
          : "", // Ensure it's an array
        action: item.action,
        totalApprovedDistance: item.totalApprovedDistance,
        totalApprovedExpenses: item.totalApprovedExpenses,
        totalApprovedHours: item.totalApprovedHours,
        totalApprovedSleepover: item.totalApprovedSleepover,
        totalHours: item.totalHours
      })
    );
  }

  const handleChangePage = (
    event: any,
    newPage: React.SetStateAction<number>
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <DashboardLayout isLoading={isLoading}>
      <StyledUserPage>
        <Typography variant="h4">Time Sheet</Typography>
        {/* Displaying summary information using Chips */}
        {transformedData[0] ? (
          <Stack direction="row" spacing={1}>
            <Chip label="Sleepover" color="primary" />
            &nbsp;
            {transformedData[0].totalApprovedSleepover}
            <Chip label="Mileage" color="success" />
            &nbsp;{transformedData[0].totalApprovedDistance}
            <Chip label="Expenses" color="warning" />
            &nbsp;{transformedData[0].totalApprovedExpenses}
            <Chip label="Approved Hours" color="success" />
            &nbsp;{transformedData[0].totalApprovedHours}
            <Chip label="Total" color="primary" />
            &nbsp;{transformedData[0].totalHours}
          </Stack>
        ) : (
          <Typography>No Data</Typography>
        )}

        {/* Displaying the Material-UI Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Shift</TableCell>
                <TableCell>Clients</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>Finish Time</TableCell>
                <TableCell>Break Time (min)</TableCell>
                <TableCell>Hours Worked</TableCell>
                <TableCell>Distance (miles)</TableCell>
                <TableCell>Expenses</TableCell>
                <TableCell>Allowances</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transformedData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(
                  (row: {
                    id: React.Key | null | undefined;
                    date:
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactElement<
                          any,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | React.ReactPortal
                      | Promise<React.AwaitedReactNode>
                      | null
                      | undefined;
                    shiftType:
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactElement<
                          any,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | React.ReactPortal
                      | Promise<React.AwaitedReactNode>
                      | null
                      | undefined;
                    clientName:
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactElement<
                          any,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | React.ReactPortal
                      | Promise<React.AwaitedReactNode>
                      | null
                      | undefined;
                    startTime:
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactElement<
                          any,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | React.ReactPortal
                      | Promise<React.AwaitedReactNode>
                      | null
                      | undefined;
                    finishTime:
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactElement<
                          any,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | React.ReactPortal
                      | Promise<React.AwaitedReactNode>
                      | null
                      | undefined;
                    breakTime:
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactElement<
                          any,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | React.ReactPortal
                      | Promise<React.AwaitedReactNode>
                      | null
                      | undefined;
                    hours:
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactElement<
                          any,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | React.ReactPortal
                      | Promise<React.AwaitedReactNode>
                      | null
                      | undefined;
                    distance:
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactElement<
                          any,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | React.ReactPortal
                      | Promise<React.AwaitedReactNode>
                      | null
                      | undefined;
                    expense:
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactElement<
                          any,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | React.ReactPortal
                      | Promise<React.AwaitedReactNode>
                      | null
                      | undefined;
                    allowances:
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactElement<
                          any,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | React.ReactPortal
                      | Promise<React.AwaitedReactNode>
                      | null
                      | undefined;
                    action:
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactElement<
                          any,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | React.ReactPortal
                      | Promise<React.AwaitedReactNode>
                      | null
                      | undefined;
                  }) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.shiftType}</TableCell>
                      <TableCell>{row.clientName}</TableCell>
                      <TableCell>{row.startTime}</TableCell>
                      <TableCell>{row.finishTime}</TableCell>
                      <TableCell>{row.breakTime}</TableCell>
                      <TableCell>{row.hours}</TableCell>
                      <TableCell>{row.distance}</TableCell>
                      <TableCell>{row.expense}</TableCell>
                      <TableCell>{row.allowances}</TableCell>
                      <TableCell>{row.action}</TableCell>
                    </TableRow>
                  )
                )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Pagination component */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={transformedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </StyledUserPage>
    </DashboardLayout>
  );
}
