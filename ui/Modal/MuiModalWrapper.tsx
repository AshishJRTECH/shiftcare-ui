import { borderRadius } from "@/themes/themeConstant";
import CloseIcon from "@mui/icons-material/Close";
import { Button, DialogActions, DialogTitle } from "@mui/material";
import Box from "@mui/material/Box";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ReactNode } from "react";

interface MuiModalWrapperProps extends DialogProps {
  title: string;
  onClose: () => void;
  DialogActions?: JSX.Element;
}

export default function MuiModalWrapper(props: MuiModalWrapperProps) {
  const { open, onClose, scroll, children, title, DialogActions } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog
      scroll={scroll}
      aria-labelledby="responsive-dialog-title"
      PaperProps={{
        style: {
          borderRadius: fullScreen ? 0 : borderRadius
        }
      }}
      sx={{
        ".MuiDialogActions-root": {
          paddingRight: "15px",
          paddingBottom: "15px"
        }
      }}
      fullScreen={fullScreen}
      {...props}
    >
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          // sx={{ padding: "10px" }}
        >
          <Typography variant="h5">{title}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>{children}</DialogContent>
      {DialogActions}
      {/* <DialogActions>
        <Button variant="outlined">Cancel</Button>
        <Button variant="contained">Create</Button>
      </DialogActions> */}
    </Dialog>
  );
}
