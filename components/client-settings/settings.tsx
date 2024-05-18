import StyledPaper from "@/ui/Paper/Paper";
import styled from "@emotion/styled";
import {
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  Typography
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { useState } from "react";
import Iconify from "../Iconify/Iconify";
import { getRoles } from "@/api/functions/cms.api";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { ISettings, IUpdateSettings } from "@/interface/staff.interfaces";
import { getAllTeams } from "@/api/functions/teams.api";
import * as yup from "yup";
import validationText from "@/json/messages/validationText";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateSettings } from "@/api/functions/staff.api";
import { LoadingButton } from "@mui/lab";
import { queryClient } from "pages/_app";
import { useParams } from "next/navigation";
import { ClientSettings } from "@/interface/client.interface";
import CustomInput from "@/ui/Inputs/CustomInput";
import { updateClientSettings } from "@/api/functions/client.api";
import { getAllPriceBooks } from "@/api/functions/pricebook.api";

const StyledBox = styled(Box)`
  padding-top: 15px;
  p {
    color: #95959a;
  }
`;

const client_types = [
  {
    id: "SelfManaged",
    label: "Self Managed"
  },
  {
    id: "PlanManaged",
    label: "Plan Managed"
  },
  {
    id: "NdisManaged",
    label: "NDIS Managed"
  },
  {
    id: "Level1AgedCare",
    label: "Level 1 Aged Care"
  },
  {
    id: "Level2AgedCare",
    label: "Level 2 Aged Care"
  },
  {
    id: "Level3AgedCare",
    label: "Level 3 Aged Care"
  },
  {
    id: "Level4AgedCare",
    label: "Level 4 Aged Care"
  },
  {
    id: "Sil",
    label: "Sil"
  }
];

const schema = yup.object().shape({
  ndisNumber: yup.string().nullable(),
  agedCareRecipientID: yup.string().nullable(),
  referenceNumber: yup.string().nullable(),
  customField: yup.string().nullable(),
  purchaseOrderNumber: yup.string().nullable(),
  clientType: yup.string().nullable(),
  priceBookId: yup.number().nullable(),
  priceBookName: yup.string().nullable(),
  teamIds: yup.array().of(yup.number()).nullable(),
  teams: yup.array().of(yup.string()).nullable(),
  isShareProgressNotes: yup.boolean().nullable(),
  isSMSRemindersEnabled: yup.boolean().nullable(),
  isInvoiceTravel: yup.boolean().nullable()
});

export default function Settings({ settings }: { settings: ClientSettings }) {
  const [edit, setEdit] = useState(false);
  const { id } = useParams();

  const data = useQueries({
    queries: [
      {
        queryKey: ["all-pricebook"],
        queryFn: getAllPriceBooks
      },
      {
        queryKey: ["teams"],
        queryFn: getAllTeams
      }
    ],
    combine: (result) => {
      return {
        priceBooks: result[0].data,
        teams: result[1].data,
        loading: result[0].isLoading || result[1].isLoading
      };
    }
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ndisNumber: settings.ndisNumber,
      agedCareRecipientID: settings.agedCareRecipientID,
      customField: settings.customField,
      purchaseOrderNumber: settings.purchaseOrderNumber,
      clientType: settings.clientType,
      priceBookId: settings.priceBookId,
      priceBookName: settings.priceBookName,
      teamIds: settings.teamIds || [],
      teams: settings.teams,
      referenceNumber: settings.referenceNumber,
      isShareProgressNotes: settings.isShareProgressNotes,
      isSMSRemindersEnabled: settings.isSMSRemindersEnabled,
      isInvoiceTravel: settings.isInvoiceTravel
    }
  });

  console.log(methods.formState.errors);

  const { mutate, isPending } = useMutation({
    mutationFn: updateClientSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-settings", id] });
      setEdit(false);
    }
  });

  const onSubmit = (data: ClientSettings) => {
    mutate({ id: id as string, data });
  };

  return (
    <StyledPaper>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ paddingBottom: "15px" }}
      >
        <Typography variant="h5">Settings</Typography>
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
        <FormProvider {...methods}>
          <Grid container spacing={2}>
            <Grid item lg={5} md={6} sm={12} xs={12}>
              <Typography variant="body1">NDIS Number:</Typography>
            </Grid>
            <Grid item lg={7} md={6} sm={12} xs={12}>
              {edit ? (
                <CustomInput
                  name="ndisNumber"
                  fullWidth
                  placeholder="Enter NDIS Number"
                />
              ) : (
                <Typography variant="body1">{settings.ndisNumber}</Typography>
              )}
            </Grid>
            <Grid item lg={5} md={6} sm={12} xs={12}>
              <Typography variant="body1">Aged Care Recipient ID:</Typography>
            </Grid>
            <Grid item lg={7} md={6} sm={12} xs={12}>
              {edit ? (
                <CustomInput
                  name="agedCareRecipientID"
                  fullWidth
                  placeholder="Enter Aged Care Recipient ID"
                />
              ) : (
                <Typography variant="body1">
                  {settings.agedCareRecipientID}
                </Typography>
              )}
            </Grid>
            <Grid item lg={5} md={6} sm={12} xs={12}>
              <Typography variant="body1">Reference Number:</Typography>
            </Grid>
            <Grid item lg={7} md={6} sm={12} xs={12}>
              {edit ? (
                <CustomInput
                  name="referenceNumber"
                  fullWidth
                  placeholder="Enter Reference Number"
                />
              ) : (
                <Typography variant="body1">
                  {settings.referenceNumber}
                </Typography>
              )}
            </Grid>
            <Grid item lg={5} md={6} sm={12} xs={12}>
              <Typography variant="body1">Custom Field:</Typography>
            </Grid>
            <Grid item lg={7} md={6} sm={12} xs={12}>
              {edit ? (
                <CustomInput
                  name="customField"
                  fullWidth
                  placeholder="Enter Custom Field"
                />
              ) : (
                <Typography variant="body1">{settings.customField}</Typography>
              )}
            </Grid>
            <Grid item lg={5} md={6} sm={12} xs={12}>
              <Typography variant="body1">PO. Number:</Typography>
            </Grid>
            <Grid item lg={7} md={6} sm={12} xs={12}>
              {edit ? (
                <CustomInput
                  name="purchaseOrderNumber"
                  fullWidth
                  placeholder="Enter Purchase Order Number"
                />
              ) : (
                <Typography variant="body1">
                  {settings.purchaseOrderNumber}
                </Typography>
              )}
            </Grid>

            <Grid item lg={5} md={6} sm={12} xs={12}>
              <Typography variant="body1">Client Type:</Typography>
            </Grid>
            <Grid item lg={7} md={6} sm={12} xs={12}>
              {edit ? (
                <Controller
                  name="clientType"
                  control={methods.control}
                  render={({
                    field: { value, onChange },
                    fieldState: { invalid, error }
                  }) => (
                    <Box>
                      <Select
                        fullWidth
                        size="small"
                        displayEmpty
                        value={value}
                        onChange={onChange}
                      >
                        {client_types.map((_client) => (
                          <MenuItem value={_client.id} key={_client.id}>
                            {_client.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {invalid && (
                        <FormHelperText sx={{ color: "#FF5630" }}>
                          {error?.message}
                        </FormHelperText>
                      )}
                    </Box>
                  )}
                />
              ) : (
                <Stack
                  direction="row"
                  alignItems="center"
                  gap={1}
                  flexWrap="wrap"
                >
                  <Chip
                    variant="outlined"
                    label={
                      client_types.find(
                        (_client) => _client.id === settings.clientType
                      )?.label
                    }
                    color="primary"
                    size="small"
                  />
                </Stack>
              )}
            </Grid>
            <Grid item lg={5} md={6} sm={12} xs={12}>
              <Typography variant="body1">Default Price Book:</Typography>
            </Grid>
            <Grid item lg={7} md={6} sm={12} xs={12}>
              {edit ? (
                <Controller
                  name="priceBookId"
                  control={methods.control}
                  render={({
                    field: { value, onChange },
                    fieldState: { invalid, error }
                  }) => (
                    <Box>
                      <Select
                        fullWidth
                        size="small"
                        displayEmpty
                        value={value}
                        onChange={onChange}
                      >
                        {data.priceBooks.map(
                          (_team: { id: number; priceBookName: string }) => (
                            <MenuItem value={_team.id} key={_team.id}>
                              {_team.priceBookName}
                            </MenuItem>
                          )
                        )}
                      </Select>
                      {invalid && (
                        <FormHelperText sx={{ color: "#FF5630" }}>
                          {error?.message}
                        </FormHelperText>
                      )}
                    </Box>
                  )}
                />
              ) : (
                <Chip
                  variant="outlined"
                  label={settings.priceBookName}
                  color="primary"
                  size="small"
                  key={settings.priceBookId}
                  sx={{ textTransform: "capitalize" }}
                />
              )}
            </Grid>
            {/*  */}
            <Grid item lg={5} md={6} sm={12} xs={12}>
              <Typography variant="body1">Teams:</Typography>
            </Grid>
            <Grid item lg={7} md={6} sm={12} xs={12}>
              {edit ? (
                <Controller
                  name="teamIds"
                  control={methods.control}
                  render={({
                    field: { value, onChange },
                    fieldState: { invalid, error }
                  }) => (
                    <Box>
                      <Select
                        fullWidth
                        size="small"
                        displayEmpty
                        renderValue={
                          value?.length !== 0 ? undefined : () => "Select Teams"
                        }
                        multiple
                        value={value}
                        onChange={(e) => {
                          const _value = e.target.value;
                          onChange(
                            typeof _value === "string"
                              ? _value.split(",")
                              : _value
                          );
                        }}
                      >
                        {data.teams.map(
                          (_team: { id: number; teamName: string }) => (
                            <MenuItem value={_team.id} key={_team.id}>
                              {_team.teamName}
                            </MenuItem>
                          )
                        )}
                      </Select>
                      {invalid && (
                        <FormHelperText sx={{ color: "#FF5630" }}>
                          {error?.message}
                        </FormHelperText>
                      )}
                    </Box>
                  )}
                />
              ) : (
                <Stack
                  direction="row"
                  alignItems="center"
                  gap={1}
                  flexWrap="wrap"
                >
                  {settings.teams?.map((_team) => (
                    <Chip
                      variant="outlined"
                      label={_team.teamName}
                      color="primary"
                      size="small"
                      key={_team.id}
                    />
                  ))}
                </Stack>
              )}
            </Grid>
            <Grid item lg={5} md={6} sm={12} xs={12}>
              <Typography variant="body1">Share Progress Notes:</Typography>
            </Grid>
            <Grid item lg={7} md={6} sm={12} xs={12}>
              {edit ? (
                <Controller
                  name="isShareProgressNotes"
                  control={methods.control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox />}
                      label=""
                      {...field}
                      checked={field.value}
                    />
                  )}
                />
              ) : (
                <Iconify
                  icon={`eva:${
                    settings.isShareProgressNotes ? "checkmark" : "close"
                  }-fill`}
                ></Iconify>
              )}
            </Grid>
            <Grid item lg={5} md={6} sm={12} xs={12}>
              <Typography variant="body1">Invoice travel:</Typography>
            </Grid>
            <Grid item lg={7} md={6} sm={12} xs={12}>
              {edit ? (
                <Controller
                  name="isInvoiceTravel"
                  control={methods.control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox />}
                      label=""
                      {...field}
                      checked={field.value}
                    />
                  )}
                />
              ) : (
                <Iconify
                  icon={`eva:${
                    settings.isInvoiceTravel ? "checkmark" : "close"
                  }-fill`}
                ></Iconify>
              )}
            </Grid>
          </Grid>
        </FormProvider>
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
              onClick={methods.handleSubmit(onSubmit)}
            >
              Update
            </LoadingButton>
          </Stack>
        </>
      )}
    </StyledPaper>
  );
}
