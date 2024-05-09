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

const StyledPage = styled(Box)`
  padding: 20px 10px;
`;

const schema = yup.object().shape({
  file: yup
    .mixed()
    .required(validationText.error.file)
    .test("fileType", "Invalid Format", (value: File) => {
      console.log(value.type, value.name);
      return value && value.type?.includes("application/");
    })
    .test("fileSize", "File size must not exceed 15 MB", (value: File) => {
      console.log(value, value.size, 15 * 1024 * 1024);
      return value && value.size <= 15 * 1024 * 1024;
    })
});

export default function Archived() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["all_documents_list"],
    queryFn: getAllDocuments
  });

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      file: null
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: uploadDocument,
    onSuccess: refetch
  });

  const columns = [
    {
      id: "fileType",
      label: "Type"
    },
    {
      id: "fileName",
      label: "Name"
    },
    {
      id: "lastUpdated",
      label: "Last Update"
    }
  ];

  const onSubmit = (data: { file: any }) => {
    const formData = new FormData();
    formData.append("file", data.file);
    mutate(formData);
  };

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
          <Typography variant="h4">Documents</Typography>
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Typography variant="subtitle2">
              Max allowed file size: 15MB
            </Typography>
            <Button
              variant="contained"
              component="label"
              role={undefined}
              tabIndex={-1}
            >
              Upload
              <Controller
                name="file"
                control={control}
                render={({ field: { onChange } }) => (
                  <VisuallyHiddenInput
                    type="file"
                    onChange={(e) => {
                      onChange(e.target.files![0]);
                      handleSubmit(onSubmit)();
                    }}
                    accept="application/*"
                  />
                )}
              />
            </Button>
          </Stack>
        </Stack>
        <DataTable
          columns={columns}
          RowComponent={StaffDocumentRow}
          data={data?.map((_data: documentInterface) => ({
            ..._data,
            fileType: fileExtension(_data.fileName)
          }))}
          noCheckbox
        />
      </StyledPage>
    </DashboardLayout>
  );
}
