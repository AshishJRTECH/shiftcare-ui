import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import { useState } from "react";

import { loginMutation, loginMutationPayload } from "@/api/functions/user.api";
import Logo from "@/components/logo/logo";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import validationText from "@/json/messages/validationText";
import { setCookieClient } from "@/lib/functions/storage.lib";
import { bgGradient } from "@/themes/css";
import CustomInput from "@/ui/Inputs/CustomInput";
import styled from "@emotion/styled";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import { Checkbox, FormControlLabel } from "@mui/material";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { Controller, FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { getRole } from "@/lib/functions/_helpers.lib";
// ----------------------------------------------------------------------

const StyledLoginPage = styled(Box)`
  height: 100vh;

  h6 {
    margin-bottom: 40px;
    a {
      color: inherit;
    }
  }

  .more-info {
    font-size: 14px;
    margin-top: 15px;
    margin-bottom: 20px;
    .MuiTypography-root {
      font-size: inherit;
    }

    a {
      text-decoration: none;
    }
  }

  .MuiButton-root {
    letter-spacing: normal;
  }
`;

const schema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .email(validationText.error.email_format)
    .required(validationText.error.enter_email),
  password: yup.string().trim().required(validationText.error.enter_password)
});

export default function LoginView() {
  const { isLoggedIn } = useAppSelector((s) => s.userSlice);

  const router = useRouter();

  const methods = useForm({
    resolver: yupResolver(schema),
    // mode: "all",
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const role = getRole();

  // const { mutate, isPending } = useMutation({
  //   mutationFn: loginMutation,
  //   onSuccess: (data: any) => {
  //     setCookieClient(process.env.NEXT_APP_TOKEN_NAME!, data.jwtToken);
  //     delete data.jwtToken;
  //     setCookieClient("user", JSON.stringify(data));
  //     if (role === "ROLE_CARER") {
  //       router.push("/staff-roster");
  //     } else {
  //       router.push("/");
  //     }
  //   }
  // });

  const { mutate, isPending } = useMutation({
    mutationFn: loginMutation,
    onSuccess: (data: any) => {
      setCookieClient(process.env.NEXT_APP_TOKEN_NAME!, data.jwtToken);
      delete data.jwtToken;
      setCookieClient("user", JSON.stringify(data));
      router.push(data.role[0]?.name === "ROLE_ADMIN" ? "/" : "/staff-roster");
    }
  });

  const theme = useTheme();

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (data: loginMutationPayload) => {
    // setCookieClient(process.env.NEXT_APP_TOKEN_NAME!!, "test@1234");
    // dispatch(setAccessToken("test@1234"));
    mutate(data);
    // mutate(
    //   { ...data },
    //   {
    //     onSuccess: (res) => {
    //       if (res?.status === "success") {
    //         if (res?.data) {
    //           toast.success(messages.success.loginsuccess(res?.data?.name));
    //           //   dispatch(setAccessToken(access));
    //           //   dispatch(setUserData(userData));
    //           router.push("/dashboard/branch");
    //         }
    //       }
    //     }
    //   }
    // );
  };

  // useEffect(() => {
  //   if (isLoggedIn) {
  //     router.push("/dashboard");
  //   }
  // }, [isLoggedIn]);

  return (
    <StyledLoginPage
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.4),
          imgUrl: "/assets/background/overlay-4.jpg"
        })
      }}
    >
      <Logo
        sx={{
          position: "fixed",
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 }
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Typography variant="h2">Sign in to your account</Typography>
        <Typography variant="h6">
          Or <Link href="/auth/signup">create a new account</Link>
        </Typography>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420
          }}
        >
          {/* <Typography variant="h4">Sign in</Typography> */}

          {/* <Divider sx={{ my: 3 }} /> */}

          <Box component="form" onSubmit={methods.handleSubmit(handleLogin)}>
            <FormProvider {...methods}>
              <Stack spacing={3}>
                <CustomInput
                  name="email"
                  label="Email Address"
                  type="email"
                  size="small"
                />
                <CustomInput
                  label="Password"
                  name="password"
                  size="small"
                  type={showPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOffIcon fontSize="small" />
                          ) : (
                            <RemoveRedEyeIcon fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  className="more-info"
                >
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Remember me"
                  />
                  <Link href="/auth/forgot-password">
                    Forgot your password?
                  </Link>
                </Stack>

                <LoadingButton
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="primary"
                  loading={isPending}
                >
                  Sign In
                </LoadingButton>
              </Stack>
            </FormProvider>
          </Box>
        </Card>
      </Stack>
    </StyledLoginPage>
  );
}
