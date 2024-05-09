import useUser from "@/hooks/react-query/useUser";
import { useAppDispatch } from "@/hooks/redux/useAppDispatch";
import { UserData } from "@/interface/common.interface";
import { getCookie } from "@/lib/functions/storage.lib";
import { logout } from "@/reduxtoolkit/slices/userSlice";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { Theme, alpha } from "@mui/material/styles";
import { useRouter } from "next/router";
import { destroyCookie } from "nookies";
import React, { useState } from "react";

const MENU_OPTIONS = [
  {
    label: "Home",
    icon: "eva:home-fill",
    path: "/"
  },
  {
    label: "Profile",
    icon: "eva:person-fill",
    path: "/user/profile"
  }
  // {
  //   label: "Settings",
  //   icon: "eva:settings-2-fill"
  // }
];

const AccountPopover: React.FC = () => {
  const [open, setOpen] = useState<HTMLElement | null>(null);
  const user = useUser();

  const dispatch = useAppDispatch();

  const router = useRouter();

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = (e?: any, r?: any, path?: string) => {
    if (path) {
      router.push(path);
    }
    setOpen(null);
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme: Theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme: Theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`
          })
        }}
      >
        <Avatar
          src={user?.data?.data?.photoDownloadURL}
          alt="test"
          sx={{
            width: 36,
            height: 36,
            border: (theme: Theme) =>
              `solid 2px ${theme.palette.background.default}`
          }}
        >
          {user?.data?.data?.name?.charAt(0)}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={(e, r) => handleClose(e, r)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          ".MuiPaper-root": {
            boxShadow:
              " rgba(145, 158, 171, 0.2) 0px 5px 5px -3px, rgba(145, 158, 171, 0.14) 0px 8px 10px 1px, rgba(145, 158, 171, 0.12) 0px 3px 14px 2px",
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
            outline: 0,
            padding: 0,
            marginTop: 2,
            marginLeft: "6px",
            minWidth: 4,
            minHeight: 4,
            maxWidth: "calc(100% - 32px)",
            maxHeight: "calc(100% - 32px)",
            borderRadius: "8px"
          }
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{ textTransform: "capitalize" }}
            noWrap
          >
            {user?.data?.data?.name}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {user?.data?.data?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem
            key={option.label}
            onClick={() => handleClose(null, null, option.path)}
          >
            {option.label}
          </MenuItem>
        ))}

        <Divider sx={{ borderStyle: "dashed", m: 0 }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={() => {
            dispatch(logout());
            handleClose(null, null, "/auth/signin");
          }}
          sx={{ typography: "body2", color: "error.main", py: 1.5 }}
        >
          Logout
        </MenuItem>
      </Popover>
    </>
  );
};

export default AccountPopover;
