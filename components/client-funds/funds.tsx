import { addClientFunds } from "@/api/functions/client.api";
import { ClientFund, ClientFundBody } from "@/interface/client.interface";
import validationText from "@/json/messages/validationText";
import CustomInput from "@/ui/Inputs/CustomInput";
import MuiModalWrapper from "@/ui/Modal/MuiModalWrapper";
import StyledPaper from "@/ui/Paper/Paper";
import Scrollbar from "@/ui/scrollbar";
import styled from "@emotion/styled";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Checkbox,
  DialogActions,
  Divider,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import { useMutation } from "@tanstack/react-query";
import { Dayjs } from "dayjs";
import moment from "moment";
import { useParams } from "next/navigation";
import { queryClient } from "pages/_app";
import { useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";

const StyledBox = styled(Box)`
  /* padding-top: 16px; */
  td,
  th {
    text-align: center;
  }
`;

function FundTableRow({
  name,
  startDate,
  expiryDate,
  amount,
  balance,
  isDefault
}: ClientFund) {
  return (
    <TableRow>
      <TableCell>{name}</TableCell>
      <TableCell>
        {moment(
          `${startDate[2]}/${startDate[1]}/${startDate[0]}`,
          "DD/MM/YYYY"
        ).format("DD-MM-YYYY")}
      </TableCell>
      <TableCell>
        {moment(
          `${expiryDate[2]}/${expiryDate[1]}/${expiryDate[0]}`,
          "DD/MM/YYYY"
        ).format("DD-MM-YYYY")}
      </TableCell>
      <TableCell>${amount}</TableCell>
      <TableCell>${balance}</TableCell>
      <TableCell sx={{ textTransform: "capitalize" }}>
        {isDefault.toString()}
      </TableCell>
    </TableRow>
  );
}

const schema = yup.object().shape({
  name: yup.string().required(validationText.error.fund_name),
  startDate: yup.date().nullable().required(validationText.error.starts),
  expiryDate: yup.date().nullable().required(validationText.error.expires),
  amount: yup.number().nullable().required(validationText.error.fund_amount),
  isDefault: yup.boolean()
});

export default function ClientFunds({
  funds_data
}: {
  funds_data: ClientFund[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { id } = useParams();

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      startDate: null,
      expiryDate: null,
      isDefault: false,
      amount: null
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: addClientFunds,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-funds", id] });
      setOpen(false);
    }
  });

  const onSubmit = (
    data: Omit<ClientFundBody, "balance"> & {
      startDate: Dayjs | null;
      expiryDate: Dayjs | null;
    }
  ) => {
    mutate({
      id: id.toString(),
      data: {
        ...data,
        startDate: data.startDate?.toISOString() || null,
        expiryDate: data.expiryDate?.toISOString() || null,
        balance: data.amount || 0
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
        <Typography variant="h5">Funds</Typography>
        <Stack direction="row" alignItems="center" gap={1}>
          {/* <Button size="small">View All</Button> */}
          <Button size="small" onClick={() => setOpen(true)}>
            Add Fund
          </Button>
        </Stack>
      </Stack>
      <Divider />
      <StyledBox>
        <Scrollbar ref={ref}>
          <TableContainer sx={{ overflow: "unset" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Starts</TableCell>
                  <TableCell>Expires</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Balance</TableCell>
                  <TableCell>Default</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {funds_data != null && funds_data.length ? (
                  funds_data.map((_data, index) => {
                    return <FundTableRow {..._data} key={index} />;
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6}>No Data</TableCell>
                  </TableRow>
                )}
                {/* <ComplianceTableRow />
                <ComplianceTableRow />
                <ComplianceTableRow />
                <ComplianceTableRow />
                <ComplianceTableRow /> */}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </StyledBox>
      <MuiModalWrapper
        title="Create Fund"
        fullWidth
        open={open}
        onClose={() => setOpen(false)}
        DialogActions={
          <DialogActions>
            <Button variant="outlined" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <LoadingButton
              loading={isPending}
              variant="contained"
              onClick={methods.handleSubmit(onSubmit)}
            >
              Save
            </LoadingButton>
          </DialogActions>
        }
      >
        <FormProvider {...methods}>
          <Grid container spacing={3}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <CustomInput
                name="name"
                label="Name"
                placeholder="Enter Fund Type"
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <FormLabel
                sx={{ fontSize: "14px", display: "block", marginBottom: "5px" }}
              >
                Starts
              </FormLabel>
              <Controller
                name="startDate"
                control={methods.control}
                render={({ field, fieldState: { invalid, error } }) => (
                  <Box>
                    <DatePicker
                      {...field}
                      slotProps={{
                        textField: {
                          size: "small"
                        }
                      }}
                      format="DD/MM/YYYY"
                    />
                    {invalid && (
                      <FormHelperText>{error?.message}</FormHelperText>
                    )}
                  </Box>
                )}
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <FormLabel sx={{ fontSize: "14px", marginBottom: "5px" }}>
                Expiry
              </FormLabel>
              <Controller
                name="expiryDate"
                control={methods.control}
                render={({ field, fieldState: { invalid, error } }) => (
                  <Box>
                    <DatePicker
                      {...field}
                      slotProps={{
                        textField: {
                          size: "small"
                        }
                      }}
                      format="DD/MM/YYYY"
                      minDate={methods.watch("startDate")}
                    />
                    {invalid && (
                      <FormHelperText>{error?.message}</FormHelperText>
                    )}
                  </Box>
                )}
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <CustomInput
                name="amount"
                type="number"
                label="Amount"
                placeholder="Enter Amount"
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              Balance: $
              {methods.watch("amount")
                ? parseFloat(methods.watch("amount") || "0").toFixed(2)
                : parseFloat("0").toFixed(2)}
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Controller
                name="isDefault"
                control={methods.control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox sx={{ marginRight: "5px" }} size="small" />
                    }
                    label="Default"
                    {...field}
                    checked={field.value}
                  />
                )}
              />
            </Grid>
          </Grid>
        </FormProvider>
      </MuiModalWrapper>
    </StyledPaper>
  );
}
