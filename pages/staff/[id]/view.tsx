import {
  getNotes,
  getStaff,
  getStaffAllDocuments,
  getStaffCompliance,
  getStaffSettings
} from "@/api/functions/staff.api";
import { useRouter } from "next/router";
import { getLastSignin, resendInvite } from "@/api/functions/user.api";
import Iconify from "@/components/Iconify/Iconify";
import Compliance from "@/components/staff-compliance/compliance";
import Details from "@/components/staff-details/details";
import Notes from "@/components/staff-notes/notes";
import Settings from "@/components/staff-settings/settings";
import {
  complianceData,
  staffAllDocuments
} from "@/interface/common.interface";
import { ISettings, IStaff } from "@/interface/staff.interfaces";
import assets from "@/json/assets";
import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import Loader from "@/ui/Loader/Loder";
import StyledPaper from "@/ui/Paper/Paper";
import styled from "@emotion/styled";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  Popover,
  TextField,
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
import AddShift from "@/components/add-shift/add-shift";
import PayrollSetting from "pages/staff/[id]/payroll-setting";

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
  staffalldocuments: staffAllDocuments[];
  last_login: { "Last Login": number };
  notes: {
    notes: string;
  };
  isLoading: boolean;
}

export default function Index() {
  const [openModal, setModal] = useState(false);
  const [shiftModal, setShiftModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { id } = useParams();

  const router = useRouter();

  const data: QueryResult = useQueries({
    queries: [
      {
        queryKey: ["staff", id],
        queryFn: () => getStaff(id as string)
      },
      {
        queryKey: ["staff-settings", id],
        queryFn: () => getStaffSettings(id as string)
      },
      {
        queryKey: ["staff-compliance", id],
        queryFn: () => getStaffCompliance(id as string)
      },
      {
        queryKey: ["last-login", id],
        queryFn: () => getLastSignin(id as string)
      },
      {
        queryKey: ["notes", id],
        queryFn: () => getNotes(id as string)
      },
      {
        queryKey: ["staffalldocuments", id],
        queryFn: () => getStaffAllDocuments(id as string)
      }
    ],
    combine: (results) => {
      return {
        staff: results[0].data,
        settings: results[1].data,
        compliance: results[2].data,
        last_login: results[3].data,
        notes: results[4].data,
        staffalldocuments: results[5].data,
        isLoading:
          results[0].isLoading ||
          results[1].isLoading ||
          results[2].isLoading ||
          results[3].isLoading ||
          results[4].isLoading ||
          results[5].isLoading
      };
    }
  });

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl((prev) => (prev ? null : event.currentTarget));
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: resendInvite
  });

  const open = Boolean(anchorEl);

  if (data.isLoading) return <Loader />;

  const handleModal = () => {
    setModal(true);
  };

  const handleCloseModal = () => {
    setModal(false);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
    } else {
      setError("");
      // Proceed with the password reset logic (e.g., API call)
      console.log("Password reset successful!");
    }
  };

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
          Back to Staff List
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
              src={data?.staff?.photoDownloadURL || assets.nurse_placeholder}
            ></Avatar>
            <Typography variant="h4">
              {data?.staff?.name}
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
              onClick={() => setShiftModal(true)}
            >
              Add Shift
            </MenuItem>
            <MenuItem
              // key={option.label}
              // onClick={handlePopoverClose}
              onClick={() => {
                router.push(`/shift-notes`);
                handlePopoverClose();
              }}
            >
              Communications
            </MenuItem>
            <MenuItem
              // key={option.label}
              // onClick={handlePopoverClose}

              // onClick={() => {
              //   router.push(`/staff/timesheet`);
              //   handlePopoverClose();
              // }}

              onClick={() => {
                router.push(`/staff/${id}/timesheet`);
                handlePopoverClose();
              }}
            >
              Timesheet
            </MenuItem>
            <MenuItem
              // key={option.label}
              // onClick={handlePopoverClose}
              onClick={() => {
                router.push(`/`);
                handlePopoverClose();
              }}
            >
              Calendar
            </MenuItem>
            <MenuItem
              onClick={() => {
                router.push(`/staff/${id}/documents`);
                handlePopoverClose();
              }}
            >
              Documents
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleModal();
                handlePopoverClose();
              }}
            >
              Reset Password
            </MenuItem>
          </Popover>
        </Stack>
      </Box>
      <StyledViewPage container spacing={4}>
        <Grid item md={8} sm={12} xs={12}>
          <Grid container spacing={4}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Details staff={data.staff} />
            </Grid>
            {/* <Grid item lg={12} md={12} sm={12} xs={12}>
              <Compliance compliance_data={data.compliance} />
            </Grid> */}
            {data?.staffalldocuments &&
              Object.keys(data.staffalldocuments).length > 0 && (
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Compliance staffalldocuments={data.staffalldocuments} />
                </Grid>
              )}
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
                  <Typography variant="h5">Login</Typography>
                  <Typography variant="body2">
                    {data.last_login["Last Login"] ? (
                      moment().diff(data.last_login["Last Login"], "hours") <
                      23 ? (
                        moment(data.last_login["Last Login"]).fromNow()
                      ) : (
                        moment(data.last_login["Last Login"]).calendar(null, {
                          sameDay: (now) =>
                            `[Today], ${moment(now?.toString()).fromNow()}`,
                          nextDay: "[Tomorrow]",
                          nextWeek: "dddd",
                          lastDay: "[Yesterday], hh:mm a",
                          lastWeek: "[Last] dddd, hh:mm a",
                          sameElse: "DD/MM/YYYY hh:mm:a"
                        })
                      )
                    ) : (
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => mutate({ email: data.staff.email })}
                      >
                        Resend Invitation
                      </Button>
                    )}
                  </Typography>
                </Stack>
              </StyledPaper>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Settings settings={data.settings} />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Notes note={data.notes.notes} />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <PayrollSetting />
            </Grid>
          </Grid>
        </Grid>
        <AddShift open={shiftModal} onClose={() => setShiftModal(false)} />
      </StyledViewPage>
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        {/* <DialogTitle>Reset Password</DialogTitle> */}
        <Divider />
        <DialogContent>
          <Typography variant="h6">Reset Your Password</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="New Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              margin="normal"
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              margin="normal"
            />
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}

            {/* Buttons Container */}
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                type="submit"
                size="small"
                variant="contained"
                color="primary"
                style={{ marginRight: 8 }}
              >
                Submit
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </DialogContent>
        {/* <DialogActions>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleCloseModal}
            >
              Close
            </Button>
            <Button variant="contained" color="success">
              Update
            </Button>
          </Box>
        </DialogActions> */}
      </Dialog>
    </DashboardLayout>
  );
}
