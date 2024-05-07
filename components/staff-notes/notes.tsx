import { updateNotes } from "@/api/functions/staff.api";
import validationText from "@/json/messages/validationText";
import StyledPaper from "@/ui/Paper/Paper";
import styled from "@emotion/styled";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Button, Divider, TextField, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { queryClient } from "pages/_app";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

const StyledBox = styled(Box)`
  padding-top: 10px;
`;

const schema = yup.object().shape({
  note: yup.string().required(validationText.error.notes)
});

export default function Notes({ note }: { note?: string }) {
  const [edit, setEdit] = useState(false);

  const { id } = useParams();

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      note: note || ""
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateNotes,
    onSuccess: () => {
      setEdit(false);
      queryClient.invalidateQueries({ queryKey: ["notes", id] });
    }
  });

  const onSubmit = (data: { note: string }) => {
    mutate({ id: id as string, data: data.note });
  };

  return (
    <StyledPaper>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ paddingBottom: "15px" }}
      >
        <Typography variant="h5">Notes</Typography>
        {!edit && (
          <Button size="small" onClick={() => setEdit(true)}>
            Edit
          </Button>
        )}
      </Stack>
      <Divider />
      <StyledBox
        sx={{
          paddingBottom: edit ? "16px" : 0
        }}
      >
        <Typography
          variant="caption"
          sx={{ display: "inline-block", marginBottom: "5px" }}
        >
          Private Info
        </Typography>
        {edit ? (
          <Controller
            control={control}
            name="note"
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField
                multiline
                size="small"
                sx={{
                  display: "block",
                  marginTop: "5px",
                  fontSize: "14px",
                  "& textarea::placeholder": {
                    fontSize: "14px"
                  }
                }}
                {...field}
                fullWidth
                rows={5}
                placeholder="Enter Private Info"
                error={invalid}
                helperText={error?.message}
              />
            )}
          />
        ) : (
          <Typography variant="body1">{note}</Typography>
        )}
      </StyledBox>
      {edit && (
        <>
          <Divider />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            gap={1}
            sx={{ paddingTop: "16px" }}
          >
            <Button
              variant="outlined"
              size="small"
              onClick={() => setEdit(false)}
            >
              Cancel
            </Button>
            <LoadingButton
              loading={isPending}
              variant="contained"
              size="small"
              onClick={handleSubmit(onSubmit)}
            >
              Update
            </LoadingButton>
          </Stack>
        </>
      )}
    </StyledPaper>
  );
}
