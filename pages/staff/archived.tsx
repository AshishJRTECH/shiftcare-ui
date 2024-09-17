import { getArchivedList } from "@/api/functions/staff.api";
import DataTable from "@/components/Table/DataTable";
import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import styled from "@emotion/styled";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useQuery } from "@tanstack/react-query";
import ArchivedStaffRow from "./archived-staff-row";

const StyledPage = styled(Box)`
  padding: 20px 10px;
  h4 {
    margin-bottom: 40px;
  }
`;

export default function Archived() {
  const { data, isLoading } = useQuery({
    queryKey: ["archived_list_staff"],
    queryFn: getArchivedList
  });

  const columns = [
    {
      id: "name",
      label: "Name"
    },
    {
      id: "email",
      label: "Email"
    },
    {
      id: "mobileNo",
      label: "Mobile No"
    },
    {
      id: "phoneNo",
      label: "Phone No"
    }
  ];

  return (
    <DashboardLayout isLoading={isLoading}>
      <StyledPage>
        <Typography variant="h4">Archived Staffs</Typography>
        <DataTable
          columns={columns}
          RowComponent={ArchivedStaffRow}
          data={data}
          noCheckbox
        />
      </StyledPage>
    </DashboardLayout>
  );
}
