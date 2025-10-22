import { Task } from "@/interface/shift.interface";
import assets from "@/json/assets";
import StyledPaper from "@/ui/Paper/Paper";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import Image from "next/image";
import React, { useState } from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  useFormContext
} from "react-hook-form";
import * as yup from "yup";
import AddIcon from "@mui/icons-material/Add";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { toast } from "sonner";

export default function TaskSection({
  view,
  edit
}: {
  view?: boolean;
  edit?: boolean;
}) {
  const { control, watch } = useFormContext();
  const { append, remove } = useFieldArray({
    name: "tasks",
    control: control
  });

  const shortSchema = yup.object().shape({
    task: yup.string().required("Please enter a task"),
    isTaskMandatory: yup.boolean()
  });

  const {
    control: shortControl,
    handleSubmit,
    reset
  } = useForm({
    resolver: yupResolver(shortSchema),
    defaultValues: {
      task: "",
      isTaskMandatory: false
    }
  });

  const onSubmit = (data: Task) => {
    const existingTasks = watch("tasks") || [];
    const isDuplicate = existingTasks.some(
      (t: Task) =>
        t.task.trim().toLowerCase() === data.task.trim().toLowerCase()
    );

    if (isDuplicate) {
      toast.error("This task has already been added!");
      return;
    }

    append(data);
    reset();
  };

  const [inputMode, setInputMode] = useState<"select" | "input">("select");

  const toggleInputMode = () => {
    setInputMode((prevMode) => (prevMode === "select" ? "input" : "select"));
  };

  return (
    <StyledPaper>
      <Stack direction="row" alignItems="center" gap={2}>
        <Image
          src={assets.task}
          alt="tasks"
          width={512}
          height={512}
          className="icon"
        />
        <Typography variant="h6">Tasks</Typography>
      </Stack>
      <Divider sx={{ marginBlock: "10px" }} />
      <Box>
        <Stack
          direction="row"
          alignItems="flex-start"
          gap={2}
          justifyContent="space-between"
          marginBottom={2}
        >
          <Controller
            name="task"
            control={shortControl}
            render={({ field, fieldState: { invalid, error } }) => (
              <FormControl size="small" error={invalid}>
                {inputMode === "select" ? (
                  <Select {...field} displayEmpty>
                    <MenuItem value="" disabled>
                      Select Task
                    </MenuItem>
                    <MenuItem value="In-home supports/assistance with daily living">
                      In-home supports/assistance with daily living
                    </MenuItem>
                    <MenuItem value="In-home supports/assistance with daily living (High Intensity)">
                      In-home supports/assistance with daily living (High
                      Intensity)
                    </MenuItem>
                    <MenuItem value="Community access">
                      Community access
                    </MenuItem>
                    <MenuItem value="Community access using wheelchair accessible transport">
                      Community access using wheelchair accessible transport
                    </MenuItem>
                    <MenuItem value="Community Nursing">
                      Community Nursing
                    </MenuItem>
                    <MenuItem value="Skill Development">
                      Skill Development
                    </MenuItem>
                    <MenuItem value="Assistance with daily living in Supported living home">
                      Assistance with daily living in Supported living home
                    </MenuItem>
                    <MenuItem value="Assistance with daily living in Supported living home (High Intensity)">
                      Assistance with daily living in Supported living home
                      (High Intensity)
                    </MenuItem>
                    <MenuItem value="Cleaning">Cleaning</MenuItem>
                    <MenuItem value="Cooking">Cooking</MenuItem>
                    <MenuItem value="Yard Maintenance">
                      Yard Maintenance
                    </MenuItem>
                    {/* Add more dummy values as needed */}
                  </Select>
                ) : (
                  <TextField {...field} placeholder="Enter Task" size="small" />
                )}
                {error && <FormHelperText>{error.message}</FormHelperText>}
              </FormControl>
            )}
          />
          {/* <IconButton onClick={toggleInputMode} size="small">
            <SwapHorizIcon />
          </IconButton> */}
          <Stack direction="row" alignItems="center" gap={1}>
            <IconButton onClick={toggleInputMode} size="small">
              <SwapHorizIcon />
            </IconButton>
            <Typography variant="body2">
              {inputMode === "select" ? "Select Input Box" : "Select List Box"}
            </Typography>
          </Stack>

          <Controller
            name="isTaskMandatory"
            control={shortControl}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox size="small" />}
                label="Mandatory"
                {...field}
                checked={field.value}
              />
            )}
          />

          <Button
            startIcon={<AddIcon fontSize="small" />}
            variant="contained"
            size="small"
            sx={{ minWidth: "auto", marginTop: "5px" }}
            onClick={handleSubmit(onSubmit)}
          >
            Add Task
          </Button>
        </Stack>
        {/* {watch("tasks").map((_task: Task, index: number) => (
          <Stack
            key={index}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap={2}
            padding={1}
            paddingRight={5}
            marginBottom={2}
            position="relative"
            sx={{ backgroundColor: "#f5f5f5", borderRadius: 2 }}
          >
            <Typography>{_task.task}</Typography>
            <Typography>
              <strong>Mandatory: </strong>
              {_task.isTaskMandatory ? "Yes" : "No"}
            </Typography>
            <button
              style={{
                borderRadius: "50%",
                backgroundColor: "#fff",
                color: "#fff",
                border: "2px solid #fff",
                position: "absolute",
                top: -10,
                right: -10,
                boxShadow: "0 1px 2px 0 rgba(0,0,0,.3)",
                cursor: "pointer"
              }}
              onClick={() => remove(index)}
            >
              <Image
                src={assets.delete}
                alt="delete"
                width={512}
                height={512}
                style={{ width: 25, height: 25 }}
              />
            </button>
          </Stack>
        ))} */}

        {watch("tasks") &&
          Array.isArray(watch("tasks")) &&
          watch("tasks").map((_task: Task, index: number) => (
            <Stack
              key={index}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              gap={2}
              padding={1}
              paddingRight={5}
              marginBottom={2}
              position="relative"
              sx={{ backgroundColor: "#f5f5f5", borderRadius: 2 }}
            >
              <Typography>{_task.task}</Typography>
              <Typography>
                <strong>Mandatory: </strong>
                {_task.isTaskMandatory ? "Yes" : "No"}
              </Typography>
              <button
                style={{
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  color: "#fff",
                  border: "2px solid #fff",
                  position: "absolute",
                  top: -10,
                  right: -10,
                  boxShadow: "0 1px 2px 0 rgba(0,0,0,.3)",
                  cursor: "pointer"
                }}
                onClick={() => remove(index)}
              >
                <Image
                  src={assets.delete}
                  alt="delete"
                  width={512}
                  height={512}
                  style={{ width: 25, height: 25 }}
                />
              </button>
            </Stack>
          ))}
      </Box>
    </StyledPaper>
  );
}
