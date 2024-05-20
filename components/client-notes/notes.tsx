import { updateAdditionalInformation } from "@/api/functions/client.api";
import { updateNotes } from "@/api/functions/staff.api";
import validationText from "@/json/messages/validationText";
import StyledPaper from "@/ui/Paper/Paper";
import styled from "@emotion/styled";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Button, Divider, TextField, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import { useMutation } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";
import moment from "moment";
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
  privateInfo: yup.string().required(validationText.error.notes),
  reviewDate: yup.date().nullable()
});

export default function Notes({
  privateInfo,
  reviewDate
}: {
  privateInfo?: string;
  reviewDate?: string;
}) {
  const [edit, setEdit] = useState(false);

  const { id } = useParams();

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      privateInfo: privateInfo || "",
      reviewDate: reviewDate ? dayjs(reviewDate) : null
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateAdditionalInformation,
    onSuccess: () => {
      setEdit(false);
      queryClient.invalidateQueries({
        queryKey: ["client-additional-information", id]
      });
    }
  });

  const onSubmit = (data: {
    privateInfo: string;
    reviewDate: Dayjs | null;
  }) => {
    mutate({
      id: id as string,
      data: {
        privateInfo: data.privateInfo,
        reviewDate: data.reviewDate?.toISOString()
      }
    });
  };

  return (
    <StyledPaper>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ paddingBottom: "15px" }}
      >
        <Typography variant="h5">Additional Information</Typography>
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
            name="privateInfo"
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
          <Typography variant="body1">{privateInfo}</Typography>
        )}
        <Typography
          variant="caption"
          sx={{
            display: "inline-block",
            marginBottom: "5px",
            marginTop: "15px"
          }}
        >
          Review date:
        </Typography>
        {edit ? (
          <Controller
            control={control}
            name="reviewDate"
            render={({ field }) => (
              <DatePicker
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true
                  }
                }}
                format="DD/MM/YYYY"
                {...field}
              />
            )}
          />
        ) : (
          <Typography variant="body1" sx={{ fontSize: "14px" }}>
            {reviewDate ? moment(reviewDate).format("DD-MM-YYYY") : null}
          </Typography>
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
