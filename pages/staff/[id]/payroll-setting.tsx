import {
  get_payroll_setting,
  updatePayrollSetting
} from "@/api/functions/staff.api";
import { PayrollSettingInterface } from "@/interface/common.interface";
import validationText from "@/json/messages/validationText";
import StyledPaper from "@/ui/Paper/Paper";
import styled from "@emotion/styled";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { queryClient } from "pages/_app";
import React, { useEffect, useState } from "react";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm
} from "react-hook-form";
import * as yup from "yup";

const StyledBox = styled(Box)`
  padding-top: 10px;
`;

const schema = yup.object().shape({
  dailyHours: yup.number().required().positive().integer(),
  weeklyHours: yup.number().required().positive().integer(),
  employeeId: yup.number().required().integer(),
  payGroupId: yup.number().required().integer(),
  payGroupName: yup.string().required(),
  allowances: yup.array().of(yup.object()), // Assuming allowances is an array of objects, but you can adjust based on its structure
  industryAward: yup.string().nullable(),
  awardLevel: yup.string().nullable(),
  awardLevelPayPoint: yup.string().nullable(),
  employeeProfile: yup.object().nullable()
});

export default function PayrollSetting() {
  const [edit, setEdit] = useState(false);
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["payroll_setting_list", id],
    queryFn: () => get_payroll_setting(id.toString()) // pass the id as an object
  });

  useEffect(() => {
    console.log(
      "---------------------: Payroll Setting :--------------------",
      data
    );
  }, [data]);

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (data) {
      // Only reset the form when the data is available
      reset({
        dailyHours: data.dailyHours,
        weeklyHours: data.weeklyHours,
        employeeId: data.employeeId,
        payGroupId: data.payGroupId,
        payGroupName: data.payGroupName,
        allowances: data.allowances || [],
        industryAward: data.industryAward || null,
        awardLevel: data.awardLevel || null,
        awardLevelPayPoint: data.awardLevelPayPoint || null,
        employeeProfile: data.employeeProfile || null
      });
    }
  }, [edit, data, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: updatePayrollSetting,
    onSuccess: () => {
      setEdit(false);
      queryClient.invalidateQueries({ queryKey: ["notes", id] });
    }
  });

  // Correct type for handleSubmit
  // const onSubmit: SubmitHandler<FieldValues> = (formData) => {
  //   const payload: PayrollSettingInterface = {
  //     dailyHours: formData.dailyHours,
  //     weeklyHours: formData.weeklyHours,
  //     employeeId: formData.employeeId,
  //     payGroupId: formData.payGroupId,
  //     payGroupName: formData.payGroupName,
  //     allowances: formData.allowances,
  //     industryAward: formData.industryAward,
  //     awardLevel: formData.awardLevel,
  //     awardLevelPayPoint: formData.awardLevelPayPoint,
  //     employeeProfile: formData.employeeProfile
  //   };

  //   mutate({
  //     id: id as string,
  //     data: JSON.stringify(payload)
  //   });
  // };

  // const onSubmit: SubmitHandler<FieldValues> = (formData) => {
  //   const payload: PayrollSettingInterface = {
  //     dailyHours: formData.dailyHours,
  //     weeklyHours: formData.weeklyHours,
  //     employeeId: formData.employeeId,
  //     payGroupId: formData.payGroupId,
  //     payGroupName: formData.payGroupName,
  //     allowances: formData.allowances,
  //     industryAward: formData.industryAward,
  //     awardLevel: formData.awardLevel,
  //     awardLevelPayPoint: formData.awardLevelPayPoint,
  //     employeeProfile: formData.employeeProfile
  //   };
  //   mutate({
  //     id: data.id.toString(),
  //     data: JSON.stringify(payload)
  //   });
  // };

  const onSubmit = (formdata: FieldValues) => {
    const payrollData: PayrollSettingInterface = {
      dailyHours: formdata.dailyHours,
      weeklyHours: formdata.weeklyHours,
      employeeId: formdata.employeeId,
      payGroupId: formdata.payGroupId,
      payGroupName: formdata.payGroupName,
      allowances: formdata.allowances,
      industryAward: formdata.industryAward,
      awardLevel: formdata.awardLevel,
      awardLevelPayPoint: formdata.awardLevelPayPoint,
      employeeProfile: formdata.employeeProfile
    };

    mutate({ id: data.id, data: payrollData });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading payroll settings</div>;
  }

  return (
    <StyledPaper>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ paddingBottom: "15px" }}
      >
        <Typography variant="h5">Payroll Setting</Typography>
        {!edit && (
          <Button size="small" onClick={() => setEdit(true)}>
            Edit
          </Button>
        )}
      </Stack>
      <Divider />
      <StyledBox sx={{ paddingBottom: edit ? "16px" : 0 }}>
        {edit ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* Daily Hours */}
              <Grid item xs={12} md={12}>
                <TextField
                  label="Daily Hours"
                  fullWidth
                  type="number"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true
                  }}
                  {...control.register("dailyHours")}
                />
              </Grid>

              {/* Weekly Hours */}
              <Grid item xs={12} md={12}>
                <TextField
                  label="Weekly Hours"
                  fullWidth
                  type="number"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true
                  }}
                  {...control.register("weeklyHours")}
                />
              </Grid>

              {/* Employee ID */}
              <Grid item xs={12} md={12}>
                <TextField
                  label="Employee ID"
                  fullWidth
                  type="text"
                  variant="outlined"
                  {...control.register("employeeId")}
                />
              </Grid>

              {/* Pay Group */}
              <Grid item xs={12} md={12}>
                <TextField
                  label="Pay Group"
                  fullWidth
                  type="text"
                  variant="outlined"
                  {...control.register("payGroupId")}
                />
              </Grid>

              {/* Pay Group Name */}
              <Grid item xs={12} md={12}>
                <TextField
                  label="Pay Group Name"
                  fullWidth
                  type="text"
                  variant="outlined"
                  {...control.register("payGroupName")}
                />
              </Grid>

              {/* Allowances */}
              <Grid item xs={12} md={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Allowances</InputLabel>
                  <Controller
                    name="allowances"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <Select
                        multiple
                        label="Allowances"
                        {...field}
                        value={field.value || []} // Ensure the value is an array
                      >
                        {["Allowance 1", "Allowance 2", "Allowance 3"].map(
                          (allowance, idx) => (
                            <MenuItem key={idx} value={allowance}>
                              {allowance}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              {/* Industry Award */}
              <Grid item xs={12} md={12}>
                <TextField
                  label="Industry Award"
                  fullWidth
                  type="text"
                  variant="outlined"
                  {...control.register("industryAward")}
                />
              </Grid>

              {/* Award Level */}
              <Grid item xs={12} md={12}>
                <TextField
                  label="Award Level"
                  fullWidth
                  type="text"
                  variant="outlined"
                  {...control.register("awardLevel")}
                />
              </Grid>

              {/* Award Level Pay Point */}
              <Grid item xs={12} md={12}>
                <TextField
                  label="Award Level Pay Point"
                  fullWidth
                  type="number"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true
                  }}
                  {...control.register("awardLevelPayPoint")}
                />
              </Grid>

              {/* Employee Profile */}
              <Grid item xs={12} md={12}>
                <TextField
                  label="Employee Profile"
                  fullWidth
                  type="text"
                  variant="outlined"
                  {...control.register("employeeProfile")}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12} md={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Update
                </Button>
              </Grid>
            </Grid>
          </form>
        ) : (
          <TableContainer style={{ padding: "0px" }}>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography
                      variant="body2"
                      style={{
                        textTransform: "capitalize",
                        fontWeight: "bold",
                        fontSize: "14px"
                      }}
                    >
                      Daily Hours
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{data?.dailyHours}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography
                      variant="body2"
                      style={{
                        textTransform: "capitalize",
                        fontWeight: "bold",
                        fontSize: "14px"
                      }}
                    >
                      Weekly Hours
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{data?.weeklyHours}</Typography>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <Typography
                      variant="body2"
                      style={{
                        textTransform: "capitalize",
                        fontWeight: "bold",
                        fontSize: "14px"
                      }}
                    >
                      Pay Group
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {data?.payGroupName}
                    </Typography>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <Typography
                      variant="body2"
                      style={{
                        textTransform: "capitalize",
                        fontWeight: "bold",
                        fontSize: "14px"
                      }}
                    >
                      Allowances
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {data?.allowances.length > 0
                        ? data?.allowances.join(", ")
                        : "None"}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography
                      variant="body2"
                      style={{
                        textTransform: "capitalize",
                        fontWeight: "bold",
                        fontSize: "14px"
                      }}
                    >
                      Industry Award
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {data?.industryAward ?? "None"}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography
                      variant="body2"
                      style={{
                        textTransform: "capitalize",
                        fontWeight: "bold",
                        fontSize: "14px"
                      }}
                    >
                      Award Level
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {data?.awardLevel ?? "None"}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography
                      variant="body2"
                      style={{
                        textTransform: "capitalize",
                        fontWeight: "bold",
                        fontSize: "14px"
                      }}
                    >
                      Award Level Pay Point
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {data?.awardLevelPayPoint ?? "None"}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography
                      variant="body2"
                      style={{
                        textTransform: "capitalize",
                        fontWeight: "bold",
                        fontSize: "14px"
                      }}
                    >
                      Employee Profile
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {data?.employeeProfile ?? "None"}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </StyledBox>
    </StyledPaper>
  );
}
