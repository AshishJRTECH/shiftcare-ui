import { IStaff } from "@/interface/staff.interfaces";
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
import moment from "moment";
import React, { SyntheticEvent, useState } from "react";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Iconify from "../Iconify/Iconify";
import { useMutation } from "@tanstack/react-query";
import { updateProfilePhoto, updateStaff } from "@/api/functions/staff.api";
import VisuallyHiddenInput from "@/ui/VisuallyHiddenInput/VisuallyHiddenInput";
import { useParams } from "next/navigation";
import { queryClient } from "pages/_app";
import CustomInput from "@/ui/Inputs/CustomInput";
import { Controller, FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import validationText from "@/json/messages/validationText";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import EmailIcon from "@mui/icons-material/Email";
import InfoIcon from "@mui/icons-material/Info";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import { LoadingButton } from "@mui/lab";
import languages from "language-list";

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

const employment_list = ["Employee", "Contractor"];

const schema = yup.object().shape({
  salutation: yup.string(),
  name: yup.string().required(validationText.error.name),
  email: yup
    .string()
    .email(validationText.error.email_format)
    .trim()
    .required(validationText.error.enter_email),
  mobileNo: yup.string().trim().required(validationText.error.mobile),
  phoneNo: yup.string().trim().required(validationText.error.phone),
  gender: yup.string().trim().required(validationText.error.gender),
  dateOfBirth: yup.date().nullable().required(validationText.error.dob),
  employmentType: yup
    .string()
    .trim()
    .required(validationText.error.employment_type),
  address: yup.string().trim().required(validationText.error.address),
  languagesSpoken: yup.array().of(yup.string())
});

interface editStaffProfile {
  salutation: string;
  name: string;
  email: string;
  mobileNo: string;
  phoneNo: string;
  gender: string;
  dateOfBirth: Dayjs;
  employmentType: string;
  address: string;
  languagesSpoken: string[];
}

export default function Details({ staff }: { staff: IStaff }) {
  const [edit, setEdit] = useState(false);
  const [salutation, setSalutation] = useState(Boolean(staff?.salutation));

  const language_list = languages();

  const { id } = useParams();

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      salutation: staff?.salutation,
      name: staff?.name,
      email: staff?.email,
      mobileNo: staff?.mobileNo,
      phoneNo: staff?.phoneNo,
      gender: staff?.gender,
      dateOfBirth: dayjs(staff?.dateOfBirth),
      employmentType: staff?.employmentType,
      address: staff?.address,
      languagesSpoken: staff.languagesSpoken || []
    }
  });

  const { mutate } = useMutation({
    mutationFn: updateProfilePhoto,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff", id] })
  });

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: updateStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff", id] });
      setEdit(false);
    }
  });

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData();
    formData.append("file", e.target.files![0]);
    mutate({ file: formData, user: id.toString() });
  };

  const onSubmit = (data: editStaffProfile) => {
    updateProfile({
      id: id as string,
      data
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
            <Grid container spacing={{ lg: 3, md: 2, sm: 2, xs: 2 }}>
              <Grid item lg={3} md={12} sm={12} xs={12}>
                <Typography variant="body1">Name:</Typography>
              </Grid>
              <Grid item lg={9} md={12} sm={12} xs={12}>
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label="Use Salutation"
                  sx={{ ".MuiTypography-root": { fontSize: "14px" } }}
                  checked={salutation}
                  onChange={(e: SyntheticEvent<Element, Event>, checked) => {
                    setSalutation(checked);
                    methods.setValue("salutation", "");
                  }}
                />
                <Grid container spacing={{ lg: 2, md: 1, sm: 1, xs: 1 }}>
                  <Grid item lg={2} md={5} sm={12} xs={12}>
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
                            sx={{ fontSize: "14px" }}
                          >
                            {salutation_list.map((_salutation) => (
                              <MenuItem
                                value={_salutation}
                                key={_salutation}
                                sx={{ fontSize: "14px" }}
                              >
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
                  <Grid item lg={10} md={12} sm={12} xs={12}>
                    <CustomInput
                      fullWidth
                      name="name"
                      placeholder="Enter Name"
                      size="small"
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
                  size="small"
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
                <Typography variant="body1">Contact:</Typography>
              </Grid>
              <Grid item lg={9} md={12} sm={12} xs={12}>
                <Grid container spacing={{ lg: 2, md: 1, sm: 1, xs: 1 }}>
                  <Grid item lg={6} md={12} sm={12} xs={12}>
                    <CustomInput
                      fullWidth
                      name="phoneNo"
                      type="number"
                      placeholder="Enter Mobile Number"
                      size="small"
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
                      name="mobileNo"
                      type="number"
                      placeholder="Enter Phone Number"
                      size="small"
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
              <Grid item lg={6} md={12} sm={12} xs={12}>
                <Grid container spacing={{ lg: 0, md: 2, sm: 2, xs: 2 }}>
                  <Grid item lg={6.35} md={12} sm={12} xs={12}>
                    <Typography>Gender:</Typography>
                  </Grid>
                  <Grid item lg={5.65} md={12} sm={12} xs={12}>
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
                              <MenuItem
                                value={_salutation}
                                key={_salutation}
                                sx={{ fontSize: "14px" }}
                              >
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
                <Grid container gap={{ lg: 4, md: 2, sm: 2, xs: 2 }}>
                  <Grid
                    item
                    lg={3}
                    md={12}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Typography>Date of Birth:</Typography>
                  </Grid>
                  <Grid item lg={8} md={12} sm={12} xs={12}>
                    <Controller
                      control={methods.control}
                      name="dateOfBirth"
                      render={({
                        field: { value, onChange },
                        fieldState: { error, invalid }
                      }) => (
                        <Box>
                          <DatePicker
                            sx={{ width: "100%", fontSize: "14px" }}
                            className="date-picker"
                            value={value}
                            onChange={onChange}
                            slotProps={{
                              textField: {
                                size: "small"
                                // sx: {
                                //   fontSize: "14px"
                                // }
                              }
                            }}
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
                <Typography variant="body1">Employment Type:</Typography>
              </Grid>
              <Grid item lg={9} md={12} sm={12} xs={12}>
                <Controller
                  control={methods.control}
                  name="employmentType"
                  render={({
                    field: { value, onChange },
                    fieldState: { error, invalid }
                  }) => (
                    <Box>
                      <Select
                        fullWidth
                        displayEmpty
                        renderValue={
                          value !== ""
                            ? undefined
                            : () => "Select Employment Type"
                        }
                        value={value}
                        onChange={onChange}
                        defaultValue={""}
                        size="small"
                        sx={{ fontSize: "14px" }}
                      >
                        {employment_list.map((_salutation) => (
                          <MenuItem
                            value={_salutation}
                            key={_salutation}
                            sx={{ fontSize: "14px" }}
                          >
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
              <Grid item lg={3} md={12} sm={12} xs={12}>
                <Typography variant="body1">Address:</Typography>
              </Grid>
              <Grid item lg={9} md={12} sm={12} xs={12}>
                <CustomInput
                  fullWidth
                  name="address"
                  placeholder="Enter Address"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item lg={3} md={12} sm={12} xs={12}>
                <Typography variant="body1">Languages Spoken:</Typography>
              </Grid>
              <Grid item lg={9} md={12} sm={12} xs={12}>
                <Controller
                  control={methods.control}
                  name="languagesSpoken"
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
                        size="small"
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
                <Typography variant="body1">{staff.name}</Typography>
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
                  {staff.phoneNo ? (
                    <>
                      <Iconify icon="eva:smartphone-outline"></Iconify>
                      {staff.phoneNo}
                    </>
                  ) : null}{" "}
                  {staff.mobileNo ? (
                    <>
                      <Iconify icon="eva:phone-fill"></Iconify>
                      {staff.mobileNo}
                    </>
                  ) : null}{" "}
                  {staff.email ? (
                    <>
                      <Iconify icon="eva:email-fill"></Iconify>
                      {staff.email}
                    </>
                  ) : null}
                </Typography>
              </Grid>
              <Grid item lg={4} md={12} sm={12} xs={12}>
                <Typography variant="h6">Address</Typography>
              </Grid>
              <Grid item lg={8} md={12} sm={12} xs={12}>
                <Typography variant="body1">{staff.address}</Typography>
              </Grid>
              <Grid item lg={4} md={12} sm={12} xs={12}>
                <Typography variant="h6">Gender</Typography>
              </Grid>
              <Grid item lg={8} md={12} sm={12} xs={12}>
                <Typography variant="body1">{staff.gender}</Typography>
              </Grid>
              <Grid item lg={4} md={12} sm={12} xs={12}>
                <Typography variant="h6">Employment Type</Typography>
              </Grid>
              <Grid item lg={8} md={12} sm={12} xs={12}>
                <Typography variant="body1">{staff.employmentType}</Typography>
              </Grid>
              <Grid item lg={4} md={12} sm={12} xs={12}>
                <Typography variant="h6">DOB</Typography>
              </Grid>
              <Grid item lg={8} md={12} sm={12} xs={12}>
                <Typography variant="body1">
                  {moment(staff.dateOfBirth).format("DD-MM-YYYY")}
                </Typography>
              </Grid>
              <Grid item lg={4} md={12} sm={12} xs={12}>
                <Typography variant="h6">Language Spoken</Typography>
              </Grid>
              <Grid item lg={8} md={12} sm={12} xs={12}>
                <Typography variant="body1">
                  {staff.languagesSpoken.join(", ")}
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
                src={staff.photoDownloadURL}
                sx={{
                  width: "100%",
                  aspectRatio: 1,
                  height: "auto",
                  fontSize: "4rem"
                }}
              >
                {staff.name.charAt(0)}
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
