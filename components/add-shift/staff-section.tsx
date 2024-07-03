import { getStaffList } from "@/api/functions/staff.api";
import { Shift } from "@/interface/shift.interface";
import { IStaff } from "@/interface/staff.interfaces";
import assets from "@/json/assets";
import { getRole } from "@/lib/functions/_helpers.lib";
import StyledPaper from "@/ui/Paper/Paper";
import {
  Divider,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  Typography
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

export default function StaffSection({
  view,
  edit,
  shift
}: {
  view?: boolean;
  edit?: boolean;
  shift?: Shift;
}) {
  const { control } = useFormContext();
  const role = getRole();

  const { data, isLoading } = useQuery({
    queryKey: ["user_list"],
    queryFn: getStaffList,
    enabled: role === "ROLE_ADMIN"
  });

  return (
    <StyledPaper>
      <Stack direction="row" alignItems="center" gap={2}>
        <Image
          src={assets.nurse}
          alt="Carer"
          width={512}
          height={512}
          className="icon"
        />
        <Typography variant="h6">Carer</Typography>
      </Stack>
      <Divider sx={{ marginBlock: "10px" }} />
      {view ? (
        <Grid container alignItems="center" rowSpacing={2}>
          <Grid item lg={8} md={6} sm={12} xs={12}>
            <Typography>Name</Typography>
          </Grid>
          <Grid item lg={4} md={6} sm={12} xs={12}>
            <Link
              href={`/participants/${shift?.employee.id}/view`}
              style={{ textDecoration: "none", color: "#333" }}
            >
              <Typography variant="body1" textAlign="right">
                {shift?.employee.displayName}
              </Typography>
            </Link>
          </Grid>
          <Grid item lg={8} md={6} sm={12} xs={12}>
            <Typography>Time</Typography>
          </Grid>
          <Grid item lg={4} md={6} sm={12} xs={12}>
            <Typography variant="body1" textAlign="right">
              <strong>
                {moment(
                  `${shift?.startTime[0]}:${shift?.startTime[1]}`,
                  "HH:mm"
                ).format("hh:mm a")}{" "}
                to{" "}
                {moment(
                  `${shift?.endTime[0]}:${shift?.endTime[1]}`,
                  "HH:mm"
                ).format("hh:mm a")}
              </strong>
            </Typography>
          </Grid>
          <Grid item lg={8} md={6} sm={12} xs={12}>
            <Typography>
              Total hours scheduled on{" "}
              {moment(shift?.startDate).format("DD/MM/YYYY")}
            </Typography>
          </Grid>
          <Grid item lg={4} md={6} sm={12} xs={12}>
            <Typography variant="body1" textAlign="right">
              <strong>{shift?.shiftHours}</strong> hours
            </Typography>
          </Grid>
        </Grid>
      ) : (
        <Grid container alignItems="center">
          <Grid item lg={4} md={6} sm={12} xs={12}>
            <Typography>Choose Carer</Typography>
          </Grid>
          <Grid item lg={8} md={6} sm={12} xs={12}>
            <Controller
              control={control}
              name="employeeIds"
              render={({ field, fieldState: { error, invalid } }) => {
                return (
                  <Box>
                    <Select
                      fullWidth
                      size="small"
                      {...field}
                      onChange={(e) => {
                        const _value = e.target.value;
                        field.onChange(
                          typeof _value === "string"
                            ? _value.split(",")
                            : _value
                        );
                      }}
                      displayEmpty
                      renderValue={
                        field.value?.length !== 0
                          ? undefined
                          : () => "Select Carer"
                      }
                      multiple
                    >
                      {isLoading ? (
                        <MenuItem disabled>Loading...</MenuItem>
                      ) : (
                        data?.map((_data: IStaff) => (
                          <MenuItem value={_data.id} key={_data.id}>
                            {_data.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    {invalid && (
                      <FormHelperText>{error?.message}</FormHelperText>
                    )}
                  </Box>
                );
              }}
            />
          </Grid>
        </Grid>
      )}
    </StyledPaper>
  );
}
