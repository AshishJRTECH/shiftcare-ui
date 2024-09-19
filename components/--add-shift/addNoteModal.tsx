import CustomInput from "@/ui/Inputs/CustomInput";
import MuiModalWrapper, {
  MuiModalWrapperProps
} from "@/ui/Modal/MuiModalWrapper";
import {
  DialogActions,
  FormHelperText,
  Grid,
  MenuItem,
  Select
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import React, { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import RichTextEditor from "../RichTextEditor/RichTextEditor";
import { Box, Stack } from "@mui/system";
import { useMutation } from "@tanstack/react-query";
import { addShiftNote } from "@/api/functions/shift.api";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs, { Dayjs } from "dayjs";
import * as yup from "yup";
import { ShiftNoteBody } from "@/interface/shift.interface";
import { LoadingButton } from "@mui/lab";
import styled from "@emotion/styled";
import { queryClient } from "pages/_app";

const schema = yup.object().shape({
  shiftNoteCategories: yup.string(),
  date: yup.date(),
  subject: yup.string().required("Please enter a Subject"),
  notes: yup.string().required("Please enter a note"),
  clientId: yup.number().required("Please Select a Client")
});

const StyledBox = styled(Box)`
  .tiptap {
    height: 250px;
    overflow: auto;
  }
`;

export default function AddNoteModal({
  clientId,
  ...props
}: MuiModalWrapperProps & { clientId?: number }) {
  const [documents, setDocuments] = useState<File | null | undefined>(null);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      shiftNoteCategories: "Notes",
      date: dayjs(),
      subject: "",
      notes: "",
      clientId: -1
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: addShiftNote,
    onSuccess: () => {
      methods.reset();
      props.onClose();
      queryClient.invalidateQueries({
        queryKey: ["all_shift_notes", clientId]
      });
    }
  });

  const onSubmit = (
    data: Omit<ShiftNoteBody, "documents" | "date"> & {
      date: Dayjs;
      clientId: number;
    }
  ) => {
    const formData = new FormData();
    formData.append("shiftNotesCategories", data.shiftNoteCategories);
    formData.append("date", dayjs(data.date).format("YYYY-MM-DD"));
    formData.append("notes", data.notes);
    formData.append("subject", data.subject);
    formData.append("clientId", clientId?.toString() || "");
    if (documents) formData.append("files", documents);
    mutate(formData);
  };

  return (
    <MuiModalWrapper
      {...props}
      sx={{ zIndex: 9999 }}
      DialogActions={
        <DialogActions>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            paddingBottom={2}
            paddingInline={2}
          >
            <input
              type="file"
              onChange={(e) => setDocuments(e.target.files?.[0])}
            />
            <LoadingButton
              variant="contained"
              onClick={methods.handleSubmit(onSubmit)}
              loading={isPending}
            >
              Add
            </LoadingButton>
          </Stack>
        </DialogActions>
      }
    >
      <FormProvider {...methods}>
        <Grid container spacing={2}>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Controller
              control={methods.control}
              name="shiftNoteCategories"
              render={({ field }) => (
                <Select {...field} fullWidth size="small">
                  <MenuItem value="Notes">Notes</MenuItem>
                  <MenuItem value="Feedback">Feedback</MenuItem>
                  <MenuItem value="Enquiry">Enquiry</MenuItem>
                  <MenuItem value="Incident">Incident</MenuItem>
                  <MenuItem value="Injury">Injury</MenuItem>
                </Select>
              )}
            />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Controller
              control={methods.control}
              name="date"
              render={({ field }) => (
                <DatePicker
                  {...field}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small"
                    }
                  }}
                  maxDate={dayjs()}
                />
              )}
            />
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <CustomInput name="subject" placeholder="Enter Subject" />
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Box
              padding={1}
              paddingInline={1.5}
              border="1px solid #ededed"
              borderRadius={1}
            >
              <Controller
                control={methods.control}
                name="notes"
                render={({ field, fieldState: { invalid, error } }) => (
                  <StyledBox>
                    <RichTextEditor {...field} />
                    {invalid && (
                      <FormHelperText>{error?.message}</FormHelperText>
                    )}
                  </StyledBox>
                )}
              />
            </Box>
          </Grid>
        </Grid>
      </FormProvider>
    </MuiModalWrapper>
  );
}
