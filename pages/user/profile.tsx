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
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  changePasswordMutation,
  changePasswordPayload
} from "@/api/functions/user.api";

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
      @media (min-width: 900px) {
        left: 24px;
        bottom: 24px;
        z-index: 10;
        padding-top: 0;
        position: absolute;
      }
      .MuiBadge-badge {
        height: auto;
        padding: 7px 6px 6px 7px;
        border-radius: 50%;
        cursor: pointer;
      }
      .MuiAvatar-root {
        border: 2px solid rgb(255, 255, 255);
        margin-inline: auto;
        @media (min-width: 900px) {
          height: 128px;
          width: 128px;
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
          @media (min-width: 600px) {
            font-size: 1.5rem;
          }
          @media (min-width: 1200px) {
            font-size: 2rem;
          }
        }
        li:not(.name) {
          padding: 0;
          margin: 4px 0px 0px;
          color: #fff;
          line-height: 1.57143;
          font-size: 1rem;
          opacity: 0.48;
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
  dob: yup.date().required(validationText.error.dob),
  mobileNo: yup.string().trim().required(validationText.error.mobile),
  phoneNo: yup.string().trim().required(validationText.error.phone)
});

const changePasswordSchema = yup.object().shape({
  currentPassword: yup.string().required(validationText.error.currentPassword),
  newPassword: yup.string().required(validationText.error.newPassword),
  reEnteredPassword: yup.string().required(validationText.error.confirmPassword)
});

export default function Index() {
  const user = useUser();

  const methods = useForm({
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
      methods.setValue("dob", user?.data?.data?.dateOfBirth);
      methods.setValue("mobileNo", user?.data?.data?.mobileNo);
      methods.setValue("phoneNo", user?.data?.data?.phoneNo);
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

  const onPasswordSubmit = (data: changePasswordPayload) => {
    passwordMutate(data);
  };

  return (
    <DashboardLayout isLoading={user.isLoading}>
      <Container fixed>
        <StyledPaper elevation={0}>
          <Box className="inner-box">
            <Stack direction="row" className="info">
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={<CameraAltIcon fontSize="small" />}
                component="label"
              >
                <Avatar src="https://api-prod-minimal-v510.vercel.app/assets/images/avatar/avatar_25.jpg">
                  {user?.data?.data?.name}
                </Avatar>
                <VisuallyHiddenInput type="file" />
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
                  name="dob"
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
                        <FormHelperText>{error?.message}</FormHelperText>
                      )}
                    </Box>
                  )}
                />
              </Grid>
              <Grid item lg={6} md={6} sm={6} xs={12}>
                <CustomInput
                  name="mobileNo"
                  type="text"
                  label="Mobile"
                  size="small"
                />
              </Grid>
              <Grid item lg={6} md={6} sm={6} xs={12}>
                <CustomInput
                  name="phoneNo"
                  type="text"
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
            <Button variant="outlined" size="small">
              Discard
            </Button>
            <LoadingButton variant="contained" size="small">
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
