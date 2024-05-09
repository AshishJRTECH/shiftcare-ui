import { UserData } from "@/interface/common.interface";
import validationText from "@/json/messages/validationText";
import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import { getCookie } from "@/lib/functions/storage.lib";
import { roleParser } from "@/lib/functions/_helpers.lib";
import CustomInput from "@/ui/Inputs/CustomInput";
import VisuallyHiddenInput from "@/ui/VisuallyHiddenInput/VisuallyHiddenInput";
import styled from "@emotion/styled";
import { yupResolver } from "@hookform/resolvers/yup";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Avatar,
  Badge,
  Button,
  Divider,
  FormHelperText,
  FormLabel,
  Grid,
  List,
  ListItem,
  Paper,
  Typography
} from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import { Controller, FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import useUser from "@/hooks/react-query/useUser";
import { useEffect, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  changePasswordMutation,
  changePasswordPayload,
  updateProfileDetails,
  updateProfilePayload,
  updateProfilePhoto
} from "@/api/functions/user.api";
import moment from "moment";
import dayjs, { Dayjs } from "dayjs";
import { queryClient } from "pages/_app";

const StyledPaper = styled(Paper)`
  border-radius: 16px;
  box-shadow: rgba(145, 158, 171, 0.2) 0px 0px 2px 0px,
    rgba(145, 158, 171, 0.12) 0px 12px 24px -4px;
  background-image: none;
  overflow: hidden;
  position: relative;
  z-index: 0;
  height: 290px;
  margin-bottom: 24px;

  .inner-box {
    height: 100%;
    background: linear-gradient(rgba(0, 75, 80, 0.8), rgba(0, 75, 80, 0.8)),
      url(https://api-prod-minimal-v510.vercel.app/assets/images/cover/cover_4.jpg);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    .info {
      left: 24px;
      bottom: 24px;
      z-index: 10;
      padding-top: 0;
      position: absolute;
      @media (max-width: 900px) {
        padding-top: 65px;
        flex-direction: column;
        position: static;
      }
      .MuiBadge-badge {
        height: auto;
        padding: 7px 6px 6px 7px;
        border-radius: 50%;
        cursor: pointer;
        @media (max-width: 900px) {
          right: 46.5%;
          padding: 5px 4px 4px 5px;
          svg {
            width: 0.8em;
            height: 0.8em;
          }
        }
      }
      .MuiAvatar-root {
        border: 2px solid rgb(255, 255, 255);
        margin-inline: auto;
        height: 128px;
        width: 128px;
        @media (max-width: 900px) {
          width: 64px;
          height: 64px;
        }
      }
      ul {
        flex: 1 1 auto;
        min-width: 0px;
        margin: 24px 0px 0px;
        @media (min-width: 900px) {
          margin-left: 24px;
          text-align: unset;
        }
        .name {
          margin: 0;
          font-weight: 700;
          color: #fff;
          padding: 0;
          display: block;
          @media (min-width: 600px) {
            font-size: 1.5rem;
          }
          @media (min-width: 1200px) {
            font-size: 2rem;
          }
          @media (max-width: 900px) {
            text-align: center;
          }
        }
        li:not(.name) {
          padding: 0;
          margin: 4px 0px 0px;
          color: #fff;
          line-height: 1.57143;
          font-size: 1rem;
          opacity: 0.48;
          display: block;
          @media (max-width: 900px) {
            text-align: center;
          }
        }
      }
    }
  }
`;

const StyledForm = styled(Box)`
  background-color: #fff;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 24px;
  h5 {
    margin-bottom: 30px;
  }
  hr {
    margin-block: 20px;
  }
`;

const schema = yup.object().shape({
  name: yup.string().trim().required(validationText.error.fullName),
  dateOfBirth: yup
    .date()
    .typeError(validationText.error.dob)
    .required(validationText.error.dob),
  mobileNo: yup.string().trim().required(validationText.error.mobile),
  phoneNo: yup.string().trim().required(validationText.error.phone)
});

const changePasswordSchema = yup.object().shape({
  currentPassword: yup.string().required(validationText.error.currentPassword),
  newPassword: yup.string().required(validationText.error.newPassword),
  reEnteredPassword: yup.string().required(validationText.error.confirmPassword)
});

interface localUpdateProfileType
  extends Omit<updateProfilePayload, "dateOfBirth"> {
  dateOfBirth: Dayjs | null;
}

export default function Index() {
  const user = useUser();

  const methods = useForm<localUpdateProfileType>({
    resolver: yupResolver(schema)
  });

  const passwordMethods = useForm({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      reEnteredPassword: ""
    }
  });

  useEffect(() => {
    if (!user.isLoading) {
      methods.setValue("name", user?.data?.data?.name);
      methods.setValue(
        "dateOfBirth",
        user?.data?.data?.dateOfBirth
          ? dayjs(user?.data?.data?.dateOfBirth)
          : null
      );
      methods.setValue("mobileNo", user?.data?.data?.mobileNo || "");
      methods.setValue("phoneNo", user?.data?.data?.phoneNo || "");
    }
  }, [user.isLoading]);

  const { mutate: passwordMutate, isPending } = useMutation({
    mutationFn: changePasswordMutation,
    onSuccess: () =>
      passwordMethods.reset({
        currentPassword: "",
        newPassword: "",
        reEnteredPassword: ""
      })
  });

  const { mutate, isPending: isProfileUpdating } = useMutation({
    mutationFn: updateProfileDetails,
    onSuccess: () => {
      user.refetch();
    }
  });

  const { mutate: profilePhotoMutate, isPending: isPhotoUpdatePending } =
    useMutation({
      mutationFn: updateProfilePhoto,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["userdetails"] });
      }
    });

  const onPasswordSubmit = (data: changePasswordPayload) => {
    passwordMutate(data);
  };

  const updatePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      profilePhotoMutate(formData);
    }
  };

  const onSubmit = (data: localUpdateProfileType) => {
    const date = dayjs(data.dateOfBirth).toISOString();
    mutate({
      ...data,
      dateOfBirth: date
    });
  };

  return (
    <DashboardLayout isLoading={user.isLoading}>
      <Container>
        <StyledPaper elevation={0}>
          <Box className="inner-box">
            <Stack direction="row" className="info">
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={<CameraAltIcon fontSize="small" />}
                component="label"
              >
                <Avatar src={user?.data?.data.photoDownloadURL}>
                  {user?.data?.data?.name.charAt(0)}
                </Avatar>
                <VisuallyHiddenInput type="file" onChange={updatePhoto} />
              </Badge>
              <List disablePadding>
                <ListItem disableGutters className="name">
                  {user?.data?.data?.name}
                </ListItem>
                <ListItem disableGutters>
                  {roleParser(user?.data?.data?.role?.[0].name || "")}
                </ListItem>
              </List>
            </Stack>
          </Box>
        </StyledPaper>
        <StyledForm>
          <Typography variant="h5">Edit Details</Typography>
          <FormProvider {...methods}>
            <Grid container spacing={4}>
              <Grid item lg={6} md={6} sm={6} xs={12}>
                <CustomInput
                  name="name"
                  type="text"
                  label="Full Name"
                  size="small"
                />
              </Grid>
              <Grid item lg={6} md={6} sm={6} xs={12}>
                <Controller
                  name="dateOfBirth"
                  control={methods.control}
                  render={({
                    field: { value, onChange },
                    fieldState: { invalid, error }
                  }) => (
                    <Box>
                      <FormLabel
                        sx={{
                          fontSize: "14px",
                          display: "block",
                          marginBottom: "5px"
                        }}
                      >
                        Date of Birth
                      </FormLabel>
                      <DatePicker
                        value={value}
                        onChange={onChange}
                        slotProps={{
                          textField: { size: "small", fullWidth: true }
                        }}
                      />
                      {invalid && (
                        <FormHelperText
                          sx={{
                            color: "#FF5630",
                            marginTop: "4px",
                            marginInline: "14px"
                          }}
                        >
                          {error?.message}
                        </FormHelperText>
                      )}
                    </Box>
                  )}
                />
              </Grid>
              <Grid item lg={6} md={6} sm={6} xs={12}>
                <CustomInput
                  name="mobileNo"
                  type="number"
                  label="Mobile"
                  size="small"
                />
              </Grid>
              <Grid item lg={6} md={6} sm={6} xs={12}>
                <CustomInput
                  name="phoneNo"
                  type="number"
                  label="Phone"
                  size="small"
                />
              </Grid>
              {/* <Grid item lg={12}> */}
              {/* <CustomInput type="text" label="Account Owner" size="small" /> */}
              {/* </Grid> */}
            </Grid>
          </FormProvider>
          <Divider />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            gap={2}
          >
            <Button
              variant="outlined"
              size="small"
              disabled={isProfileUpdating}
              onClick={() =>
                methods.reset({
                  name: user?.data?.data?.name,
                  dateOfBirth: dayjs(user?.data?.data?.dateOfBirth) || null,
                  mobileNo: user?.data?.data?.mobileNo || "",
                  phoneNo: user?.data?.data?.phoneNo || ""
                })
              }
            >
              Discard
            </Button>
            <LoadingButton
              variant="contained"
              size="small"
              onClick={methods.handleSubmit(onSubmit)}
              loading={isProfileUpdating}
            >
              Save Changes
            </LoadingButton>
          </Stack>
        </StyledForm>
        <StyledForm>
          <Typography variant="h5">Change Password</Typography>
          <FormProvider {...passwordMethods}>
            <Grid container spacing={3}>
              <Grid item lg={12}>
                <CustomInput
                  type="text"
                  label="Current Password"
                  size="small"
                  name="currentPassword"
                />
              </Grid>
              <Grid item lg={12}>
                <CustomInput
                  type="text"
                  label="New Password"
                  size="small"
                  name="newPassword"
                />
              </Grid>
              <Grid item lg={12}>
                <CustomInput
                  type="text"
                  label="Confirm Password"
                  size="small"
                  name="reEnteredPassword"
                />
              </Grid>
            </Grid>
          </FormProvider>
          <Divider />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            gap={2}
          >
            <LoadingButton
              variant="contained"
              size="small"
              onClick={passwordMethods.handleSubmit(onPasswordSubmit)}
              loading={isPending}
            >
              Save
            </LoadingButton>
          </Stack>
        </StyledForm>
      </Container>
    </DashboardLayout>
  );
}
