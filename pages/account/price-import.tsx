import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Box, Button, Container, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { priceImport } from "@/api/functions/client.api";

export default function PriceImport({
  closemodal
}: {
  closemodal: () => void;
}) {
  const { id } = useParams();
  const { register, handleSubmit, setValue, reset } = useForm();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type === "text/csv") {
        setSelectedFile(file);
        setValue("file", file); // Set file in form state
      } else {
        alert("Please upload a valid CSV file.");
      }
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    reset(); // Reset form state
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => priceImport({ file: formData }),
    onSuccess: () => {
      alert("File uploaded successfully.");
      closemodal();
      handleCancel();
    },
    onError: (error) => {
      alert("File upload failed. Please try again.");
      console.error(error);
    }
  });

  const onSubmit = async (data: any) => {
    if (!data.file) {
      alert("Please select a file before submitting.");
      return;
    }
    const formData = new FormData();
    formData.append("file", data.file); // Append the actual file
    console.log("Uploading file:", data.file.name);

    mutate(formData);
  };

  return (
    <Container>
      <Typography variant="body1" gutterBottom>
        This is the Price Import page. Upload a CSV file below.
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="file"
          accept=".csv"
          {...register("file")}
          style={{ display: "none" }}
          id="file-upload"
          onChange={onFileChange}
        />
        <label htmlFor="file-upload">
          <Button variant="contained" component="span">
            Choose File
          </Button>
        </label>

        {selectedFile && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Selected File: {selectedFile.name}
          </Typography>
        )}

        {/* Buttons aligned to bottom-right */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button
            onClick={() => {
              closemodal();
              handleCancel();
            }}
            variant="outlined"
            sx={{ mr: 2 }}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isPending}
          >
            {isPending ? "Uploading..." : "Upload"}
          </Button>
        </Box>
      </form>
    </Container>
  );
}
