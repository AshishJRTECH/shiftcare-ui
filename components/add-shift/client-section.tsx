import {
  getAllClients,
  getClient,
  getClientAdditionalInformation,
  getClientContacts,
  getClientDocuments,
  getClientFunds,
  getClientSettings
} from "@/api/functions/client.api";
import {
  getPriceBooks,
  getPriceBooksListAll
} from "@/api/functions/pricebook.api";
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
  const role = getRole();
  const [selectedDisplayNames, setSelectedDisplayNames] = useState("");
  const { control, setValue, getValues } = useFormContext();
  const [open, setOpen] = React.useState(true);
  const [selectedClientId, setSelectedClientId] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["client_list"],
    queryFn: () => getAllClients(),
    enabled: role === "ROLE_ADMIN"
  });

  // console.log(
  //   ":::::::::::::::::: Participant Data Read ::::::::::::::::::",
  //   data
  // );

  const clientIdsString = selectedClientId; // Example string
  const clientIds = clientIdsString.split(",").map((id) => Number(id.trim())); // [3, 4]
  console.log("Id----------------------", clientIds);

  // const { data: price, isLoading: isloading } = useQuery({
  //   queryKey: ["price-books", router.query.page],
  //   queryFn: () => getPriceBooks((router.query.page as string) || "1")
  // });

  const { data: price, isLoading: isloading } = useQuery({
    queryKey: ["price-books", router.query.page],
    queryFn: () => getPriceBooksListAll((router.query.page as string) || "1")
  });

  useEffect(() => {
    console.log("-------------- Price Book ^^^^^^^^^^^ --------------", price);
  }, [price]);

  const handleRemoveName = (namesToRemove: string) => {
    // Remove the names from selectedDisplayNames
    const updatedNames = selectedDisplayNames
      .split(",")
      .filter((name) => !namesToRemove.includes(name.trim())) // Filter out names to remove
      .join(", ");

    setSelectedDisplayNames(updatedNames);

    // Find the client IDs associated with the names to remove
    const clientsToRemove = data.filter((client: any) =>
      namesToRemove.includes(client.displayName)
    );

    if (clientsToRemove.length > 0) {
      // Get the current clientIds from the form
      const currentClientIds = getValues("clientIds");

      // Filter out the IDs of the clients to remove
      const updatedClientIds = currentClientIds.filter(
        (id: string) =>
          !clientsToRemove.some((client: { id: string }) => client.id === id)
      );

      // Update the clientIds field in the form
      setValue("clientIds", updatedClientIds);
    }
  };

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
                    // <Box>
                    //   <Select
                    //     fullWidth
                    //     size="small"
                    //     {...field}
                    //     value={Array.isArray(field.value) ? field.value : []}
                    //     onChange={(e) => {
                    //       const _value = e.target.value;
                    //       field.onChange(
                    //         Array.isArray(_value) ? _value : [_value]
                    //       );
                    //     }}
                    //     displayEmpty
                    //     renderValue={
                    //       field.value?.length !== 0
                    //         ? undefined
                    //         : () => "Select Participant"
                    //     }
                    //     multiple
                    //   >
                    //     {isLoading ? (
                    //       <MenuItem disabled>
                    //         <CircularProgress size={20} />
                    //         Loading...
                    //       </MenuItem>
                    //     ) : (
                    //       data?.map((_data: IClient) => (
                    //         <MenuItem value={_data.id} key={_data.id}>
                    //           {_data.displayName}
                    //         </MenuItem>
                    //       ))
                    //     )}
                    //   </Select>
                    //   {invalid && (
                    //     <FormHelperText>{error?.message}</FormHelperText>
                    //   )}
                    // </Box>
                    <Box>
                      <Select
                        fullWidth
                        size="small"
                        {...field}
                        value={Array.isArray(field.value) ? field.value : []} // Ensure value is an array
                        onChange={(e) => {
                          const _value = e.target.value;
                          field.onChange(
                            Array.isArray(_value) ? _value : [_value]
                          ); // Ensure _value is an array

                          // Set selectedClientId state
                          setSelectedClientId(
                            Array.isArray(_value) ? _value.join(", ") : _value
                          );

                          // Get the selected display names
                          const selectedNames = data
                            ?.filter((client: any) =>
                              _value.includes(client.id)
                            )
                            .map((client: any) => client.displayName)
                            .join(", ");

                          setOpen(selectedNames.length);
                          setSelectedDisplayNames(selectedNames);
                          console.log(
                            ":::::::::::::::::: Selected Name of Participant::::::::",
                            selectedNames
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

      {open && selectedDisplayNames ? (
        selectedDisplayNames.split(",").map((name: string, index: number) => {
          // const clientData = Array.isArray(fundsData)
          //   ? fundsData.find(
          //       (client) => client.clientName.trim() === name.trim()
          //     )
          //   : null;

          // const relevantFunds = clientData ? clientData.funds : [];

          // Prefilling values for priceBookId and fundId
          const prefilledPriceBookId = shift?.priceBooks?.id; // Use the id from the priceBooks JSON
          // const prefilledPriceBookId = shift?.priceBooks?.[0]?.id || ""; // Use the id from the priceBooks JSON
          // const prefilledFundId = shift?.funds?.fundId;
          // relevantFunds.length > 0 ? relevantFunds[0].fundId : ""; // Use the first fundId if available

          return (
            <Card
              key={index}
              sx={{
                minWidth: 275,
                position: "relative",
                bgcolor: "#f5f5f5",
                border: "1px solid #ccc",
                boxShadow: 2,
                margin: "10px 0px 0px 6px",
                display: "inline-table;"
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
                    <Grid item lg={4} md={6} sm={12} xs={12}>
                      <Typography>Participant Name</Typography>
                    </Grid>
                    <Grid item lg={8} md={6} sm={12} xs={12}>
                      {name.trim()}
                    </Grid>

                    {/* Price Book Selection */}
                    <Grid item lg={4} md={6} sm={12} xs={12}>
                      <Typography>Choose Price</Typography>
                    </Grid>
                    <Grid item lg={8} md={6} sm={12} xs={12}>
                      <Controller
                        control={control}
                        name={`clientPriceBooks[${index}].priceBookIds`}
                        defaultValue={[prefilledPriceBookId]}
                        render={({ field, fieldState: { error, invalid } }) => (
                          <Box>
                            <Select
                              fullWidth
                              size="small"
                              {...field}
                              value={field.value || prefilledPriceBookId}
                              onChange={(e) => {
                                const _value = e.target.value;
                                field.onChange([_value]);
                              }}
                              displayEmpty
                              renderValue={
                                field.value && field.value.length > 0
                                  ? undefined
                                  : () => "Select Price Book"
                              }
                            >
                              {isLoading ? (
                                <MenuItem disabled>
                                  <CircularProgress size={20} />
                                  Loading...
                                </MenuItem>
                              ) : price?.length > 0 ? (
                                price.map((priceBook: any) => (
                                  <MenuItem
                                    value={priceBook.id}
                                    key={priceBook.id}
                                  >
                                    {priceBook.priceBookName}
                                  </MenuItem>
                                ))
                              ) : (
                                <MenuItem disabled>
                                  No Price Books Available
                                </MenuItem>
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
              </CardContent>
            </Card>
          );
        })
      ) : (
        <Typography></Typography>
      )}
    </>
  );
}
