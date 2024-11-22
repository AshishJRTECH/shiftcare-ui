import React from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface FormValues {
  date: string;
  fundId: string;
  pricebookId: string;
  startTime: string;
  finishTime: string;
  hourlyRate: number;
  hours: number;
  additionalCost: number;
  distanceRate: number;
  distance: number;
  runningTotal: number;
  totalCost: number;
  isConfirmed: boolean; // Field for the checkbox
}

const EditBillForm = () => {
  const { control, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      date: "",
      fundId: "",
      pricebookId: "",
      startTime: "",
      finishTime: "",
      hourlyRate: 0,
      hours: 0,
      additionalCost: 0,
      distanceRate: 0,
      distance: 0,
      runningTotal: 0,
      totalCost: 0,
      isConfirmed: false // Default value for the checkbox
    }
  });

  const calculateTotal = () => {
    const { hourlyRate, hours, additionalCost, distanceRate, distance } =
      watch();
    const runningTotal = hourlyRate * hours + additionalCost;
    const totalCost = runningTotal + distanceRate * distance;

    setValue("runningTotal", runningTotal);
    setValue("totalCost", totalCost);
  };

  const onSubmit = (data: FormValues) => {
    console.log("Form Data:", data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item lg={4} md={6} sm={12} xs={12}>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
            sx={{ height: "100%" }}
          >
            <DatePicker
              label="Date"
              slotProps={{
                textField: { variant: "outlined", fullWidth: true }
              }}
            />
          </Stack>
        </Grid>

        <Grid item lg={4} md={6} sm={12} xs={12}>
          <Controller
            name="fundId"
            control={control}
            render={({ field }) => (
              <Select
                fullWidth
                size="small"
                displayEmpty
                {...field}
                sx={{ height: "55px" }} // Set the desired height here
              >
                <MenuItem value="" disabled>
                  Fund
                </MenuItem>
                {["Fund 1", "Fund 2", "Fund 3", "Fund 4"].map((fund, index) => (
                  <MenuItem value={fund} key={index}>
                    {fund}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </Grid>

        <Grid item lg={4} md={6} sm={12} xs={12}>
          <Controller
            name="pricebookId"
            control={control}
            render={({ field }) => (
              <Select
                fullWidth
                size="small"
                displayEmpty
                {...field}
                sx={{ height: "55px" }} // Set the desired height here
              >
                <MenuItem value="" disabled>
                  Price Book
                </MenuItem>
                {["10 M", "12 M", "15 M", "20 M"].map((fund, index) => (
                  <MenuItem value={fund} key={index}>
                    {fund}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Controller
            name="startTime"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Start Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Controller
            name="finishTime"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Finish Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Controller
            name="additionalCost"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Additional Cost"
                type="number"
                fullWidth
                onChange={(e) => {
                  field.onChange(e);
                  calculateTotal();
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Controller
            name="distance"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Distance"
                type="number"
                fullWidth
                onChange={(e) => {
                  field.onChange(e);
                  calculateTotal();
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <Controller
            name="isConfirmed"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    checked={field.value} // Bind value to the form field
                  />
                }
                label="Confirm Details"
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditBillForm;
