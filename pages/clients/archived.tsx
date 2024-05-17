import { getClientArchivedList } from "@/api/functions/client.api";
import DataTable from "@/components/Table/DataTable";
import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import styled from "@emotion/styled";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useQuery } from "@tanstack/react-query";
import ArchivedClientRow from "./archived-client-row";

const StyledPage = styled(Box)`
  padding: 20px 10px;
  h4 {
    margin-bottom: 40px;
  }
`;

export default function Archived() {
  const { data, isLoading } = useQuery({
    queryKey: ["archived_list_client"],
    queryFn: getClientArchivedList
  });

  const columns = [
    {
      id: "displayName",
      label: "Name"
    },
    {
      id: "ndisNumber",
      label: "Ndis"
    },
    {
      id: "agedCareRecipientID",
      label: "Aged Care Recipient Id"
    },
    {
      id: "contactNumber",
      label: "Phone"
    },
    {
      id: "email",
      label: "Email"
    },
    {
      id: "address",
      label: "Address"
    },
    {
      id: "priceBookName",
      label: "Area"
    }
  ];

  return (
    <DashboardLayout isLoading={isLoading}>
      <StyledPage>
        <Typography variant="h4">Archived Staffs</Typography>
        <DataTable
          columns={columns}
          RowComponent={ArchivedClientRow}
          data={data}
          noCheckbox
        />
      </StyledPage>
    </DashboardLayout>
  );
}
