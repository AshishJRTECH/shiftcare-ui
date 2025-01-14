import { appliedShiftApprove } from "@/api/functions/shift.api";
import { getAllAppliedShift } from "@/api/functions/shift.api";
import { IClient } from "@/interface/client.interface";
import { AppliedShift, ClientList, Shift } from "@/interface/shift.interface";
import assets from "@/json/assets";
import { getRole } from "@/lib/functions/_helpers.lib";
import StyledPaper from "@/ui/Paper/Paper";
import {
  Button,
  Divider,
  FormHelperText,
  Grid,
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
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { format, isValid } from "date-fns";
import { useMutation, useQueries } from "@tanstack/react-query";
import { queryClient } from "pages/_app";
import { toast } from "sonner";

export default function JobApplicant({
  view,
  edit,
  shift
}: {
  view?: boolean;
  edit?: boolean;
  shift?: Shift;
}) {
  const { control, setValue } = useFormContext();
  const role = getRole();

  const shiftId = shift?.id;

  const { data, isLoading, error } = useQuery({
    queryKey: ["applied_shift", shiftId],
    queryFn: () => getAllAppliedShift({ shiftId: shiftId as number }),
    enabled: role === "ROLE_ADMIN" && typeof shiftId === "number"
  });

  // Debugging logs
  console.log("Applied Shift:", data);
  console.log("Role:", role);
  console.log("Shift ID:", shiftId);
  console.log(
    "Is query enabled:",
    role === "ROLE_ADMIN" && typeof shiftId === "number"
  );

  if (error) {
    console.error("Error fetching applied shifts:", error);
  }

  // --------------- Applied Shift Approval is start here ---------------
  const [isApproved, setIsApproved] = useState(true);
  const { mutate } = useMutation({
    mutationFn: appliedShiftApprove,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["applied_shift"] });
      toast.success(response);
    },
    onError: (error) => {
      console.error("Error saving Compliance Data:", error);
    }
  });

  const onSubmit = (params: { applicationId: number; data: FormData }) => {
    mutate(params);
  };

  const handleApprove = async (id: number) => {
    // if (id != 0 || id != undefined) {
    //   setIsApproved(true);
    // }
    if (id) {
      const formData = new FormData();
      formData.append("isApproved", isApproved ? "true" : "false");

      console.log(
        "Submitting data",
        { id },
        formData // Check the file content
      );
      onSubmit({
        applicationId: id,
        data: formData
      });
    } else {
      console.log("Missing data");
    }
  };
  // --------------- Applied Shift Approval is end here ---------------

  return (
    <StyledPaper>
      <Stack direction="row" alignItems="center" gap={2}>
        <Typography variant="h6">Job Applicant List</Typography>
      </Stack>
      <Divider sx={{ marginBlock: "10px" }} />
      {view && data?.length > 0 ? (
        <Grid container alignItems="center">
          <Grid container alignItems="center">
            <TableContainer component={StyledPaper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {/* <TableCell>ID</TableCell> */}
                    <TableCell>Employee Name</TableCell>
                    <TableCell>Application Date</TableCell>
                    <TableCell>Applied</TableCell>
                    <TableCell>Approved</TableCell>
                    <TableCell>Action</TableCell> {/* New Action Column */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((applicant: AppliedShift) => (
                    <TableRow key={applicant.id}>
                      {/* <TableCell>{applicant.id}</TableCell> */}
                      <TableCell>{applicant.employeeName}</TableCell>
                      <TableCell>
                        {(() => {
                          // Ensure applicationDate is an array
                          if (!Array.isArray(applicant.applicationDate)) {
                            console.error(
                              "applicationDate is not an array:",
                              applicant.applicationDate
                            );
                            return "Invalid date";
                          }
                          const [year, month, day] = applicant.applicationDate; // Destructure the date array
                          const date = new Date(year, month - 1, day); // Month is 0-indexed

                          // Log the created date for debugging
                          console.log("Created Date:", date);

                          if (!isValid(date)) {
                            console.error(
                              "Invalid applicationDate:",
                              applicant.applicationDate
                            );
                            return "Invalid date"; // Handle invalid date
                          }

                          return format(date, "dd-MM-yyyy"); // Format date to dd-MM-yyyy
                        })()}
                      </TableCell>
                      <TableCell>
                        {applicant.isApplied ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>
                        {applicant.isApproved ? "Yes" : "No"}
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleApprove(applicant.id)} // Your approve handler function
                        >
                          Approve
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      ) : (
        <Typography>No applicants found.</Typography>
      )}
    </StyledPaper>
  );
}
