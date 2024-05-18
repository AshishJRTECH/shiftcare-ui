import {
  updateClientProfile,
  updateClientProfilePhoto
} from "@/api/functions/client.api";
import { ClientBody, IClient } from "@/interface/client.interface";
import validationText from "@/json/messages/validationText";
import CustomInput from "@/ui/Inputs/CustomInput";
import VisuallyHiddenInput from "@/ui/VisuallyHiddenInput/VisuallyHiddenInput";
import { yupResolver } from "@hookform/resolvers/yup";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Typography
} from "@mui/material";
import { Box, Stack, styled } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import { useMutation } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";
import languages from "language-list";
import moment from "moment";
import { useParams } from "next/navigation";
import { queryClient } from "pages/_app";
import React, { SyntheticEvent, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import Iconify from "../Iconify/Iconify";

const StyledDetailsBox = styled(Paper)`
  box-shadow: rgba(145, 158, 171, 0.2) 0px 5px 5px -3px,
    rgba(145, 158, 171, 0.14) 0px 8px 10px 1px,
    rgba(145, 158, 171, 0.12) 0px 3px 14px 2px;
  padding: 15px 20px;
  margin-top: 4px;
  margin-left: 3px;
  outline: 0;
  margin-top: 4px;
  margin-left: 6px;
  min-width: 4px;
  min-height: 4px;
  border-radius: 8px;

  .MuiInputBase-root {
    font-size: 14px;
  }

  .MuiBadge-badge {
    height: auto;
    padding: 7px 7px 6px 7px;
    border-radius: 50%;
    cursor: pointer;
    @media (max-width: 900px) {
      /* right: 46.5%; */
      /* padding: 5px 4px 4px 5px; */
      svg {
        /* width: 0.8em; */
        /* height: 0.8em; */
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
  middleName: yup.string(),
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
  language: yup.array().of(yup.string())
});

export default function Details({ client }: { client: IClient }) {
  const [edit, setEdit] = useState(false);
  const [salutation, setSalutation] = useState(Boolean(client?.salutation));

  const language_list = languages();

  const { id } = useParams();

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      salutation: client.salutation,
      firstName: client.firstName,
      middleName: client.middleName,
      lastName: client.lastName,
      gender: client.gender,
      dateOfBirth: dayjs(client.dateOfBirth) || null,
      apartmentNumber: client.apartmentNumber,
      address: client.address,
      contactNumber: client.contactNumber,
      mobileNumber: client.mobileNumber,
      email: client.email,
      religion: client.religion,
      maritalStatus: client.maritalStatus,
      nationality: client.nationality,
      language: client.language || []
    }
  });

  const { mutate } = useMutation({
    mutationFn: updateClientProfilePhoto,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["client", id] })
  });

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: updateClientProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client", id] });
      setEdit(false);
    }
  });

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData();
    formData.append("file", e.target.files![0]);
    mutate({ file: formData, id: id.toString() });
  };

  const onSubmit = (
    data: Omit<ClientBody, "dateOfBirth" | "prospect"> & {
      dateOfBirth: Dayjs | null;
    }
  ) => {
    updateProfile({
      id: id as string,
      data: { ...data, dateOfBirth: dayjs(data.dateOfBirth).toISOString() }
    });
  };

  return (
    <StyledDetailsBox>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ paddingBottom: "15px" }}
      >
        <Typography variant="h5">Demographic Detail</Typography>
        {!edit && (
          <Button size="small" onClick={() => setEdit(true)}>
            Edit
          </Button>
        )}
      </Stack>
      <Divider />
      {edit ? (
        <Box sx={{ paddingBlock: "15px" }}>
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
                            size="small"
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
                            size="small"
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
                            slotProps={{
                              textField: {
                                size: "small"
                              }
                            }}
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
                            size="small"
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
                        size="small"
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
            </Grid>
          </FormProvider>
        </Box>
      ) : (
        <Grid container sx={{ paddingTop: 2 }}>
          <Grid item lg={8} md={12} sm={12} xs={12}>
            <Grid container rowSpacing={3}>
              <Grid item lg={4} md={12} sm={12} xs={12}>
                <Typography variant="h6">Name</Typography>
              </Grid>
              <Grid item lg={8} md={12} sm={12} xs={12}>
                <Typography variant="body1">{client.displayName}</Typography>
              </Grid>
              <Grid item lg={4} md={12} sm={12} xs={12}>
                <Typography variant="h6">Contact</Typography>
              </Grid>
              <Grid item lg={8} md={12} sm={12} xs={12}>
                <Typography
                  variant="body1"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1
                  }}
                >
                  {client.contactNumber ? (
                    <>
                      <Iconify icon="eva:smartphone-outline"></Iconify>
                      {client.contactNumber}
                    </>
                  ) : null}{" "}
                  {client.mobileNumber ? (
                    <>
                      <Iconify icon="eva:phone-fill"></Iconify>
                      {client.mobileNumber}
                    </>
                  ) : null}{" "}
                  {client.email ? (
                    <>
                      <Iconify icon="eva:email-fill"></Iconify>
                      {client.email}
                    </>
                  ) : null}
                </Typography>
              </Grid>
              <Grid item lg={4} md={12} sm={12} xs={12}>
                <Typography variant="h6">Address</Typography>
              </Grid>
              <Grid item lg={8} md={12} sm={12} xs={12}>
                <Typography variant="body1">{client.address}</Typography>
                <Typography variant="body1">
                  <Iconify icon="solar:buildings-bold"></Iconify>
                  Unit/Appartment Number: {client.apartmentNumber}
                </Typography>
              </Grid>
              <Grid item lg={4} md={12} sm={12} xs={12}>
                <Typography variant="h6">Gender</Typography>
              </Grid>
              <Grid item lg={8} md={12} sm={12} xs={12}>
                <Typography variant="body1">{client.gender}</Typography>
              </Grid>
              <Grid item lg={4} md={12} sm={12} xs={12}>
                <Typography variant="h6">DOB</Typography>
              </Grid>
              <Grid item lg={8} md={12} sm={12} xs={12}>
                <Typography variant="body1">
                  {moment(client.dateOfBirth).format("DD-MM-YYYY")}
                </Typography>
              </Grid>
              <Grid item lg={4} md={12} sm={12} xs={12}>
                <Typography variant="h6">Marital Status</Typography>
              </Grid>
              <Grid item lg={8} md={12} sm={12} xs={12}>
                <Typography variant="body1">{client.maritalStatus}</Typography>
              </Grid>
              <Grid item lg={4} md={12} sm={12} xs={12}>
                <Typography variant="h6">Religion</Typography>
              </Grid>
              <Grid item lg={8} md={12} sm={12} xs={12}>
                <Typography variant="body1">{client.religion}</Typography>
              </Grid>
              <Grid item lg={4} md={12} sm={12} xs={12}>
                <Typography variant="h6">Nationality</Typography>
              </Grid>
              <Grid item lg={8} md={12} sm={12} xs={12}>
                <Typography variant="body1">{client.nationality}</Typography>
              </Grid>
              <Grid item lg={4} md={12} sm={12} xs={12}>
                <Typography variant="h6">Language Spoken</Typography>
              </Grid>
              <Grid item lg={8} md={12} sm={12} xs={12}>
                <Typography variant="body1">
                  {client.language?.join(", ")}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            lg={4}
            md={12}
            sm={12}
            xs={12}
            sx={{
              // lg: {
              padding: "20px"
              // }
            }}
          >
            <Badge
              sx={{ width: "100%" }}
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={<CameraAltIcon fontSize="small" />}
              component="label"
            >
              <Avatar
                src={client.photoDownloadURL || ""}
                sx={{
                  width: "100%",
                  aspectRatio: 1,
                  height: "auto",
                  fontSize: "4rem"
                }}
              >
                {client.displayName.charAt(0)}
              </Avatar>
              <VisuallyHiddenInput
                type="file"
                onChange={onPhotoChange}
                accept="image/*"
              />
            </Badge>
          </Grid>
        </Grid>
      )}
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
              variant="contained"
              size="small"
              loading={isPending}
              onClick={methods.handleSubmit(onSubmit)}
            >
              Update
            </LoadingButton>
          </Stack>
        </>
      )}
    </StyledDetailsBox>
  );
}
