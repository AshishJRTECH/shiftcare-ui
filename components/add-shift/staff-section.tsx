import { useEffect, useState } from "react";
import { getStaffList } from "@/api/functions/staff.api";
import { Shift } from "@/interface/shift.interface";
import { IStaff } from "@/interface/staff.interfaces";
import assets from "@/json/assets";
import { getRole } from "@/lib/functions/_helpers.lib";
import StyledPaper from "@/ui/Paper/Paper";
import {
  Checkbox,
  Divider,
  FormControlLabel,
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
import { useRouter } from "next/router";

export default function StaffSection({
  view,
  edit,
  shift
}: {
  view?: boolean;
  edit?: boolean;
  shift?: Shift;
}) {
  const { control, watch, setValue } = useFormContext();
  const role = getRole();
  const isOpenShift = watch("isOpenShift");

  const { data, isLoading } = useQuery({
    queryKey: ["user_list"],
    queryFn: getStaffList,
    enabled: role === "ROLE_ADMIN"
  });

  useEffect(() => {
    if (isOpenShift) {
      // Unselect all selected carers by resetting employeeIds
      setValue("employeeIds", []);
    }
  }, [isOpenShift, setValue]);

  // console.log("------------- Staff List --------------", data);
  console.log("------------- Exact Shift in Shift --------------", shift);

  // console.log("============ SHIFT EDITABLE DATA =============", shift);
  const router = useRouter();
  const [staffId, setStaffId] = useState<string | null>(null);
  useEffect(() => {
    if (router.query.staff) {
      setStaffId(router.query.staff as string);
    }
  }, [router.query.staff]);
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
            {/* <Controller
              name="isOpenShift"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  checked={field.value}
                  {...field}
                  label="Is Open Shift"
                />
              )}
            /> */}
            <Controller
              name="isOpenShift"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  checked={staffId === "2" ? true : field.value} // Check if staffId is 2
                  {...field}
                  label="Is Open Shift"
                />
              )}
            />
          </Grid>
          <Grid item lg={8} md={6} sm={12} xs={12}></Grid>
          {!isOpenShift && staffId !== "2" && (
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
                          value={field.value || []} // Ensure value is an array
                          onChange={(e) => {
                            const _value = e.target.value;
                            field.onChange(_value); // _value should already be an array
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
                            // data?.map((_data: IStaff) => (
                            data?.slice(1).map((_data: IStaff) => (
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
        </Grid>
      )}
    </StyledPaper>
  );
}
