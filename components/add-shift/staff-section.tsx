import { useEffect, useState } from "react";
import { getStaffList } from "@/api/functions/staff.api";
import { Shift } from "@/interface/shift.interface";
import { IStaff } from "@/interface/staff.interfaces";
import assets from "@/json/assets";
import { getRole } from "@/lib/functions/_helpers.lib";
import StyledPaper from "@/ui/Paper/Paper";
import {
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
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
import { getAllPayGroups } from "@/api/functions/paygroup.api";
import CloseIcon from "@mui/icons-material/Close";

export default function StaffSection({
  view,
  edit,
  shift,
  advanceShift
}: {
  view?: boolean;
  edit?: boolean;
  shift?: Shift;
  advanceShift: boolean;
}) {
  const { control, watch, setValue, getValues } = useFormContext();
  const role = getRole();
  const isOpenShift = watch("isOpenShift");
  const isPickupJob = watch("isPickupJob");

  const { data, isLoading } = useQuery({
    queryKey: ["user_list"],
    queryFn: getStaffList,
    enabled: role === "ROLE_ADMIN"
  });

  useEffect(() => {

    if (isOpenShift || isPickupJob)
    {
      // Unselect all selected carers by resetting employeeIds
      setValue("employeeIds", []);
    }
  }, [isOpenShift, setValue]);

  // console.log("------------- Staff List --------------", data);
  // console.log(
  //   "-------------+++++++++++ Selected SHIFT +++++++++++ --------------",
  //   shift
  // );

  // console.log("============ SHIFT EDITABLE DATA =============", shift);
  const router = useRouter();
  const [staffId, setStaffId] = useState<string | null>(null);
  const [selectedDisplayNames, setSelectedDisplayNames] = useState("");
  const [preselectedNames, setPreselectedNames] = useState("");
  const [selectedCarerId, setSelectedCarerId] = useState("");
  const [open, setOpen] = React.useState(true);

  const staffDisplayName = shift?.employee.displayName;
  useEffect(() => {
    if (staffDisplayName) {
      setSelectedDisplayNames(staffDisplayName);
    }
  }, [shift?.client.displayName]);

  useEffect(() => {
    if (router.query.staff) {
      setStaffId(router.query.staff as string);
    }
  }, [router.query.staff]);

  const { data: paygroup, isLoading: isloading } = useQuery({
    queryKey: ["pay-groups", router.query.page],
    queryFn: () => getAllPayGroups((router.query.page as string) || "1")
  });

  // useEffect(()=>{

  // },[])

  useEffect(() => {
    console.log(
      "-------------: Pay Group List in Carer Page :-------------",
      paygroup
    );
  }, [paygroup]);

  const handleRemoveName = (namesToRemove: string) => {
    // Remove the names from selectedDisplayNames
    const updatedNames = selectedDisplayNames
      .split(",")
      .filter((name) => !namesToRemove.includes(name.trim())) // Filter out names to remove
      .join(", ");

    setSelectedDisplayNames(updatedNames);

    // Find the employee IDs associated with the names to remove
    const employeesToRemove = data.filter((client: any) =>
      namesToRemove.includes(client.name)
    );

    if (employeesToRemove.length > 0) {
      // Get the current employeeIds from the form
      const currentEmployeeIds = getValues("employeeIds");

      // Filter out the IDs of the employees to remove
      const updatedEmployeeIds = currentEmployeeIds.filter(
        (id: string) =>
          !employeesToRemove.some((emp: { id: string }) => emp.id === id)
      );

      // Update the employeeIds field in the form
      setValue("employeeIds", updatedEmployeeIds);
    }
  };

  return (
    <>
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
              <Controller
                name="isOpenShift"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox size="small" />}
                    checked={staffId === "1" ? true : field.value} // Check if staffId is 1
                    {...field}
                    label="Is Open Shift"
                  />
                )}
              />
            </Grid>
            {!isOpenShift && staffId !== "1" && (
              <Grid item lg={4} md={6} sm={12} xs={12}>
                <Controller
                  name="isPickupJob"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={staffId === "1" ? true : field.value} // Check if staffId is 1
                          onChange={(e) => {
                            field.onChange(e.target.checked); // Update the field value
                            // console.log("Checked:", e.target.checked); // Log the checked state
                          }}
                        />
                      }
                      {...field}
                      label="Is Pickup Job"
                    />
                  )}
                />
              </Grid>
            )}
            {/* <Grid item lg={8} md={6} sm={12} xs={12}></Grid> */}
            {/* {!isOpenShift && ( */}
            {!isOpenShift &&
              staffId !== "1" &&
              !isPickupJob &&(
                <Grid container alignItems="center">
                  <Grid container spacing={2}>
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

                                  // Get the selected display names and update state directly
                                  const selectedNames = data
                                    ?.filter((client: any) =>
                                      _value.includes(client.id)
                                    )
                                    .map((client: any) => client.name)
                                    .join(", ");
                                  setSelectedDisplayNames(selectedNames);

                                  // Get the selected IDs and update state
                                  const selectedId = data
                                    ?.filter((client: any) =>
                                      _value.includes(client.id)
                                    )
                                    .map((client: any) => client.id)
                                    .join(", ");
                                  if (selectedId) {
                                    setSelectedCarerId(selectedId);
                                  }

                                  // Optionally set open state based on selected names length
                                  setOpen(selectedNames.length);
                                }}
                                displayEmpty
                                renderValue={
                                  field.value?.length !== 0
                                    ? undefined
                                    : () => "Select Carer"
                                }
                                multiple
                              >
                                {/* {isLoading ? (
                                  <MenuItem disabled>Loading...</MenuItem>
                                ) : (
                                  data?.slice(1).map((_data: IStaff) => (
                                    <MenuItem value={_data.id} key={_data.id}>
                                      {_data.name}
                                    </MenuItem>
                                  ))
                                )} */}
                                {isLoading ? (
                                  <MenuItem disabled>Loading...</MenuItem>
                                ) : isPickupJob ? (
                                  <MenuItem disabled>
                                    No carers available for pickup jobs
                                  </MenuItem>
                                ) : (
                                  // Only display carers if it's not a pickup job
                                  data?.slice(2).map((_data: IStaff) => (
                                    <MenuItem value={_data.id} key={_data.id}>
                                      {_data.name}
                                    </MenuItem>
                                  ))
                                )}
                              </Select>
                              {invalid && (
                                <FormHelperText>
                                  {error?.message}
                                </FormHelperText>
                              )}
                            </Box>
                          );
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )}
          </Grid>
        )}
      </StyledPaper>
      {advanceShift && (
        <>
          {/* {open && selectedDisplayNames ? ( */}
          {open ? (
            selectedDisplayNames
              .split(",")
              .map((name: string, index: number) => {
                const selectedCarerIdsArray = selectedCarerId
                  .split(",")
                  .map((id) => id.trim()); // Ensure trimming of whitespace

                // Log to debug the split result and index
                // console.log("Selected Carer IDs Array:", selectedCarerIdsArray);
                // console.log("Selected Display Names:", selectedDisplayNames);

                // Ensure proper handling for the first index
                const carerId = selectedCarerIdsArray[index]?.trim() || "0"; // Check if index exists

                console.log(
                  `Index: ${index}, Name: ${name.trim()}, Carer ID: ${carerId}`
                );
                const prefilledPayGroupId = shift?.payGroups?.id;
                return (
                  <Card
                    key={index}
                    sx={{
                      minWidth: 275,
                      position: "relative",
                      bgcolor: "#f5f5f5",
                      border: "1px solid #ccc",
                      boxShadow: 2,
                      margin: "10px 0px 0px 6px"
                    }}
                  >
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: -3,
                        right: -3,
                        border: "6px solid #ffffff",
                        color: "white",
                        width: "0.6em",
                        height: "0.6em",
                        bgcolor: "red",
                        "&:hover": {
                          bgcolor: "darkred"
                        }
                      }}
                      onClick={() => handleRemoveName(name)}
                    >
                      <CloseIcon />
                    </IconButton>
                    <CardContent>
                      <Grid container alignItems="center">
                        <Divider
                          style={{ marginTop: "20px", marginBottom: "20px" }}
                        />
                        <Grid container spacing={2}>
                          {advanceShift && (
                            <>
                              <Grid item lg={4} md={6} sm={12} xs={12}>
                                <Typography>Carer Name:</Typography>
                              </Grid>
                              <Grid item lg={8} md={6} sm={12} xs={12}>
                                {name.trim()}
                              </Grid>

                              <Controller
                                control={control}
                                name={`employeePayGroups[${index}].employeeId`}
                                defaultValue={carerId} // Ensure carerId is properly set for the first record
                                render={({ field }) => (
                                  <input
                                    type="hidden"
                                    {...field}
                                    value={carerId}
                                  />
                                )}
                              />

                              <Grid item lg={4} md={6} sm={12} xs={12}>
                                <Typography>Choose Pay Group</Typography>
                              </Grid>
                              <Grid item lg={8} md={6} sm={12} xs={12}>
                                <Controller
                                  control={control}
                                  name={`employeePayGroups[${index}].payGroupId`}
                                  defaultValue={
                                    prefilledPayGroupId
                                      ? [prefilledPayGroupId]
                                      : []
                                  } // Initialize as an array
                                  render={({
                                    field,
                                    fieldState: { error, invalid }
                                  }) => (
                                    <Box>
                                      <Select
                                        fullWidth
                                        size="small"
                                        {...field}
                                        value={
                                          field.value.length > 0
                                            ? field.value[0]
                                            : ""
                                        } // Get the first element or default to empty
                                        onChange={(e) => {
                                          const _value = e.target.value;
                                          field.onChange([_value]); // Wrap value in an array
                                        }}
                                        displayEmpty
                                        renderValue={
                                          field.value?.length > 0
                                            ? undefined
                                            : () => "Select Pay Group"
                                        }
                                      >
                                        {isLoading ? (
                                          <MenuItem disabled>
                                            <CircularProgress size={20} />
                                            Loading...
                                          </MenuItem>
                                        ) : paygroup?.payGroups?.length > 0 ? (
                                          paygroup.payGroups.map(
                                            (payGroup: any) => (
                                              <MenuItem
                                                value={payGroup.id}
                                                key={payGroup.id}
                                              >
                                                {payGroup.payGroupName}
                                              </MenuItem>
                                            )
                                          )
                                        ) : (
                                          <MenuItem disabled>
                                            No Pay Groups Available
                                          </MenuItem>
                                        )}
                                      </Select>
                                      {invalid && (
                                        <FormHelperText>
                                          {error?.message}
                                        </FormHelperText>
                                      )}
                                    </Box>
                                  )}
                                />
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                );
              })
          ) : (
            <Typography></Typography>
          )}
        </>
      )}
    </>
  );
}
