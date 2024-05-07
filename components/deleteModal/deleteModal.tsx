import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import { styled } from "@mui/system";

const StyledDialog = styled(Dialog)`
  h2 {
    font-size: 1.25rem;
  }
`;

export default function DeleteModal({
  title,
  description,
  agreeBtnText,
  declineBtnText,
  onAgree,
  onDecline,
  open,
  onClose,
  isActionLoading,
  onAgreeBtnType = "primary"
}: {
  title: string;
  description: string;
  agreeBtnText: string;
  declineBtnText: string;
  onAgree: () => void;
  onDecline: () => void;
  open: boolean;
  onClose: () => void;
  isActionLoading?: boolean;
  onAgreeBtnType?:
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "warning"
    | "info"
    | "inherit";
}) {
  return (
    <StyledDialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="primary"
          onClick={onDecline}
          size="small"
        >
          {declineBtnText}
        </Button>
        <LoadingButton
          variant="contained"
          color={onAgreeBtnType}
          onClick={onAgree}
          loading={isActionLoading}
          size="small"
        >
          {agreeBtnText}
        </LoadingButton>
      </DialogActions>
    </StyledDialog>
  );
}
