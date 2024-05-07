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
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateSettings } from "@/api/functions/staff.api";
import { LoadingButton } from "@mui/lab";
import { queryClient } from "pages/_app";
import { useParams } from "next/navigation";

const StyledBox = styled(Box)`
  padding-top: 15px;
  p {
    color: #95959a;
  }
`;

const schema = yup.object().shape({
  roleId: yup.string().required(validationText.error.role),
  teamIds: yup.array().of(yup.string()),
  isNotifyTimesheetApproval: yup.boolean(),
  isSubscribeToNotifications: yup.boolean(),
  subscribedEmailCategories: yup.array().of(yup.string()),
  isAvailableForRostering: yup.boolean(),
  isReadAndWriteClientPrivateNotes: yup.boolean(),
  isReadAndWriteStaffPrivateNotes: yup.boolean(),
  isAccess: yup.boolean(),
  isAccountOwner: yup.boolean()
});

export default function Settings({ settings }: { settings: ISettings }) {
  const [edit, setEdit] = useState(false);
  const { id } = useParams();

  const data = useQueries({
    queries: [
      {
        queryKey: ["roles"],
        queryFn: getRoles
      },
      {
        queryKey: ["teams"],
        queryFn: getAllTeams
      }
    ],
    combine: (result) => {
      return {
        roles: result[0].data,
        teams: result[1].data,
        loading: result[0].isLoading || result[1].isLoading
      };
    }
  });

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      roleId: settings.roleId,
      teamIds: settings.teamIds,
      isNotifyTimesheetApproval: settings.isNotifyTimesheetApproval,
      isSubscribeToNotifications: settings.isSubscribeToNotifications || false,
      subscribedEmailCategories: settings.subscribedEmailCategories,
      isAvailableForRostering: settings.isAvailableForRostering,
      isReadAndWriteClientPrivateNotes:
        settings.isReadAndWriteClientPrivateNotes,
      isReadAndWriteStaffPrivateNotes: settings.isReadAndWriteStaffPrivateNotes,
      isAccess: settings.isAccess,
      isAccountOwner: settings.isAccountOwner
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-settings", id] });
      setEdit(false);
    }
  });

  const onSubmit = (data: IUpdateSettings) => {
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
        <Grid container spacing={2}>
          <Grid item lg={5} md={6} sm={12} xs={12}>
            <Typography variant="body1">Role</Typography>
          </Grid>
          <Grid item lg={7} md={6} sm={12} xs={12}>
            {edit ? (
              <Controller
                name="roleId"
                control={control}
                render={({ field, fieldState: { invalid, error } }) => (
                  <Box>
                    <Select
                      fullWidth
                      size="small"
                      {...field}
                      sx={{ textTransform: "capitalize" }}
                    >
                      {data.roles.map((role: { id: number; name: string }) => (
                        <MenuItem
                          value={role.id}
                          key={role.id}
                          sx={{ textTransform: "capitalize" }}
                        >
                          {role.name
                            ?.replace("ROLE_", "")
                            .replaceAll("_", " ")
                            .toLowerCase()}
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
              <Chip
                variant="outlined"
                label={settings.roleName
                  ?.replace("ROLE_", "")
                  .replaceAll("_", " ")
                  .toLowerCase()}
                color="primary"
                size="small"
                sx={{ textTransform: "capitalize" }}
              />
            )}
          </Grid>
          <Grid item lg={5} md={6} sm={12} xs={12}>
            <Typography variant="body1">Teams:</Typography>
          </Grid>
          <Grid item lg={7} md={6} sm={12} xs={12}>
            {edit ? (
              <Select fullWidth size="small">
                {data.teams.map((_team: { id: number; name: string }) => (
                  <MenuItem value={_team.id} key={_team.id}>
                    {_team.name}
                  </MenuItem>
                ))}
              </Select>
            ) : (
              <Chip
                variant="outlined"
                label="Team 1"
                color="primary"
                size="small"
              />
            )}
          </Grid>
          <Grid item lg={5} md={6} sm={12} xs={12}>
            <Typography variant="body1">Notify Timesheet Approval</Typography>
          </Grid>
          <Grid item lg={7} md={6} sm={12} xs={12}>
            {edit ? (
              <Controller
                name="isNotifyTimesheetApproval"
                control={control}
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
                  settings.isNotifyTimesheetApproval ? "checkmark" : "close"
                }-fill`}
              ></Iconify>
            )}
          </Grid>
          <Grid item lg={5} md={6} sm={12} xs={12}>
            <Typography variant="body1">Available For Rostering</Typography>
          </Grid>
          <Grid item lg={7} md={6} sm={12} xs={12}>
            {edit ? (
              <Controller
                name="isAvailableForRostering"
                control={control}
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
                  settings.isAvailableForRostering ? "checkmark" : "close"
                }-fill`}
              ></Iconify>
            )}
          </Grid>
          <Grid item lg={5} md={6} sm={12} xs={12}>
            <Typography variant="body1">
              Read and write private notes
            </Typography>
          </Grid>
          <Grid item lg={7} md={6} sm={12} xs={12}>
            {edit ? (
              <>
                <Controller
                  name="isReadAndWriteClientPrivateNotes"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Client Notes"
                      {...field}
                      checked={field.value}
                    />
                  )}
                />
                <Controller
                  name="isReadAndWriteStaffPrivateNotes"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Staff Notes"
                      {...field}
                      checked={field.value}
                    />
                  )}
                />
              </>
            ) : (
              <>
                <Typography
                  variant="subtitle2"
                  display="flex"
                  alignItems="center"
                >
                  Client Notes
                  <Iconify
                    icon={`eva:${
                      settings.isReadAndWriteClientPrivateNotes
                        ? "checkmark"
                        : "close"
                    }-fill`}
                  ></Iconify>
                </Typography>
                <Typography
                  variant="subtitle2"
                  display="flex"
                  alignItems="center"
                >
                  Staff Notes
                  <Iconify
                    icon={`eva:${
                      settings.isReadAndWriteStaffPrivateNotes
                        ? "checkmark"
                        : "close"
                    }-fill`}
                  ></Iconify>
                </Typography>
              </>
            )}
          </Grid>
          <Grid item lg={5} md={6} sm={12} xs={12}>
            <Typography variant="body1">No Access</Typography>
          </Grid>
          <Grid item lg={7} md={6} sm={12} xs={12}>
            {edit ? (
              <Controller
                name="isAccess"
                control={control}
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
                icon={`eva:${settings.isAccess ? "checkmark" : "close"}-fill`}
              ></Iconify>
            )}
          </Grid>
          <Grid item lg={5} md={6} sm={12} xs={12}>
            <Typography variant="body1">Account Owner</Typography>
          </Grid>
          <Grid item lg={7} md={6} sm={12} xs={12}>
            {edit ? (
              <Controller
                name="isAccountOwner"
                control={control}
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
                  settings.isAccountOwner ? "checkmark" : "close"
                }-fill`}
              ></Iconify>
            )}
          </Grid>
        </Grid>
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
              onClick={handleSubmit(onSubmit)}
            >
              Update
            </LoadingButton>
          </Stack>
        </>
      )}
    </StyledPaper>
  );
}
