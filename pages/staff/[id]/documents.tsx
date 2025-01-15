import {
  getNotes,
  getStaff,
  getStaffAllDocuments,
  getStaffCompliance,
  getStaffSettings
} from "@/api/functions/staff.api";
import { getLastSignin } from "@/api/functions/user.api";
import {
  complianceData,
  staffAllDocuments
} from "@/interface/common.interface";
import { ISettings, IStaff } from "@/interface/staff.interfaces";
import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import { Container, Grid, Typography } from "@mui/material";
import { useQueries } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Compliance from "@/components/staff-compliance/compliance";

interface QueryResult {
  staff: IStaff;
  settings: ISettings;
  compliance: complianceData[];
  staffalldocuments: staffAllDocuments[];
  last_login: { "Last Login": number };
  notes: {
    notes: string;
  };
  isLoading: boolean;
}

export default function Documents() {
  const { id } = useParams();
  const data: QueryResult = useQueries({
    queries: [
      {
        queryKey: ["staff", id],
        queryFn: () => getStaff(id as string)
      },
      {
        queryKey: ["staff-settings", id],
        queryFn: () => getStaffSettings(id as string)
      },
      {
        queryKey: ["staff-compliance", id],
        queryFn: () => getStaffCompliance(id as string)
      },
      {
        queryKey: ["last-login", id],
        queryFn: () => getLastSignin(id as string)
      },
      {
        queryKey: ["notes", id],
        queryFn: () => getNotes(id as string)
      },
      {
        queryKey: ["staffalldocuments", id],
        queryFn: () => getStaffAllDocuments(id as string)
      }
    ],
    combine: (results) => {
      return {
        staff: results[0].data,
        settings: results[1].data,
        compliance: results[2].data,
        last_login: results[3].data,
        notes: results[4].data,
        staffalldocuments: results[5].data,
        isLoading:
          results[0].isLoading ||
          results[1].isLoading ||
          results[2].isLoading ||
          results[3].isLoading ||
          results[4].isLoading ||
          results[5].isLoading
      };
    }
  });
  return (
    <DashboardLayout>
      <Container>
        {/* <Typography variant="h4" component="h1" gutterBottom>
          Documents {id}
        </Typography>
        <Typography variant="body1">Documents...</Typography> */}

        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Compliance staffalldocuments={data.staffalldocuments} />
        </Grid>
      </Container>
    </DashboardLayout>
  );
}
