import { useState } from "react";

import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Popover from "@mui/material/Popover";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import Label from "@/ui/label/label";
import Iconify from "@/components/Iconify/Iconify";
import { useRouter } from "next/router";
import DeleteModal from "@/components/deleteModal/deleteModal";
import { useMutation } from "@tanstack/react-query";
import {
  deleteDocument,
  deleteStaff,
  editDocument,
  unarchiveStaff
} from "@/api/functions/staff.api";
import { queryClient } from "pages/_app";
import { Button } from "@mui/material";
import moment from "moment";
import VisuallyHiddenInput from "@/ui/VisuallyHiddenInput/VisuallyHiddenInput";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import validationText from "@/json/messages/validationText";

// ----------------------------------------------------------------------

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

export default function StaffDocumentRow({
  documentId,
  fileName,
  fileType,
  lastUpdated,
  downloadURL
}: {
  documentId: number;
  fileName: string;
  fileType: string;
  lastUpdated: string;
  downloadURL: string;
}) {
  const [deleteModal, setDeleteModal] = useState(false);
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      file: null
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all_documents_list"] });
      setDeleteModal(false);
    }
  });

  const { mutate: editFile } = useMutation({
    mutationFn: editDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all_documents_list"] });
    }
  });

  const onSubmit = (data: { file: any }) => {
    const formData = new FormData();
    formData.append("file", data.file);
    editFile({ id: documentId, fileData: formData });
  };

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell component="th" scope="row">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {fileType}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{fileName}</TableCell>
        <TableCell>{moment(lastUpdated).format("LL")}</TableCell>

        {/* <TableCell align="center">{isVerified ? "Yes" : "No"}</TableCell>

        <TableCell>
          <Label color={(status === "banned" && "error") || "success"}>
            {status}
          </Label>
        </TableCell> */}

        <TableCell align="right">
          <IconButton
            onClick={() => null}
            component="label"
            tabIndex={-1}
            role={undefined}
          >
            <Iconify icon="mingcute:edit-line" />
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
          </IconButton>
          <IconButton onClick={() => setDeleteModal(true)}>
            <Iconify icon="mingcute:delete-2-line" />
          </IconButton>
          <IconButton
            role={undefined}
            component="a"
            href={downloadURL}
            download
          >
            <Iconify icon="mingcute:download-3-line" />
          </IconButton>
        </TableCell>
      </TableRow>
      <DeleteModal
        title="Delete Document"
        description="Are you sure you want to delete this document?"
        agreeBtnText="Yes, Sure"
        declineBtnText="No, Cancel"
        onAgreeBtnType="error"
        onClose={() => setDeleteModal(false)}
        open={deleteModal}
        onAgree={() => mutate(documentId)}
        isActionLoading={isPending}
        onDecline={() => setDeleteModal(false)}
        key={documentId}
      />
    </>
  );
}
