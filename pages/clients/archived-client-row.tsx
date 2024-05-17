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
import { unarchiveClient } from "@/api/functions/client.api";
import { IClient } from "@/interface/client.interface";

// ----------------------------------------------------------------------

export default function ArchivedClientRow({
  id,
  displayName,
  ndisNumber,
  agedCareRecipientID,
  contactNumber,
  email,
  address,
  priceBookName
}: IClient) {
  const { mutate, isPending } = useMutation({
    mutationFn: unarchiveClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["archived_list_client"] });
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

        <TableCell>{ndisNumber}</TableCell>
        <TableCell>{agedCareRecipientID}</TableCell>
        <TableCell>{contactNumber}</TableCell>
        <TableCell>{email}</TableCell>
        <TableCell>{address}</TableCell>
        <TableCell>{priceBookName}</TableCell>

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
