import { get_payroll_setting, updateNotes } from "@/api/functions/staff.api";
import validationText from "@/json/messages/validationText";
import StyledPaper from "@/ui/Paper/Paper";
import styled from "@emotion/styled";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Divider,
  Grid,
  Paper,
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
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

const StyledBox = styled(Box)`
  padding-top: 10px;
`;

const schema = yup.object().shape({
  note: yup.string().required(validationText.error.notes)
});

export default function PayrollSetting() {
  const [edit, setEdit] = useState(false);

  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["payroll_setting_list"],
    queryFn: () => get_payroll_setting(id.toString()) // pass the id as an object
  });

  useEffect(() => {
    console.log("---------: Payroll Setting :---------", data);
  }, [data]);

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      note: ""
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateNotes,
    onSuccess: () => {
      setEdit(false);
      queryClient.invalidateQueries({ queryKey: ["notes", id] });
    }
  });

  const onSubmit = (data: { note: string }) => {
    mutate({ id: id as string, data: data.note });
  };

  return (
    <StyledPaper>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ paddingBottom: "15px" }}
      >
        <Typography variant="h5">Payroll Setting</Typography>
        {/* {!edit && (
          <Button size="small" onClick={() => setEdit(true)}>
            Edit
          </Button>
        )} */}
      </Stack>
      <Divider />
      <StyledBox
        sx={{
          paddingBottom: edit ? "16px" : 0
        }}
      >
        {/* <Typography
          variant="caption"
          sx={{ display: "inline-block", marginBottom: "5px" }}
        >
          Private Info
        </Typography> */}
        {edit ? (
          <Controller
            control={control}
            name="note"
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField
                multiline
                size="small"
                sx={{
                  display: "block",
                  marginTop: "5px",
                  fontSize: "14px",
                  "& textarea::placeholder": {
                    fontSize: "14px"
                  }
                }}
                {...field}
                fullWidth
                rows={5}
                placeholder="Enter Private Info"
                error={invalid}
                helperText={error?.message}
              />
            )}
          />
        ) : (
          // <Typography variant="body1">{/* {note} */}</Typography>
          // <Paper elevation={3} style={{ padding: "16px" }}>
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

          // </Paper>
        )}
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
