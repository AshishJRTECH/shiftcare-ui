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
import { deleteStaff, unarchiveStaff } from "@/api/functions/staff.api";
import { queryClient } from "pages/_app";
import { Button } from "@mui/material";

// ----------------------------------------------------------------------

export default function ArchivedStaffRow({
  id,
  name,
  role,
  email,
  mobileNo,
  address
}: {
  id: number;
  name: string;
  role: string;
  email: string;
  mobileNo: string;
  address: string;
}) {
  const { mutate, isPending } = useMutation({
    mutationFn: unarchiveStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["archived_list"] });
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
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{role}</TableCell>
        <TableCell>{email}</TableCell>
        <TableCell>{mobileNo}</TableCell>
        <TableCell>{address}</TableCell>

        {/* <TableCell align="center">{isVerified ? "Yes" : "No"}</TableCell>

        <TableCell>
          <Label color={(status === "banned" && "error") || "success"}>
            {status}
          </Label>
        </TableCell> */}

        <TableCell align="right">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => mutate(id)}
            size="small"
          >
            Unarchive
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
}
