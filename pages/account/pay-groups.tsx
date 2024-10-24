import { addPayGroup, getAllPayGroups } from "@/api/functions/paygroup.api";
import PayItem from "@/components/PayItem/PayItem";
import { PayGroup } from "@/interface/settings.interfaces";
import validationText from "@/json/messages/validationText";
import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import CustomInput from "@/ui/Inputs/CustomInput";
import MuiModalWrapper from "@/ui/Modal/MuiModalWrapper";
import styled from "@emotion/styled";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Button, DialogActions, Pagination, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { queryClient } from "pages/_app";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";

const StyledPage = styled(Box)`
  padding: 20px 10px;
`;

const schema = yup.object().shape({
  payGroupName: yup.string().required(validationText.error.name)
});

export default function PayGroups() {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["pay-groups", router.query.page],
    queryFn: () => getAllPayGroups((router.query.page as string) || "1")
  });

  // useEffect(() => {
  //   console.log("-----------: Pay Group List :-------------", data);
  // }, [data]);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      payGroupName: ""
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: addPayGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pay-groups", router.query.page]
      });
      setOpen(false);
    }
  });

  useEffect(() => {
    if (data && !router.query.page) {
      router.push({ query: { page: data?.currentPage } }, undefined, {
        shallow: true
      });
    } else if (router.query.page && data?.payGroups.length == 0) {
      router.push(
        {
          query: {
            page: data?.currentPage - 1 === 0 ? 1 : data?.currentPage - 1
          }
        },
        undefined,
        {
          shallow: true
        }
      );
    }
  }, [data, router.query.page]);

  const onSubmit = (data: { payGroupName: string }) => {
    mutate(data);
  };

  return (
    <DashboardLayout isLoading={isLoading}>
      <StyledPage>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={3}
          sx={{ marginBottom: "40px" }}
        >
          <Typography variant="h4">
            Pay Groups{" "}
            <Typography
              variant="caption"
              sx={{ fontSize: "15px", marginLeft: "10px" }}
            >
              Pay Items
            </Typography>
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            size="medium"
          >
            Add New
          </Button>
        </Stack>

        <Box>
          {data?.payGroups.map((payGroup: PayGroup) => (
            <PayItem {...payGroup} key={payGroup.id} />
          ))}
        </Box>
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ marginTop: "10px" }}
        >
          <Pagination
            count={data?.totalPages}
            // variant="outlined"
            page={
              router.query.page ? parseInt(router.query.page!.toString()) : 1
            }
            onChange={(e: React.ChangeEvent<unknown>, value: number) => {
              router.push(
                {
                  query: {
                    page: value
                  }
                },
                undefined,
                { shallow: true }
              );
            }}
          />
        </Stack>
      </StyledPage>

      <MuiModalWrapper
        title="Edit Pay Group"
        maxWidth="md"
        open={open}
        onClose={() => {
          setOpen(false);
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
                disabled={isPending}
                onClick={() => {
                  setOpen(false);
                  methods.reset();
                }}
              >
                Cancel
              </Button>
              <LoadingButton
                variant="contained"
                onClick={methods.handleSubmit(onSubmit)}
                loading={isPending}
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
    </DashboardLayout>
  );
}
