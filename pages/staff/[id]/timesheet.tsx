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

const StyledUserPage = styled(Box)`
  padding: 20px 10px;
  h4 {
    margin-bottom: 40px;
  }
`;

export default function Index() {
  const { id } = useParams();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Adjust as needed

  const { data = [], isLoading } = useQuery({
    queryKey: ["staff", id],
    queryFn: () => getTimesheet(id as string)
  });

  useEffect(() => {
    console.log("============== Data Check =================", data);
  }, [data]);

  // Transform data to match columns definition
  const transformedData = data.map(
    (item: {
      id: any;
      date: any[];
      shift: { shiftType: any };
      client: { clientName: any };
      startTime: any[];
      finishTime: any[];
      breakTime: any;
      hours: number;
      distance: any;
      expense: any;
      allowances: any[];
      action: any;
    }) => ({
      id: item.id,
      date: `${item.date[0]}-${item.date[1]}-${item.date[2]}`,
      shiftType: item.shift ? item.shift.shiftType : "",
      clientName: item.client ? item.client.clientName : "",
      startTime: `${item.startTime[0]}:${item.startTime[1] < 10 ? "0" : ""}${
        item.startTime[1]
      }`,
      finishTime: `${item.finishTime[0]}:${item.finishTime[1] < 10 ? "0" : ""}${
        item.finishTime[1]
      }`,
      breakTime: item.breakTime,
      hours: item.hours.toFixed(2),
      distance: item.distance,
      expense: item.expense,
      allowances: item.allowances.join(", "),
      action: item.action
    })
  );

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
        <Stack direction="row" spacing={1}>
          <Chip label="Sleepover" color="primary" />
          &nbsp;0
          <Chip label="Mileage" color="success" />
          &nbsp;0
          <Chip label="Expenses" color="warning" />
          &nbsp;0
          <Chip label="Approved" color="success" />
          &nbsp;0
          <Chip label="Total" color="primary" />
          &nbsp;0
        </Stack>

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
