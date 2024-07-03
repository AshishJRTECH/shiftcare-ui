import { Task } from "@/interface/shift.interface";
import assets from "@/json/assets";
import StyledPaper from "@/ui/Paper/Paper";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  TextField,
  Typography
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import Image from "next/image";
import React from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  useFormContext
} from "react-hook-form";
import * as yup from "yup";
import AddIcon from "@mui/icons-material/Add";

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
    append(data);
    reset();
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
              <TextField
                size="small"
                fullWidth
                placeholder="Task Description"
                {...field}
                error={invalid}
                helperText={error?.message}
              />
            )}
          />
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
            Task
          </Button>
        </Stack>
        {watch("tasks").map((_task: Task, index: number) => (
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
