import { addPriceBook, getPriceBooks } from "@/api/functions/pricebook.api";
import Iconify from "@/components/Iconify/Iconify";
import PriceBookModal from "@/components/PriceBookModal/PriceBookModal";
import PriceBook from "@/components/Pricebook/PriceBook";
import { IPriceBook } from "@/interface/settings.interfaces";
import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import styled from "@emotion/styled";
import {
  Button,
  MenuItem,
  Pagination,
  Popover,
  Typography
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const StyledPage = styled(Box)`
  padding: 20px 10px;
`;

export default function Prices() {
  const [addPriceBookModal, setAddPriceBookModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["price-books", router.query.page],
    queryFn: () => getPriceBooks(router.query.page as string)
  });

  useEffect(() => {
    if (data && !router.query.page) {
      router.push({ query: { page: data?.currentPage } }, undefined, {
        shallow: true
      });
    } else if (router.query.page && data.priceBooks.length == 0) {
      router.push(
        {
          query: {
            page: data?.currentPage - 1 === 0 ? 1 : data?.currentPage - 1
          }
        },
        undefined,
        {
          shallow: true
        }
      );
    }
  }, [data, router.query.page]);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl((prev) => (prev ? null : event.currentTarget));
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <DashboardLayout isLoading={isLoading}>
      <StyledPage>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={3}
          sx={{ marginBottom: "40px" }}
        >
          <Typography variant="h4">Prices</Typography>
          <Button
            variant="contained"
            onClick={handlePopoverOpen}
            size="large"
            // onMouseLeave={handlePopoverClose}
          >
            Actions{" "}
            <Iconify
              icon="eva:arrow-ios-downward-outline"
              sx={{ ml: "5px" }}
            ></Iconify>
          </Button>
          <Popover
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right"
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
            sx={{
              ".MuiPaper-root": {
                boxShadow:
                  " rgba(145, 158, 171, 0.2) 0px 5px 5px -3px, rgba(145, 158, 171, 0.14) 0px 8px 10px 1px, rgba(145, 158, 171, 0.12) 0px 3px 14px 2px",
                p: 0,
                mt: 1,
                ml: 0.75,
                width: 160,
                outline: 0,
                padding: 0,
                paddingBlock: 1,
                marginTop: 1,
                marginLeft: "6px",
                minWidth: 4,
                minHeight: 4,
                maxWidth: "calc(100% - 32px)",
                maxHeight: "calc(100% - 32px)",
                borderRadius: "8px"
              }
            }}
          >
            <MenuItem
              // key={option.label}
              onClick={() => {
                handlePopoverClose();
                setAddPriceBookModal(true);
              }}
            >
              Add Price Book
            </MenuItem>
            <MenuItem
              // key={option.label}
              onClick={handlePopoverClose}
            >
              Import Prices
            </MenuItem>
            <MenuItem
              // key={option.label}
              onClick={handlePopoverClose}
            >
              Export Prices
            </MenuItem>
          </Popover>
        </Stack>
        <Box className="priceBooks">
          {data?.priceBooks?.map((_data: IPriceBook) => (
            <PriceBook {..._data} key={_data.id} />
          ))}
        </Box>
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ marginTop: "10px" }}
        >
          <Pagination
            count={data?.totalPages}
            // variant="outlined"
            page={
              router.query.page ? parseInt(router.query.page!.toString()) : 1
            }
            onChange={(e: React.ChangeEvent<unknown>, value: number) => {
              router.push(
                {
                  query: {
                    page: value
                  }
                },
                undefined,
                { shallow: true }
              );
            }}
          />
        </Stack>
        <PriceBookModal
          title="Add Price Book"
          open={addPriceBookModal}
          onClose={() => setAddPriceBookModal(false)}
          onSubmit={addPriceBook}
        />
      </StyledPage>
    </DashboardLayout>
  );
}
