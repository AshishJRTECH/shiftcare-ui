import styled from "@emotion/styled";
import { Box, Stack } from "@mui/system";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FilledTextFieldProps,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedTextFieldProps,
  Select,
  StandardTextFieldProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  TextFieldVariants,
  Typography
} from "@mui/material";
import { Shift as IShift } from "@/interface/shift.interface";
import moment from "moment";
import AddShift from "../add-shift/add-shift";
import { getRole } from "@/lib/functions/_helpers.lib";
import { LoadingButton } from "@mui/lab";
import Iconify from "../Iconify/Iconify";
import { useMutation } from "@tanstack/react-query";
import { applyShift } from "@/api/functions/shift.api";
import { queryClient } from "pages/_app";
import { toast } from "sonner";
import AddNoteModal from "../add-shift/addNoteModal";
// import { Grid } from "antd";

const ShiftBox = styled(Box)<{ selected: boolean }>`
  background-color: ${(props) => (props.selected ? "#12ff004d" : "#f0f0f0")};
  cursor: pointer;
  padding: 16px;
  padding-left: 10px;
  width: auto;
  border: 0.5px solid #cecece;
  border-radius: 3px;
  margin: 3px 5px;
  padding: 1px 10px;
  border-bottom: 2px solid #aeaeae;
`;

export default function Shift({
  shift,
  type = "comfortable",
  isClient,
  bulkaction,
  selectall
}: {
  shift: IShift;
  type?: "comfortable" | "compact";
  isClient?: boolean;
  bulkaction?: boolean;
  selectall?: boolean;
}) {
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedShiftId, setSelectedShiftId] = useState<number | null>(null);
  const [openJobForPickUpModal, setJobForPickUpModal] = useState(false);

  // Initialize state with the value from session storage if available
  const [shiftIds, setShiftIds] = useState<number[]>(() => {
    const savedIds = sessionStorage.getItem("shiftIds");
    return savedIds ? JSON.parse(savedIds) : [];
  });

  const handleClick = (id: number) => {
    setSelectedShiftId(selectedShiftId === shift.id ? null : shift.id);
    // Read the current array from session storage
    const savedIds = sessionStorage.getItem("shiftIds");
    const currentIds = savedIds ? JSON.parse(savedIds) : [];

    // Update the array based on the clicked ID
    const updatedIds = currentIds.includes(id)
      ? currentIds.filter((existingId: number) => existingId !== id)
      : [...currentIds, id];

    // Save the updated array to session storage
    sessionStorage.setItem("shiftIds", JSON.stringify(updatedIds));

    console.log("$$$$$$$$", updatedIds);
    // Update the component state to trigger re-render and log the updated array
    setShiftIds(updatedIds);
  };

  // To log the output in the desired format
  useEffect(() => {
    if (selectall) {
      // Retrieve the list of shift IDs from session storage
      const shiftIdsList = JSON.parse(
        sessionStorage.getItem("shiftIdsList") || "[]"
      );

      // Update the state with the shift IDs
      if (shiftIdsList !== "" || shiftIdsList !== null) {
        setShiftIds(shiftIdsList); // setting data into array shiftIds fetched from array shiftIdsList
        sessionStorage.setItem("shiftIds", JSON.stringify(shiftIdsList)); // saving data of array shiftIds into session
        console.log(
          "All Selected Shift Ids shiftIdsList----------------------------",
          shiftIdsList
        );
        console.log(
          "All Selected Shift Ids shiftIds----------------------------",
          shiftIds
        );
      }
    } else {
      sessionStorage.removeItem("shiftIds");
      sessionStorage.setItem("shiftIds", JSON.stringify([])); // save the empty array into session
      setShiftIds([]);
      // console.log("Removed shiftIds----------------------------", shiftIds);
    }
  }, [selectall]);

  const unselectShifts = () => {
    // Read the current array from session storage
    const savedIds = sessionStorage.getItem("shiftIds");

    // If there's data in session storage, process it
    if (savedIds) {
      // Optionally, you could log the data that is being cleared
      // console.log("Clearing selected shifts:", JSON.parse(savedIds));

      // Clear the session storage
      sessionStorage.removeItem("shiftIds");

      // Optionally, you could save an empty array to the session storage (not strictly necessary)
      sessionStorage.setItem("shiftIds", JSON.stringify([]));

      // console.log("Selected Shifts:", shiftIds);

      // Update the component state to reflect the cleared array
      setShiftIds([]);
    }
  };

  useEffect(() => {
    unselectShifts();
    setSelectedShiftId(null);
  }, [bulkaction]); // unselectShifts() will be called on change of the value of bulkaction evrytime

  // useEffect(() => {
  //   console.log("selectAll after update:::", selectall);
  // }, [selectall]);

  // Determine if this ShiftBox should be selected based on selectall
  // const isSelected = selectall || shiftIds.includes(shift.id);
  const isSelected = shiftIds.includes(shift.id);

  const toUnselectBulkselected = (id: number) => {
    const shiftIds = sessionStorage.getItem("shiftIds");
    const currentIds = shiftIds ? JSON.parse(shiftIds) : [];

    if (shiftIds) {
      console.log("----------------: shiftIds :--------------", currentIds);

      // Update the array based on the current state
      const updatedIds = currentIds.includes(id)
        ? currentIds.filter((existingId: any) => existingId !== id) // Remove if already selected
        : [...currentIds, id]; // Add if not selected

      // Save the updated array to session storage
      sessionStorage.setItem("shiftIds", JSON.stringify(updatedIds));
      console.log(
        "----------------: Save Updated Array :--------------",
        updatedIds
      );
      const fresh = sessionStorage.getItem("shiftIds");
      console.log(
        "----------------: Read Updated Array :--------------",
        fresh
      );
      // Update the component state to reflect the change
      setShiftIds(updatedIds);
    }
  };

  // Handle click event
  const handleClicktoUnselectBulkselected = () => {
    toUnselectBulkselected(shift.id);
  };

  const handleCloseJobForPickupModal = () => {
    setJobForPickUpModal(false);
  };

  const [noteModal, setNoteModal] = useState(false);

  const role = getRole();
  const [loading, setLoading] = useState(false);

  const { mutate: shiftapply, isPending: isShiftApplying } = useMutation({
    mutationFn: applyShift,
    onSuccess: (response) => {
      setNoteModal(false);
      queryClient.invalidateQueries({ queryKey: ["all_shift"] });
      return toast.success(response.message);
      // setJobForPickUpModal(false);
    }
  });

  const handleApply = async () => {
    setLoading(true);
    try {
      if (shift?.id) {
        await shiftapply(shift.id); // Pass the shift.id directly if it's a number
      } else {
        // console.error("Shift ID is undefined or invalid");
      }
    } finally {
      setLoading(false); // Stop loading after action completes
      setJobForPickUpModal(false);
    }
  };

  // console.log("----------------- Shift Details ----------------", shift);
  return (
    <>
      {selectall ? (
        <ShiftBox
          selected={isSelected}
          sx={
            type === "comfortable"
              ? {
                  padding: "16px",
                  paddingLeft: "10px",
                  width: "100%"
                }
              : {
                  padding: "5px",
                  paddingLeft: "10px"
                }
          }
          onClick={() => {
            handleClicktoUnselectBulkselected();
          }}
        >
          {type === "comfortable" ? (
            <>
              <Box className="time">
                <Box className="border" />
                <Typography variant="caption" lineHeight="1.4">
                  {moment()
                    .set({
                      hours: shift.startTime[0],
                      minutes: shift.startTime[1]
                    })
                    .format("hh:mm a")}{" "}
                  <br></br>
                  {"To"}
                  <br></br>{" "}
                  {moment()
                    .set({
                      hours: shift.endTime[0],
                      minutes: shift.endTime[1]
                    })
                    .format("hh:mm a")}
                </Typography>
              </Box>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                gap={1}
              >
                <Typography
                  variant="body1"
                  style={{
                    overflow: "hidden",
                    textWrap: "nowrap",
                    textOverflow: "ellipsis",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    color: "#037171"
                  }}
                >
                  {isClient
                    ? shift.employee.displayName
                    : shift.client.displayName}
                </Typography>
              </Stack>
            </>
          ) : (
            <Stack direction="row" alignItems="center" gap={1}>
              <Box className="border" />
              <Typography variant="caption" sx={{ marginRight: "auto" }}>
                {isClient
                  ? shift.employee.displayName
                  : shift.client.displayName}
              </Typography>
              <Typography variant="caption">
                {moment()
                  .set({
                    hours: shift.startTime[0],
                    minutes: shift.startTime[1]
                  })
                  .format("hh:mm a")}{" "}
                <br></br>
                {"To"}
                <br></br>{" "}
                {moment()
                  .set({
                    hours: shift.endTime[0],
                    minutes: shift.endTime[1]
                  })
                  .format("hh:mm a")}
              </Typography>
            </Stack>
          )}
        </ShiftBox>
      ) : (
        <ShiftBox
          selected={isSelected}
          sx={
            type === "comfortable"
              ? {
                  padding: "16px",
                  paddingLeft: "10px",
                  width: "100%"
                }
              : {
                  padding: "5px",
                  paddingLeft: "10px"
                }
          }
          // onClick={() =>
          //   bulkaction ? handleClick(shift.id) : setViewModal(true)
          // }

          onClick={() => {
            if (bulkaction) {
              handleClick(shift.id);
            } else {
              if (shift.isPickupJob && role === "ROLE_CARER") {
                setSelectedShiftId(shift.id);
                setJobForPickUpModal(true);
              } else {
                setViewModal(true);
              }
            }
          }}
        >
          {type === "comfortable" ? (
            <>
              <Box className="time">
                <Box className="border" />
                <Typography variant="caption" lineHeight="1.4">
                  {moment()
                    .set({
                      hours: shift.startTime[0],
                      minutes: shift.startTime[1]
                    })
                    .format("hh:mm a")}{" "}
                  <br></br>
                  {"To"}
                  <br></br>{" "}
                  {moment()
                    .set({
                      hours: shift.endTime[0],
                      minutes: shift.endTime[1]
                    })
                    .format("hh:mm a")}
                </Typography>
              </Box>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                gap={1}
              >
                <Typography
                  variant="body1"
                  style={{
                    overflow: "hidden",
                    textWrap: "nowrap",
                    textOverflow: "ellipsis",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    color: "#037171"
                  }}
                >
                  {isClient
                    ? shift.employee.displayName
                    : shift.client.displayName}
                </Typography>
              </Stack>
            </>
          ) : (
            <Stack direction="row" alignItems="center" gap={1}>
              <Box className="border" />
              <Typography variant="caption" sx={{ marginRight: "auto" }}>
                {isClient
                  ? shift.employee.displayName
                  : shift.client.displayName}
              </Typography>
              <Typography variant="caption">
                From
                {moment()
                  .set({
                    hours: shift.startTime[0],
                    minutes: shift.startTime[1]
                  })
                  .format("hh:mm a")}{" "}
                <br></br>
                {"To"}
                <br></br>{" "}
                {moment()
                  .set({
                    hours: shift.endTime[0],
                    minutes: shift.endTime[1]
                  })
                  .format("hh:mm a")}
              </Typography>
            </Stack>
          )}
        </ShiftBox>
      )}

      <AddShift
        view={viewModal}
        edit={editModal}
        onClose={() => {
          setViewModal(false);
          setEditModal(false);
        }}
        setViewModal={setViewModal}
        setEditModal={setEditModal}
        shift={shift}
      />

      <Dialog
        open={openJobForPickUpModal}
        onClose={handleCloseJobForPickupModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Job For Pickup</DialogTitle>
        <Divider />
        <DialogContent>
          <Typography>
            You can pickup this shift by clicking on the below given Apply
            button.
          </Typography>

          {/* <Box display="flex" justifyContent="flex-end" gap={2}> */}
        </DialogContent>
        <DialogActions>
          {/* <Button variant="contained" onClick={handleCloseJobForPickupModal}>
            Cancel
          </Button> */}
          {shift?.isPickupJob && (
            <LoadingButton
              variant="contained"
              loading={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Iconify icon="tabler:check" fontSize={14} />
                )
              }
              onClick={handleApply}
              disabled={loading} // Disable button while loading
            >
              {loading ? "" : "Apply"} {/* Show text only when not loading */}
            </LoadingButton>
          )}
          {/* <Button
            variant="contained"
            startIcon={<Iconify icon="tabler:plus" fontSize={14} />}
            onClick={() => setNoteModal(true)}
          >
            Add Note
          </Button> */}
          <Button
            variant="contained"
            color="error"
            onClick={handleCloseJobForPickupModal}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <AddNoteModal
        open={noteModal}
        onClose={() => setNoteModal(false)}
        clientId={shift?.client.id}
        title="Add Note"
      />
    </>
  );
}
