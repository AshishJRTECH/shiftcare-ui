import assets from "@/json/assets";
import StyledPaper from "@/ui/Paper/Paper";
import {
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  Typography
} from "@mui/material";
import { Stack } from "@mui/system";
import Image from "next/image";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  CustomStepperInput,
  daysOfWeek,
  repeatPeriods,
  shiftTypeArray
} from "./add-shift";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import CustomInput from "@/ui/Inputs/CustomInput";
import Iconify from "../Iconify/Iconify";
import { Shift } from "@/interface/shift.interface";
import moment from "moment";

export default function TimeLocation({
  view,
  edit,
  shift
}: {
  view?: boolean;
  edit?: boolean;
  shift?: Shift;
}) {
  const { control, watch, setValue } = useFormContext();

  return (
    <StyledPaper>
      <Stack direction="row" alignItems="center" gap={2}>
        <Image
          src={assets.calendar}
          alt="Calendar"
          width={512}
          height={512}
          style={{ width: 25, height: 25 }}
          className="icon"
        />
        <Typography variant="h6">Time & Location</Typography>
      </Stack>
      <Divider sx={{ marginBlock: "10px" }} />
      {view ? (
        <Grid container rowSpacing={2} alignItems="center">
          <Grid item lg={8} md={6} sm={12} xs={12}>
            <Typography>Time</Typography>
          </Grid>
          <Grid item lg={4} md={6} sm={12} xs={12}>
            <Typography variant="body1" textAlign="right">
              <strong>
                {moment(
                  `${shift?.startTime[0]}:${shift?.startTime[1]}`,
                  "HH:mm"
                ).format("hh:mm a")}{" "}
                to{" "}
                {moment(
                  `${shift?.endTime[0]}:${shift?.endTime[1]}`,
                  "HH:mm"
                ).format("hh:mm a")}
              </strong>
            </Typography>
          </Grid>
          <Grid item lg={8} md={6} sm={12} xs={12}>
            <Typography>Date</Typography>
          </Grid>
          <Grid item lg={4} md={6} sm={12} xs={12}>
            <Typography variant="body1" textAlign="right">
              {moment(shift?.startDate).format("ddd, DD MMMM YYYY")}
            </Typography>
          </Grid>
          {shift?.isRepeated && (
            <>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Typography variant="body1" textAlign="right">
                  Repeats every 1 days until 05 Jun 2024{" "}
                  <Chip
                    label={`${shift.occurrenceCounter || 0} occurence(s)`}
                    variant="filled"
                    size="small"
                  />
                </Typography>
              </Grid>
            </>
          )}
          <Grid item lg={5} md={6} sm={12} xs={12}>
            Address
          </Grid>
          <Grid item lg={7} md={6} sm={12} xs={12}>
            <Typography variant="body1" textAlign="right">
              {shift?.address}
            </Typography>
          </Grid>
        </Grid>
      ) : (
        <Grid container rowSpacing={2} columnSpacing={1} alignItems="center">
          <Grid item lg={4} md={6} sm={12} xs={12}>
            <Typography>Shift Type</Typography>
          </Grid>
          <Grid item lg={8} md={6} sm={12} xs={12}>
            <Controller
              name="shiftType"
              control={control}
              render={({ field }) => (
                <Select fullWidth size="small" {...field}>
                  {shiftTypeArray.map((_shift) => (
                    <MenuItem value={_shift.id} key={_shift.id}>
                      {_shift.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </Grid>
          <Grid item lg={4} md={6} sm={12} xs={12}>
            Date
          </Grid>
          <Grid item lg={8} md={6} sm={12} xs={12}>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true
                    }
                  }}
                  minDate={dayjs()}
                  format="DD/MM/YYYY"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setValue("occursOnDays", [e.format("dddd").toUpperCase()]);
                  }}
                />
              )}
            />
          </Grid>
          {!edit && (
            <Grid
              item
              lg={12}
              md={12}
              sm={12}
              xs={12}
              display="flex"
              justifyContent="flex-end"
            >
              <Controller
                control={control}
                name="isShiftEndsNextDay"
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox size="small" />}
                    label="Shift finishes the next day"
                    checked={field.value}
                    {...field}
                  />
                )}
              />
            </Grid>
          )}
          <Grid item lg={4} md={6} sm={12} xs={12}>
            Time
          </Grid>
          <Grid item lg={8} md={6} sm={12} xs={12}>
            <Stack direction="row" alignItems="center" gap={1}>
              <Controller
                name="startTime"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    slotProps={{
                      textField: {
                        size: "small"
                      }
                    }}
                    views={["hours", "minutes"]}
                    minutesStep={15}
                    skipDisabled
                    {...field}
                  />
                )}
              />
              -
              <Controller
                name="endTime"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    slotProps={{
                      textField: {
                        size: "small"
                      }
                    }}
                    views={["hours", "minutes"]}
                    minutesStep={15}
                    skipDisabled
                    {...field}
                  />
                )}
              />
            </Stack>
            {watch("isShiftEndsNextDay") && (
              <Typography variant="body2" marginTop={2}>
                This shift is{" "}
                {dayjs(watch("endTime").add(1, "day")).diff(
                  watch("startTime"),
                  "hours"
                )}{" "}
                hours, finishing next day,{" "}
                {watch("startDate").add(1, "day").format("DD/MM/YYYY")}
              </Typography>
            )}
          </Grid>
          {!edit && (
            <>
              <Grid item lg={4} md={6} sm={12} xs={12}>
                Break time in minutes
              </Grid>
              <Grid item lg={8} md={6} sm={12} xs={12}>
                <Controller
                  name="breakTimeInMins"
                  control={control}
                  render={({ field }) => <CustomStepperInput {...field} />}
                />
              </Grid>
              <Grid
                item
                lg={12}
                md={12}
                sm={12}
                xs={12}
                display="flex"
                justifyContent="flex-end"
              >
                <Controller
                  name="isRepeated"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Repeat"
                      checked={field.value}
                      {...field}
                    />
                  )}
                />
              </Grid>
              {watch("isRepeated") && (
                <>
                  <Grid item lg={4} md={6} sm={12} xs={12}>
                    <Typography>Recurrance</Typography>
                  </Grid>
                  <Grid item lg={8} md={6} sm={12} xs={12}>
                    <Controller
                      control={control}
                      name="recurrance"
                      render={({ field }) => (
                        <Select
                          fullWidth
                          size="small"
                          defaultValue="Weekly"
                          {...field}
                        >
                          <MenuItem value="Daily">Daily</MenuItem>
                          <MenuItem value="Weekly">Weekly</MenuItem>
                          <MenuItem value="Monthly">Monthly</MenuItem>
                        </Select>
                      )}
                    />
                  </Grid>
                  <Grid item lg={4} md={6} sm={12} xs={12}>
                    <Typography>Repeat Every</Typography>
                  </Grid>
                  <Grid
                    item
                    lg={8}
                    md={6}
                    sm={12}
                    xs={12}
                    display="flex"
                    alignItems="center"
                  >
                    <Controller
                      control={control}
                      name={
                        watch("recurrance") === "Daily"
                          ? "repeatNoOfDays"
                          : watch("recurrance") === "Weekly"
                          ? "repeatNoOfWeeks"
                          : "repeatNoOfMonths"
                      }
                      render={({ field }) => (
                        <Select
                          fullWidth
                          size="small"
                          defaultValue="Weekly"
                          {...field}
                        >
                          {repeatPeriods[
                            watch("recurrance") as keyof typeof repeatPeriods
                          ].repeats.map((_value: number) => (
                            <MenuItem value={_value} key={_value}>
                              {_value}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    <Typography paddingLeft={2}>
                      {
                        repeatPeriods[
                          watch("recurrance") as keyof typeof repeatPeriods
                        ].name
                      }
                    </Typography>
                  </Grid>
                  {repeatPeriods[
                    watch("recurrance") as keyof typeof repeatPeriods
                  ].display !== "" && (
                    <>
                      <Grid item lg={4} md={6} sm={12} xs={12}>
                        <Typography>Occurs on</Typography>
                      </Grid>
                      <Grid
                        item
                        lg={8}
                        md={6}
                        sm={12}
                        xs={12}
                        display="flex"
                        alignItems="center"
                      >
                        {repeatPeriods[
                          watch("recurrance") as keyof typeof repeatPeriods
                        ].display === "days" ? (
                          <Stack
                            direction="row"
                            alignItems="center"
                            flexWrap="wrap"
                            gap={1}
                          >
                            {daysOfWeek.map((_day) => {
                              return (
                                <FormControlLabel
                                  key={_day.id}
                                  control={<Checkbox />}
                                  checked={watch("occursOnDays").includes(
                                    _day.id
                                  )}
                                  onChange={() =>
                                    setValue(
                                      "occursOnDays",
                                      watch("occursOnDays").includes(_day.id)
                                        ? watch("occursOnDays").filter(
                                            (_item: string) => _item !== _day.id
                                          )
                                        : [...watch("occursOnDays"), _day.id]
                                    )
                                  }
                                  label={_day.name}
                                />
                              );
                            })}
                          </Stack>
                        ) : (
                          <>
                            <Typography paddingRight={1}>Day</Typography>
                            <Controller
                              name="occursOnDayOfMonth"
                              control={control}
                              render={({ field }) => (
                                <Select fullWidth size="small" {...field}>
                                  <MenuItem value={1}>1</MenuItem>
                                  <MenuItem value={2}>2</MenuItem>
                                  <MenuItem value={3}>3</MenuItem>
                                  <MenuItem value={4}>4</MenuItem>
                                  <MenuItem value={5}>5</MenuItem>
                                  <MenuItem value={6}>6</MenuItem>
                                  <MenuItem value={7}>7</MenuItem>
                                  <MenuItem value={8}>8</MenuItem>
                                  <MenuItem value={9}>9</MenuItem>
                                  <MenuItem value={10}>10</MenuItem>
                                  <MenuItem value={11}>11</MenuItem>
                                  <MenuItem value={12}>12</MenuItem>
                                  <MenuItem value={13}>13</MenuItem>
                                  <MenuItem value={14}>14</MenuItem>
                                  <MenuItem value={15}>15</MenuItem>
                                  <MenuItem value={16}>16</MenuItem>
                                  <MenuItem value={17}>17</MenuItem>
                                  <MenuItem value={18}>18</MenuItem>
                                  <MenuItem value={19}>19</MenuItem>
                                  <MenuItem value={20}>20</MenuItem>
                                  <MenuItem value={21}>21</MenuItem>
                                  <MenuItem value={22}>22</MenuItem>
                                  <MenuItem value={23}>23</MenuItem>
                                  <MenuItem value={24}>24</MenuItem>
                                  <MenuItem value={25}>25</MenuItem>
                                  <MenuItem value={26}>26</MenuItem>
                                  <MenuItem value={27}>27</MenuItem>
                                  <MenuItem value={28}>28</MenuItem>
                                  <MenuItem value={29}>29</MenuItem>
                                  <MenuItem value={30}>30</MenuItem>
                                  <MenuItem value={31}>31</MenuItem>
                                </Select>
                              )}
                            />
                            <Typography paddingLeft={2} whiteSpace="nowrap">
                              of the Month
                            </Typography>
                          </>
                        )}
                      </Grid>
                    </>
                  )}
                  <Grid item lg={4} md={6} sm={12} xs={12}>
                    End Date
                  </Grid>
                  <Grid item lg={8} md={6} sm={12} xs={12}>
                    <Controller
                      name="endDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          slotProps={{
                            textField: {
                              size: "small",
                              fullWidth: true
                            }
                          }}
                          minDate={dayjs(watch("startDate"))}
                          format="DD/MM/YYYY"
                          {...field}
                        />
                      )}
                    />
                  </Grid>
                </>
              )}
            </>
          )}
          <Grid item lg={4} md={6} sm={12} xs={12}>
            Address
          </Grid>
          <Grid item lg={8} md={6} sm={12} xs={12}>
            <CustomInput name="address" placeholder="Enter Address here" />
          </Grid>
          <Grid item lg={4} md={6} sm={12} xs={12}>
            Unit/Apartment Number
          </Grid>
          <Grid item lg={8} md={6} sm={12} xs={12}>
            <CustomInput
              name="apartmentNumber"
              placeholder="Enter Unit/Apartment Number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="bxs:building" color="#c0c4cc" />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          {!edit && (
            <>
              <Grid
                item
                lg={12}
                md={12}
                sm={12}
                xs={12}
                display="flex"
                justifyContent="flex-end"
              >
                <Controller
                  name="isDropOffAddress"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      checked={field.value}
                      {...field}
                      label="Drop off address"
                    />
                  )}
                />
              </Grid>
              {watch("isDropOffAddress") && (
                <>
                  <Grid item lg={4} md={6} sm={12} xs={12}>
                    Drop off address
                  </Grid>
                  <Grid item lg={8} md={6} sm={12} xs={12}>
                    <CustomInput
                      name="dropOffAddress"
                      placeholder="Enter Address here"
                    />
                  </Grid>
                  <Grid item lg={4} md={6} sm={12} xs={12}>
                    Drop off Unit/Aparment number
                  </Grid>
                  <Grid item lg={8} md={6} sm={12} xs={12}>
                    <CustomInput
                      name="dropOffApartmentNumber"
                      placeholder="Enter Unit/Apartment Number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Iconify icon="bxs:building" color="#c0c4cc" />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                </>
              )}
            </>
          )}
        </Grid>
      )}
    </StyledPaper>
  );
}
