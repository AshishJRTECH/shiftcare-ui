import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import CustomInput from "@/ui/Inputs/CustomInput";
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ToggleButtonGroup,
  Tooltip,
  Typography
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { SyntheticEvent, useEffect, useState } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm
} from "react-hook-form";
import EmailIcon from "@mui/icons-material/Email";
import InfoIcon from "@mui/icons-material/Info";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import { LoadingButton } from "@mui/lab";
import { DatePicker } from "@mui/x-date-pickers";
import styled from "@emotion/styled";
import * as yup from "yup";
import validationText from "@/json/messages/validationText";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs, { Dayjs } from "dayjs";
import languages from "language-list";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addInvoiceNotes, getClient } from "@/api/functions/client.api";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { InvoiceNotesInterface } from "@/interface/invoicepayment";

const StyledBox = styled(Box)`
  padding: 20px 10px;
  h4 {
    margin-bottom: 40px;
  }
  .inner-container {
    padding: 10px 20px;
    background-color: #fff;
    border-radius: 5px;
    .header {
      padding-bottom: 10px;
    }
    .footer {
      padding-block: 15px;
    }
    hr:first-of-type {
      margin-bottom: 20px;
    }
    hr:last-of-type {
      margin-top: 20px;
    }
    .date-picker {
      .MuiInputBase-root {
        flex-direction: row-reverse;
      }
    }

    .MuiInputBase-root {
      svg {
        color: #ccc;
      }
    }
  }
`;

const schema = yup.object().shape({
  note: yup.string().required("Note is required")
});

export default function InvoiceNotes({ selectedInvoiceId }: any) {
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      note: ""
    }
  });

  const { control, handleSubmit, reset } = methods;

  const { mutate, isPending } = useMutation({
    mutationFn: addInvoiceNotes,
    onSuccess: (data) => {
      toast.success(data.message); // Show success toast
    }
  });

  const onSubmit = (data: InvoiceNotesInterface) => {
    // const isDayjs = (value: any): value is Dayjs => dayjs.isDayjs(value);

    const formattedData: InvoiceNotesInterface = {
      ...data
    };
    // Pass FormData to mutate function
    mutate({
      id: selectedInvoiceId,
      data: formattedData
    });

    console.log("Invoice ID::::::::::::::::::::::::::::::", selectedInvoiceId);
    console.log(
      "Behaviour Observation : Json Data::::::::::::::::::::::::::::::",
      data
    );
    // console.log("Form Data::::::::::::::::::::::::::::::", clientIntakeFormDto);
  };

  return (
    <StyledBox>
      <Box className="inner-container">
        <FormProvider {...methods}>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="body1">Note:</Typography>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Controller
                name="note"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    placeholder="Add Notes"
                    multiline
                    rows={4} // Adjust the number of rows as needed
                    variant="outlined" // You can choose "filled" or "standard" if preferred
                    error={!!fieldState.error} // Show error styling if validation fails
                    helperText={fieldState.error?.message} // Show validation error message
                  />
                )}
              />
            </Grid>
          </Grid>
        </FormProvider>
        {/* <Divider /> */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          className="footer"
          spacing={2}
        >
          {/* <Button variant="outlined" disabled={isPending}> */}
          <LoadingButton
            variant="contained"
            onClick={methods.handleSubmit(onSubmit)}
            loading={isPending}
          >
            Add
          </LoadingButton>
        </Stack>
      </Box>
    </StyledBox>
  );
}
