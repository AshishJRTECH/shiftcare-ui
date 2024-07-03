import styled from "@emotion/styled";
import { Button, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import moment, { Moment } from "moment";
import React, { SetStateAction, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AddIcon from "@mui/icons-material/Add";
import AddShift from "../add-shift/add-shift";
import { getRole } from "@/lib/functions/_helpers.lib";

const StyledStack = styled(Stack)`
  margin-bottom: 20px;
  h5 {
    margin-left: auto;
    margin-right: auto;
  }
`;

const StyledButton = styled(Button)`
  background-color: #fff;
  color: #555;
  box-shadow: none;
  border: 1px solid #ccc;
  padding-block: 10px;
  &:hover {
    background-color: #ececec;
    box-shadow: none;
  }
`;

export default function CalendarToolbar({
  date,
  setDate
}: {
  date: Moment;
  setDate: React.Dispatch<SetStateAction<Moment>>;
}) {
  const [shiftModal, setShiftModal] = useState(false);
  const role = getRole();

  return (
    <StyledStack direction="row" alignItems="center" gap={2}>
      <Typography variant="h5">{moment(date).format("MMMM YYYY")}</Typography>
      <Stack direction="row" gap={1}>
        <StyledButton
          onClick={() => setDate((prev) => moment(prev).subtract(1, "month"))}
        >
          <ArrowBackIosNewIcon />
        </StyledButton>
        <StyledButton onClick={() => setDate(moment())}>
          <Typography>This Month</Typography>
        </StyledButton>
        <StyledButton
          onClick={() => setDate((prev) => moment(prev).add(1, "month"))}
        >
          <ArrowForwardIosIcon />
        </StyledButton>
      </Stack>
      {role === "ROLE_ADMIN" && (
        <Button
          variant="contained"
          size="large"
          sx={{
            minHeight: 45
          }}
          startIcon={<AddIcon />}
          onClick={() => setShiftModal(true)}
        >
          Shift
        </Button>
      )}
      <AddShift open={shiftModal} onClose={() => setShiftModal(false)} />
    </StyledStack>
  );
}
