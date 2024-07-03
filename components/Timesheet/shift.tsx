import styled from "@emotion/styled";
import { Box, Stack } from "@mui/system";
import React, { useEffect, useState } from "react";
import LoopIcon from "@mui/icons-material/Loop";
import { Typography } from "@mui/material";
import { Shift as IShift } from "@/interface/shift.interface";
import moment from "moment";
import AddShift from "../add-shift/add-shift";

const ShiftBox = styled(Box)`
  background-color: #f0f0f0;
  cursor: pointer;
  .time {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }
  .border {
    width: 2px;
    background-color: green;
    height: 15px;
    border-radius: 10px;
    margin-right: 5px;
  }
`;

export default function Shift({
  shift,
  type = "comfortable",
  isClient
}: {
  shift: IShift;
  type?: "comfortable" | "compact";
  isClient?: boolean;
}) {
  const [viewModal, setViewModal] = useState(false);
  const [editMddal, setEditModal] = useState(false);

  return (
    <>
      <ShiftBox
        sx={
          type === "comfortable"
            ? {
                padding: "16px",
                paddingLeft: "10px",
                width: "100%"
                //   width: shift.isShiftEndsNextDay ? "200px" : "100%"
              }
            : { padding: "5px", paddingLeft: "10px" }
        }
        onClick={() => setViewModal(true)}
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
                -{" "}
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
                  textOverflow: "ellipsis"
                }}
              >
                {isClient
                  ? shift.employee.displayName
                  : shift.client.displayName}
              </Typography>
              {/* <LoopIcon color="disabled" fontSize="small" /> */}
            </Stack>
          </>
        ) : (
          <Stack direction="row" alignItems="center" gap={1}>
            <Box className="border" />
            <Typography variant="caption" sx={{ marginRight: "auto" }}>
              {isClient ? shift.employee.displayName : shift.client.displayName}
            </Typography>
            <Typography variant="caption">
              {moment()
                .set({
                  hours: shift.startTime[0],
                  minutes: shift.startTime[1]
                })
                .format("hh:mm a")}{" "}
              -{" "}
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
      <AddShift
        view={viewModal}
        edit={editMddal}
        onClose={() => {
          setViewModal(false);
          setEditModal(false);
        }}
        setViewModal={setViewModal}
        setEditModal={setEditModal}
        shift={shift}
      />
    </>
  );
}
