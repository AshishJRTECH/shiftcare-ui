import { useState } from "react";

import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Popover from "@mui/material/Popover";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import Label from "@/ui/label/label";
import Iconify from "@/components/Iconify/Iconify";
import { useRouter } from "next/router";
import DeleteModal from "@/components/deleteModal/deleteModal";
import { useMutation } from "@tanstack/react-query";
import { deleteStaff } from "@/api/functions/staff.api";
import { queryClient } from "pages/_app";

// ----------------------------------------------------------------------

export default function ClientTableRow({
  id,
  displayName,
  gender,
  age,
  ndis,
  recipient_id,
  mobileNo,
  phoneNo,
  email,
  address,
  type,
  pricebook,
  review,
  selected,
  handleClick
}: {
  id: number;
  displayName: string;
  gender: string;
  age: string;
  ndis: string;
  recipient_id: string;
  mobileNo: string;
  phoneNo: string;
  email: string;
  address: string;
  type: string;
  pricebook: any;
  review: number;
  selected: boolean;
  handleClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [open, setOpen] = useState<HTMLElement | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const router = useRouter();

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = (
    event: React.MouseEvent<HTMLElement>,
    path?: string
  ) => {
    if (path && path !== "backdropClick") {
      router.push(path);
    }
    setOpen(null);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: deleteStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_list"] });
      setDeleteModal(false);
    }
  });

  return (
    <>
      <TableRow hover tabIndex={-1}>
        {/* <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell> */}

        <TableCell component="th" scope="row">
          <Stack direction="row" alignItems="center" spacing={2}>
            {/* <Avatar alt={name} src={avatarUrl} /> */}
            <Typography variant="subtitle2" noWrap>
              {displayName}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{gender}</TableCell>

        <TableCell>{age}</TableCell>
        <TableCell>{ndis}</TableCell>
        <TableCell>{recipient_id}</TableCell>
        <TableCell>{mobileNo}</TableCell>
        <TableCell>{phoneNo}</TableCell>
        <TableCell>{email}</TableCell>
        <TableCell>{address}</TableCell>
        <TableCell>{type}</TableCell>
        <TableCell>{pricebook}</TableCell>
        <TableCell>{review}</TableCell>

        {/* <TableCell align="center">{isVerified ? "Yes" : "No"}</TableCell>

        <TableCell>
          <Label color={(status === "banned" && "error") || "success"}>
            {status}
          </Label>
        </TableCell> */}

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: { width: 140 }
          }
        }}
      >
        <MenuItem onClick={(e) => handleCloseMenu(e, `/staff/${id}/view`)}>
          <Iconify icon="eva:file-text-outline" sx={{ mr: 2 }} />
          View
        </MenuItem>
        {/* <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem> */}

        <MenuItem
          onClick={(e) => {
            setDeleteModal(true);
            handleCloseMenu(e);
          }}
          sx={{ color: "error.main" }}
        >
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
      <DeleteModal
        title="Delete Staff"
        description="Are you sure, you want to delete this staff?"
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        agreeBtnText="Yes, Delete"
        declineBtnText="Not sure"
        onAgreeBtnType="error"
        isActionLoading={isPending}
        onAgree={() => mutate(id)}
        onDecline={() => setDeleteModal(false)}
      />
    </>
  );
}
