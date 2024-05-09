import { getAllDocuments, uploadDocument } from "@/api/functions/staff.api";
import DataTable from "@/components/Table/DataTable";
import { documentInterface } from "@/interface/staff.interfaces";
import validationText from "@/json/messages/validationText";
import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import VisuallyHiddenInput from "@/ui/VisuallyHiddenInput/VisuallyHiddenInput";
import styled from "@emotion/styled";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useMutation, useQuery } from "@tanstack/react-query";
import fileExtension from "file-extension";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import StaffDocumentRow from "./staff-document-row";
import { queryClient } from "pages/_app";
import { useRouter } from "next/router";
import { getAllTeams } from "@/api/functions/teams.api";
import TeamStaffRow from "./team-staff-row";

const StyledPage = styled(Box)`
  padding: 20px 10px;
`;

export default function Teams() {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["teams"],
    queryFn: getAllTeams
  });

  const columns = [
    {
      id: "teamName",
      label: "Name"
    },
    {
      id: "employeeCount",
      label: "Count"
    },
    {
      id: "employees",
      label: "Staff"
    }
  ];

  return (
    <DashboardLayout isLoading={isLoading}>
      <StyledPage>
        <Stack
          direction="row"
          alignItems="center"
          flexWrap="wrap"
          justifyContent="space-between"
          gap={2}
          sx={{ marginBottom: "40px" }}
        >
          <Typography variant="h4">Teams</Typography>
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Button
              variant="contained"
              component="label"
              role={undefined}
              tabIndex={-1}
              onClick={() => router.push("/staff/create-new-team")}
            >
              Create New Team
            </Button>
          </Stack>
        </Stack>
        <DataTable
          columns={columns}
          RowComponent={TeamStaffRow}
          data={data}
          noCheckbox
        />
      </StyledPage>
    </DashboardLayout>
  );
}
