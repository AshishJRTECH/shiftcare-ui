import { PayGroup, Price, PriceItem } from "@/interface/settings.interfaces";
import styled from "@emotion/styled";
import {
  Button,
  Checkbox,
  CircularProgress,
  DialogActions,
  IconButton,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import Iconify from "../Iconify/Iconify";
import otpGenerator from "otp-generation";
import Scrollbar from "@/ui/scrollbar";
import { LoadingButton } from "@mui/lab";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useMutation } from "@tanstack/react-query";
import {
  deletePayGroup,
  updatePayGroup,
  updatePriceItems
} from "@/api/functions/paygroup.api";
import { queryClient } from "pages/_app";
import { useRouter } from "next/router";
import MuiModalWrapper from "@/ui/Modal/MuiModalWrapper";
import CustomInput from "@/ui/Inputs/CustomInput";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import validationText from "@/json/messages/validationText";

const days_array = [
  {
    id: "Weekdays",
    label: "Weekdays",
    daysOfWeek: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]
  },
  { id: "Saturday", label: "Saturday", daysOfWeek: ["SATURDAY"] },
  { id: "Sunday", label: "Sunday", daysOfWeek: ["SUNDAY"] },
  {
    id: "Public_Holiday",
    label: "Public Holiday",
    daysOfWeek: [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY"
    ]
  }
];
const start_time_array = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23
];
const end_time_array = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24
];

const StyledPayItem = styled(Box)`
  margin-bottom: 30px;
`;

const PayItemRow = ({
  id,
  days,
  startTimeHours,
  daysOfWeek,
  endTimeHours,
  date,
  externalId,
  edit,
  setPayItem,
  index,
  isDelete
}: PriceItem & {
  edit: boolean;
  setPayItem: React.Dispatch<React.SetStateAction<PriceItem[]>>;
  index: number;
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayItem((prev) => {
      return prev.map((_prev: PriceItem) => {
        if (_prev.id === id) {
          (_prev as Record<string, any>)[e.target.name as keyof PriceItem] =
            e.target.value;
        }
        return _prev;
      });
    });
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    setPayItem((prev) => {
      return prev.map((_prev: PriceItem) => {
        if (_prev.id === id) {
          (_prev as Record<string, any>)[e.target.name as keyof PriceItem] =
            e.target.value;
        }
        return _prev;
      });
    });
  };

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell>
          {edit ? (
            <Select
              size="small"
              value={days}
              fullWidth
              name="days"
              onChange={(e) => {
                handleSelectChange(e);
                const value = days_array.find(
                  (_day) => _day.id === e.target.value
                );
                setPayItem((prev) => {
                  return prev.map((_prev: PriceItem) => {
                    if (_prev.id === id) {
                      (_prev as Record<string, any>)["daysOfWeek"] =
                        value?.daysOfWeek;
                    }
                    return _prev;
                  });
                });
              }}
            >
              {days_array.map((_day) => (
                <MenuItem value={_day.id} key={_day.id}>
                  {_day.label}
                </MenuItem>
              ))}
            </Select>
          ) : (
            days.replaceAll("_", " ")
          )}
        </TableCell>
        <TableCell>
          {edit ? (
            <Stack direction="row" alignItems="center" gap={1}>
              <Select
                size="small"
                value={startTimeHours.toString()}
                fullWidth
                name="startTimeHours"
                onChange={handleSelectChange}
              >
                {start_time_array.map((_time) => (
                  <MenuItem value={_time.toString()} key={_time}>
                    {moment(_time, "HH").format("hh a")}
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="subtitle1">-</Typography>
              <Select
                size="small"
                value={endTimeHours.toString()}
                fullWidth
                name="endTimeHours"
                onChange={handleSelectChange}
              >
                {end_time_array.map((_time) => (
                  <MenuItem value={_time.toString()} key={_time}>
                    {moment(_time, "HH").format("hh a")}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
          ) : (
            `${moment(startTimeHours, "HH").format("hh a")} - 
            ${moment(endTimeHours, "HH").format("hh a")}`
          )}
        </TableCell>
        <TableCell>
          {edit ? (
            <DatePicker
              value={
                date
                  ? dayjs(`${date[2]}/${date[1]}/${date[0]}`, "D/M/YYYY")
                  : null
              }
              slotProps={{
                // field: { clearable: true },
                textField: {
                  size: "small"
                },
                actionBar: {
                  actions: ["clear"]
                }
              }}
              format="DD/MM/YYYY"
              onChange={(e) => {
                setPayItem((prev) => {
                  return prev.map((_prev: PriceItem) => {
                    if (_prev.id === id) {
                      _prev["date"] = e
                        ? [
                            parseInt(e?.format("YYYY")),
                            parseInt(e?.format("M")),
                            parseInt(e?.format("D"))
                          ]
                        : null;
                    }
                    return _prev;
                  });
                });
              }}
            />
          ) : date ? (
            `${date[2]}-${date[1]}-${date[0]}`
          ) : null}
        </TableCell>
        <TableCell>
          {edit ? (
            <TextField
              type="text"
              value={externalId}
              name="externalId"
              onChange={handleInputChange}
              size="small"
            />
          ) : (
            externalId
          )}
        </TableCell>
        {edit && (
          <>
            <TableCell>
              <IconButton
                onClick={() =>
                  setPayItem((prev) => {
                    const copy = [...prev];
                    copy.splice(index + 1, 0, {
                      id: otpGenerator.generate(6, {
                        lowerCaseAlphabets: true,
                        digits: false,
                        specialChars: false,
                        upperCaseAlphabets: false
                      }),
                      days,
                      daysOfWeek,
                      startTimeHours,
                      endTimeHours,
                      externalId,
                      date
                    });
                    return copy;
                  })
                }
              >
                <Iconify icon="mingcute:copy-fill" />
              </IconButton>
            </TableCell>
            <TableCell>
              <Checkbox
                checked={isDelete}
                onChange={() => {
                  setPayItem((prev) => {
                    return prev.map((_prev: PriceItem) => {
                      if (_prev.id === id) {
                        _prev.isDelete = !_prev.isDelete;
                      }
                      return _prev;
                    });
                  });
                }}
              />
            </TableCell>
          </>
        )}
      </TableRow>
    </>
  );
};

const schema = yup.object().shape({
  payGroupName: yup.string().required(validationText.error.name)
});

export default function PayItem({ payGroupName, payItems, id }: PayGroup) {
  const [editTable, setEditTable] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [payItemCpy, setPayItemCpy] = useState(payItems);

  const router = useRouter();
  const ref = useRef(null);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      payGroupName: payGroupName || ""
    }
  });

  useEffect(() => {
    setPayItemCpy(payItems);
  }, [payItems]);

  const { mutate: editPayGroup, isPending: isPayGroupUpdating } = useMutation({
    mutationFn: updatePayGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pay-groups", router.query.page]
      });
      setEditModal(false);
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updatePriceItems,
    onSuccess: () => {
      setEditTable(false);
      queryClient.invalidateQueries({
        queryKey: ["pay-groups", router.query.page]
      });
    }
  });

  const { mutate: deleteMutation, isPending: isDeleting } = useMutation({
    mutationFn: deletePayGroup,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["pay-groups", router.query.page]
      })
  });

  const onSubmit = (data: { payGroupName: string }) => {
    editPayGroup({
      id,
      data
    });
  };

  return (
    <StyledPayItem>
      <Stack
        direction="row"
        alignItems="center"
        columnGap={3}
        rowGap={1}
        justifyContent="space-between"
        flexWrap="wrap"
        sx={{ mb: "15px" }}
      >
        <Typography variant="h4">
          {payGroupName}
          <IconButton
            sx={{ marginLeft: "5px", marginBottom: "2px" }}
            onClick={() => setEditModal(true)}
          >
            <Iconify icon="akar-icons:edit" />
          </IconButton>
        </Typography>
        {editTable ? (
          <Button
            variant="contained"
            onClick={() =>
              setPayItemCpy((prev) => [
                {
                  id: otpGenerator.generate(6, {
                    lowerCaseAlphabets: true,
                    digits: false,
                    specialChars: false,
                    upperCaseAlphabets: false
                  }),
                  days: days_array[0].id,
                  daysOfWeek: days_array[0].daysOfWeek,
                  startTimeHours: start_time_array[0],
                  endTimeHours: end_time_array[end_time_array.length - 1],
                  externalId: "",
                  date: [
                    parseInt(moment().add(7, "days").format("YYYY")),
                    parseInt(moment().add(7, "days").format("M")),
                    parseInt(moment().add(7, "days").format("D"))
                  ]
                },
                ...prev
              ])
            }
          >
            New Pay Item
          </Button>
        ) : (
          <Stack direction="row" alignItems="center" gap={1}>
            <Button
              size="small"
              color="error"
              sx={{ textTransform: "uppercase" }}
              onClick={() => deleteMutation(id)}
              disabled={isDeleting}
            >
              Archive
              {isDeleting && (
                <CircularProgress
                  size="10px"
                  color="inherit"
                  sx={{ marginLeft: "5px" }}
                />
              )}
            </Button>
            <Button
              size="small"
              sx={{ textTransform: "uppercase" }}
              onClick={() => setEditTable(true)}
            >
              Edit
            </Button>
          </Stack>
        )}
      </Stack>
      <Scrollbar ref={ref}>
        <TableContainer sx={{ overflow: "unset" }} component={Paper}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell>Day of Week</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Effective Date</TableCell>
                <TableCell>External Id</TableCell>
                {editTable && (
                  <>
                    <TableCell>Copy</TableCell>
                    <TableCell>Delete</TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {payItemCpy.length > 0
                ? payItemCpy.map((_payItem, index: number) => (
                    <PayItemRow
                      {..._payItem}
                      key={_payItem.id}
                      edit={editTable}
                      setPayItem={setPayItemCpy}
                      index={index}
                    />
                  ))
                : !editTable && (
                    <TableCell colSpan={6}>
                      <Typography variant="body2" textAlign="center">
                        No Data
                      </Typography>
                    </TableCell>
                  )}
            </TableBody>
            {editTable && (
              <TableFooter>
                <TableCell colSpan={6}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    gap={2}
                    justifyContent="flex-end"
                  >
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setEditTable(false);
                        setPayItemCpy(payItems);
                      }}
                    >
                      Cancel
                    </Button>
                    <LoadingButton
                      variant="contained"
                      onClick={() =>
                        mutate({
                          id: id,
                          payItems: payItemCpy
                        })
                      }
                      loading={isPending}
                    >
                      Save
                    </LoadingButton>
                  </Stack>
                </TableCell>
              </TableFooter>
            )}
          </Table>
        </TableContainer>
      </Scrollbar>
      <MuiModalWrapper
        title="Edit Pay Group"
        maxWidth="md"
        open={editModal}
        onClose={() => {
          setEditModal(false);
          methods.reset();
        }}
        fullWidth
        fullScreen={false}
        DialogActions={
          <DialogActions>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ paddingTop: "10px" }}
              gap={2}
            >
              <Button
                variant="outlined"
                disabled={isPayGroupUpdating}
                onClick={() => {
                  setEditModal(false);
                  methods.reset();
                }}
              >
                Cancel
              </Button>
              <LoadingButton
                variant="contained"
                onClick={methods.handleSubmit(onSubmit)}
                loading={isPayGroupUpdating}
              >
                Save
              </LoadingButton>
            </Stack>
          </DialogActions>
        }
      >
        <FormProvider {...methods}>
          <CustomInput name="payGroupName" label="Name" />
        </FormProvider>
      </MuiModalWrapper>
    </StyledPayItem>
  );
}
