import { IPriceBook } from "@/interface/settings.interfaces";
import validationText from "@/json/messages/validationText";
import CustomInput from "@/ui/Inputs/CustomInput";
import MuiModalWrapper from "@/ui/Modal/MuiModalWrapper";
import styled from "@emotion/styled";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Checkbox,
  DialogActions,
  DialogProps,
  FormControlLabel
} from "@mui/material";
import { Box } from "@mui/system";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { queryClient } from "pages/_app";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";

const StyledPriceBookModal = styled(Box)``;

interface ModalInterface extends Omit<DialogProps, "id">, Partial<IPriceBook> {
  title: string;
  onClose: () => void;
  onSubmit: (body: any) => any;
}

const schema = yup.object().shape({
  priceBookName: yup
    .string()
    .trim()
    .required(validationText.error.pricebook_name),
  externalId: yup.string().nullable(),
  isProviderTravel: yup.boolean().nullable(),
  isFixedPriceOnly: yup.boolean().nullable(),
  isExpired: yup.boolean().nullable()
});

export default function PriceBookModal({
  title,
  priceBookName = "",
  externalId = "",
  isFixedPriceOnly = false,
  isProviderTravel = false,
  isExpired = false,
  onSubmit,
  ...props
}: ModalInterface) {
  const router = useRouter();

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      priceBookName,
      externalId,
      isFixedPriceOnly,
      isProviderTravel,
      isExpired
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: onSubmit,
    onSuccess: () => {
      props.onClose();
      queryClient.invalidateQueries({
        queryKey: ["price-books", router.query.page]
      });
    }
  });

  const Submit = (data: Omit<IPriceBook, "price" | "id">) => {
    mutate({
      id: props.id,
      data
    });
  };

  return (
    <MuiModalWrapper
      title={title}
      {...props}
      id={props.id?.toString()}
      fullWidth
      DialogActions={
        <DialogActions>
          <Button variant="outlined" onClick={props.onClose}>
            Cancel
          </Button>
          <LoadingButton
            loading={isPending}
            variant="contained"
            onClick={methods.handleSubmit(Submit)}
          >
            {title.toLowerCase().includes("edit") ? "Save" : "Create"}
          </LoadingButton>
        </DialogActions>
      }
    >
      <FormProvider {...methods}>
        <CustomInput
          name="priceBookName"
          fullWidth
          label="Name"
          size="small"
          placeholder="Lets give your price book a name"
          sx={{ mb: "20px" }}
        />
        <CustomInput
          name="externalId"
          fullWidth
          label="External ID"
          size="small"
          placeholder="External ID"
          sx={{ mb: "20px" }}
        />
        <Box>
          <Controller
            name="isFixedPriceOnly"
            control={methods.control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox size="small" />}
                label="Fixed Price Only"
                {...field}
                checked={field.value}
              />
            )}
          />
        </Box>
        <Box>
          <Controller
            name="isProviderTravel"
            control={methods.control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox size="small" />}
                label="Provider Travel"
                {...field}
                checked={field.value}
              />
            )}
          />
        </Box>
      </FormProvider>
    </MuiModalWrapper>
  );
}
