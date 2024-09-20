/* eslint-disable react/display-name */
/* eslint-disable react/require-default-props */
import Box from "@mui/material/Box";
import { Theme, useTheme } from "@mui/material/styles";
import { SxProps } from "@mui/system";
import { ReactNode, forwardRef } from "react";
import { StyledLabel } from "./styles";
import { Typography } from "@mui/material";

interface LabelProps {
  children: ReactNode;
  color?:
    | "primary"
    | "default"
    | "secondary"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "grey"
    | "common"
    | "divider"
    | "action";
  variant?: "outlined" | "filled" | "soft";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

const Label = forwardRef<HTMLSpanElement, LabelProps>(
  (
    {
      children,
      color = "default",
      variant = "soft",
      startIcon,
      endIcon,
      sx = {},
      ...other
    },
    ref
  ) => {
    const theme = useTheme();

    const iconStyles = {
      width: 16,
      height: 16,
      "& svg, img": { width: "100%", height: "100%", objectFit: "cover" }
    };

    return (
      // <StyledLabel
      //   ref={ref}
      //   component="span"
      //   ownerState={{ color, variant }}
      //   sx={{
      //     ...(startIcon ? { paddingLeft: 0.75 } : {}),
      //     ...(endIcon ? { paddingRight: 0.75 } : {}),
      //     ...sx
      //   }}
      //   theme={theme}
      //   {...other}
      // >
      //   {startIcon && (
      //     <Box sx={{ marginRight: 0.75, ...iconStyles }}>
      //       {React.isValidElement(startIcon) ? startIcon : null}
      //     </Box>
      //   )}

      //   {children}

      //   {endIcon && (
      //     <Box sx={{ marginLeft: 0.75, ...iconStyles }}>
      //       {React.isValidElement(endIcon) ? endIcon : null}
      //     </Box>
      //   )}
      // </StyledLabel>

      <Typography>-</Typography>
    );
  }
);

export default Label;
