import Logo from "@/components/logo/logo";
import { useResponsive } from "@/hooks/utils/use-responsive";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { NAV } from "@/config/constants";
import { UserData } from "@/interface/common.interface";
import { roleParser } from "@/lib/functions/_helpers.lib";
import { getCookie } from "@/lib/functions/storage.lib";
import Scrollbar from "@/ui/scrollbar";
import navConfig from "../config-navigation";
import SidebarItem from "./SidebarItem";
import useUser from "@/hooks/react-query/useUser";

interface SidebarProps {
  openNav: boolean;
  onCloseNav: () => void;
}

export default function Sidebar({ openNav, onCloseNav }: SidebarProps) {
  const pathname = usePathname();
  const ref = useRef(null);
  const upLg = useResponsive("up", "lg");
  const user = useUser();

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderAccount = (
    <Box
      sx={{
        my: 3,
        mx: 2.5,
        py: 2,
        px: 2.5,
        display: "flex",
        borderRadius: 1.5,
        alignItems: "center",
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12)
      }}
    >
      <Avatar src={user?.data?.data?.photoDownloadURL} alt="photoURL">
        {user?.data?.data?.name?.charAt(0)}
      </Avatar>

      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2" sx={{ color: "#000000" }}>
          {user?.data?.data?.name}
        </Typography>

        {/* <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {roleParser(user?.data?.data?.role?.[0].name || "")}
        </Typography> */}
        <Typography variant="body2" sx={{ color: "#747474" }}>
          {roleParser(user?.data?.data?.role?.[0].name || "")}
        </Typography>
      </Box>
    </Box>
  );

  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2, color: "#ffffff" }}>
      {navConfig.map((item) => (
        <SidebarItem key={item.title} item={item} />
      ))}
    </Stack>
  );

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "&.simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column"
        }
      }}
      ref={ref}
    >
      <Logo sx={{ mt: 3, ml: 4 }} />

      {renderAccount}

      {renderMenu}

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH }
      }}
    >
      {upLg ? (
        <Box
          sx={{
            color: "#ffffff",
            height: 1,
            position: "fixed",
            width: NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
              color: "#ffffff"
            }
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
