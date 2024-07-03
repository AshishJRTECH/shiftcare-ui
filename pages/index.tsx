import AppWidgetSummaryCard from "@/components/cards/AppWidgetSummaryCard";
import { customSeriesFill } from "@/components/chart/chart";

import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import { Container, Grid, Typography } from "@mui/material";
import { Calendar, momentLocalizer } from "react-big-calendar";

import dynamic from "next/dynamic";
import moment from "moment";
import { Box } from "@mui/system";
import { getAllShifts } from "@/api/functions/shift.api";
import { GetServerSidePropsContext } from "next";
import { Shift } from "@/interface/shift.interface";
import Timesheet from "@/components/Timesheet/Timesheet";
import {
  DehydratedState,
  HydrationBoundary,
  QueryClient,
  dehydrate,
  useQuery
} from "@tanstack/react-query";
import { getAllClients } from "@/api/functions/client.api";
import { getStaffList } from "@/api/functions/staff.api";

export const getServerSideProps = async ({
  req
}: GetServerSidePropsContext) => {
  const queryClient = new QueryClient();

  const cookie = req.cookies;
  const startDate = moment().startOf("week").format("YYYY-MM-DDT00:00:00.000");
  const endDate = moment().endOf("week").format("YYYY-MM-DDT23:59:59.999");
  const data = await getAllShifts({ token: cookie?.token, startDate, endDate });

  await queryClient.prefetchQuery({
    queryKey: ["user_list"],
    queryFn: getStaffList
  });
  await queryClient.prefetchQuery({
    queryKey: ["client_list"],
    queryFn: () => getAllClients()
  });

  return {
    props: {
      shifts: data,
      dehydratedState: dehydrate(queryClient)
    }
  };
};

export default function Home({
  shifts,
  dehydratedState
}: {
  shifts: Shift[];
  dehydratedState: DehydratedState;
}) {
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Box
          sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
        >
          <HydrationBoundary state={dehydratedState}>
            <Timesheet shifts={shifts} />
          </HydrationBoundary>
        </Box>
      </Container>
    </DashboardLayout>
  );
}
