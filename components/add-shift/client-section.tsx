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
import React from "react";
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
        <Typography variant="h6">Paritcipant</Typography>
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
              name="clientId"
              render={({ field, fieldState: { error, invalid } }) => {
                return (
                  <Box>
                    <Select
                      fullWidth
                      size="small"
                      {...field}
                      onChange={(e) => {
                        const _client: IClient = data.find(
                          (_data: IClient) => _data.id === e.target.value
                        );
                        field.onChange(e);
                        setValue("address", _client.address);
                        setValue("apartmentNumber", _client.apartmentNumber);
                      }}
                      displayEmpty
                      renderValue={
                        field.value === "" || !field.value
                          ? () => "Select Participant"
                          : undefined
                      }
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
