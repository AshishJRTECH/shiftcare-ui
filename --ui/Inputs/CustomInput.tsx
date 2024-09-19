import { InputLabel, TextField, TextFieldProps } from "@mui/material";
import { Box } from "@mui/system";
import { Controller, useFormContext } from "react-hook-form";

type CustomInputProps = {
  name: string;
} & TextFieldProps;

function CustomInput({ size = "small", ...props }: CustomInputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={props.name}
      render={({ field, fieldState: { invalid, error } }) => (
        <Box>
          {Boolean(props.label) && (
            <InputLabel
              sx={{
                fontSize: "14px",
                marginBottom: "5px"
              }}
            >
              {props.label}
            </InputLabel>
          )}
          <TextField
            {...field}
            {...props}
            size={size}
            label=""
            fullWidth
            error={invalid}
            helperText={error?.message}
          />
        </Box>
      )}
    />
  );
}

export default CustomInput;
