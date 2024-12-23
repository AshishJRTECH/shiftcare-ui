import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { getStaffList, getStaffShiftList } from "@/api/functions/staff.api";
import assets from "@/json/assets";
import { getRole } from "@/lib/functions/_helpers.lib";
import StyledPaper from "@/ui/Paper/Paper";
import {
  Button,
  Container,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import DatePicker from "react-datepicker"; // Import react-datepicker
import { ReactNode, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"; // Import Calendar icon
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker
} from "@react-google-maps/api";
import { GeoLocationCoordinatesTracking } from "@/interface/shift.interface";
import AddressCell from "pages/staff/team/addresscell";

export default function LoggedinShiftGeolocation() {
  const methods = useForm(); // Initialize useForm
  const { control } = methods; // Get control from methods
  const role = getRole();

  const { data, isLoading } = useQuery({
    queryKey: ["user_list"],
    queryFn: getStaffList,
    enabled: role === "ROLE_ADMIN"
  });

  const [selectedStaffId, setSelectedStaffId] = useState(0);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [triggerFetch, setTriggerFetch] = useState(false);

  const { data: shifttrack, isLoading: shifttrackLoading } = useQuery({
    queryKey: [
      "shiftlist",
      selectedStaffId,
      startDate ? startDate.toISOString().split("T")[0] : null, // Format date to 'YYYY-MM-DD'
      endDate ? endDate.toISOString().split("T")[0] : null // Format date to 'YYYY-MM-DD'
    ],
    queryFn: () =>
      getStaffShiftList(
        selectedStaffId.toString(),
        startDate ? startDate.toISOString().split("T")[0] : "", // Format date to 'YYYY-MM-DD'
        endDate ? endDate.toISOString().split("T")[0] : "" // Format date to 'YYYY-MM-DD'
      ),
    enabled: triggerFetch // Only trigger the query if `triggerFetch` is true
  });

  useEffect(() => {
    console.log("^^^^^^^^^^^^^^^^^^^^^ Id startDate an endDate:", {
      selectedStaffId,
      startDate,
      endDate
    });
  }, [selectedStaffId, startDate, endDate]);

  useEffect(() => {
    console.log("Shift Track Data: ", shifttrack);
  }, [shifttrack]);

  // Map component defined first
  const Map = ({
    coordinates,
    markersInfo
  }: {
    coordinates: { lat: number; lng: number }[];
    markersInfo: {
      clockInLatitude: null;
      participantname: ReactNode;
      shiftlocation: ReactNode;
      label: string;
      date: string;
      time: string;
      shiftid: string;
      shiftstartdate: string;
      shiftenddate: string;
      shiftstarttime: string;
      shiftendtime: string;
    }[];
  }) => {
    const containerStyle = {
      width: "100%",
      height: "400px"
    };

    const center =
      coordinates.length > 0
        ? coordinates[0]
        : { lat: 22.5430048, lng: 88.371854 }; // Default center

    const [activeMarker, setActiveMarker] = useState<number | null>(null);

    useEffect(() => {
      console.log("----========= activeMarker =========-----", activeMarker);
    }, [activeMarker]);

    // return (
    //   <LoadScript googleMapsApiKey="AIzaSyDsXUEv1aTdtqUR2dId4Juf1KlaxXM533Y">
    //     <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
    //       {/* {coordinates.map((coordinate, index) => (
    //         <Marker
    //           key={index}
    //           position={{ lat: coordinate.lat, lng: coordinate.lng }}
    //           icon={`http://maps.google.com/mapfiles/ms/icons/${
    //             index % 2 === 0 ? "green" : "red"
    //           }-dot.png`} // Green for clock-in, red for clock-out
    //           onClick={() => setActiveMarker(index)} // Set the clicked marker as active
    //         />
    //       ))} */}

    //       {/* {coordinates
    //         .filter((coordinate) => {
    //           const isValid = coordinate.lat != null && coordinate.lng != null;
    //           if (!isValid) {
    //             console.log(`Skipping invalid coordinate:`, coordinate); // Log invalid coordinates
    //           }
    //           return isValid;
    //         })
    //         .map((coordinate, index) => (
    //           <Marker
    //             key={index}
    //             position={{ lat: coordinate.lat, lng: coordinate.lng }}
    //             icon={`http://maps.google.com/mapfiles/ms/icons/${
    //               index % 2 === 0 ? "green" : "red"
    //             }-dot.png`} // Green for clock-in, red for clock-out
    //             onClick={() => setActiveMarker(index)} // Set the clicked marker as active
    //           />
    //         ))} */}

    //       {coordinates.map((coordinate, index) => {
    //         if (coordinate.lat === null || coordinate.lng === null) {
    //           console.log("Skipping invalid coordinate:", coordinate); // Log invalid coordinates
    //           return null; // Skip rendering for invalid coordinates
    //         }

    //         return (
    //           <Marker
    //             key={index}
    //             position={{ lat: coordinate.lat, lng: coordinate.lng }}
    //             icon={`http://maps.google.com/mapfiles/ms/icons/${
    //               index % 2 === 0 ? "green" : "red"
    //             }-dot.png`} // Green for clock-in, red for clock-out
    //             onClick={() => setActiveMarker(index)} // Set the clicked marker as active
    //           />
    //         );
    //       })}

    //       {/* ------------------ Coordinate Message Bix --------------------- */}

    //       {/* {activeMarker !== null && activeMarker < markersInfo.length && (
    //         <InfoWindow
    //           position={{
    //             lat: coordinates[activeMarker].lat,
    //             lng: coordinates[activeMarker].lng
    //           }}
    //           onCloseClick={() => setActiveMarker(null)} // Close the InfoWindow
    //         >
    //           <div>
    //             <h3>{markersInfo[activeMarker]?.label}</h3>
    //             <p>Date:- {markersInfo[activeMarker]?.date}</p>
    //             <p>Time:- {markersInfo[activeMarker]?.time}</p>
    //             <p>
    //               Participant Name:-{" "}
    //               {markersInfo[activeMarker]?.participantname}
    //             </p>
    //             <p>
    //               Shift Location:- {markersInfo[activeMarker]?.shiftlocation}
    //             </p>
    //             <p>Shift ID:- {markersInfo[activeMarker]?.shiftid}</p>
    //           </div>
    //         </InfoWindow>
    //       )} */}

    //       {activeMarker !== null &&
    //         activeMarker < markersInfo.length &&
    //         markersInfo[activeMarker]?.date !== "Invalid Date" && (
    //           <InfoWindow
    //             position={{
    //               lat: coordinates[activeMarker].lat,
    //               lng: coordinates[activeMarker].lng
    //             }}
    //             onCloseClick={() => setActiveMarker(null)} // Close the InfoWindow
    //           >
    //             <div>
    //               <h3>{markersInfo[activeMarker]?.label}</h3>
    //               <p>Shift ID: {markersInfo[activeMarker]?.shiftid}</p>
    //               <p>Date: {markersInfo[activeMarker]?.date}</p>
    //               <p>Time: {markersInfo[activeMarker]?.time}</p>
    //               <p>
    //                 Participant Name:{" "}
    //                 {markersInfo[activeMarker]?.participantname}
    //               </p>
    //               <p>
    //                 Shift Location: {markersInfo[activeMarker]?.shiftlocation}
    //               </p>

    //               <p>
    //                 Shift Start Date:{" "}
    //                 {markersInfo[activeMarker]?.shiftstartdate}
    //               </p>
    //               <p>
    //                 Shift Start Time:{" "}
    //                 {markersInfo[activeMarker]?.shiftstarttime}
    //               </p>
    //               <p>
    //                 Shift End Date: {markersInfo[activeMarker]?.shiftenddate}
    //               </p>
    //               <p>
    //                 Shift End Time: {markersInfo[activeMarker]?.shiftendtime}
    //               </p>
    //             </div>
    //           </InfoWindow>
    //         )}
    //     </GoogleMap>
    //   </LoadScript>
    // );

    return (
      <LoadScript googleMapsApiKey="AIzaSyDsXUEv1aTdtqUR2dId4Juf1KlaxXM533Y">
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
          {coordinates.map((coordinate, index) => {
            if (coordinate.lat === null || coordinate.lng === null) {
              console.log("Skipping invalid coordinate:", coordinate);
              return null;
            }

            const markerInfo = markersInfo[index];
            const isValidMarkerInfo =
              markerInfo &&
              markerInfo.date &&
              markerInfo.date !== "Invalid Date";

            return (
              <Marker
                key={index}
                position={{ lat: coordinate.lat, lng: coordinate.lng }}
                icon={`http://maps.google.com/mapfiles/ms/icons/${
                  index % 2 === 0 ? "green" : "red"
                }-dot.png`} // Green for clock-in, red for clock-out
                onClick={() => setActiveMarker(index)}
              >
                {/* {activeMarker === index && isValidMarkerInfo && ( */}
                {activeMarker === index && (
                  <InfoWindow
                    onCloseClick={() => setActiveMarker(null)}
                    position={{
                      lat: coordinate.lat,
                      lng: coordinate.lng
                    }}
                  >
                    <div>
                      <h3>{markerInfo.label}</h3>
                      <p>Shift ID: {markerInfo.shiftid}</p>
                      <p>Date: {markerInfo.date}</p>
                      <p>Time: {markerInfo.time}</p>
                      <p>Participant Name: {markerInfo.participantname}</p>
                      <p>Shift Location: {markerInfo.shiftlocation}</p>
                      <p>Shift Start Date: {markerInfo.shiftstartdate}</p>
                      <p>Shift Start Time: {markerInfo.shiftstarttime}</p>
                      <p>Shift End Date: {markerInfo.shiftenddate}</p>
                      <p>Shift End Time: {markerInfo.shiftendtime}</p>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            );
          })}
        </GoogleMap>
      </LoadScript>
    );
  };

  const coordinates =
    shifttrack
      ?.flatMap((geoloc: GeoLocationCoordinatesTracking) => {
        const clockIn = {
          lat: geoloc.clockInLatitude,
          lng: geoloc.clockInLongitude
        };
        const clockOut = {
          lat: geoloc.clockOutLatitude,
          lng: geoloc.clockOutLongitude
        };

        // Check if clockIn and clockOut have valid latitude and longitude
        return [
          clockIn.lat !== null && clockIn.lng !== null ? clockIn : null,
          clockOut.lat !== null && clockOut.lng !== null ? clockOut : null
        ];
      })
      .filter(Boolean) || []; // Remove null entries and default to an empty array if shifttrack is undefined or null

  // console.log("Coordinates : 2 ********:::::::::", coordinates);

  // Prepare markers info for both Login and Logout
  // const markersInfo =
  //   shifttrack?.flatMap((geoloc: GeoLocationCoordinatesTracking) => {
  //     const clockInDate = new Date(parseInt(geoloc.clockInEpoch, 10) * 1000);
  //     const clockOutDate = new Date(parseInt(geoloc.clockOutEpoch, 10) * 1000);
  //     const participantname = geoloc.participantName;
  //     const shiftlocation = geoloc.shiftLocation;
  //     const shiftid = geoloc.shiftId;
  //     const shiftstartTime = new Date(
  //       parseInt(geoloc.shiftStartTime, 10) * 1000
  //     );
  //     const shiftendTime = new Date(parseInt(geoloc.shiftEndTime, 10) * 1000);

  //     return [
  //       {
  //         label: "Login",
  //         date: clockInDate.toLocaleDateString(),
  //         time: clockInDate.toLocaleTimeString(),
  //         participantname: participantname,
  //         shiftlocation: shiftlocation,
  //         shiftid: shiftid,
  //         shiftstartdate: shiftstartTime.toLocaleDateString(),
  //         shiftenddate: shiftendTime.toLocaleDateString(),
  //         shiftstarttime: shiftstartTime.toLocaleTimeString(),
  //         shiftendtime: shiftendTime.toLocaleTimeString()
  //       },
  //       {
  //         label: "Logout",
  //         date: clockOutDate.toLocaleDateString(),
  //         time: clockOutDate.toLocaleTimeString(),
  //         participantname: participantname,
  //         shiftlocation: shiftlocation,
  //         shiftid: shiftid,
  //         shiftstartdate: shiftstartTime.toLocaleDateString(),
  //         shiftenddate: shiftendTime.toLocaleDateString(),
  //         shiftstarttime: shiftstartTime.toLocaleTimeString(),
  //         shiftendtime: shiftendTime.toLocaleTimeString()
  //       }
  //     ];
  //   }) || [];

  const markersInfo =
    shifttrack?.flatMap((geoloc: GeoLocationCoordinatesTracking) => {
      const clockInEpoch = parseInt(geoloc.clockInEpoch, 10) * 1000;
      const clockOutEpoch = parseInt(geoloc.clockOutEpoch, 10) * 1000;
      const shiftStartEpoch = parseInt(geoloc.shiftStartTime, 10) * 1000;
      const shiftEndEpoch = parseInt(geoloc.shiftEndTime, 10) * 1000;

      const clockInDate = new Date(clockInEpoch);
      const clockOutDate = new Date(clockOutEpoch);
      const shiftstartTime = new Date(shiftStartEpoch);
      const shiftendTime = new Date(shiftEndEpoch);

      const isValidDate = (date: Date) => !isNaN(date.getTime());

      if (
        !isValidDate(clockInDate) ||
        !isValidDate(clockOutDate) ||
        !isValidDate(shiftstartTime) ||
        !isValidDate(shiftendTime)
      ) {
        return [];
      }

      const participantname = geoloc.participantName;
      const shiftlocation = geoloc.shiftLocation;
      const shiftid = geoloc.shiftId;

      return [
        {
          label: "Login",
          date: clockInDate.toLocaleDateString(),
          time: clockInDate.toLocaleTimeString(),
          participantname,
          shiftlocation,
          shiftid,
          shiftstartdate: shiftstartTime.toLocaleDateString(),
          shiftenddate: shiftendTime.toLocaleDateString(),
          shiftstarttime: shiftstartTime.toLocaleTimeString(),
          shiftendtime: shiftendTime.toLocaleTimeString()
        },
        {
          label: "Logout",
          date: clockOutDate.toLocaleDateString(),
          time: clockOutDate.toLocaleTimeString(),
          participantname,
          shiftlocation,
          shiftid,
          shiftstartdate: shiftstartTime.toLocaleDateString(),
          shiftenddate: shiftendTime.toLocaleDateString(),
          shiftstarttime: shiftstartTime.toLocaleTimeString(),
          shiftendtime: shiftendTime.toLocaleTimeString()
        }
      ];
    }) || [];

  useEffect(() => {
    console.log(
      "------------------- Coordinate :: markersInfo -------------------",
      { coordinates, markersInfo }
    );
  }, [coordinates, markersInfo]);

  const submitHandle = () => {
    console.log("Button clicked! Form submitted!");
    setTriggerFetch(true);
  };

  return (
    <DashboardLayout>
      <Container>
        <FormProvider {...methods}>
          <StyledPaper>
            <Stack direction="row" alignItems="center" gap={2}>
              <Image
                src={assets.nurse}
                alt="Carer"
                width={25}
                height={25}
                className="icon"
              />
              <Typography variant="h6">Login Track</Typography>
            </Stack>
            <Divider sx={{ marginBlock: "10px" }} />

            <Grid container alignItems="center" spacing={3}>
              {" "}
              <Grid item lg={3} md={6} sm={12} xs={12}>
                <Stack direction="row" alignItems="center" gap={2}>
                  <Controller
                    control={control}
                    name="selectedDate"
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => {
                          setStartDate(date);
                          onChange(date);
                        }}
                        dateFormat="yyyy/MM/dd"
                        placeholderText="Select Start Date"
                        isClearable
                        customInput={
                          <TextField
                            size="small"
                            variant="outlined"
                            fullWidth
                            placeholder="Select Start Date"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <CalendarTodayIcon />
                                </InputAdornment>
                              )
                            }}
                          />
                        }
                      />
                    )}
                  />
                </Stack>
              </Grid>
              <Grid item lg={3} md={6} sm={12} xs={12}>
                <Stack direction="row" alignItems="center" gap={2}>
                  <Controller
                    control={control}
                    name="selectedDate"
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => {
                          setEndDate(date);
                          onChange(date);
                        }}
                        dateFormat="yyyy/MM/dd"
                        placeholderText="Select End Date"
                        isClearable
                        customInput={
                          <TextField
                            size="small"
                            variant="outlined"
                            fullWidth
                            placeholder="Select End Date"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <CalendarTodayIcon />
                                </InputAdornment>
                              )
                            }}
                          />
                        }
                      />
                    )}
                  />
                </Stack>
              </Grid>
              <Grid item lg={4} md={6} sm={12} xs={12}>
                <Controller
                  control={control}
                  name="employeeIds"
                  render={({ field }) => (
                    <Box>
                      <Grid item lg={12} md={6} sm={12} xs={12}>
                        <Controller
                          control={control}
                          name="allowanceIds"
                          render={({ field: { onChange, value } }) => (
                            <Box>
                              <Grid item lg={12} md={6} sm={12} xs={12}>
                                <Select
                                  fullWidth
                                  size="small"
                                  value={value || ""}
                                  onChange={(event) => {
                                    const selectedValue = event.target.value;
                                    const selectedCarer = data?.find(
                                      (carer: { id: number; name: string }) =>
                                        carer.id === selectedValue
                                    );
                                    setSelectedStaffId(selectedCarer?.id);
                                    console.log(
                                      "Selected ID:",
                                      selectedCarer?.id
                                    );
                                    console.log(
                                      "Selected Name:",
                                      selectedCarer?.name
                                    );
                                    onChange(selectedValue);
                                  }}
                                >
                                  {isLoading ? (
                                    <MenuItem disabled>Loading...</MenuItem>
                                  ) : (
                                    data?.slice(2).map((_allowance: any) => (
                                      <MenuItem
                                        value={_allowance.id}
                                        key={_allowance.id}
                                      >
                                        {_allowance.name}
                                      </MenuItem>
                                    ))
                                  )}
                                </Select>
                              </Grid>
                            </Box>
                          )}
                        />
                      </Grid>
                    </Box>
                  )}
                />
              </Grid>
              <Grid item lg={2} md={6} sm={12} xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={submitHandle}
                  fullWidth
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </StyledPaper>
        </FormProvider>

        <Grid container alignItems="center">
          <Grid container alignItems="center">
            {shifttrack && shifttrack.length > 0 ? (
              <TableContainer component={StyledPaper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Shift ID</TableCell>

                      <TableCell>Participant Name</TableCell>
                      <TableCell>Clock In</TableCell>
                      <TableCell>Clock Out</TableCell>
                      <TableCell>Shift Start Time</TableCell>
                      <TableCell>Shift End Time</TableCell>
                      <TableCell>Shift Location</TableCell>
                      <TableCell>Clock in Address</TableCell>
                      <TableCell>Clock out Address</TableCell>
                    </TableRow>
                  </TableHead>
                  {/* <TableBody>
                    {shifttrack.map(
                      (geoloc: GeoLocationCoordinatesTracking) => (
                        <TableRow key={geoloc.shiftId}>
                          <TableCell>{geoloc.shiftId}</TableCell>
                          <TableCell>{geoloc.shiftLocation}</TableCell>
                          <TableCell>{geoloc.participantName}</TableCell>
                          <TableCell>
                            {geoloc.clockInEpoch
                              ? new Date(
                                  parseInt(geoloc.clockInEpoch, 10) * 1000
                                ).toLocaleString()
                              : "No Login"}
                          </TableCell>
                          <TableCell>{geoloc.clockInLatitude}</TableCell>
                          <TableCell>{geoloc.clockInLongitude}</TableCell>
                          <TableCell>
                            {geoloc.clockOutEpoch
                              ? new Date(
                                  parseInt(geoloc.clockOutEpoch, 10) * 1000
                                ).toLocaleString()
                              : "No Logout"}
                          </TableCell>
                          <TableCell>
                            {geoloc.shiftStartTime
                              ? new Date(
                                  parseInt(geoloc.shiftStartTime, 10) * 1000
                                ).toLocaleString()
                              : ""}
                          </TableCell>
                          <TableCell>
                            {geoloc.shiftEndTime
                              ? new Date(
                                  parseInt(geoloc.shiftEndTime, 10) * 1000
                                ).toLocaleString()
                              : ""}
                          </TableCell>
                          <TableCell>{geoloc.clockOutLatitude}</TableCell>
                          <TableCell>{geoloc.clockOutLongitude}</TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody> */}
                  <TableBody>
                    {shifttrack.map(
                      (geoloc: GeoLocationCoordinatesTracking) => (
                        <TableRow key={geoloc.shiftId}>
                          <TableCell>{geoloc.shiftId}</TableCell>

                          <TableCell>{geoloc.participantName}</TableCell>
                          <TableCell>
                            {geoloc.clockInEpoch
                              ? new Date(
                                  parseInt(geoloc.clockInEpoch, 10) * 1000
                                ).toLocaleString()
                              : "No Login"}
                          </TableCell>
                          {/* <TableCell>{geoloc.clockInLatitude}</TableCell>
                          <TableCell>{geoloc.clockInLongitude}</TableCell> */}

                          <TableCell>
                            {geoloc.clockOutEpoch
                              ? new Date(
                                  parseInt(geoloc.clockOutEpoch, 10) * 1000
                                ).toLocaleString()
                              : "No Logout"}
                          </TableCell>
                          <TableCell>
                            {geoloc.shiftStartTime
                              ? new Date(
                                  parseInt(geoloc.shiftStartTime, 10) * 1000
                                ).toLocaleString()
                              : ""}
                          </TableCell>
                          <TableCell>
                            {geoloc.shiftEndTime
                              ? new Date(
                                  parseInt(geoloc.shiftEndTime, 10) * 1000
                                ).toLocaleString()
                              : ""}
                          </TableCell>
                          {/* <TableCell>{geoloc.clockOutLatitude}</TableCell>
                          <TableCell>{geoloc.clockOutLongitude}</TableCell> */}
                          <TableCell>{geoloc.shiftLocation}</TableCell>
                          <TableCell>
                            {/* Use AddressCell component to display clock-in address */}
                            <AddressCell
                              latitude={
                                typeof geoloc.clockInLatitude === "number"
                                  ? geoloc.clockInLatitude
                                  : null
                              }
                              longitude={
                                typeof geoloc.clockInLongitude === "number"
                                  ? geoloc.clockInLongitude
                                  : null
                              }
                            />
                          </TableCell>
                          <TableCell>
                            {/* Use AddressCell component to display clock-out address */}
                            <AddressCell
                              latitude={
                                typeof geoloc.clockOutLatitude === "number"
                                  ? geoloc.clockOutLatitude
                                  : null
                              }
                              longitude={
                                typeof geoloc.clockOutLongitude === "number"
                                  ? geoloc.clockOutLongitude
                                  : null
                              }
                            />
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No Data</Typography>
            )}
          </Grid>

          <Grid item xs={12} sx={{ margin: 1, width: "100%" }}>
            <Map coordinates={coordinates} markersInfo={markersInfo} />{" "}
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
}
