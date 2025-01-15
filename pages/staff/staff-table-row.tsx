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

export default function StaffTableRow({
  id,
  name,
  gender,
  role,
  email,
  mobileNo,
  address,
  employmentType,
  selected,
  handleClick,
  index
}: {
  id: number;
  name: string;
  gender: string;
  role: string;
  email: string;
  mobileNo: string;
  address: string;
  employmentType: string;
  selected: boolean;
  handleClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  index: number;
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
      <TableRow
        hover
        tabIndex={-1}
        role="checkbox"
        selected={selected}
        onClick={(e) => handleCloseMenu(e, `/staff/${id}/view`)}
        style={{ cursor: "pointer" }}
      >
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Stack direction="row" alignItems="center" spacing={2}>
            {/* <Avatar alt={name} src={avatarUrl} /> */}
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{gender}</TableCell>

        <TableCell>{role}</TableCell>
        <TableCell>{email}</TableCell>
        <TableCell>{mobileNo}</TableCell>
        <TableCell>{address}</TableCell>
        <TableCell>{employmentType}</TableCell>

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
          // disabled={index === 0}
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
