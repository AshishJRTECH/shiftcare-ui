import styled from "@emotion/styled";
import {
  Autocomplete,
  AutocompleteProps,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  DrawerProps,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import React, { SetStateAction, useEffect, useState } from "react";
import Iconify from "../Iconify/Iconify";
import { Box, Stack } from "@mui/system";
import StyledPaper from "@/ui/Paper/Paper";
import Image from "next/image";
import assets from "@/json/assets";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import {
  Unstable_NumberInput as BaseNumberInput,
  NumberInputProps
} from "@mui/base/Unstable_NumberInput";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import RepeatIcon from "@mui/icons-material/Repeat";
import useGoogle from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import CustomInput from "@/ui/Inputs/CustomInput";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext
} from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getStaffList, undoTimesheet } from "@/api/functions/staff.api";
import { IStaff } from "@/interface/staff.interfaces";
import { getAllClients } from "@/api/functions/client.api";
import { IClient } from "@/interface/client.interface";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import RichTextEditor from "../RichTextEditor/RichTextEditor";
import {
  Shift,
  ShiftBody,
  ShiftBodyS,
  Task
} from "@/interface/shift.interface";
import { cancelShift, createShift, editShift } from "@/api/functions/shift.api";
import { LoadingButton } from "@mui/lab";
import { useCurrentEditor } from "@tiptap/react";
import { Moment } from "moment";
import ClientSection from "./client-section";
import StaffSection from "./staff-section";
import TaskSection from "./task-section";
import InstructionSection from "./instruction-section";
import TimeLocation from "./time-location";
import { queryClient } from "pages/_app";
import ShiftRelatedNotes from "./shift-related-notes";
import { getRole } from "@/lib/functions/_helpers.lib";
import AddNoteModal from "./addNoteModal";
import RepeatShift from "../add-shift/repeat-shift";
import AdvanceShift from "./advance-shift";
import { rebookShift } from "@/api/functions/shift.api";
import { toast } from "sonner";
import JobApplicant from "./jobapplicant";
import NoteIcon from "@mui/icons-material/Note"; // Import NoteIcon
import ShiftNotesIndividualShift from "pages/shift-notes-individualshift";

interface DrawerInterface extends DrawerProps {
  open?: boolean;
}

export const StyledDrawer = styled(Drawer)<DrawerInterface>`
  z-index: 3000;
  > .drawer {
    width: 700px;
    background-color: #f0f0f0;
    z-index: 3000;
    @media (width<=699px) {
      width: 100%;
    }
  }
  .header {
    padding: 15px;
    background-color: #fff;
  }
  .main-container {
    padding: 15px;
  }
  img.icon {
    width: 30px;
    height: 30px;
  }
`;

export const StyledInputRoot = styled(Box)`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
`;

export const StyledInput = styled("input")`
  height: 40px;
  width: 100%;
  padding: 8.5px 14px;
  text-align: center;
  border-block: 1px solid rgba(145, 158, 171, 0.24);
  border-inline: none;
  font-size: 16px;
  color: #212b36;
  font-weight: 400;
  letter-spacing: 1px;
  font-family: "Inter", sans-serif;
`;

export const StyledButton = styled("button")`
  padding: 8.7px;
  background-color: #f0f0f0;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border: 1px solid rgba(145, 158, 171, 0.24);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &.increment {
    order: 1;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  .css-1sucic7 {
    position: fixed;
    z-index: 5000 !important;
    inset: 0px;
  }
`;

export const CustomStepperInput = (
  props: NumberInputProps & {
    onChange: (value: number | null) => void;
  }
) => {
  return (
    <BaseNumberInput
      slots={{
        root: StyledInputRoot,
        input: StyledInput,
        incrementButton: StyledButton,
        decrementButton: StyledButton
      }}
      slotProps={{
        incrementButton: {
          children: <AddIcon fontSize="small" sx={{ color: "#606266" }} />,
          className: "increment"
        },
        decrementButton: {
          children: <RemoveIcon fontSize="small" sx={{ color: "#606266" }} />
        }
      }}
      min={1}
      max={60}
      {...props}
      onChange={(e, val) => props.onChange(val)}
    />
  );
};

interface CustomAutoCompleteProps
  extends Omit<
    AutocompleteProps<
      string,
      boolean | undefined,
      boolean | undefined,
      boolean | undefined
    >,
    "onChange"
  > {
  onChange: (value: string) => void;
}

const AddressInput = ({ ...props }: CustomAutoCompleteProps) => {
  const { placePredictions, getPlacePredictions, isPlacePredictionsLoading } =
    useGoogle({
      apiKey: process.env.NEXT_APP_GOOGLE_API
    });

  console.log(placePredictions, isPlacePredictionsLoading);

  const AddressItem = ({ description }: { description: any }) => {
    return (
      <Stack alignItems="center" gap={1}>
        <Iconify icon="carbon:location-filled" />
        <Typography variant="caption">{description}</Typography>
      </Stack>
    );
  };

  return (
    // <Autocomplete
    //   size="small"
    //   freeSolo
    //   {...props}
    //   onChange={(e: any, newValue: any | null) => {
    //     console.log(e, newValue, "dfd");
    //   }}
    //   onInputChange={(e: any, value: string) => {
    //     getPlacePredictions({ input: value });
    //     props.onChange && props.onChange(value as string);
    //   }}
    //   renderInput={(params) => (
    //     <TextField {...params} placeholder="Search Address" />
    //   )}
    //   loading={isPlacePredictionsLoading}
    //   loadingText="Loading Locations"
    //   options={placePredictions}
    //   renderOption={(item) => <AddressItem description={item} />}
    // />

    <Autocomplete
      size="small"
      freeSolo
      {...props}
      onChange={(e: any, newValue: any | null) => {
        console.log(e, newValue, "dfd");
      }}
      onInputChange={(e: any, value: string) => {
        getPlacePredictions({ input: value });
        props.onChange && props.onChange(value as string);
      }}
      renderInput={(params) => (
        <TextField {...params} placeholder="Search Address" />
      )}
      loading={isPlacePredictionsLoading}
      loadingText="Loading Locations"
      options={placePredictions.map((item) => item.description)} // Extract description as string[]
      renderOption={(props, item) => (
        <AddressItem {...props} description={item} />
      )} // Ensure AddressItem uses string description
    />
  );
};

export const repeatPeriods = {
  Daily: {
    repeats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    name: "Day",
    display: ""
  },
  Weekly: {
    repeats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    name: "Week",
    display: "days"
  },
  Monthly: {
    repeats: [1, 2, 3],
    name: "Month",
    display: "daysOfMonth"
  },
  Fortnight: {
    repeats: [1, 2, 3],
    name: "Fortnight",
    display: "fortnight"
  }
};

// export const shiftTypeArrays = [
//   {
//     id: "PersonalCare",
//     name: "Personal Care"
//   },
//   {
//     id: "DomesticAssistance",
//     name: "Domestic Assistance"
//   },
//   {
//     id: "NightShift",
//     name: "Night Shift"
//   },
//   {
//     id: "RespiteCare",
//     name: "Respite Care"
//   },
//   {
//     id: "Sleepover",
//     name: "Sleepover"
//   },
//   {
//     id: "SupportCoordination",
//     name: "Support Coordination"
//   },
//   {
//     id: "Transport",
//     name: "Transport"
//   }
// ];

// export const shiftTypeArrays = [
//   {
//     id: "CommunityNursing",
//     name: "Community Nursing"
//   },
//   {
//     id: "OccupationalTherapy",
//     name: "Occupational Therapy"
//   },
//   {
//     id: "YardMaintenance",
//     name: "Yard Maintenance"
//   },
//   {
//     id: "Gardening",
//     name: "Gardening"
//   },
//   {
//     id: "Cleaning",
//     name: "Cleaning"
//   },
//   {
//     id: "AssistanceWithSelfCare",
//     name: "Assistance With Self-Care"
//   },
//   {
//     id: "InHomeCare",
//     name: "In Home Care"
//   },
//   {
//     id: "CommunityAccess",
//     name: "Community Access"
//   },
//   {
//     id: "AccessibleTransport",
//     name: "Accessible Transport"
//   },
//   {
//     id: "SkillsDevelopment",
//     name: "Skills Development"
//   },
//   {
//     id: "GroupAndCenterBasedActivities",
//     name: "Group And Center Based Activities"
//   },
//   {
//     id: "SupportCoordination",
//     name: "Support Coordination"
//   },
//   {
//     id: "RespiteCare",
//     name: "Respite Care"
//   }
// ];

export const shiftTypeArrays = [
  {
    id: "AssistanceWithDailyLife",
    name: "Assistance with Daily Life"
  },
  {
    id: "Transport",
    name: "Transport"
  },
  {
    id: "Consumables",
    name: "Consumables"
  },
  {
    id: "AssistanceWithSocialEconomicAndCommunityParticipation",
    name: "Assistance with Social, Economic, and Community Participation"
  },
  {
    id: "AssistiveTechnology",
    name: "Assistive Technology"
  },
  {
    id: "HomeModificationsAndSpecialisedDisabilityAccommodation",
    name: "Home Modifications and Specialised Disability Accommodation(SDA)"
  },
  {
    id: "SupportCoordination",
    name: "Support Coordination"
  },
  {
    id: "ImprovedLivingArrangements",
    name: "Improved Living Arrangements"
  },
  {
    id: "IncreasedSocialAndCommunityParticipation",
    name: "Increased Social and Community Participation"
  },
  {
    id: "FindingAndKeepingAJob",
    name: "Finding and Keeping a Job"
  },
  {
    id: "ImprovedRelationships",
    name: "Improved Relationships"
  },
  {
    id: "ImprovedHealthAndWellbeing",
    name: "Improved Health and Wellbeing"
  },
  {
    id: "ImprovedLearning",
    name: "Improved Learning"
  },
  {
    id: "ImprovedLifeChoices",
    name: "Improved Life Choices"
  },
  {
    id: "ImprovedDailyLivingSkills",
    name: "Improved Daily Living Skills"
  }
];

export const daysOfWeek = [
  {
    id: "SUNDAY",
    name: "Sun"
  },
  {
    id: "MONDAY",
    name: "Mon"
  },
  {
    id: "TUESDAY",
    name: "Tue"
  },
  {
    id: "WEDNESDAY",
    name: "Wed"
  },
  {
    id: "THURSDAY",
    name: "Thur"
  },
  {
    id: "FRIDAY",
    name: "Fri"
  },
  {
    id: "SATURDAY",
    name: "Sat"
  }
];

interface AddShiftProps extends DrawerProps {
  isClient?: boolean;
  view?: boolean;
  edit?: boolean;
  repeatshift?: boolean;
  setViewModal?: React.Dispatch<SetStateAction<boolean>>;
  setEditModal?: React.Dispatch<SetStateAction<boolean>>;
  shift?: Shift;
  onClose: () => void;
  selectedDate?: Moment | null;
  // onSelectId: (id: number) => void;
}

const schema = yup.object().shape({
  startDate: yup.date().required("Please Select a Date"),
  isShiftEndsNextDay: yup.boolean(),
  startTime: yup.date().required("Please select a start time"),
  endTime: yup.date().required("Please select an end time"),
  breakTimeInMins: yup.number(),
  isRepeated: yup.boolean(),
  address: yup.string(),
  apartmentNumber: yup.string(),
  isDropOffAddress: yup.boolean(),
  shiftType: yup.string(),
  recurrance: yup.string(),
  repeatNoOfDays: yup.number(),
  repeatNoOfWeeks: yup.number(),
  occursOnDays: yup.array().of(yup.string()),
  repeatNoOfMonths: yup.number(),
  occursOnDayOfMonth: yup.number(),
  endDate: yup.date(),
  dropOffAddress: yup.string(),
  dropOffApartmentNumber: yup.string(),
  tasks: yup.array().of(
    yup.object().shape({
      task: yup.string().required("Please enter a task"),
      isTaskMandatory: yup.boolean()
    })
  ),
  instruction: yup.string(),
  clientIds: yup
    .array()
    .of(yup.number())
    .required("Please Select a Paricipant"),
  employeeIds: yup.array().of(yup.number()).required("Please Select a Carer"),
  isOpenShift: yup.boolean()
});

clientPriceBooks: yup.array().of(
  yup.object().shape({
    clientId: yup.number(),
    priceBookIds: yup.array().of(yup.string())
  })
);

export default function AddShift({
  // onSelectId,
  view,
  edit,
  repeatshift,
  setViewModal,
  setEditModal,
  shift,
  ...props
}: AddShiftProps) {
  const router = useRouter();
  const { id } = useParams();
  const role = getRole();
  const { staff, client } = router.query;
  const [repeatshiftModal, setRepeatShiftModal] = useState(false);
  // const [shiftModal, setShiftModal] = useState(false);
  const { data: clients, isLoading } = useQuery({
    queryKey: ["client_list"],
    queryFn: () => getAllClients(),
    enabled: Boolean(client) && role === "ROLE_ADMINS"
  });

  const [viewAdvanceModal, setViewAdvanceModal] = useState(false);
  const [editAdvanceModal, setEditAdvanceModal] = useState(false);
  const [advanceShift, setAdvanceShift] = useState(false);
  const [shiftModalAdvance, setShiftModalAdvance] = useState(false);
  const [shiftNotes, setShiftNotes] = useState(false);

  const [noteModal, setNoteModal] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      startDate: dayjs(),
      isShiftEndsNextDay: false,
      startTime: dayjs().set("hour", 10).set("minute", 0),
      endTime: dayjs().set("hour", 11).set("minute", 0),
      breakTimeInMins: 0,
      isRepeated: false,
      address: "",
      apartmentNumber: "",
      isDropOffAddress: false,
      shiftType: shiftTypeArrays[0].id,
      recurrance: "Daily",
      repeatNoOfDays: "1",
      repeatNoOfWeeks: "1",
      occursOnDays: [dayjs().format("dddd").toUpperCase()],
      repeatNoOfMonths: "1",
      occursOnDayOfMonth: "1",
      endDate: dayjs().add(1, "day"),
      dropOffAddress: "",
      dropOffApartmentNumber: "",
      tasks: [
        {
          task: "Sample task",
          isTaskMandatory: false
        }
      ],
      instruction: "",
      clientIds: router.pathname.includes("participants")
        ? [parseInt(id as string)]
        : client
        ? [parseInt(client as string)]
        : [],
      employeeIds: router.pathname.includes("staff")
        ? [parseInt(id as string)]
        : staff
        ? [parseInt(staff as string)]
        : [],
      isOpenShift: false,
      clientPriceBooks: [
        { clientId: 0, priceBookIds: "" } // Initialize with an empty object for the first entry
      ]
    }
  });

  useEffect(() => {
    if (client) {
      // methods.setValue("clientId", client as string);
      methods.setValue("clientIds", [parseInt(client as string)]);
      const _client: IClient = clients.find(
        (_data: IClient) => _data.id === parseInt(client as string)
      );
      methods.setValue("address", _client.address);
      methods.setValue("apartmentNumber", _client.apartmentNumber);
    }
    if (staff) {
      methods.setValue("employeeIds", [parseInt(staff as string)]);
    }
    if (props.selectedDate) {
      methods.setValue("startDate", dayjs(props.selectedDate?.toDate()));
    }
  }, [staff, client, isLoading]);

  useEffect(() => {
    if (edit) {
      methods.reset({
        startDate: dayjs(shift?.startDate),
        isShiftEndsNextDay: shift?.isShiftEndsNextDay,
        startTime: dayjs()
          .set("hour", shift?.startTime[0] || 0)
          .set("minute", shift?.startTime[1] || 0),
        endTime: dayjs()
          .set("hour", shift?.endTime[0] || 0)
          .set("minute", shift?.endTime[1] || 0),
        breakTimeInMins: shift?.breakTimeInMins,
        isRepeated: shift?.isRepeated,
        address: shift?.address,
        apartmentNumber: shift?.apartmentNumber,
        isDropOffAddress: shift?.isDropOffAddress,
        shiftType: shift?.shiftType,
        recurrance: shift?.recurrance,
        repeatNoOfDays: shift?.repeatNoOfDays.toString(),
        repeatNoOfWeeks: shift?.repeatNoOfWeeks.toString(),
        occursOnDays: [],
        repeatNoOfMonths: shift?.repeatNoOfMonths.toString(),
        occursOnDayOfMonth: shift?.occursOnDayOfMonth.toString(),
        endDate: dayjs(shift?.endDate),
        dropOffAddress: shift?.dropOffAddress,
        dropOffApartmentNumber: shift?.dropOffApartmentNumber,
        tasks: shift?.tasks,
        instruction: shift?.instruction,
        clientIds: [shift?.client.id],
        employeeIds: [shift?.employee.id],
        isOpenShift: shift?.isOpenShift
      });
    }
  }, [edit]);

  const { mutate, isPending } = useMutation({
    mutationFn: createShift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all_shifts"] });
      methods.reset();
      props.onClose();
    }
  });

  const { mutate: editMutate, isPending: isEditPending } = useMutation({
    mutationFn: editShift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all_shifts"] });
      methods.reset();
      props.onClose();
    }
  });

  const { mutate: cancelMutate, isPending: isShiftCancelling } = useMutation({
    mutationFn: cancelShift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all_shifts"] });
      methods.reset();
      props.onClose();
    }
  });

  const onSubmit = (data: ShiftBodyS) => {
    const selectedClientIdsArray = data.clientIds;
    const newData = {
      ...data,
      startDate: dayjs(data.startDate).format("YYYY-MM-DD"),
      endDate: dayjs(data.endDate).format("YYYY-MM-DD"),
      // shiftEndDate: data.isShiftEndsNextDay
      //   ? dayjs(data.startDate).add(1, "day").format("YYYY-MM-DD")
      //   : dayjs(data.startDate).format("YYYY-MM-DD"),
      breakTimeInMins: data.breakTimeInMins || 0,
      startTime: dayjs(data.startTime).format("HH:mm"),
      endTime: dayjs(data.endTime).format("HH:mm"),
      clientIds: data.clientIds,
      id: shift?.id,
      clientPriceBooks: data.clientPriceBooks?.map((group, index) => ({
        ...group,
        clientId: selectedClientIdsArray[index]?.toString() || "0" // Assign clientId from clientIds array
      }))
      // instruction: JSON.stringify(editor?.getJSON(), null, 2)
    };
    console.log(
      "-------------------- Form Data ------------------------",
      newData
    );
    if (edit) editMutate(newData);
    else mutate(newData);
  };

  const handleRepeatShift = (id: any) => {
    setSelectedId(id);
    // Logic to handle repeating the shift with the given ID
    console.log(
      "---------------Repeating shift with ID:---------------------",
      id
    );
  };

  const handleCreateShiftNotes = (id: any) => {
    setShiftNotes(true);
    props.onClose();
    setSelectedId(id);
    console.log("--------------- Shift ID: ---------------------", id);
  };

  const handleCloseModalShiftNotes = () => {
    setShiftNotes(false);
  };

  const { mutate: rebook, isPending: pending } = useMutation({
    mutationFn: rebookShift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all_shifts"] });
      props.onClose();
    }
  });

  const handleRebookShift = (shiftId: number) => {
    rebook(shiftId);
  };

  // useEffect(() => {
  //   console.log(
  //     "-------------: Shift Details in Add-shift page is as below :-------------",
  //     shift
  //   );
  // }, []);

  // ---------------------------- Time Sheet Undo Start Here ----------------------------
  const { mutate: undoTimesheetMutation, isPending: ispendingUndo } =
    useMutation({
      mutationFn: undoTimesheet,
      onSuccess: (response) => {
        toast.success(response.message);
        // console.log("Response:", response);
        queryClient.invalidateQueries({ queryKey: ["all_shifts"] });
        props.onClose();
      }
    });
  const handleUndoTimesheet = (time_sheet_id: string) => {
    if (typeof time_sheet_id === "string") {
      // console.log("Undo Timesheet of Id:", time_sheet_id);
      undoTimesheetMutation(time_sheet_id);
    } else {
      console.error("Invalid id type. Expected a string.");
    }
  };
  // ---------------------------- Time Sheet Undo End Here ----------------------------

  return (
    <>
      <AdvanceShift
        view={viewAdvanceModal}
        edit={editAdvanceModal}
        open={shiftModalAdvance}
        onClose={() => {
          setShiftModalAdvance(false);
          setViewAdvanceModal(false);
          setEditAdvanceModal(false);
        }}
        shift={shift}
        // open={shiftModalAdvance}
        // onClose={() => {
        //   setShiftModalAdvance(false);
        // }}
      />
      <StyledDrawer
        anchor="right"
        {...props}
        open={props.open || view || edit || repeatshift}
        PaperProps={{
          className: "drawer"
        }}
        onClose={isPending ? undefined : props.onClose}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
          className="header"
        >
          {!edit ? (
            <Button
              variant="outlined"
              startIcon={<Iconify icon="mingcute:close-fill" />}
              onClick={props.onClose}
              disabled={isPending}
            >
              Close
            </Button>
          ) : (
            <Button
              variant="outlined"
              startIcon={<Iconify icon="ion:chevron-back-outline" />}
              onClick={() => {
                if (setEditModal && setViewModal) {
                  setEditModal(false);
                  setViewModal(true);
                }
              }}
              disabled={isPending}
            >
              Back
            </Button>
          )}

          {role === "ROLE_CARER" ? (
            <Button
              variant="contained"
              startIcon={<Iconify icon="tabler:plus" fontSize={14} />}
              onClick={() => setNoteModal(true)}
            >
              Add Note
            </Button>
          ) : !view ? (
            <>
              {!edit ? (
                <>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Button
                      variant="contained"
                      startIcon={
                        <Iconify icon="basil:edit-outline" fontSize={14} />
                      }
                      onClick={() => {
                        setShiftModalAdvance(true);
                        setEditAdvanceModal(false);
                        setViewAdvanceModal(false);
                      }}
                    >
                      Advance Shift
                    </Button>
                    <LoadingButton
                      variant="contained"
                      startIcon={<Iconify icon="ic:baseline-save" />}
                      onClick={methods.handleSubmit(onSubmit)}
                      loading={isPending || isEditPending}
                    >
                      Save
                    </LoadingButton>
                  </Stack>
                </>
              ) : (
                <Stack direction="row" alignItems="center" gap={1}>
                  <Button
                    variant="contained"
                    startIcon={
                      <Iconify icon="basil:edit-outline" fontSize={14} />
                    }
                    onClick={() => {
                      setShiftModalAdvance(true);
                      setEditAdvanceModal(true);
                      setViewAdvanceModal(false);
                    }}
                  >
                    Advance Edit
                  </Button>
                  <LoadingButton
                    variant="contained"
                    startIcon={<Iconify icon="ic:baseline-save" />}
                    onClick={methods.handleSubmit(onSubmit)}
                    loading={isPending || isEditPending}
                  >
                    Save
                  </LoadingButton>
                </Stack>
              )}
            </>
          ) : (
            // <>
            //   {shift?.deleted ? (
            //     // <Typography>Shift Deleted</Typography>
            //     <Stack direction="row" alignItems="center" gap={1}>
            //       <Button
            //         variant="contained"
            //         startIcon={<RepeatIcon />}
            //         onClick={() => {
            //           handleRebookShift(shift?.id as number); // Pass the ID here
            //         }}
            //       >
            //         Rebook
            //       </Button>
            //     </Stack>
            //   ) : (
            //     // <Typography>Shift Not Deleted</Typography>
            //     <Stack direction="row" alignItems="center" gap={1}>
            //       <LoadingButton
            //         variant="contained"
            //         color="error"
            //         startIcon={
            //           <Iconify icon="iconamoon:trash-duotone" fontSize={14} />
            //         }
            //         loading={isShiftCancelling}
            //         onClick={() => cancelMutate(shift?.id as number)}
            //       >
            //         Cancel Shift
            //       </LoadingButton>
            //       <Button
            //         variant="contained"
            //         startIcon={<RepeatIcon />}
            //         onClick={() => {
            //           handleRepeatShift(shift?.id as number); // Pass the ID here
            //           setRepeatShiftModal(true);
            //         }}
            //       >
            //         Repeat Shift
            //       </Button>
            //       <RepeatShift
            //         open={repeatshiftModal}
            //         onClose={() => setRepeatShiftModal(false)}
            //         id={selectedId}
            //       />
            //       <Button
            //         variant="contained"
            //         startIcon={
            //           <Iconify icon="basil:edit-outline" fontSize={14} />
            //         }
            //         onClick={() => {
            //           if (setEditModal && setViewModal) {
            //             setEditModal(true);
            //             setViewModal(false);
            //           }
            //         }}
            //       >
            //         Edit
            //       </Button>
            //     </Stack>
            //   )}
            // </>

            <>
              {shift?.deleted ? (
                <Stack direction="row" alignItems="center" gap={1}>
                  <Button
                    variant="contained"
                    startIcon={<RepeatIcon />}
                    onClick={() => {
                      handleRebookShift(shift?.id as number); // Pass the ID here
                    }}
                  >
                    Rebook
                  </Button>
                </Stack>
              ) : shift?.isTimesheetApproved ? (
                <Stack direction="row" alignItems="center" gap={1}>
                  <Button
                    variant="contained"
                    // color="warning"
                    sx={{ backgroundColor: "#b4ceff", color: "#000000" }}
                    startIcon={
                      <Iconify icon="mdi:undo-variant" fontSize={14} />
                    }
                    // onClick={() => handleUnapproveShift(shift?.id as number)} // Handle unapprove logic here
                    onClick={() => handleUndoTimesheet(String(shift.id))}
                  >
                    Unapprove
                  </Button>
                </Stack>
              ) : (
                // <Stack direction="row" alignItems="center" gap={1}>
                //   <LoadingButton
                //     variant="contained"
                //     color="error"
                //     startIcon={
                //       <Iconify icon="iconamoon:trash-duotone" fontSize={14} />
                //     }
                //     loading={isShiftCancelling}
                //     onClick={() => cancelMutate(shift?.id as number)}
                //   >
                //     Cancel Shift
                //   </LoadingButton>
                //   <Button
                //     variant="contained"
                //     startIcon={<RepeatIcon />}
                //     onClick={() => {
                //       handleRepeatShift(shift?.id as number); // Pass the ID here
                //       setRepeatShiftModal(true);
                //     }}
                //   >
                //     Repeat Shift
                //   </Button>
                //   <RepeatShift
                //     open={repeatshiftModal}
                //     onClose={() => setRepeatShiftModal(false)}
                //     id={selectedId}
                //   />
                //   <Button
                //     variant="contained"
                //     startIcon={
                //       <Iconify icon="basil:edit-outline" fontSize={14} />
                //     }
                //     onClick={() => {
                //       if (setEditModal && setViewModal) {
                //         setEditModal(true);
                //         setViewModal(false);
                //       }
                //     }}
                //   >
                //     Edit
                //   </Button>
                // </Stack>
                <>
                  {shift?.isPickupJob ? null : (
                    <Stack direction="row" alignItems="center" gap={1}>
                      <LoadingButton
                        variant="contained"
                        color="error"
                        startIcon={
                          <Iconify
                            icon="iconamoon:trash-duotone"
                            fontSize={14}
                          />
                        }
                        loading={isShiftCancelling}
                        onClick={() => cancelMutate(shift?.id as number)}
                      >
                        Cancel Shift
                      </LoadingButton>
                      <Button
                        variant="contained"
                        startIcon={<RepeatIcon />}
                        onClick={() => {
                          handleRepeatShift(shift?.id as number); // Pass the ID here
                          setRepeatShiftModal(true);
                        }}
                      >
                        Repeat Shift
                      </Button>
                      <RepeatShift
                        open={repeatshiftModal}
                        onClose={() => setRepeatShiftModal(false)}
                        id={selectedId}
                      />
                      <Button
                        variant="contained"
                        startIcon={
                          <Iconify icon="basil:edit-outline" fontSize={14} />
                        }
                        onClick={() => {
                          if (setEditModal && setViewModal) {
                            setEditModal(true);
                            setViewModal(false);
                          }
                        }}
                      >
                        Edit
                      </Button>
                    </Stack>
                  )}
                </>
              )}
            </>
          )}
        </Stack>
        <Divider />
        <Stack
          gap={2}
          className="main-container"
          sx={{
            height: "100%",
            overflow: "auto",
            "&::-webkit-scrollbar": {
              display: "none"
            }
          }}
        >
          {role === "ROLE_CARER" ? (
            <FormProvider {...methods}>
              {shift?.isPickupJob ? (
                // <JobApplicant view={view} edit={edit} shift={shift} />
                <Typography></Typography>
              ) : (
                <>
                  <ClientSection view={view} edit={edit} shift={shift} />
                  <StaffSection
                    view={view}
                    edit={edit}
                    shift={shift}
                    advanceShift={advanceShift}
                  />
                  <TimeLocation view={view} edit={edit} shift={shift} />
                  {!view && <TaskSection edit={edit} />}
                  <InstructionSection view={view} edit={edit} shift={shift} />
                  {/* <TimeLocation view={view} edit={edit} shift={shift} /> */}
                  {view && <ShiftRelatedNotes shift={shift} />}
                </>
              )}
            </FormProvider>
          ) : (
            <FormProvider {...methods}>
              {shift?.isPickupJob ? (
                <JobApplicant view={view} edit={edit} shift={shift} />
              ) : (
                <>
                  <ClientSection view={view} edit={edit} shift={shift} />
                  <StaffSection
                    view={view}
                    edit={edit}
                    shift={shift}
                    advanceShift={advanceShift}
                  />
                  <TimeLocation view={view} edit={edit} shift={shift} />
                  {!view && <TaskSection edit={edit} />}
                  <InstructionSection view={view} edit={edit} shift={shift} />
                  {/* <TimeLocation view={view} edit={edit} shift={shift} /> */}
                  <Button
                    variant="contained"
                    startIcon={<NoteIcon />} // Change to NoteIcon
                    onClick={() => {
                      handleCreateShiftNotes(shift?.id as number); // Pass the ID here
                    }}
                    sx={{
                      backgroundColor: "#00a65a",
                      "&:hover": { backgroundColor: "#008d45" }
                    }} // Set the background color
                  >
                    Create Shift Notes
                  </Button>
                  {view && <ShiftRelatedNotes shift={shift} />}
                </>
              )}
            </FormProvider>
          )}
          {/* <FormProvider {...methods}>
            <ClientSection view={view} edit={edit} shift={shift} />
            <StaffSection
              view={view}
              edit={edit}
              shift={shift}
              advanceShift={advanceShift}
            />
            {!view && <TaskSection edit={edit} />}
            <InstructionSection view={view} edit={edit} shift={shift} />
            <TimeLocation view={view} edit={edit} shift={shift} />
            {view && <ShiftRelatedNotes shift={shift} />}
          </FormProvider> */}
        </Stack>
        <AddNoteModal
          open={noteModal}
          onClose={() => setNoteModal(false)}
          clientId={shift?.client.id}
          title="Add Note"
        />
      </StyledDrawer>

      {/* -------------------- Create new shift -------------------- */}
      <Dialog
        open={shiftNotes}
        onClose={handleCloseModalShiftNotes}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Create Shift Notes</DialogTitle>
        <Divider />
        <DialogContent>
          <ShiftNotesIndividualShift
            clients={[]}
            id={selectedId}
          ></ShiftNotesIndividualShift>
        </DialogContent>
        <DialogActions>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleCloseModalShiftNotes}
            >
              Close
            </Button>
            {/* <Button variant="contained" color="success">
              Update
            </Button> */}
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}
