import {
  addPriceBook,
  createPriceImport,
  getExpiredPriceFilteredData,
  getPriceBooks
} from "@/api/functions/pricebook.api";

import PriceBookModal from "@/components/PriceBookModal/PriceBookModal";
import PriceBook from "@/components/Pricebook/PriceBook";
import { IPriceBook } from "@/interface/settings.interfaces";
import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import styled from "@emotion/styled";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  MenuItem,
  Pagination,
  Popover,
  Typography
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import PriceImport from "./price-import";
import Iconify from "@/components/Iconify/Iconify";
import { queryClient } from "pages/_app";

const StyledPage = styled(Box)`
  padding: 20px 10px;
`;

export default function Prices() {
  const [addPriceBookModal, setAddPriceBookModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [openModal, setModal] = useState(false);
  const [priceFilter, setPriceFilter] = useState(false);

  const router = useRouter();

  // const { data, isLoading } = useQuery({
  //   queryKey: ["price-books", router.query.page],
  //   queryFn: () => getPriceBooks((router.query.page as string) || "1")
  // });

  const [priceBookData, setPriceBookData] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    priceBooks: []
  });

  // useEffect(() => {
  //   console.log("------------- Price Book Tittles --------------", data);
  // }, []);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl((prev) => (prev ? null : event.currentTarget));
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleModal = () => {
    setModal(true);
  };

  const handleCloseModal = () => {
    setModal(false);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createPriceImport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["price-books"] });
      // methods.reset();
      // props.onClose();
    }
  });

  const handleImport = () => {
    mutate(0);
    console.log("Import Buttom get clicked.");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPriceFilter(event.target.checked);
    queryClient.invalidateQueries({ queryKey: ["price-books"] });
  };

  useEffect(() => {
    const fetchingdata = async () => {
      // if (startDate && endDate) {
      const data = await getExpiredPriceFilteredData({
        // page: (2).toString(),
        page: (router.query.page as string) || "1",
        isExpired: !priceFilter
      });
      console.log("------------*** NEW PRICE DATA------------", data);
      // }

      setPriceBookData(data);
    };
    fetchingdata();
  }, [priceFilter, router.query.page]);

  useEffect(() => {
    if (priceBookData && !router.query.page) {
      router.push({ query: { page: priceBookData?.currentPage } }, undefined, {
        shallow: true
      });
    } else if (router.query.page && priceBookData?.priceBooks.length == 0) {
      router.push(
        {
          query: {
            page:
              priceBookData?.currentPage - 1 === 0
                ? 1
                : priceBookData?.currentPage - 1
          }
        },
        undefined,
        {
          shallow: true
        }
      );
    }
  }, [priceBookData, router.query.page]);

  return (
    // <DashboardLayout isLoading={isLoading}>
    <DashboardLayout>
      <StyledPage>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={3}
          sx={{ marginBottom: "40px" }}
        >
          <Typography variant="h4">Prices</Typography>
          {/* <Button
            variant="contained"
            size="large"
            // onMouseLeave={handlePopoverClose}
          >
            Import{" "}
            <Iconify
              icon="eva:arrow-ios-downward-outline"
              sx={{ ml: "5px" }}
            ></Iconify>
          </Button>
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
          </Button> */}

          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControlLabel
              control={
                <Checkbox checked={priceFilter} onChange={handleChange} />
              }
              label="Hide Expired Date"
            />
            <Button variant="contained" size="large" onClick={handleImport}>
              Update October 2024 NDIS Price{" "}
              <Iconify icon="eva:download-outline" sx={{ ml: "5px" }} />
            </Button>
            <Button
              variant="contained"
              onClick={handlePopoverOpen}
              size="large"
            >
              Actions{" "}
              <Iconify
                icon="eva:arrow-ios-downward-outline"
                sx={{ ml: "5px" }}
              />
            </Button>
          </Box>

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
              onClick={handleModal}
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
          {" "}
          {/* ---- */}
          {/* {data?.priceBooks?.map((_data: IPriceBook) => (
            <PriceBook {..._data} key={_data.id} />
          ))} */}
          {priceBookData?.priceBooks
            ?.filter((_data: IPriceBook) =>
              priceFilter ? !_data.isExpired : true
            ) // Apply filtering only if priceFilter is true
            .map((_data: IPriceBook) => (
              <PriceBook {..._data} key={_data.id} />
            ))}
        </Box>
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ marginTop: "10px" }}
        >
          <Pagination
            count={priceBookData?.totalPages}
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
        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Modal Title</DialogTitle>
          <Divider />
          <DialogContent>
            <PriceImport closemodal={handleCloseModal}></PriceImport>
          </DialogContent>
        </Dialog>
      </StyledPage>
    </DashboardLayout>
  );
}
