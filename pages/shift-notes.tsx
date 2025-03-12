/* eslint-disable @typescript-eslint/no-non-null-assertion */
import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import styled from "@emotion/styled";
import {
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  Paper,
  Popover,
  Select,
  SelectChangeEvent,
  Typography
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { useMemo, useRef, useState } from "react";
import { DatePicker } from "antd";
import { DatePicker as Datepicker } from "@mui/x-date-pickers";
import StyledPaper from "@/ui/Paper/Paper";
import Iconify from "@/components/Iconify/Iconify";
import {
  QueryClient,
  dehydrate,
  useMutation,
  useQuery
} from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  exportNotesToEmail,
  exportNotesToPdf,
  exportShiftNotesToEmail,
  getAllClients,
  getAllClientsShiftNote,
  getAllShiftNotes,
  getAllTemporaryClients
} from "@/api/functions/client.api";
import dayjs, { Dayjs } from "dayjs";
import { RangePickerProps } from "antd/lib/date-picker";
import moment from "moment";
import {
  ShiftNotes as IShiftNotes,
  ShiftNoteBody
} from "@/interface/shift.interface";
import { Controller, FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import MenuItem from "@mui/material/MenuItem";
import CustomInput from "@/ui/Inputs/CustomInput";
import RichTextEditor from "@/components/RichTextEditor/RichTextEditor";
import {
  addShiftNote,
  exportShiftNotes,
  getAllDirectShiftsNotes,
  getAllDirectShiftsNotesWithShift
} from "@/api/functions/shift.api";
import { LoadingButton } from "@mui/lab";
import { useCurrentEditor } from "@tiptap/react";
import { useRouter } from "next/router";
import MuiModalWrapper from "@/ui/Modal/MuiModalWrapper";
import { GetServerSidePropsContext } from "next";
import { IClient } from "@/interface/client.interface";
import Image from "next/image";
import assets from "@/json/assets";
import Link from "next/link";
import prettyBytes from "pretty-bytes";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import { queryClient } from "./_app";
import { toast } from "sonner";
import EmailIcon from "@mui/icons-material/Email";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Tooltip from "@mui/material/Tooltip";

const { RangePicker } = DatePicker;

const StyledBox = styled(Box)`
  .tiptap {
    height: 400px;
    overflow: auto;
  }
`;

const StyledCommunication = styled(Box)`
  padding-inline: 40px;
  .mainBox {
    border-left: 3px solid #ccc;
    padding: 10px 30px;
    padding-right: 0;
    position: relative;

    .floating-element {
      width: 30px;
      height: 30px;
      /* padding: 3px; */
      display: flex;
      align-items: center;
      border-radius: 50%;
      justify-content: center;
      position: absolute;
      top: 20px;
      left: -15.5px;
      color: #fff;
    }
  }
  .file {
    margin-top: 20px;
    width: 280px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 5px;
    > div {
      flex: 1;
      p {
        width: 175px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    a {
      display: flex;
      align-items: center;
    }
    img {
      width: 30px;
      height: 30px;
      aspect-ratio: 1/1;
      &.file_image {
        width: 45px;
        height: 45px;
      }
    }
  }
`;

const getIcon = (noteType: string) => {
  switch (noteType) {
    case "Enquiry":
      return (
        <Box className="floating-element" sx={{ backgroundColor: "#ff851b" }}>
          <Iconify icon="iconamoon:search-bold" />
        </Box>
      );
    case "Notes":
      return (
        <Box className="floating-element" sx={{ backgroundColor: "#00a65a" }}>
          <Iconify icon="ic:sharp-person" />
        </Box>
      );
    case "Incident":
      return (
        <Box className="floating-element" sx={{ backgroundColor: "#0073b7" }}>
          <Iconify icon="ph:flag-fill" />
        </Box>
      );
    case "Injury":
      return (
        <Box className="floating-element" sx={{ backgroundColor: "#dd4b39" }}>
          <Iconify icon="fa:ambulance" />
        </Box>
      );
    case "Feedback":
      return (
        <Box className="floating-element" sx={{ backgroundColor: "#ff851b" }}>
          <Iconify icon="ep:warning-filled" />
        </Box>
      );
  }
};

const EachShiftNote = ({
  note,
  lastElement
}: {
  note: IShiftNotes;
  lastElement?: boolean;
}) => {
  const [isEdit, setIsEdit] = useState(false);
  // const schema = yup.object().shape({
  //   shiftNoteCategories: yup.string(),
  //   date: yup.date(),
  //   subject: yup.string().required("Please enter a Subject"),
  //   notes: yup.string().required("Please enter a note")
  // });

  // const methods = useForm({
  //   resolver: yupResolver(schema),
  //   defaultValues: {
  //     shiftNoteCategories: note.shiftNotesCategories,
  //     date: note.date,
  //     subject: note.subject,
  //     notes:note.notes
  //   }
  // });

  return (
    <>
      <StyledCommunication>
        <Box
          className="mainBox"
          paddingBottom={lastElement ? "80px !important" : "10px"}
        >
          <Stack
            direction="row"
            gap={2}
            alignItems="flex-end"
            justifyContent="space-between"
          >
            {getIcon(note.shiftNotesCategories)}
            <Typography variant="body1">
              <strong>{note.addedByEmployee}</strong> added{" "}
              {note.shiftNotesCategories} for <strong>{note.clientName}</strong>{" "}
              dated {moment.unix(note.epochDate).format("DD/MM/YYYY")}
            </Typography>
            <Stack alignItems="flex-end">
              <Typography
                variant="caption"
                display="flex"
                alignItems="center"
                gap={0.5}
              >
                <Iconify icon="bi:clock" width={13} height={13} />
                {moment.unix(note.createdAtEpoch).fromNow()}
              </Typography>
              <Typography variant="caption">
                {moment.unix(note.createdAtEpoch).format("LLL")}
              </Typography>
            </Stack>
          </Stack>
          <Divider sx={{ marginBlock: "10px 15px" }} />
          <Stack
            direction="column"
            // alignItems="flex-start"
            // justifyContent="space-between"
            gap={2}
          >
            {/* <Box>
              <Typography variant="body1" marginBottom={1}></Typography>
              <Box>
                <strong>Subject: </strong>
                <span dangerouslySetInnerHTML={{ __html: note.subject }} />
              </Box>
              <Box>
                <strong>Notes: </strong>
                <span dangerouslySetInnerHTML={{ __html: note.notes }} />
              </Box>
              <Box>
                <strong>Shift assigned to: </strong>
                <span
                  dangerouslySetInnerHTML={{ __html: note.shiftAssignedTo }}
                />
              </Box>

              <Box>
                <strong>Shift Start Time: </strong>
                <span
                  dangerouslySetInnerHTML={{
                    __html: moment.unix(note.shiftStartTimeEpoch).format("LLL")
                  }}
                />
              </Box>
              <Box>
                <strong>Shift End Time: </strong>
                <span
                  dangerouslySetInnerHTML={{
                    __html: moment.unix(note.shiftEndTimeEpoch).format("LLL")
                  }}
                />
              </Box>
              <Box>
                <strong>Employee Clock In Time: </strong>
                <span
                  dangerouslySetInnerHTML={{
                    __html: moment.unix(note.employeeClockInTime).format("LLL")
                  }}
                />
              </Box>
              <Box>
                <strong>Employee Clock Out Time: </strong>
                <span
                  dangerouslySetInnerHTML={{
                    __html: moment.unix(note.employeeClockOutTime).format("LLL")
                  }}
                />
              </Box>
            </Box> */}

            <Paper
              sx={{
                // maxWidth: 600,
                // margin: "auto",
                padding: 3,
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: "#fff",
                fontFamily: '"Roboto", sans-serif'
              }}
            >
              <Box sx={{ marginBottom: 2 }}>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 500, color: "#333" }}
                >
                  Subject:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#555" }}
                  dangerouslySetInnerHTML={{ __html: note.subject }}
                />
              </Box>

              <Box sx={{ marginBottom: 2 }}>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 500, color: "#333" }}
                >
                  Notes:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#555" }}
                  dangerouslySetInnerHTML={{ __html: note.notes }}
                />
              </Box>
              <Divider></Divider>
              <br></br>
              <Grid container spacing={2}>
                {/* Column 1 */}
                <Grid item xs={12} sm={4}>
                  <Box sx={{ marginBottom: 2 }}>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 500, color: "#333" }}
                    >
                      Shift Assigned To:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#555" }}
                      dangerouslySetInnerHTML={{ __html: note.shiftAssignedTo }}
                    />
                  </Box>

                  <Box sx={{ marginBottom: 2 }}>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 500, color: "#333" }}
                    >
                      Shift Start Time:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#555" }}
                      dangerouslySetInnerHTML={{
                        __html: moment
                          .unix(note.shiftStartTimeEpoch)
                          .format("LLL")
                      }}
                    />
                  </Box>
                </Grid>

                {/* Column 2 */}
                <Grid item xs={12} sm={4}>
                  <Box sx={{ marginBottom: 2 }}>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 500, color: "#333" }}
                    >
                      Shift End Time:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#555" }}
                      dangerouslySetInnerHTML={{
                        __html: moment
                          .unix(note.shiftEndTimeEpoch)
                          .format("LLL")
                      }}
                    />
                  </Box>

                  <Box sx={{ marginBottom: 2 }}>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 500, color: "#333" }}
                    >
                      Employee Clock In Time:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#555" }}
                      dangerouslySetInnerHTML={{
                        __html: moment
                          .unix(note.employeeClockInTime)
                          .format("LLL")
                      }}
                    />
                  </Box>
                </Grid>

                {/* Column 3 */}
                <Grid item xs={12} sm={4}>
                  <Box sx={{ marginBottom: 2 }}>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 500, color: "#333" }}
                    >
                      Employee Clock Out Time:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#555" }}
                      dangerouslySetInnerHTML={{
                        __html: moment
                          .unix(note.employeeClockOutTime)
                          .format("LLL")
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* <Button>Edit</Button> */}
          </Stack>
          {note.documents.map((_document) => (
            <Stack
              direction="row"
              className="file"
              key={_document.downloadURL}
              gap={1}
            >
              <Image
                src={assets.file_icon}
                alt="File Icon"
                width={512}
                height={512}
                className="file_image"
              />
              <Box>
                <Typography sx={{ fontSize: "15px" }}>
                  {_document.fileName}
                </Typography>
                <Typography variant="caption">
                  {prettyBytes(_document.fileSize)}
                </Typography>
              </Box>
              <Link href={_document.downloadURL} download>
                <Image
                  src={assets.download}
                  alt="download"
                  width={512}
                  height={512}
                />
              </Link>
            </Stack>
          ))}
          <Divider sx={{ marginTop: "80px", borderColor: "#ccc" }} />
        </Box>
      </StyledCommunication>
      {/* <MuiModalWrapper
        title="Edit Shift Notes"
        open={isEdit}
        onClose={() => setIsEdit(false)}
      >
        <FormProvider {...methods}>
          <Grid container spacing={2}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Controller
                control={methods.control}
                name="shiftNoteCategories"
                render={({ field }) => (
                  <Select {...field} fullWidth size="small">
                    <MenuItem value="Notes">Notes</MenuItem>
                    <MenuItem value="Feedback">Feedback</MenuItem>
                    <MenuItem value="Enquiry">Enquiry</MenuItem>
                    <MenuItem value="Incident">Incident</MenuItem>
                    <MenuItem value="Injury">Injury</MenuItem>
                  </Select>
                )}
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Controller
                control={methods.control}
                name="date"
                render={({ field }) => (
                  <Datepicker
                    {...field}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small"
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <CustomInput name="subject" placeholder="Enter Notes" />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Box
                padding={1}
                paddingInline={1.5}
                border="1px solid #ededed"
                borderRadius={1}
              >
                <Controller
                  control={methods.control}
                  name="notes"
                  render={({ field, fieldState: { invalid, error } }) => (
                    <Box>
                      <RichTextEditor {...field} />
                      {invalid && (
                        <FormHelperText>{error?.message}</FormHelperText>
                      )}
                    </Box>
                  )}
                />
              </Box>
            </Grid>
          </Grid>
        </FormProvider>
      </MuiModalWrapper> */}
    </>
  );
};

export const getServerSideProps = async ({
  req
}: GetServerSidePropsContext) => {
  const token = req.cookies?.token;

  if (!token) {
    return {
      redirect: {
        destination: "/login", // Redirect to a login page or show an error page
        permanent: false
      }
    };
  }

  try {
    const clients = await getAllClientsShiftNote(token);
    return {
      props: {
        clients
      }
    };
  } catch (error) {
    console.error("Failed to fetch clients:", error);

    return {
      props: {
        clients: []
      }
    };
  }
};

const schema = yup.object().shape({
  shiftNoteCategories: yup.string(),
  date: yup.date(),
  subject: yup.string().required("Please enter a Subject"),
  notes: yup.string().required("Please enter a note"),
  clientId: yup.number().required("Please Select a Client")
});

export default function ShiftNotes({ clients }: { clients: IClient[] }) {
  const { data: tempraryclients } = useQuery({
    queryKey: ["client_list"],
    queryFn: () => getAllTemporaryClients()
    // enabled: Boolean(client) && role === "ROLE_ADMINS"
  });

  // console.log(
  //   "----------------- Temporary Client -----------------",
  //   tempraryclients
  // );

  const [dates, setDates] = useState<
    [Dayjs | null | undefined, Dayjs | null | undefined] | null | undefined
  >([null, null]);
  const [documents, setDocuments] = useState<File | null | undefined>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [filterValues, setFilterValues] = useState([
    "Enquiry",
    "Injury",
    "Incident",
    "Notes",
    "Feedback"
  ]);
  const [clientFilter, setClientFilter] = useState<number | undefined>(
    undefined
  );
  const [staffFilter, setStaffFilter] = useState<number | undefined>(undefined);
  const { id } = useParams();
  const router = useRouter();

  console.log(
    "=========********* Client Notes ID ********==========",
    clientFilter
  );

  // ExportEmail is start here-------------------
  // const { mutate: ExportEmail } = useMutation({
  //   mutationFn: exportNotesToEmail,
  //   onSuccess: (response) => {
  //     queryClient.invalidateQueries({ queryKey: ["applied_shift"] });
  //     toast.success(response.message);
  //   },
  //   onError: (error) => {
  //     console.error("Error:", error);
  //   }
  // });

  // const onExport = (params: { id: number }) => {
  //   ExportEmail(params);
  // };

  // const handleExport = async (id: number) => {
  //   if (id) {
  //     console.log("Submitting data", { id });
  //     onExport({
  //       id: id
  //     });
  //   } else {
  //     console.log("Missing data");
  //   }
  // };

  console.log("Selected dates range is as below:", {
    startDate: dates?.[0]?.unix()?.toString(),
    endDate: dates?.[1]?.unix()?.toString()
  });

  const { mutate: ExportEmail } = useMutation({
    mutationFn: exportShiftNotesToEmail,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["applied_shift"] });
      toast.success(response.message);
    },
    onError: (error) => {
      console.error("Error:", error);
    }
  });

  const onExport = (params: {
    id: number;
    startDate: string;
    endDate: string;
  }) => {
    ExportEmail(params);
  };

  const handleExport = async (
    id: number,
    startDate: string,
    endDate: string
  ) => {
    if (id) {
      console.log("Submitting data", { id, startDate, endDate });
      onExport({
        id: id,
        startDate: startDate,
        endDate: endDate
      });
    } else {
      console.log("Missing data");
    }
  };

  // Usage example (ensure to provide startDate and endDate):
  // handleExport(1, "2024-01-01", "2024-12-31");

  // ExportEmail is end here-------------------

  // ExportPdf is start here-------------------
  const { mutate: ExportPdf } = useMutation({
    mutationFn: exportNotesToPdf,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["applied_shift"] });
      toast.success(response);
      // Open the URL in a new tab
      if (response) {
        window.open(response, "_blank");
      }
    },
    onError: (error) => {
      console.error("Error:", error);
    }
  });

  // const onExportPdf = (params: { id: number }) => {
  //   ExportPdf(params);
  // };

  const onExportPdf = (params: {
    id: number;
    startDate: string;
    endDate: string;
  }) => {
    ExportPdf(params);
  };

  // const handleExportPdf = async (id: number) => {
  //   if (id) {
  //     // console.log("Submitting data", { id });
  //     onExportPdf({
  //       id: id.toString()
  //     });
  //   } else {
  //     console.log("Missing data");
  //   }
  // };

  const handleExportPdf = async (
    id: number,
    startDate: string,
    endDate: string
  ) => {
    if (id) {
      // console.log("Submitting data", { id });
      onExportPdf({
        id: id,
        startDate: startDate,
        endDate: endDate
      });
    } else {
      console.log("Missing data");
    }
  };
  // ExportPdf is end here-------------------

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      shiftNoteCategories: "Notes",
      date: dayjs(),
      subject: "",
      notes: "",
      clientId: -1
    }
  });

  const { data, isLoading } = useQuery({
    queryKey: ["all_shift_notes", id, dates],
    queryFn: () =>
      getAllDirectShiftsNotesWithShift({
        startDate: dates?.[0]?.unix(),
        endDate: dates?.[1]?.endOf("day").unix()
      })
  });

  const clientList = useMemo(() => {
    const list: { id: number; name: string }[] = [];
    (Object.values(data || {}).flat() as IShiftNotes[]).forEach((_data) => {
      if (!list.find((_list) => _list.id === _data.clientId))
        list.push({
          id: _data.clientId,
          name: _data.clientName
        });
    });
    return list;
  }, [data]);

  const staffList = useMemo(() => {
    const list: { id: number; name: string }[] = [];
    (Object.values(data || {}).flat() as IShiftNotes[]).forEach((_data) => {
      if (!list.find((_list) => _list.id === _data.employeeId))
        list.push({
          id: _data.employeeId,
          name: _data.addedByEmployee
        });
    });
    return list;
  }, [data]);

  const { mutate, isPending } = useMutation({
    mutationFn: addShiftNote,
    onSuccess: router.reload
  });

  const onSubmit = (
    data: Omit<ShiftNoteBody, "documents" | "date"> & {
      date: Dayjs;
      clientId: number;
    }
  ) => {
    const formData = new FormData();
    formData.append("shiftNotesCategories", data.shiftNoteCategories);
    formData.append("date", dayjs(data.date).format("YYYY-MM-DD"));
    formData.append("notes", data.notes);
    formData.append("subject", data.subject);
    formData.append("clientId", data.clientId.toString());
    if (documents) formData.append("files", documents);
    mutate(formData);
  };

  const { mutate: exportShiftNotesMutation, isPending: isExporting } =
    useMutation({
      mutationFn: exportShiftNotes
    });

  const open = Boolean(anchorEl);

  const [selectedValue, setSelectedValue] = useState<string | number>("");
  const [isOtherSelected, setIsOtherSelected] = useState(false); // For second dropdown
  const handleSelectChange = (event: SelectChangeEvent<string | number>) => {
    setSelectedValue(event.target.value);
    if (event.target.value === "001") {
      setIsOtherSelected(true);
    } else {
      setIsOtherSelected(false);
    }
  };

  const handleSecondDropdownChange = (
    event: SelectChangeEvent<string | number>
  ) => {
    setIsOtherSelected(true); // When a value from the second dropdown is selected
  };

  return (
    <DashboardLayout isLoading={isLoading}>
      <StyledBox>
        <Stack
          direction="row"
          justifyContent="space-between"
          gap={2}
          flexWrap="wrap"
          marginBottom={5}
        >
          <Stack direction="row" gap={2} flexWrap="wrap">
            <Box display="flex" justifyContent="flex-start" gap={2}>
              <Tooltip title="To add new note">
                <Button role="a" href="#add-notes" variant="contained">
                  Add Note
                </Button>
              </Tooltip>
              {/* <LoadingButton
                variant="contained"
                onClick={() =>
                  exportShiftNotesMutation(Array.isArray(id) ? id[0] : id)
                }
                loading={isExporting}
              >
                Export
              </LoadingButton> */}
              <Tooltip title="Export Data To Email">
                <Button
                  // onClick={() => handleExport(clientFilter ?? 0)}
                  onClick={() =>
                    handleExport(
                      clientFilter ?? 0,
                      dates?.[0]?.unix()?.toString() ?? "",
                      dates?.[1]?.unix()?.toString() ?? ""
                    )
                  }
                  variant="contained"
                  startIcon={<EmailIcon />}
                ></Button>
              </Tooltip>
              <Tooltip title="Export & Download Data to PDF">
                <Button
                  onClick={() =>
                    handleExportPdf(
                      clientFilter ?? 0,
                      dates?.[0]?.unix()?.toString() ?? "",
                      dates?.[1]?.unix()?.toString() ?? ""
                    )
                  }
                  role="a"
                  variant="contained"
                  startIcon={<PictureAsPdfIcon />}
                ></Button>
              </Tooltip>
            </Box>
            <RangePicker
              allowClear
              format="DD/MM/YYYY"
              value={dates}
              onChange={(dates: RangePickerProps["value"]) => setDates(dates)}
            />
            <Box>
              <Button
                variant="outlined"
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                Filter Categories
              </Button>
              <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                  horizontal: "center",
                  vertical: "bottom"
                }}
                transformOrigin={{
                  horizontal: "center",
                  vertical: "top"
                }}
                sx={{
                  ".MuiPaper-root": {
                    paddingBlock: "10px",
                    paddingInline: "15px"
                  }
                }}
              >
                <Stack>
                  <FormControlLabel
                    control={<Checkbox size="small" />}
                    checked={filterValues.includes("Notes")}
                    onChange={() =>
                      setFilterValues((prev) =>
                        prev.includes("Notes")
                          ? prev.filter((_prev) => _prev !== "Notes")
                          : [...prev, "Notes"]
                      )
                    }
                    label="Notes"
                  />
                  <FormControlLabel
                    control={<Checkbox size="small" />}
                    checked={filterValues.includes("Feedback")}
                    onChange={() =>
                      setFilterValues((prev) =>
                        prev.includes("Feedback")
                          ? prev.filter((_prev) => _prev !== "Feedback")
                          : [...prev, "Feedback"]
                      )
                    }
                    label="Feedback"
                  />
                  <FormControlLabel
                    control={<Checkbox size="small" />}
                    checked={filterValues.includes("Enquiry")}
                    onChange={() =>
                      setFilterValues((prev) =>
                        prev.includes("Enquiry")
                          ? prev.filter((_prev) => _prev !== "Enquiry")
                          : [...prev, "Enquiry"]
                      )
                    }
                    label="Enquiry"
                  />
                  <FormControlLabel
                    control={<Checkbox size="small" />}
                    checked={filterValues.includes("Incident")}
                    onChange={() =>
                      setFilterValues((prev) =>
                        prev.includes("Incident")
                          ? prev.filter((_prev) => _prev !== "Incident")
                          : [...prev, "Incident"]
                      )
                    }
                    label="Incident"
                  />
                  <FormControlLabel
                    control={<Checkbox size="small" />}
                    checked={filterValues.includes("Injury")}
                    onChange={() =>
                      setFilterValues((prev) =>
                        prev.includes("Injury")
                          ? prev.filter((_prev) => _prev !== "Injury")
                          : [...prev, "Injury"]
                      )
                    }
                    label="Injury"
                  />
                </Stack>
              </Popover>
            </Box>
            <Select
              value={clientFilter}
              onChange={(e) =>
                setClientFilter(
                  e.target.value
                    ? parseInt(e.target.value.toString())
                    : undefined
                )
              }
              size="small"
              displayEmpty
              // renderValue={
              //   !clientFilter ? () => "Filter Participant" : undefined
              // }
              sx={{ backgroundColor: "#fff" }}
            >
              <MenuItem>Filter Participant</MenuItem>
              {clientList.map((_item) => (
                <MenuItem key={_item.id} value={_item.id}>
                  {_item.name}
                </MenuItem>
              ))}
            </Select>
            <Select
              value={staffFilter}
              onChange={(e) =>
                setStaffFilter(
                  e.target.value
                    ? parseInt(e.target.value.toString())
                    : undefined
                )
              }
              size="small"
              displayEmpty
              // renderValue={!staffFilter ? () => "Filter Staff" : undefined}
              sx={{ backgroundColor: "#fff" }}
            >
              <MenuItem>Filter Staff</MenuItem>
              {staffList.map((_item) => (
                <MenuItem key={_item.id} value={_item.id}>
                  {_item.name}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        </Stack>
        <StyledPaper>
          {Object.keys(data || {})
            .sort((a, b) => parseInt(b) - parseInt(a))
            .map((_key) => {
              const eachShiftNotesArray = data[_key] as IShiftNotes[];
              return (
                eachShiftNotesArray.some(
                  (_data) =>
                    filterValues.includes(_data.shiftNotesCategories) &&
                    (clientFilter ? _data.clientId === clientFilter : true) &&
                    (staffFilter ? _data.employeeId === staffFilter : true)
                ) && (
                  <Box key={_key}>
                    <Chip
                      label={moment.unix(parseInt(_key)).format("D MMM, YYYY")}
                      variant="filled"
                      color="error"
                    />
                    {eachShiftNotesArray
                      .filter(
                        (_note) =>
                          filterValues.includes(_note.shiftNotesCategories) &&
                          (clientFilter
                            ? _note.clientId === clientFilter
                            : true) &&
                          (staffFilter
                            ? _note.employeeId === staffFilter
                            : true)
                      )
                      .sort((a, b) => b.createdAtEpoch - a.createdAtEpoch)
                      .map((_note, index: number) => (
                        <EachShiftNote
                          key={_note.id}
                          note={_note}
                          lastElement={index === eachShiftNotesArray.length - 1}
                        />
                      ))}
                  </Box>
                )
              );
            })}
          <Box paddingLeft={8} paddingRight={5} id="add-notes">
            <FormProvider {...methods}>
              <Grid container spacing={2}>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <Controller
                    control={methods.control}
                    name="shiftNoteCategories"
                    render={({ field }) => (
                      <Select {...field} fullWidth size="small">
                        <MenuItem value="Notes">Notes</MenuItem>
                        <MenuItem value="Feedback">Feedback</MenuItem>
                        <MenuItem value="Enquiry">Enquiry</MenuItem>
                        <MenuItem value="Incident">Incident</MenuItem>
                        <MenuItem value="Injury">Injury</MenuItem>
                      </Select>
                    )}
                  />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <Controller
                    control={methods.control}
                    name="date"
                    render={({ field }) => (
                      <Datepicker
                        {...field}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small"
                          }
                        }}
                        maxDate={dayjs()}
                      />
                    )}
                  />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <CustomInput name="subject" placeholder="Enter Subject" />
                </Grid>

                <>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Controller
                      control={methods.control}
                      name="clientId"
                      render={({ field }) => {
                        return (
                          <Select
                            {...field}
                            fullWidth
                            displayEmpty
                            size="small"
                            value={selectedValue}
                            onChange={(e) => {
                              field.onChange(e);
                              handleSelectChange(e);
                            }}
                            renderValue={
                              selectedValue === "001"
                                ? () => "Other"
                                : selectedValue === ""
                                ? () => "Select Participant"
                                : undefined
                            }
                          >
                            {/* Dynamic options */}
                            {clients?.map((_client) => (
                              <MenuItem value={_client.id} key={_client.id}>
                                {_client.displayName}
                              </MenuItem>
                            ))}

                            {/* Static option */}
                            <MenuItem value="001">Other</MenuItem>
                          </Select>
                        );
                      }}
                    />
                  </Grid>

                  {/* Conditionally display input field if "Other" is selected */}
                  {isOtherSelected && (
                    <>
                      <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Typography></Typography>
                      </Grid>
                      <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Controller
                          control={methods.control}
                          name="clientId"
                          render={({ field }) => {
                            return (
                              <Select
                                {...field}
                                fullWidth
                                displayEmpty
                                size="small"
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleSecondDropdownChange(e);
                                }}
                                renderValue={
                                  selectedValue === "001"
                                    ? () => "Select Temprary Participant"
                                    : selectedValue === ""
                                    ? () => ""
                                    : undefined
                                }
                              >
                                {tempraryclients?.map((_client: IClient) => (
                                  <MenuItem value={_client.id} key={_client.id}>
                                    {_client.salutation} {_client.firstName}{" "}
                                    {_client.middleName} {_client.lastName}
                                  </MenuItem>
                                ))}
                              </Select>
                            );
                          }}
                        />
                      </Grid>
                      <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Typography></Typography>
                      </Grid>
                      <Grid item lg={6} md={6} sm={12} xs={12}>
                        {/* <Link
                          href="/participants/new"
                          passHref
                          style={{ textDecoration: "none" }}
                        >
                          <Typography style={{ color: "#00a9a9" }}>
                            Add Temporary Employee
                          </Typography>
                        </Link> */}
                        <Link
                          href="/participants/new"
                          passHref
                          style={{ textDecoration: "none" }}
                        >
                          <Typography
                            style={{
                              color: "#00a9a9",
                              display: "flex",
                              alignItems: "center"
                            }}
                          >
                            <TouchAppIcon style={{ marginLeft: "4px" }} /> Add
                            Temporary Employee
                            {/* Add the icon */}
                          </Typography>
                        </Link>
                      </Grid>
                    </>
                  )}
                </>

                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Box
                    padding={1}
                    paddingInline={1.5}
                    border="1px solid #ededed"
                    borderRadius={1}
                  >
                    <Controller
                      control={methods.control}
                      name="notes"
                      render={({ field, fieldState: { invalid, error } }) => (
                        <Box>
                          <RichTextEditor {...field} />
                          {invalid && (
                            <FormHelperText>{error?.message}</FormHelperText>
                          )}
                        </Box>
                      )}
                    />
                  </Box>
                </Grid>
              </Grid>
            </FormProvider>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              marginTop={3}
              marginBottom={5}
            >
              <input
                type="file"
                onChange={(e) => setDocuments(e.target.files?.[0])}
              />
              <Tooltip title="To save the note">
                <LoadingButton
                  variant="contained"
                  onClick={methods.handleSubmit(onSubmit)}
                  loading={isPending}
                >
                  Save Note
                </LoadingButton>
              </Tooltip>
            </Stack>
          </Box>
        </StyledPaper>
      </StyledBox>
    </DashboardLayout>
  );
}
