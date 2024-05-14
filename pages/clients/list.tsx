import { Box, styled } from "@mui/system";
import { Paper, Typography } from "@mui/material";
import React, { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import { getStaffList } from "@/api/functions/staff.api";
import { IStaff } from "@/interface/staff.interfaces";
import DataGridTable from "@/components/Table/DataGridTable";
import SimpleBar from "simplebar-react";
import DataTable from "@/components/Table/DataTable";
import UserTableRow from "pages/staff/staff-table-row";
import Loader from "@/ui/Loader/Loder";
import { getAllClients } from "@/api/functions/client.api";
import { IClient } from "@/interface/client.interface";
import ClientTableRow from "./client-table.row";

const StyledClientPage = styled(Box)`
  padding: 20px 10px;
  h4 {
    margin-bottom: 40px;
  }
`;

export default function List() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["client_list"],
    queryFn: getAllClients
  });

  const columns = [
    {
      id: "displayName",
      label: "Name"
    },
    {
      id: "gender",
      label: "Gender"
    },
    {
      id: "age",
      label: "Age"
    },
    {
      id: "ndis",
      label: "NDIS"
    },
    {
      id: "recipient_id",
      label: "Recipient ID"
    },
    {
      id: "mobileNo",
      label: "Mobile"
    },
    {
      id: "phoneNo",
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
      id: "type",
      label: "Type"
    },
    {
      id: "pricebook",
      label: "Pricebook"
    },
    {
      id: "review",
      label: "Review"
    }
  ];

  const rows =
    data?.map((_item: IClient) => ({
      ..._item
    })) || [];

  if (isLoading) return <Loader />;

  return (
    <DashboardLayout>
      <StyledClientPage>
        <Typography variant="h4">Client List</Typography>
        {/* <SimpleBar scrollableNodeProps={{ ref: ref }}> */}
        {/* <Paper>
          <DataGridTable
            rows={rows}
            columns={columns}
            checkboxSelection
            loading={isLoading}
          />
        </Paper> */}
        <DataTable
          columns={columns}
          RowComponent={ClientTableRow}
          data={data}
          noCheckbox
        />
        {/* </SimpleBar> */}
      </StyledClientPage>
    </DashboardLayout>
  );
}
