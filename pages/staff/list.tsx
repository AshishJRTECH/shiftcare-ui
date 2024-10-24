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

const StyledUserPage = styled(Box)`
  padding: 20px 10px;
  h4 {
    margin-bottom: 40px;
  }
  /* .MuiPaper-root {
    overflow: hidden;
    position: relative;
    box-shadow: rgba(145, 158, 171, 0.2) 0px 0px 2px 0px,
      rgba(145, 158, 171, 0.12) 0px 12px 24px -4px;
    border-radius: 16px;
    z-index: 0;
    .MuiDataGrid-columnHeader {
      outline: none;
    }
  } */
`;

export default function Index() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["user_list"],
    queryFn: getStaffList
  });

  const columns = [
    {
      id: "name",
      label: "Name"
    },
    {
      id: "gender",
      label: "Gender"
    },
    {
      id: "role",
      label: "Role"
    },
    {
      id: "email",
      label: "Email"
    },
    {
      id: "mobileNo",
      label: "Mobile"
    },
    {
      id: "address",
      label: "Address"
    },
    {
      id: "employmentType",
      label: "Employment Type"
    }
  ];

  return (
    <DashboardLayout isLoading={isLoading}>
      <StyledUserPage>
        <Typography variant="h4">Staff List</Typography>
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
          RowComponent={UserTableRow}
          data={data?.slice(1).map((_data: IStaff, index: number) => ({
            ..._data,
            role: _data.rolesName?.[0]
              .replace("ROLE_", "")
              .replaceAll("_", " ")
              .toLowerCase(),
            index
          }))}
        />
        {/* </SimpleBar> */}
      </StyledUserPage>
    </DashboardLayout>
  );
}
