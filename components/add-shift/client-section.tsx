import { getAllClients } from "@/api/functions/client.api";
import { IClient } from "@/interface/client.interface";
import { Shift } from "@/interface/shift.interface";
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
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

export default function ClientSection({
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

  const { data, isLoading } = useQuery({
    queryKey: ["client_list"],
    queryFn: () => getAllClients(),
    enabled: role === "ROLE_ADMINS"
  });

  useEffect(() => {
    console.log("============== Dropdown Data Check =================", data);
  }, data);

  return (
    <StyledPaper>
      <Stack direction="row" alignItems="center" gap={2}>
        <Image
          src={assets.client_img}
          alt="Client"
          width={512}
          height={512}
          className="icon"
        />
        <Typography variant="h6">Participant</Typography>
      </Stack>
      <Divider sx={{ marginBlock: "10px" }} />
      {view ? (
        <Grid container alignItems="center">
          <Grid item lg={8} md={6} sm={12} xs={12}>
            <Typography>Name</Typography>
          </Grid>
          <Grid item lg={4} md={6} sm={12} xs={12}>
            <Link
              href={`/participants/${shift?.client?.id}/view`}
              style={{ textDecoration: "none", color: "#333" }}
            >
              <Typography variant="body1" textAlign="right">
                {shift?.client.displayName}
              </Typography>
            </Link>
          </Grid>
        </Grid>
      ) : (
        <Grid container alignItems="center">
          <Grid item lg={4} md={6} sm={12} xs={12}>
            <Typography>Choose Participant</Typography>
          </Grid>
          <Grid item lg={8} md={6} sm={12} xs={12}>
            <Controller
              control={control}
              name="clientIds"
              render={({ field, fieldState: { error, invalid } }) => {
                return (
                  <Box>
                    <Select
                      fullWidth
                      size="small"
                      {...field}
                      value={Array.isArray(field.value) ? field.value : []} // Ensure value is always an array
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
                          ? () => "Select Participant"
                          : () => "Select Participant"
                      }
                      multiple
                    >
                      {isLoading ? (
                        <MenuItem disabled>Loading...</MenuItem>
                      ) : (
                        data?.map((_data: IClient) => (
                          <MenuItem value={_data.id} key={_data.id}>
                            {_data.firstName} {_data.lastName}
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
