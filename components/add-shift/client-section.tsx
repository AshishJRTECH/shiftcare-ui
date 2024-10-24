import {
  getAllClients,
  getClient,
  getClientAdditionalInformation,
  getClientContacts,
  getClientDocuments,
  getClientFunds,
  getClientSettings
} from "@/api/functions/client.api";
import { getPriceBooks } from "@/api/functions/pricebook.api";
import { IClient } from "@/interface/client.interface";
import { ClientList, Shift } from "@/interface/shift.interface";
import assets from "@/json/assets";
import { getRole } from "@/lib/functions/_helpers.lib";
import StyledPaper from "@/ui/Paper/Paper";
import {
  Button,
  CardActions,
  CircularProgress,
  Divider,
  FormHelperText,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Typography
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useQueries, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import router from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useRouter } from "next/router";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CloseIcon from "@mui/icons-material/Close";

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

  // console.log(
  //   ":::::::::::::::::: Participant Data Read ::::::::::::::::::",
  //   data
  // );

  const { data: price, isLoading: isloading } = useQuery({
    queryKey: ["price-books", router.query.page],
    queryFn: () => getPriceBooks((router.query.page as string) || "1")
  });
  // console.log(price ? price.priceBooks : "Price data not loaded yet");

  return (
    <>
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
                {
                  <Typography variant="body1" textAlign="right">
                    {shift?.client.displayName}
                  </Typography>
                  // <Typography variant="body1" textAlign="right">
                  //   {(shift?.client as unknown as ClientList[])
                  //     ?.map((c) => c.displayName)
                  //     .join(", ")}
                  // </Typography>
                }
              </Link>
            </Grid>
          </Grid>
        ) : (
          <Grid container alignItems="center">
            <Grid container spacing={2}>
              <Grid item lg={4} md={6} sm={12} xs={12}>
                <Typography>Choose Participant</Typography>
              </Grid>
              <Grid item lg={8} md={6} sm={12} xs={12}>
                <Controller
                  control={control}
                  name="clientIds"
                  render={({ field, fieldState: { error, invalid } }) => (
                    <Box>
                      <Select
                        fullWidth
                        size="small"
                        {...field}
                        value={Array.isArray(field.value) ? field.value : []}
                        onChange={(e) => {
                          const _value = e.target.value;
                          field.onChange(
                            Array.isArray(_value) ? _value : [_value]
                          );
                        }}
                        displayEmpty
                        renderValue={
                          field.value?.length !== 0
                            ? undefined
                            : () => "Select Participant"
                        }
                        multiple
                      >
                        {isLoading ? (
                          <MenuItem disabled>
                            <CircularProgress size={20} />
                            Loading...
                          </MenuItem>
                        ) : (
                          data?.map((_data: IClient) => (
                            <MenuItem value={_data.id} key={_data.id}>
                              {_data.displayName}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                      {invalid && (
                        <FormHelperText>{error?.message}</FormHelperText>
                      )}
                    </Box>
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
        )}
      </StyledPaper>
    </>
  );
}
