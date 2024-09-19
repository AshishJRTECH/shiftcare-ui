import assets from "@/json/assets";
import StyledPaper from "@/ui/Paper/Paper";
import { Divider, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import Image from "next/image";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import RichTextEditor from "../RichTextEditor/RichTextEditor";
import { Shift } from "@/interface/shift.interface";

export default function InstructionSection({
  view,
  edit,
  shift
}: {
  view?: boolean;
  edit?: boolean;
  shift?: Shift;
}) {
  const { control } = useFormContext();

  return (
    <StyledPaper>
      <Stack direction="row" alignItems="center" gap={2}>
        <Image
          src={assets.notes}
          alt="notes"
          width={512}
          height={512}
          className="icon"
        />
        <Typography variant="h6">Instructions</Typography>
      </Stack>
      <Divider sx={{ marginBlock: "10px" }} />
      {view ? (
        <Box dangerouslySetInnerHTML={{ __html: shift?.instruction || "" }} />
      ) : (
        <Controller
          name="instruction"
          control={control}
          render={({ field }) => (
            <RichTextEditor value={field.value} onChange={field.onChange} />
          )}
        />
      )}
    </StyledPaper>
  );
}
