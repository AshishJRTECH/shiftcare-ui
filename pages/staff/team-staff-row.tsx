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
import { deleteStaff, deleteTeam } from "@/api/functions/staff.api";
import { queryClient } from "pages/_app";
import { StaffTeam } from "@/interface/staff.interfaces";
import { Chip } from "@mui/material";

// ----------------------------------------------------------------------

export default function TeamStaffRow({
  id,
  teamName,
  employees,
  employeeCount
}: StaffTeam) {
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
    mutationFn: deleteTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      setDeleteModal(false);
    }
  });

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell component="th" scope="row">
          <Stack direction="row" alignItems="center" spacing={2}>
            {/* <Avatar alt={name} src={avatarUrl} /> */}
            <Typography variant="subtitle2" noWrap>
              {teamName}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{employeeCount}</TableCell>

        <TableCell sx={{ maxWidth: "250px" }}>
          <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
            {employees.map((_employee: { id: number; name: string }) => (
              <Chip label={_employee.name} color="default" key={_employee.id} />
            ))}
          </Stack>
        </TableCell>

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
        <MenuItem onClick={(e) => handleCloseMenu(e, `/staff/team/${id}`)}>
          <Iconify icon="mingcute:edit-line" sx={{ mr: 2 }} />
          Edit
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
