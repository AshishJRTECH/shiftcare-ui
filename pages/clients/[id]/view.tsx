import {
  getClient,
  getClientAdditionalInformation,
  getClientDocuments,
  getClientFunds,
  getClientSettings
} from "@/api/functions/client.api";
import {
  getNotes,
  getStaff,
  getStaffCompliance,
  getStaffSettings
} from "@/api/functions/staff.api";
import { getLastSignin, resendInvite } from "@/api/functions/user.api";
import Iconify from "@/components/Iconify/Iconify";
import Compliance from "@/components/staff-compliance/compliance";
import Details from "@/components/client-details/details";
import Notes from "@/components/staff-notes/notes";
import { complianceData } from "@/interface/common.interface";
import { ISettings, IStaff } from "@/interface/staff.interfaces";
import assets from "@/json/assets";
import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import Loader from "@/ui/Loader/Loder";
import StyledPaper from "@/ui/Paper/Paper";
import styled from "@emotion/styled";
import {
  Avatar,
  Button,
  Grid,
  MenuItem,
  Popover,
  Typography
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import {
  useIsFetching,
  useMutation,
  useQueries,
  useQuery
} from "@tanstack/react-query";
import moment from "moment";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import Settings from "@/components/client-settings/settings";

const StyledViewPage = styled(Grid)`
  padding: 20px 10px;
  h4 {
    margin-bottom: 40px;
  }
`;

interface QueryResult {
  staff: IStaff;
  settings: ISettings;
  compliance: complianceData[];
  last_login: { "Last Login": number };
  notes: {
    notes: string;
  };
  isLoading: boolean;
}

export default function Index() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { id } = useParams();

  const data = useQueries({
    queries: [
      {
        queryKey: ["client", id],
        queryFn: () => getClient(id as string)
      },
      {
        queryKey: ["client-settings", id],
        queryFn: () => getClientSettings(id as string)
      },
      {
        queryKey: ["client-documents", id],
        queryFn: () => getClientDocuments(id as string)
      },
      {
        queryKey: ["client-funds", id],
        queryFn: () => getClientFunds(id as string)
      },
      {
        queryKey: ["client-additional-information", id],
        queryFn: () => getClientAdditionalInformation(id as string)
      }
    ],
    combine: (results) => {
      return {
        client: results[0].data,
        settings: results[1].data,
        documents: results[2].data,
        funds: results[3].data,
        additionalInformation: results[4].data,
        isLoading:
          results[0].isLoading ||
          results[1].isLoading ||
          results[2].isLoading ||
          results[3].isLoading ||
          results[4].isLoading
      };
    }
  });

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl((prev) => (prev ? null : event.currentTarget));
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  if (data.isLoading) return <Loader />;

  return (
    <DashboardLayout>
      <Box sx={{ padding: "0px 10px 20px 10px" }}>
        <Link
          href="/staff/list"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            fontSize: "14px"
          }}
        >
          <Iconify
            icon="eva:arrow-back-fill"
            sx={{
              width: 17,
              height: 17,
              marginRight: "5px",
              marginBottom: "2px"
            }}
          />{" "}
          Back to Client List
        </Link>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ marginTop: "20px" }}
          gap={3}
        >
          <Stack direction="row" alignItems="center" gap={2}>
            <Avatar
              src={data?.client?.photoDownloadURL || assets.nurse_placeholder}
            ></Avatar>
            <Typography variant="h4">
              {data?.client?.displayName}
              <Typography variant="body1" display="inline-block" ml={1}>
                Details
              </Typography>
            </Typography>
          </Stack>
          <Button
            variant="contained"
            onClick={handlePopoverOpen}
            size="large"
            // onMouseLeave={handlePopoverClose}
          >
            Manage{" "}
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
                width: 200,
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
              onClick={handlePopoverClose}
            >
              Add Shift
            </MenuItem>
            <MenuItem
              // key={option.label}
              onClick={handlePopoverClose}
            >
              Add Expense
            </MenuItem>
            <MenuItem
              // key={option.label}
              onClick={handlePopoverClose}
            >
              Communications
            </MenuItem>
            <MenuItem
              // key={option.label}
              onClick={handlePopoverClose}
            >
              Billing Report
            </MenuItem>
            <MenuItem
              // key={option.label}
              onClick={handlePopoverClose}
            >
              Calendar
            </MenuItem>
            <MenuItem
              // key={option.label}
              onClick={handlePopoverClose}
            >
              Documents
            </MenuItem>
            <MenuItem
              // key={option.label}
              onClick={handlePopoverClose}
            >
              Print Roaster
            </MenuItem>
          </Popover>
        </Stack>
      </Box>
      <StyledViewPage container spacing={4}>
        <Grid item md={8} sm={12} xs={12}>
          <Grid container spacing={4}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Details client={data.client} />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {/* <Compliance compliance_data={data.documents} /> */}
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={4} sm={12} xs={12}>
          <Grid container spacing={4}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <StyledPaper>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={1}
                >
                  <Typography variant="h5">Additional Contacts</Typography>
                  <Typography variant="body2">
                    <Button size="small" variant="contained">
                      Add
                    </Button>
                  </Typography>
                </Stack>
              </StyledPaper>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Settings settings={data.settings} />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {/* <Notes note={data.additionalInformation} /> */}
            </Grid>
          </Grid>
        </Grid>
      </StyledViewPage>
    </DashboardLayout>
  );
}
