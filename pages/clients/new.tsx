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
  Select,
  ToggleButtonGroup,
  Tooltip,
  Typography
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { SyntheticEvent, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
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
import { useMutation } from "@tanstack/react-query";
import { addClient } from "@/api/functions/client.api";
import { ClientBody } from "@/interface/client.interface";
import { useRouter } from "next/router";

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

const gender_list = [
  "Male",
  "Female",
  "Intersex",
  "Non-binary",
  "Unspecified",
  "Prefer not to say"
];

const marital_status = [
  "Single",
  "Married",
  "DeFacto",
  "Divorced",
  "Separated",
  "Widowed"
];

const schema = yup.object().shape({
  salutation: yup.string(),
  firstName: yup.string().trim().required(validationText.error.firstName),
  middleName: yup.string().trim().required(validationText.error.middleNames),
  lastName: yup.string().trim().required(validationText.error.lastName),
  gender: yup.string().trim().required(validationText.error.gender),
  dateOfBirth: yup.date().required(validationText.error.dob),
  apartmentNumber: yup.string().trim().required(validationText.error.apartment),
  address: yup.string().trim().required(validationText.error.address),
  contactNumber: yup.string().trim().required(validationText.error.phone),
  mobileNumber: yup.string().trim().required(validationText.error.mobile),
  email: yup.string().email().trim().required(validationText.error.enter_email),
  religion: yup.string().trim().required(validationText.error.religion),
  maritalStatus: yup
    .string()
    .trim()
    .required(validationText.error.maritalStatus),
  nationality: yup.string().trim().required(validationText.error.nationality),
  language: yup.array().of(yup.string()),
  prospect: yup.boolean()
});

export default function Index() {
  const [salutation, setSalutation] = useState(true);
  const router = useRouter();

  const language_list = languages();

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      salutation: "",
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "",
      dateOfBirth: null,
      apartmentNumber: "",
      address: "",
      contactNumber: "",
      mobileNumber: "",
      email: "",
      religion: "",
      maritalStatus: "",
      nationality: "",
      language: [],
      prospect: false
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: addClient,
    onSuccess: router.back
  });

  console.log(methods.formState.errors);

  const onSubmit = (
    data: Omit<ClientBody, "dateOfBirth"> & { dateOfBirth: Dayjs | null }
  ) => {
    mutate({ ...data, dateOfBirth: dayjs(data.dateOfBirth).toISOString() });
  };

  return (
    <DashboardLayout>
      <StyledBox>
        <Typography variant="h4">Add New Client</Typography>
        <Box className="inner-container">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            className="header"
          >
            <Typography variant="h5">Client detail</Typography>
          </Stack>
          <Divider />
          <FormProvider {...methods}>
            <Grid container spacing={2}>
              <Grid item lg={3} md={12} sm={12} xs={12}>
                <Typography variant="body1">Name:</Typography>
              </Grid>
              <Grid item lg={9} md={12} sm={12} xs={12}>
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label="Use Salutation"
                  checked={salutation}
                  onChange={(e: SyntheticEvent<Element, Event>, checked) => {
                    setSalutation(checked);
                    methods.setValue("salutation", "");
                  }}
                />
                <Grid container spacing={2}>
                  <Grid item lg={3} md={3} sm={5} xs={12}>
                    <Controller
                      control={methods.control}
                      name="salutation"
                      render={({
                        field: { value, onChange },
                        fieldState: { invalid, error }
                      }) => (
                        <Box>
                          <Select
                            fullWidth
                            displayEmpty
                            renderValue={
                              value !== ""
                                ? undefined
                                : () => "Select Salutation"
                            }
                            value={value}
                            onChange={onChange}
                            disabled={!salutation}
                            defaultValue={salutation ? salutation_list[0] : ""}
                          >
                            {salutation_list.map((_salutation) => (
                              <MenuItem value={_salutation} key={_salutation}>
                                {_salutation}
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
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Grid container spacing={2}>
                      <Grid item lg={4} md={12} sm={12} xs={12}>
                        <CustomInput
                          fullWidth
                          name="firstName"
                          placeholder="Enter First Name"
                        />
                      </Grid>
                      <Grid item lg={4} md={12} sm={12} xs={12}>
                        <CustomInput
                          fullWidth
                          name="middleName"
                          placeholder="Enter Middle Name"
                        />
                      </Grid>
                      <Grid item lg={4} md={12} sm={12} xs={12}>
                        <CustomInput
                          fullWidth
                          name="lastName"
                          placeholder="Enter Last Name"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item lg={6} md={12} sm={12} xs={12}>
                <Grid container spacing={{ lg: 0, md: 2, sm: 2, xs: 2 }}>
                  <Grid item lg={6.15} md={12} sm={12} xs={12}>
                    <Typography>Gender:</Typography>
                  </Grid>
                  <Grid item lg={5.85} md={12} sm={12} xs={12}>
                    <Controller
                      control={methods.control}
                      name="gender"
                      render={({
                        field: { value, onChange },
                        fieldState: { error, invalid }
                      }) => (
                        <Box>
                          <Select
                            fullWidth
                            displayEmpty
                            renderValue={
                              value !== "" ? undefined : () => "Select Gender"
                            }
                            value={value}
                            onChange={onChange}
                            defaultValue={""}
                          >
                            {gender_list.map((_salutation) => (
                              <MenuItem value={_salutation} key={_salutation}>
                                {_salutation}
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
                  </Grid>
                </Grid>
              </Grid>
              <Grid item lg={6} md={12} sm={12} xs={12}>
                <Grid container spacing={{ lg: 0, md: 2, sm: 2, xs: 2 }}>
                  <Grid
                    item
                    lg={3}
                    md={12}
                    sm={12}
                    xs={12}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Typography>Date of Birth:</Typography>
                  </Grid>
                  <Grid item lg={9} md={12} sm={12} xs={12}>
                    <Controller
                      control={methods.control}
                      name="dateOfBirth"
                      render={({
                        field: { value, onChange },
                        fieldState: { error, invalid }
                      }) => (
                        <Box>
                          <DatePicker
                            sx={{ width: "100%" }}
                            className="date-picker"
                            value={value}
                            onChange={onChange}
                            maxDate={dayjs().subtract(18, "years")}
                          />
                          {invalid && (
                            <FormHelperText sx={{ color: "#FF5630" }}>
                              {error?.message}
                            </FormHelperText>
                          )}
                        </Box>
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item lg={3} md={12} sm={12} xs={12}>
                <Typography variant="body1">Address:</Typography>
              </Grid>
              <Grid item lg={9} md={12} sm={12} xs={12}>
                <CustomInput
                  fullWidth
                  name="address"
                  placeholder="Enter Address"
                />
              </Grid>
              <Grid item lg={3} md={12} sm={12} xs={12}>
                <Typography variant="body1">Unit/Apartment Number:</Typography>
              </Grid>
              <Grid item lg={9} md={12} sm={12} xs={12}>
                <CustomInput
                  fullWidth
                  name="apartmentNumber"
                  placeholder="Enter Unit Number"
                />
              </Grid>
              <Grid item lg={3} md={12} sm={12} xs={12}>
                <Typography variant="body1">Contact:</Typography>
              </Grid>
              <Grid item lg={9} md={12} sm={12} xs={12}>
                <Grid container spacing={2}>
                  <Grid item lg={6} md={12} sm={12} xs={12}>
                    <CustomInput
                      fullWidth
                      name="contactNumber"
                      type="number"
                      placeholder="Enter Mobile Number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIphoneIcon fontSize="small" />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item lg={6} md={12} sm={12} xs={12}>
                    <CustomInput
                      fullWidth
                      name="mobileNumber"
                      type="number"
                      placeholder="Enter Phone Number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon fontSize="small" />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item lg={3} md={12} sm={12} xs={12}>
                <Typography variant="body1">Email:</Typography>
              </Grid>
              <Grid item lg={9} md={12} sm={12} xs={12}>
                <CustomInput
                  fullWidth
                  name="email"
                  placeholder="Enter Email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item lg={3} md={12} sm={12} xs={12}>
                <Typography variant="body1">Religion:</Typography>
              </Grid>
              <Grid item lg={9} md={12} sm={12} xs={12}>
                <CustomInput
                  fullWidth
                  name="religion"
                  placeholder="Enter Your Religion"
                />
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Grid container>
                  <Grid item lg={3} md={12} sm={12} xs={12}>
                    <Typography>Marital Status:</Typography>
                  </Grid>
                  <Grid item lg={3} md={12} sm={12} xs={12}>
                    <Controller
                      control={methods.control}
                      name="maritalStatus"
                      render={({
                        field: { value, onChange },
                        fieldState: { error, invalid }
                      }) => (
                        <Box>
                          <Select
                            fullWidth
                            displayEmpty
                            renderValue={
                              value !== "" ? undefined : () => "Select"
                            }
                            value={value}
                            onChange={onChange}
                            defaultValue={""}
                          >
                            {marital_status.map((_salutation) => (
                              <MenuItem value={_salutation} key={_salutation}>
                                {_salutation}
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
                  </Grid>
                </Grid>
              </Grid>
              <Grid item lg={3} md={12} sm={12} xs={12}>
                <Typography variant="body1">Nationality:</Typography>
              </Grid>
              <Grid item lg={9} md={12} sm={12} xs={12}>
                <CustomInput
                  fullWidth
                  name="nationality"
                  placeholder="Enter Your Nationality"
                />
              </Grid>
              <Grid item lg={3} md={12} sm={12} xs={12}>
                <Typography variant="body1">Languages Spoken:</Typography>
              </Grid>
              <Grid item lg={9} md={12} sm={12} xs={12}>
                <Controller
                  control={methods.control}
                  name="language"
                  render={({
                    field: { value, onChange },
                    fieldState: { error, invalid }
                  }) => (
                    <Box>
                      <Select
                        fullWidth
                        displayEmpty
                        renderValue={
                          value?.length !== 0
                            ? undefined
                            : () => "Select Languages"
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
                        {language_list
                          .getData()
                          .map(
                            (_language: { language: string; code: string }) => (
                              <MenuItem
                                value={_language.language}
                                key={_language.code}
                                sx={{ fontSize: "14px" }}
                              >
                                {_language.language}
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
              </Grid>
              <Grid item lg={3} md={12} sm={12} xs={12}>
                Client Status:
              </Grid>
              <Grid item lg={9} md={12} sm={12} xs={12}>
                <Controller
                  name="prospect"
                  control={methods.control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Client is a prospect"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </FormProvider>
          <Divider />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            className="footer"
            spacing={2}
          >
            <Button variant="outlined" disabled={isPending}>
              Cancel
            </Button>
            <LoadingButton
              variant="contained"
              onClick={methods.handleSubmit(onSubmit)}
              loading={isPending}
            >
              Create
            </LoadingButton>
          </Stack>
        </Box>
      </StyledBox>
    </DashboardLayout>
  );
}
