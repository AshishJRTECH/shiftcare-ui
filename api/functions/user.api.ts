import { userData } from "@/types/common.type";
import axiosInstance from "../axiosInstance";
import { endpoints } from "../endpoints";

export interface loginMutationPayload {
  email: string;
  password: string;
}

export interface signupMutationPayload {
  email: string;
  company: string;
  // role: string;
  // manager_email: string;
  name: string;
}

export interface setPasswordPayload {
  password: string;
  reEnteredPassword: string;
  verificationToken: string;
}

export interface changePasswordPayload {
  currentPassword: string;
  newPassword: string;
  reEnteredPassword: string;
}

export type forgotPasswordPayload = Omit<loginMutationPayload, "password">;
export interface updateProfilePayload {
  name: string;
  dateOfBirth: string;
  mobileNo: string;
  phoneNo: string;
}

export const GetProfileDetails = async () => {
  return {
    status: 0,
    data: { data: {} as userData }
  };
};

export const loginMutation = async (body: loginMutationPayload) => {
  const res = await axiosInstance.post(endpoints.auth.login, body);
  return res.data;
};

export const signupMutation = async (body: signupMutationPayload) => {
  const res = await axiosInstance.post(endpoints.auth.signup, body);
  return res.data;
};

export const setPasswordMutation = async (body: setPasswordPayload) => {
  const res = await axiosInstance.post(endpoints.auth.set_password, body);
  return res.data;
};

export const forgotPasswordMutatuion = async (body: forgotPasswordPayload) => {
  const formData = new FormData();
  Object.entries(body).forEach((_item) => {
    formData.append(_item[0], _item[1]);
  });
  const res = await axiosInstance.post(
    endpoints.auth.forgot_password,
    formData
  );
  return res.data;
};

export const resendInvite = async (body: { email: string }) => {
  const res = await axiosInstance.post(endpoints.auth.resend_invite, body);
  return res.data;
};

export const resetPasswordMutation = async (body: setPasswordPayload) => {
  const res = await axiosInstance.post(endpoints.auth.reset_password, body);
  return res.data;
};

export const changePasswordMutation = async (body: changePasswordPayload) => {
  const res = await axiosInstance.post(endpoints.auth.change_password, body);
  return res.data;
};

export const getProfile = async () => {
  const res = await axiosInstance.get(endpoints.user.profile);
  return res;
};

export const updateProfilePhoto = async (body: FormData) => {
  const res = await axiosInstance.post(endpoints.user.profile_photo, body);
  return res.data;
};

export const updateProfileDetails = async (body: updateProfilePayload) => {
  const res = await axiosInstance.put(endpoints.user.update, body);
  return res.data;
};

export const getLastSignin = async (id: string) => {
  const res = await axiosInstance.get(endpoints.auth.last_signin(id));
  return res.data;
};
