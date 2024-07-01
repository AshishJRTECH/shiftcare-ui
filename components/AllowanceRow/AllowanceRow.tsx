import { SetStateAction, useState } from "react";

import MenuItem from "@mui/material/MenuItem";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

import { deleteAllowance, updateAllowance } from "@/api/functions/allowances";
import DeleteModal from "@/components/deleteModal/deleteModal";
import { AllowanceBody } from "@/interface/settings.interfaces";
import CustomInput from "@/ui/Inputs/CustomInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Select } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "pages/_app";
import { Controller, FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { LoadingButton } from "@mui/lab";
import validationText from "@/json/messages/validationText";

// ----------------------------------------------------------------------

const schema = yup.object().shape({
  allowancesName: yup.string().required(validationText.error.allowanceName),
  allowancesType: yup.string().required(validationText.error.allowanceType),
  value: yup.number().required(validationText.error.allowanceValue),
  externalId: yup.string()
});

export const allowance_types = [
  {
    name: "Expense",
    id: "Expense"
  },
  {
    name: "Mileage or Travel",
    id: "MileageOrTravel"
  },
  {
    name: "Override payitems",
    id: "OverridePayItems"
  },
  {
    name: "Override hours",
    id: "OverrideHours"
  },
  {
    name: "One-off",
    id: "OneOff"
  },
  {
    name: "Permanent",
    id: "Permanent"
  },
  {
    name: "Sleepover",
    id: "Sleepover"
  }
];

export default function AllowanceRow({
  id,
  allowancesName,
  allowancesType,
  value,
  externalId,
  edit,
  setEditId
}: {
  id: number;
  allowancesName: string;
  allowancesType: string;
  value: number;
  externalId: string;
  edit: boolean;
  setEditId: React.Dispatch<SetStateAction<number | null>>;
}) {
  const [deleteModal, setDeleteModal] = useState(false);
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      allowancesName,
      allowancesType,
      value,
      externalId
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: deleteAllowance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allowances"] });
      setDeleteModal(false);
    }
  });

  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    mutationFn: updateAllowance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allowances"] });
      setEditId(null);
    }
  });

  const onSubmit = (data: AllowanceBody) => {
    updateMutate({ id: id, body: data });
  };

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <FormProvider {...methods}>
          <TableCell>
            {edit ? <CustomInput name="allowancesName" /> : `${allowancesName}`}
          </TableCell>
          <TableCell>
            {edit ? (
              <Controller
                control={methods.control}
                name="allowancesType"
                render={({ field }) => (
                  <Select
                    size="small"
                    {...field}
                    fullWidth
                    name="allowanceType"
                  >
                    {allowance_types.map((_allowance) => (
                      <MenuItem value={_allowance.id} key={_allowance.id}>
                        {_allowance.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            ) : (
              `${allowancesType}`
            )}
          </TableCell>
          <TableCell>
            {edit ? (
              <CustomInput name="value" type="number" />
            ) : (
              `${value || "N/A"}`
            )}
          </TableCell>
          <TableCell>
            {edit ? <CustomInput name="externalId" /> : externalId}
          </TableCell>
          <TableCell align="center">
            {edit ? (
              <>
                <LoadingButton
                  loading={isUpdating}
                  onClick={methods.handleSubmit(onSubmit)}
                >
                  Save
                </LoadingButton>
                <Button color="error" onClick={() => setEditId(null)}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setEditId(id)}>Edit</Button>
                <Button color="error" onClick={() => setDeleteModal(true)}>
                  Delete
                </Button>
              </>
            )}
          </TableCell>
        </FormProvider>
      </TableRow>
      <DeleteModal
        title="Delete Allowance"
        description="Are you sure you want to delete this allowance?"
        agreeBtnText="Yes, Sure"
        declineBtnText="No, Cancel"
        onAgreeBtnType="error"
        onClose={() => setDeleteModal(false)}
        open={deleteModal}
        onAgree={() => mutate(id)}
        isActionLoading={isPending}
        onDecline={() => setDeleteModal(false)}
        key={id}
      />
    </>
  );
}
