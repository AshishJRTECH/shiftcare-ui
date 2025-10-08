/* eslint-disable no-nested-ternary */
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import { alpha } from "@mui/material/styles";
import { usePathname } from "next/navigation";
import { createElement, useState } from "react";

import { Stack, Theme } from "@mui/material";
// import ListItemIcon from "@mui/material/ListItemIcon";
import { useRouter } from "next/router";
import { NavItem } from "../config-navigation";

interface SidebarItemProps {
  item: NavItem;
}

function SidebarItem({ item }: SidebarItemProps) {
  const pathname = usePathname();
  const active =
    pathname === "/"
      ? item.path === pathname
      : item?.path?.includes(pathname.split("/")[1]);
  const [open, setOpen] = useState(active);
  const router = useRouter();

  const active_sx = {
    color: "primary.main",
    fontWeight: "fontWeightSemiBold",
    bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.08),
    "&:hover": {
      bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.16)
    }
  };

  const sx = {
    minHeight: 44,
    borderRadius: 0.75,
    typography: "body2",
    color: "text.secondary",
    textTransform: "capitalize",
    fontWeight: "fontWeightMedium"
    // ...(active && active_sx)
  };

  const handleClick = (item: NavItem) => {
    if (item?.hasChild) {
      setOpen(!open);
    } else {
      router.push(item?.path as string);
    }
  };

  return (
    <>
      <ListItemButton
        sx={{
          ...sx,
          ...(active && active_sx),
          color: "#5a5a5a",
          background: "#eeeff7"
        }}
        onClick={() => handleClick(item)}
      >
        <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
          {item.icon && createElement(item.icon)}
        </Box>

        <Stack
          justifyContent="space-between"
          direction="row"
          alignItems="center"
          width="100%"
        >
          <Box component="span">{item.title} </Box>

          {item?.children?.length ? (
            open ? (
              <ExpandLess />
            ) : (
              <ExpandMore />
            )
          ) : null}
        </Stack>
      </ListItemButton>

      {item?.children?.length ? (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item?.children?.map((_item) => {
              const link_active = _item?.path === pathname;
              return (
                <ListItemButton
                  onClick={() => {
                    router.push(_item?.path as string);
                  }}
                  sx={{
                    ...sx,
                    pl: 4,
                    ...(link_active && active_sx),
                    color: "#5a5a5a"
                  }}
                  key={_item.path}
                >
                  <Box
                    component="span"
                    sx={{ width: 24, height: 24, mr: 2, color: "#5a5a5a" }}
                  >
                    {_item.icon && createElement(_item.icon)}
                  </Box>
                  <Box component="span">{_item?.title}</Box>
                </ListItemButton>
              );
            })}
          </List>
        </Collapse>
      ) : null}
    </>
  );
}

export default SidebarItem;
