import React, { useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  DialogActions,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField
} from "@mui/material";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { BillingDataEdit } from "@/interface/billingreport.interface";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getClientFunds,
  updateBillingReport
} from "@/api/functions/client.api";
import { getPriceBooks } from "@/api/functions/pricebook.api";
import router from "next/router";
import { useParams, useRouter } from "next/navigation";

interface FormValues {
  isShiftUpdated: boolean;
  id: string;
  date: Date | null;
  fundIds: number[];
  pricebookId: number[];
  startTime: string;
  finishTime: string;
  additionalCost: number;
  distance: number;
  isConfirmed: boolean; // Field for the checkbox
}

const EditBillForm = ({
  onClose,
  selectedBillId
}: {
  onClose: () => void;
  selectedBillId: number | string;
}) => {
  const { control, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      id: selectedBillId.toString(), // Initialize with the billing report id (this would typically come from props or context)
      date: null, // Initialize as null
      fundIds: [],
      pricebookId: [],
      startTime: "",
      finishTime: "",
      additionalCost: 0,
      distance: 0,
      isConfirmed: false // Default value for the checkbox
    }
  });

  // ----------------- Price Start here --------------------
  const { data: price, isLoading: isloading } = useQuery({
    queryKey: ["price-books", router.query.page],
    queryFn: () => getPriceBooks("1")
  });

  useEffect(() => {
    console.log("---------------- PRICE LIST ----------------", price);
  }, [price]);

  // --------------------- Price end here ---------------------

  // ---------------------- Fund Start Here ----------------------
  const { id } = useParams<{ id: string }>(); // Ensure type for `id` from URL params
  const { data: fundsData, isLoading: isloadings } = useQuery({
    queryKey: ["client-funds", id],
    queryFn: () => getClientFunds({ clientIds: [Number(id)] })
  });

  useEffect(() => {
    console.log("------------- FUND LIST -------------", fundsData.funds);
  }, [fundsData]);
  // ---------------------- Fund End Here ----------------------

  const mutate = useMutation({
    mutationFn: updateBillingReport
  });

  const onSubmit = (data: FormValues) => {
    // Mapping FormValues to BillingDataEdit
    const newData: BillingDataEdit = {
      // priceBookId: data.pricebookId, // Assuming priceBookId is the correct field name
      // priceBookId: [1], // Assuming priceBookId is the correct field name
      priceBookId: [Number(data.pricebookId)], // Assuming priceBookId is the correct field name
      // isShiftUpdated: data.isShiftUpdated, // Add a timestamp if needed
      isShiftUpdated: true, // Add a timestamp if needed
      date: dayjs(data.date).format("YYYY-MM-DD"),
      startTime: data.startTime,
      finishTime: data.finishTime,
      // startTime: "16:20",
      // finishTime: "18:35",
      additionalCost: data.additionalCost,
      distance: data.distance,
      fundIds: [Number(data.fundIds)]
      // fundId: data.fundId.toString()
    };

    setValue("startTime", data.startTime);
    setValue("finishTime", data.finishTime);

    // The id from form values is passed alongside the mapped data
    console.log("Form Data to Update:", newData);

    // Call the mutation function with both the id and the data
    // mutate.mutate({ id: data.id, data: newData });
    mutate.mutate({ id: selectedBillId.toString(), data: newData });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item lg={4} md={6} sm={12} xs={12}>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
              sx={{ height: "100%" }}
            >
              <Controller
                name="date"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error }
                }) => (
                  <DatePicker
                    label="Date"
                    value={value || null} // Ensure the value is properly initialized
                    onChange={(newValue) => {
                      onChange(newValue); // Update the form state
                    }}
                    slotProps={{
                      textField: {
                        variant: "outlined",
                        fullWidth: true,
                        error: !!error,
                        helperText: error ? error.message : ""
                      }
                    }}
                  />
                )}
              />
            </Stack>
          </Grid>

          <Grid item lg={4} md={6} sm={12} xs={12}>
            <Controller
              name="fundIds"
              control={control}
              render={({ field }) => (
                <Select
                  fullWidth
                  size="small"
                  {...field}
                  value={field.value || "Select Fund"}
                  sx={{
                    height: "56px",
                    display: "flex",
                    alignItems: "center"
                    // marginTop: 2
                  }}
                  onChange={(e) => {
                    const selectedValue = e.target.value;

                    if (selectedValue && selectedValue !== "undefined") {
                      // setSelectedFund(selectedValue);
                      console.log("Selected Fund ID:", selectedValue); // Log the selected value directly
                    }

                    // Only update the state if selectedValue is not empty or undefined
                    if (selectedValue && selectedValue !== "Select Fund") {
                      // setSelectedFund(selectedValue);
                      {
                        /* Ensure selectedValue is a string */
                      }
                      console.log("Selected Fund ID:", selectedValue); // Log the selected value directly
                    }

                    // Ensure form state is updated
                    field.onChange(e);
                  }}
                >
                  {/* Default option that will be preselected */}
                  <MenuItem value="Select Fund" disabled>
                    Select Fund
                  </MenuItem>

                  {/* Check if fundsData is available and has funds */}
                  {fundsData?.[0]?.funds?.map((fund: any) => (
                    <MenuItem value={fund.fundId} key={fund.fundId}>
                      {fund.name}
                    </MenuItem>
                  ))}

                  {/* Fallback UI for empty funds data */}
                  {(!fundsData || fundsData[0]?.funds?.length === 0) && (
                    <MenuItem disabled>No funds available</MenuItem>
                  )}
                </Select>
              )}
            />
          </Grid>

          <Grid item lg={4} md={6} sm={12} xs={12}>
            <Controller
              control={control}
              name="pricebookId"
              render={({ field, fieldState: { error, invalid } }) => (
                <Box>
                  <Select
                    fullWidth
                    size="small"
                    value={field.value || ""} // Ensure the value is a string or default to an empty string
                    onChange={(e) => {
                      const _value = e.target.value;
                      field.onChange(_value); // Assign directly as a string
                    }}
                    displayEmpty
                    renderValue={
                      field.value ? undefined : () => "Select Price Book"
                    }
                  >
                    {isloading ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} />
                        Loading...
                      </MenuItem>
                    ) : price?.priceBooks?.length > 0 ? (
                      price.priceBooks.map((priceBook: any) => (
                        <MenuItem
                          value={String(priceBook.id)}
                          key={priceBook.id}
                        >
                          {priceBook.priceBookName}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No Price Books Available</MenuItem>
                    )}
                  </Select>
                  {invalid && <FormHelperText>{error?.message}</FormHelperText>}
                </Box>
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
                  value={field.value || ""} // Ensure the value is set or fallback to empty string
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
                  value={field.value || ""} // Ensure the value is set or fallback to empty string
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
                  label="Is Shift Updated"
                />
              )}
            />
          </Grid>
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <Grid sx={{ marginTop: 2 }}></Grid>
          <Divider />
          <DialogActions>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button variant="contained" color="error" onClick={onClose}>
                Close
              </Button>
              <Button type="submit" variant="contained" color="success">
                Update
              </Button>
            </Box>
          </DialogActions>
        </Grid>
      </Box>
    </form>
  );
};

export default EditBillForm;
