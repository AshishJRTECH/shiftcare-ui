import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Backdrop } from "@mui/material";

export default function Loader() {
  return (
    <Backdrop
      open
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.2)"
      }}
    >
      <CircularProgress />
    </Backdrop>
  );
}
