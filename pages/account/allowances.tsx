import { addAllowance, getAllAllowances } from "@/api/functions/allowances";
import AllowanceRow, {
  allowance_types
} from "@/components/AllowanceRow/AllowanceRow";
import { Allowance, AllowanceBody } from "@/interface/settings.interfaces";
import validationText from "@/json/messages/validationText";
import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import CustomInput from "@/ui/Inputs/CustomInput";
import Scrollbar from "@/ui/scrollbar";
import styled from "@emotion/styled";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "pages/_app";
import { useEffect, useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";

const StyledBox = styled(Box)``;

const schema = yup.object().shape({
  allowancesName: yup.string().required(validationText.error.allowanceName),
  allowancesType: yup.string().required(validationText.error.allowanceType),
  value: yup.number().required(validationText.error.allowanceValue),
  externalId: yup.string()
});

export default function Allowances() {
  const [editId, setEditId] = useState<number | null>(null);
  const [addNew, setAddNew] = useState(false);
  const ref = useRef(null);

  const { data = [], isLoading } = useQuery({
    queryKey: ["allowances"],
    queryFn: getAllAllowances
  });

  useEffect(() => {
    // console.log("------------------ Allowance List ------------------", data);
  }, [data]);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      allowancesName: "",
      allowancesType: allowance_types[0].id,
      value: 0,
      externalId: ""
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: addAllowance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allowances"] }),
        setAddNew(false);
      methods.reset();
    }
  });

  const onSubmit = (body: AllowanceBody) => {
    mutate(body);
  };

  return (
    <DashboardLayout isLoading={isLoading}>
      <StyledBox>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={3}
          sx={{ marginBottom: "40px" }}
        >
          <Typography variant="h4">Allowances</Typography>
          {!addNew && (
            <Button variant="contained" onClick={() => setAddNew(true)}>
              New Allowance
            </Button>
          )}
        </Stack>
        <Scrollbar ref={ref}>
          <TableContainer sx={{ overflow: "unset" }} component={Paper}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>External Id</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length > 0
                  ? data.map((_data: Allowance) => (
                      <AllowanceRow
                        {..._data}
                        key={_data.id}
                        edit={editId === _data.id}
                        setEditId={setEditId}
                      />
                    ))
                  : null}
                {addNew ? (
                  <TableRow hover tabIndex={-1}>
                    <FormProvider {...methods}>
                      <TableCell>
                        <CustomInput name="allowancesName" />
                      </TableCell>
                      <TableCell>
                        <Controller
                          control={methods.control}
                          name="allowancesType"
                          render={({ field }) => (
                            <Select
                              size="small"
                              {...field}
                              fullWidth
                              name="allowanceType"
                            >
                              {allowance_types.map((_allowance) => (
                                <MenuItem
                                  value={_allowance.id}
                                  key={_allowance.id}
                                >
                                  {_allowance.name}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <CustomInput name="value" type="number" />
                      </TableCell>
                      <TableCell>
                        <CustomInput name="externalId" />
                      </TableCell>
                      <TableCell align="center">
                        <LoadingButton
                          loading={isPending}
                          size="small"
                          variant="contained"
                          sx={{ marginRight: "10px" }}
                          onClick={methods.handleSubmit(onSubmit)}
                        >
                          Save
                        </LoadingButton>
                        <Button
                          color="error"
                          size="small"
                          variant="contained"
                          onClick={() => {
                            setAddNew(false);
                            methods.clearErrors();
                          }}
                        >
                          Cancel
                        </Button>
                      </TableCell>
                    </FormProvider>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableCell colSpan={6}>
                    <Typography variant="body2" textAlign="center">
                      No Data
                    </Typography>
                  </TableCell>
                ) : null}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </StyledBox>
    </DashboardLayout>
  );
}
