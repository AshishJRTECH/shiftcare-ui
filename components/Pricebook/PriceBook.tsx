import { IPriceBook, Price } from "@/interface/settings.interfaces";
import Scrollbar from "@/ui/scrollbar";
import styled from "@emotion/styled";
import {
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
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
import { useEffect, useRef, useState } from "react";
import Iconify from "../Iconify/Iconify";
import PriceBookModal from "../PriceBookModal/PriceBookModal";
import moment from "moment";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useMutation } from "@tanstack/react-query";
import {
  copyPriceBook,
  deletePriceBook,
  editPriceBook,
  updatePrices
} from "@/api/functions/pricebook.api";
import { queryClient } from "pages/_app";
import { LoadingButton } from "@mui/lab";
import otpGenerator from "otp-generation";
import { useRouter } from "next/router";

const StyledPriceBook = styled(Box)`
  margin-bottom: 40px;
`;

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

const PriceRow = ({
  id,
  days,
  startTimeHours,
  daysOfWeek,
  endTimeHours,
  ratePerHour,
  referenceNumberInHours,
  ratePerKM,
  referenceNUmberInKM,
  date,
  fixedPrice,
  referenceNumberFixedPrice,
  edit,
  setPrice,
  index,
  isDelete,
  isFixedPriceOnly
}: Price & {
  edit: boolean;
  setPrice: React.Dispatch<React.SetStateAction<Price[]>>;
  index: number;
  isFixedPriceOnly: boolean | null;
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice((prev) => {
      return prev.map((_prev: Price) => {
        if (_prev.id === id) {
          (_prev as Record<string, any>)[e.target.name as keyof Price] =
            e.target.value;
        }
        return _prev;
      });
    });
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    setPrice((prev) => {
      return prev.map((_prev: Price) => {
        if (_prev.id === id) {
          (_prev as Record<string, any>)[e.target.name as keyof Price] =
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
                setPrice((prev) => {
                  return prev.map((_prev: Price) => {
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
        {isFixedPriceOnly ? (
          <>
            <TableCell>
              {edit ? (
                <TextField
                  type="number"
                  value={fixedPrice}
                  name="fixedPrice"
                  onChange={handleInputChange}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                />
              ) : (
                `$${fixedPrice}`
              )}
            </TableCell>
            <TableCell>
              {edit ? (
                <TextField
                  type="text"
                  value={referenceNumberFixedPrice}
                  name="referenceNumberFixedPrice"
                  onChange={handleInputChange}
                  size="small"
                />
              ) : (
                referenceNumberFixedPrice
              )}
            </TableCell>
          </>
        ) : (
          <>
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
                <TextField
                  type="number"
                  value={ratePerHour}
                  name="ratePerHour"
                  onChange={handleInputChange}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                />
              ) : (
                `$${ratePerHour}`
              )}
            </TableCell>
            <TableCell>
              {edit ? (
                <TextField
                  type="text"
                  value={referenceNumberInHours}
                  name="referenceNumberInHours"
                  onChange={handleInputChange}
                  size="small"
                />
              ) : (
                referenceNumberInHours
              )}
            </TableCell>
          </>
        )}
        <TableCell>
          {edit ? (
            <TextField
              type="number"
              value={ratePerKM}
              name="ratePerKM"
              onChange={handleInputChange}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                )
              }}
            />
          ) : (
            `$${ratePerKM}`
          )}
        </TableCell>
        <TableCell>
          {edit ? (
            <TextField
              type="text"
              value={referenceNUmberInKM}
              name="referenceNUmberInKM"
              onChange={handleInputChange}
              size="small"
            />
          ) : (
            referenceNUmberInKM
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
                setPrice((prev) => {
                  return prev.map((_prev: Price) => {
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
        {edit && (
          <>
            <TableCell>
              <IconButton
                onClick={() =>
                  setPrice((prev) => {
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
                      ratePerHour,
                      referenceNumberInHours,
                      ratePerKM,
                      referenceNUmberInKM,
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
                  setPrice((prev) => {
                    return prev.map((_prev: Price) => {
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

export default function PriceBook({
  id,
  price,
  priceBookName,
  isFixedPriceOnly,
  ...props
}: IPriceBook) {
  const [editModal, setEditModal] = useState(false);
  const [editTable, seteditTable] = useState(false);
  const [price_cpy, setPrice_cpy] = useState(price);

  const router = useRouter();

  useEffect(() => {
    setPrice_cpy(price);
  }, [price]);

  const ref = useRef(null);

  const { mutate, isPending } = useMutation({
    mutationFn: updatePrices,
    onSuccess: () => {
      seteditTable(false);
      queryClient.invalidateQueries({
        queryKey: ["price-books", router.query.page]
      });
    }
  });

  const { mutate: deleteMutation, isPending: isDeleting } = useMutation({
    mutationFn: deletePriceBook,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["price-books", router.query.page]
      })
  });

  const { mutate: copyMutation, isPending: isCopying } = useMutation({
    mutationFn: copyPriceBook,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["price-books", router.query.page]
      })
  });

  return (
    <StyledPriceBook>
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
          {priceBookName}
          {isFixedPriceOnly && (
            <Chip
              label="Fixed Price"
              size="small"
              sx={{ marginLeft: "10px" }}
            />
          )}
          {props.isProviderTravel && (
            <Chip
              label="Provider Travel"
              size="small"
              sx={{ marginLeft: "10px" }}
            />
          )}
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
              setPrice_cpy((prev) => [
                ...prev,
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
                  fixedPrice: 0,
                  referenceNumberFixedPrice: null,
                  ratePerHour: 0,
                  referenceNumberInHours: null,
                  ratePerKM: 0,
                  referenceNUmberInKM: null,
                  date: [
                    parseInt(moment().add(7, "days").format("YYYY")),
                    parseInt(moment().add(7, "days").format("M")),
                    parseInt(moment().add(7, "days").format("D"))
                  ]
                }
              ])
            }
          >
            New Price
          </Button>
        ) : (
          <Stack direction="row" alignItems="center" gap={1}>
            <Button
              size="small"
              sx={{ textTransform: "uppercase" }}
              onClick={() => copyMutation(id)}
              disabled={isCopying}
            >
              Copy
              {isCopying && (
                <CircularProgress
                  size="10px"
                  color="inherit"
                  sx={{ marginLeft: "5px" }}
                />
              )}
            </Button>
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
              onClick={() => seteditTable(true)}
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
                {isFixedPriceOnly ? (
                  <>
                    <TableCell>Fixed Price</TableCell>
                    <TableCell>Reference Number (Fixed Price)</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>Time</TableCell>
                    <TableCell>Per Hour</TableCell>
                    <TableCell>Reference Number (Hour)</TableCell>
                  </>
                )}
                <TableCell>Per Km</TableCell>
                <TableCell>Reference Number</TableCell>
                <TableCell>Effective Date</TableCell>
                {editTable && (
                  <>
                    <TableCell>Copy</TableCell>
                    <TableCell>Delete</TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {price_cpy.map((_price, index: number) => (
                <PriceRow
                  {..._price}
                  key={_price.id}
                  isFixedPriceOnly={isFixedPriceOnly}
                  edit={editTable}
                  setPrice={setPrice_cpy}
                  index={index}
                />
              ))}
            </TableBody>
            {editTable && (
              <TableFooter>
                <TableCell colSpan={9}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    gap={2}
                    justifyContent="flex-end"
                  >
                    <Button
                      variant="outlined"
                      onClick={() => {
                        seteditTable(false);
                        setPrice_cpy(price);
                      }}
                    >
                      Cancel
                    </Button>
                    <LoadingButton
                      variant="contained"
                      onClick={() =>
                        mutate({
                          id: id,
                          prices: price_cpy
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
      <PriceBookModal
        title="Edit Price Book"
        open={editModal}
        onClose={() => setEditModal(false)}
        id={id}
        price={price}
        onSubmit={editPriceBook}
        priceBookName={priceBookName}
        isFixedPriceOnly={isFixedPriceOnly}
        {...props}
      />
    </StyledPriceBook>
  );
}
