import StyledPaper from "@/ui/Paper/Paper";
import styled from "@emotion/styled";
import {
  Button,
  Checkbox,
  DialogActions,
  Divider,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  Typography
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { useState } from "react";
import Iconify from "../Iconify/Iconify";
import { ClientContact, ClientContactBody } from "@/interface/client.interface";
import MuiModalWrapper from "@/ui/Modal/MuiModalWrapper";
import CustomInput from "@/ui/Inputs/CustomInput";
import * as yup from "yup";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import validationText from "@/json/messages/validationText";
import { useMutation } from "@tanstack/react-query";
import {
  deleteClientContact,
  updateClientContact
} from "@/api/functions/client.api";
import { queryClient } from "pages/_app";
import { useParams } from "next/navigation";
import { LoadingButton } from "@mui/lab";

const StyledGrid = styled(Grid)`
  padding-top: 15px;
  p {
    font-size: 14px;
    color: #222;
    &.left-title {
      color: #555;
    }
  }
`;

const salutation_list = [
  "Mr",
  "Mrs",
  "Miss",
  "Ms",
  "Mx",
  "Doctor",
  "Them",
  "They"
];

const schema = yup.object().shape({
  salutation: yup.string().nullable(),
  firstName: yup.string().required(validationText.error.firstName),
  lastName: yup.string().nullable(),
  email: yup.string().email().required(validationText.error.enter_email),
  address: yup.string().nullable(),
  apartmentNumber: yup.string().nullable(),
  mobileNumber: yup.string().nullable(),
  phoneNumber: yup.string().nullable(),
  relationship: yup.string().nullable(),
  companyName: yup.string().nullable(),
  companyNumber: yup.string().nullable(),
  purchaseOrder: yup.string().nullable(),
  referenceNumber: yup.string().nullable(),
  customField: yup.string().nullable(),
  primaryContact: yup.boolean(),
  billingContact: yup.boolean()
});

export default function ClientContacts({
  contact
}: {
  contact: ClientContact;
}) {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [salutation, setSalutation] = useState(false);

  const { id } = useParams();

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      salutation: contact.salutation,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      address: contact.address,
      apartmentNumber: contact.apartmentNumber,
      mobileNumber: contact.mobileNumber,
      phoneNumber: contact.phoneNumber,
      relationship: contact.relationship,
      companyName: contact.companyName,
      companyNumber: contact.companyNumber,
      purchaseOrder: contact.purchaseOrder,
      referenceNumber: contact.referenceNumber,
      customField: contact.customField,
      primaryContact: contact.primaryContact,
      billingContact: contact.billingContact
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateClientContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-contacts", id] });
      setEdit(false);
      setOpen(true);
    }
  });

  const { mutate: deleteMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteClientContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-contacts", id] });
      setEdit(false);
      setOpen(false);
    }
  });

  const onSubmit = (data: ClientContactBody) => {
    mutate({
      id: id.toString(),
      data: {
        ...data,
        contactId: contact.id,
        salutation: salutation ? data.salutation : null
      }
    });
  };

  return (
    <StyledPaper>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
      >
        <Typography variant="h5">Primary Contact</Typography>
        <Box>
          <Button size="small" variant="text" onClick={() => setOpen(true)}>
            View
          </Button>
          <Button size="small" variant="text" onClick={() => setEdit(true)}>
            Edit
          </Button>
        </Box>
      </Stack>
      <Divider sx={{ marginTop: "15px" }} />
      <StyledGrid container spacing={2}>
        <Grid item lg={3} md={5} sm={12} xs={12}>
          <Typography variant="body1" className="left-title">
            Full Name:
          </Typography>
        </Grid>
        <Grid item lg={9} md={7} sm={12} xs={12}>
          <Typography variant="body1">
            {contact.firstName} {contact.lastName}
          </Typography>
        </Grid>
        <Grid item lg={3} md={5} sm={12} xs={12}>
          <Typography variant="body1" className="left-title">
            Relation:
          </Typography>
        </Grid>
        <Grid item lg={9} md={7} sm={12} xs={12}>
          <Typography variant="body1">{contact.relationship}</Typography>
        </Grid>
        <Grid item lg={3} md={5} sm={12} xs={12}>
          <Typography variant="body1" className="left-title">
            Contact:
          </Typography>
        </Grid>
        <Grid item lg={9} md={7} sm={12} xs={12}>
          <Typography
            variant="body1"
            sx={{
              marginBottom: "5px",
              display: "flex",
              alignItems: "center",
              gap: "5px"
            }}
          >
            <Iconify icon="eva:smartphone-outline"></Iconify>
            {contact.mobileNumber}
          </Typography>
          <Typography
            variant="body1"
            sx={{ display: "flex", alignItems: "center", gap: "5px" }}
          >
            <Iconify icon="eva:phone-fill"></Iconify>
            {contact.phoneNumber}
          </Typography>
        </Grid>
        <Grid item lg={3} md={5} sm={12} xs={12}>
          <Typography variant="body1" className="left-title">
            Email:
          </Typography>
        </Grid>
        <Grid item lg={9} md={7} sm={12} xs={12}>
          <Typography variant="body1">{contact.email}</Typography>
        </Grid>
      </StyledGrid>
      <MuiModalWrapper
        title="Contact"
        fullWidth
        fullScreen={false}
        maxWidth="md"
        open={open || edit}
        onClose={() => {
          setOpen(false);
          setEdit(false);
        }}
        DialogActions={
          <DialogActions sx={{ paddingLeft: "15px" }}>
            <Stack direction="row" alignItems="center" gap={2} sx={{ flex: 1 }}>
              <LoadingButton
                variant="contained"
                color="error"
                sx={{ marginRight: "auto" }}
                onClick={() =>
                  deleteMutation({ id: id.toString(), contact_id: contact.id })
                }
                loading={isDeleting}
              >
                Delete
              </LoadingButton>
              <Button variant="outlined">Cancel</Button>
              <LoadingButton
                variant="contained"
                onClick={() =>
                  edit ? methods.handleSubmit(onSubmit)() : setEdit(true)
                }
                loading={isPending}
              >
                {edit ? "Update" : "Edit"}
              </LoadingButton>
            </Stack>
          </DialogActions>
        }
      >
        {!edit ? (
          <StyledGrid container spacing={2} rowSpacing={4}>
            <Grid item lg={3} md={4} sm={12} xs={12}>
              <Typography variant="body1" className="left-title">
                Full Name:
              </Typography>
            </Grid>
            <Grid item lg={9} md={8} sm={12} xs={12}>
              {contact.firstName} {contact.lastName}
            </Grid>
            <Grid item lg={3} md={4} sm={12} xs={12}>
              <Typography variant="body1" className="left-title">
                Relation:
              </Typography>
            </Grid>
            <Grid item lg={9} md={8} sm={12} xs={12}>
              {contact.relationship}
            </Grid>
            <Grid item lg={3} md={4} sm={12} xs={12}>
              <Typography variant="body1" className="left-title">
                Address:
              </Typography>
            </Grid>
            <Grid item lg={9} md={8} sm={12} xs={12}>
              {contact.address}
            </Grid>
            <Grid item lg={3} md={4} sm={12} xs={12}>
              <Typography variant="body1" className="left-title">
                Contact:
              </Typography>
            </Grid>
            <Grid item lg={9} md={8} sm={12} xs={12}>
              <Stack
                direction="row"
                alignItems="center"
                gap={2}
                flexWrap="wrap"
              >
                <Typography
                  variant="body1"
                  sx={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <Iconify icon="eva:smartphone-outline"></Iconify>
                  {contact.mobileNumber}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <Iconify icon="eva:phone-fill"></Iconify>
                  {contact.phoneNumber}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <Iconify icon="eva:email-fill"></Iconify>
                  {contact.email}
                </Typography>
              </Stack>
            </Grid>
            <Grid item lg={3} md={4} sm={12} xs={12}>
              <Typography variant="body1" className="left-title">
                Company information:
              </Typography>
            </Grid>
            <Grid item lg={9} md={8} sm={12} xs={12}>
              {contact.companyName} - {contact.companyNumber}
            </Grid>
            <Grid item lg={3} md={4} sm={12} xs={12}>
              <Typography variant="body1" className="left-title">
                Purchase Order:
              </Typography>
            </Grid>
            <Grid item lg={9} md={8} sm={12} xs={12}>
              {contact.purchaseOrder}
            </Grid>
            <Grid item lg={3} md={4} sm={12} xs={12}>
              <Typography variant="body1" className="left-title">
                Reference Number:
              </Typography>
            </Grid>
            <Grid item lg={9} md={8} sm={12} xs={12}>
              {contact.referenceNumber}
            </Grid>
            <Grid item lg={3} md={4} sm={12} xs={12}>
              <Typography variant="body1" className="left-title">
                Custom Field:
              </Typography>
            </Grid>
            <Grid item lg={9} md={8} sm={12} xs={12}>
              {contact.customField}
            </Grid>
          </StyledGrid>
        ) : (
          <FormProvider {...methods}>
            <StyledGrid container spacing={2} rowSpacing={4}>
              <Grid item lg={3} md={4} sm={12} xs={12}>
                <Typography variant="body1" className="left-title">
                  Full Name:
                </Typography>
              </Grid>
              <Grid item lg={9} md={8} sm={12} xs={12}>
                <Grid container spacing={2}>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={salutation}
                            size="small"
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setSalutation(e.target.checked);
                            }}
                          />
                        }
                        label="Use salutation"
                      />
                    </Box>
                    <Controller
                      name="salutation"
                      control={methods.control}
                      render={({ field }) => (
                        <Select
                          size="small"
                          fullWidth
                          displayEmpty
                          renderValue={
                            field.value !== ""
                              ? undefined
                              : () => "Select Salutation"
                          }
                          {...field}
                          disabled={!salutation}
                          defaultValue={salutation ? salutation_list[0] : ""}
                        >
                          {salutation_list.map((_salutation) => (
                            <MenuItem value={_salutation} key={_salutation}>
                              {_salutation}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </Grid>
                  <Grid item lg={6} md={12} sm={12} xs={12}>
                    <CustomInput
                      name="firstName"
                      placeholder="Enter First Name"
                    />
                  </Grid>
                  <Grid item lg={6} md={12} sm={12} xs={12}>
                    <CustomInput
                      name="lastName"
                      placeholder="Enter Last Name"
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item lg={3} md={4} sm={12} xs={12}>
                <Typography variant="body1" className="left-title">
                  Email:
                </Typography>
              </Grid>
              <Grid item lg={9} md={8} sm={12} xs={12}>
                <CustomInput name="email" placeholder="Enter Email" />
              </Grid>
              <Grid item lg={3} md={4} sm={12} xs={12}>
                <Typography variant="body1" className="left-title">
                  Address:
                </Typography>
              </Grid>
              <Grid item lg={9} md={8} sm={12} xs={12}>
                <CustomInput name="address" placeholder="Enter Address" />
              </Grid>
              <Grid item lg={3} md={4} sm={12} xs={12}>
                <Typography variant="body1" className="left-title">
                  Unit/Apartment Number:
                </Typography>
              </Grid>
              <Grid item lg={9} md={8} sm={12} xs={12}>
                <CustomInput
                  name="apartmentNumber"
                  placeholder="Enter Unit Number"
                />
              </Grid>
              <Grid item lg={3} md={4} sm={12} xs={12}>
                <Typography variant="body1" className="left-title">
                  Contact:
                </Typography>
              </Grid>
              <Grid item lg={9} md={8} sm={12} xs={12}>
                <Grid container spacing={2}>
                  <Grid item lg={6} md={12} sm={12} xs={12}>
                    <CustomInput
                      name="mobileNumber"
                      placeholder="Enter Phone Number"
                    />
                  </Grid>
                  <Grid item lg={6} md={12} sm={12} xs={12}>
                    <CustomInput
                      name="phoneNumber"
                      placeholder="Enter Mobile Number"
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item lg={3} md={4} sm={12} xs={12}>
                <Typography variant="body1" className="left-title">
                  Relation:
                </Typography>
              </Grid>
              <Grid item lg={9} md={8} sm={12} xs={12}>
                <CustomInput name="relationship" placeholder="Enter Relation" />
              </Grid>
              <Grid item lg={3} md={4} sm={12} xs={12}>
                <Typography variant="body1" className="left-title">
                  Company Name:
                </Typography>
              </Grid>
              <Grid item lg={9} md={8} sm={12} xs={12}>
                <CustomInput
                  name="companyName"
                  placeholder="Enter Company Name"
                />
              </Grid>
              <Grid item lg={3} md={4} sm={12} xs={12}>
                <Typography variant="body1" className="left-title">
                  Company Number:
                </Typography>
              </Grid>
              <Grid item lg={9} md={8} sm={12} xs={12}>
                <CustomInput
                  name="companyNumber"
                  placeholder="Enter Compnay Number"
                />
              </Grid>
              <Grid item lg={3} md={4} sm={12} xs={12}>
                <Typography variant="body1" className="left-title">
                  Purchase Order:
                </Typography>
              </Grid>
              <Grid item lg={9} md={8} sm={12} xs={12}>
                <CustomInput
                  name="purchaseOrder"
                  placeholder="Enter Purchase Order"
                />
              </Grid>
              <Grid item lg={3} md={4} sm={12} xs={12}>
                <Typography variant="body1" className="left-title">
                  Reference Number:
                </Typography>
              </Grid>
              <Grid item lg={9} md={8} sm={12} xs={12}>
                <CustomInput
                  name="referenceNumber"
                  placeholder="Enter Reference Number"
                />
              </Grid>
              <Grid item lg={3} md={4} sm={12} xs={12}>
                <Typography variant="body1" className="left-title">
                  Custom Field:
                </Typography>
              </Grid>
              <Grid item lg={9} md={8} sm={12} xs={12}>
                <CustomInput
                  name="customField"
                  placeholder="Enter Custom Field"
                />
              </Grid>
              <Grid item lg={3} md={4} sm={12} xs={12}>
                <Typography variant="body1" className="left-title">
                  Primary Contact:
                </Typography>
              </Grid>
              <Grid item lg={9} md={8} sm={12} xs={12}>
                <Controller
                  name="primaryContact"
                  control={methods.control}
                  render={({ field }) => (
                    <Checkbox {...field} checked={field.value} size="small" />
                  )}
                />
              </Grid>
              <Grid item lg={3} md={4} sm={12} xs={12}>
                <Typography variant="body1" className="left-title">
                  Billing Contact:
                </Typography>
              </Grid>
              <Grid item lg={9} md={8} sm={12} xs={12}>
                <Controller
                  name="billingContact"
                  control={methods.control}
                  render={({ field }) => (
                    <Checkbox {...field} checked={field.value} size="small" />
                  )}
                />
              </Grid>
            </StyledGrid>
          </FormProvider>
        )}
      </MuiModalWrapper>
    </StyledPaper>
  );
}
