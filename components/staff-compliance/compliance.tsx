import {
  complianceData,
  staffAllDocuments
} from "@/interface/common.interface";
import StyledPaper from "@/ui/Paper/Paper";
import Scrollbar from "@/ui/scrollbar";
import styled from "@emotion/styled";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import { Stack } from "@mui/system";
import { useMutation, useQueries } from "@tanstack/react-query";
import moment from "moment";
import React, { useRef, useState } from "react";
import {
  addCompliance,
  deleteDocument,
  getCategory,
  getSub_Category,
  updateCompliance
} from "@/api/functions/staff.api";
import { queryClient } from "pages/_app";
import { useParams } from "next/navigation";
import { LoadingButton } from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/CloudDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Controller } from "react-hook-form";

const StyledBox = styled(Box)`
  td,
  th {
    text-align: center;
  }
`;

function ComplianceTableRow({
  fileName,
  fileType,
  fileSize,
  lastUpdated,
  downloadURL,
  expiryDate,
  expiry,
  status,
  employee,
  documentSubCategory,
  client,
  clientDocumentCategory
}: complianceData) {
  const getStatus = (): {
    status: string;
    color:
      | "error"
      | "success"
      | "warning"
      | "default"
      | "primary"
      | "secondary"
      | "info";
  } => {
    if (expiry) {
      return {
        status: "Expired",
        color: "error"
      };
    }
    if (status && !expiry) {
      return {
        status: "Active",
        color: "success"
      };
    }
    return {
      status: "Not Specified",
      color: "warning"
    };
  };

  return (
    <TableRow>
      <TableCell>{documentSubCategory}</TableCell>
      <TableCell>
        {expiryDate ? moment(expiryDate).format("LL") : "-"}
      </TableCell>
      <TableCell>
        {lastUpdated ? moment(lastUpdated).format("LL") : "-"}
      </TableCell>
      <TableCell>
        <Chip
          label={getStatus().status}
          color={getStatus().color}
          variant="outlined"
        />
      </TableCell>
    </TableRow>
  );
}

// Second Old Code -----------------------------------------------
export default function Compliance({
  staffalldocuments
}: {
  staffalldocuments: staffAllDocuments[];
}) {
  const [documentId, setDocumentId] = useState("");
  const [openListModal, setOpenListModal] = useState(false);
  const [openComplianceModal, setOpenComplianceModal] = useState(false);
  const [openDocumentEditModal, setOpenDocumentEditModal] = useState(false);
  const [openDocumentDeleteModal, setOpenDocumentDeleteModal] = useState(false);
  const [category, setCategory] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Define the state for the DatePicker
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams(); // Employee ID
  const employeeId = Array.isArray(id) ? id[0] : id;

  const handleOpenListModal = () => setOpenListModal(true);
  const handleCloseListModal = () => setOpenListModal(false);

  // const handleOpenComplianceModal = () => setOpenComplianceModal(true);
  const handleOpenComplianceModal = () => {
    setOpenComplianceModal(true);
    setOpenListModal(false);
  };

  const handleCloseComplianceModal = () => {
    setOpenComplianceModal(false);
    setOpenListModal(true);
  };

  const handleSubmitDocumentEditModal = () => {
    setOpenDocumentEditModal(false);
    console.log("Selected file is as below:", file);
  };
  const handleOpenDocumentEditModal = (data: any) => {
    setDocumentId(data.documentId);
    console.log("Editable Data:", data.documentId);
    setOpenDocumentEditModal(true);
    setOpenListModal(false);
  };
  const handleCloseDocumentEditModal = () => {
    setOpenDocumentEditModal(false);
    setOpenListModal(true);
  };

  const handleOpenDocumentDeleteModal = (data: any) => {
    setDocumentId(data.documentId);
    console.log("Deletable Data:", data.documentId);
    setOpenDocumentDeleteModal(true);
    setOpenListModal(false);
  };
  const handleCloseDocumentDeleteModal = () => {
    setOpenDocumentDeleteModal(false);
    setOpenListModal(true);
  };

  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  const [subCategory, setSubCategory] = useState<string>("");

  // Convert id to a string or handle it as needed

  const handleClose = () => {
    setOpen(false);
  };

  // ---------------- To Delete the Document Start Here ----------------
  const { mutate: deleteDoc, isPending } = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffalldocuments"] });
      setOpenDocumentDeleteModal(false);
      setOpenListModal(true);
    }
  });

  const onDelete = (params: { docid: number }) => {
    deleteDoc(params.docid);
  };

  const confirmDocumentDelete = () => {
    console.log("Deletable-Data:", documentId);
    onDelete({
      docid: Number(documentId) // Convert documentId to number
    });
  };

  // ---------------- To Delete the Document End Here ----------------

  // ---------------- To Add the Document Start Here ----------------
  const { mutate } = useMutation({
    mutationFn: addCompliance,
    onSuccess: () => {
      console.log("Compliance Data saved successfully");
      setLoading(false); // Stop loading on success
      handleClose();
    },
    onError: (error) => {
      console.error("Error saving Compliance Data:", error);
      setLoading(false); // Stop loading on error
    }
  });

  const onSubmit = (params: {
    employeeId: string;
    subcategoryId: string;
    data: FormData;
  }) => {
    mutate(params);
  };

  const handleSubmit = () => {
    if (employeeId && category && file) {
      setLoading(true); // Start loading

      const formData = new FormData();
      formData.append("file", file);

      console.log(
        "Submitting data",
        { employeeId, category, file },
        formData.get("file") // Check the file content
      );

      onSubmit({ employeeId, subcategoryId: category, data: formData });
      // handleClose();
      setOpenComplianceModal(false);
    } else {
      console.log("Missing data", { employeeId, category, file });
      // handleClose();
      setOpenComplianceModal(false);
    }
  };
  // ---------------- To Add the Document End Here ----------------
  // ---------------- To Update the Document Start Here ----------------
  //  const { mutate } = useMutation({
  //    mutationFn: updateCompliance,
  //    onSuccess: () => {
  //      console.log("Compliance Data saved successfully");
  //      setLoading(false); // Stop loading on success
  //      handleClose();
  //    },
  //    onError: (error) => {
  //      console.error("Error saving Compliance Data:", error);
  //      setLoading(false); // Stop loading on error
  //    }
  //  });

  // const onUpdate = (params: {
  //   employeeId: string;
  //   subcategoryId: string;
  //   documentId: string;
  //   data: FormData;
  // }) => {
  //   mutate(params);
  // };

  // const handleUpdate = () => {
  //   if (employeeId && category && file) {
  //     setLoading(true); // Start loading

  //     const formData = new FormData();
  //     formData.append("file", file);

  //     console.log(
  //       "Submitting data",
  //       { employeeId, category, file },
  //       formData.get("file") // Check the file content
  //     );

  //     onUpdate({ employeeId, subcategoryId: category,documentId, data: formData });
  //     // handleClose();
  //     // setOpenComplianceModal(false);
  //   } else {
  //     console.log("Missing data", { employeeId, category, file });
  //     // handleClose();
  //     // setOpenComplianceModal(false);
  //   }
  // };
  // ---------------- To Update the Document End Here ----------------

  // Fetch categories and subcategories
  const results = useQueries({
    queries: [
      {
        queryKey: ["category_list"],
        queryFn: getCategory
      },
      {
        queryKey: ["subcategory_list"],
        queryFn: getSub_Category
      }
    ]
  });

  const [categoryResult, subCategoryResult] = results;

  const isLoading = categoryResult.isLoading || subCategoryResult.isLoading;
  const error = categoryResult.error || subCategoryResult.error;
  const subcategories = subCategoryResult.data;

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error loading data</Typography>;
  }

  const handleDateChange = (newValue: React.SetStateAction<Date | null>) => {
    setSelectedDate(newValue);
    // Add custom validation if needed
    if (!newValue) {
      setErrors("Date is required");
    } else {
      setErrors("");
    }
  };

  return (
    <StyledPaper>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ paddingBottom: "15px" }}
      >
        <Typography variant="h5">Compliance</Typography>
        <Button size="small" onClick={handleOpenListModal}>
          Manage All
        </Button>
      </Stack>
      <Divider />

      {/* Existing document list in the original place */}
      <StyledBox>
        {(Object.keys(staffalldocuments[1]) as (keyof staffAllDocuments)[]).map(
          (category) => (
            <Accordion key={category}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${category}-content`}
                id={`${category}-header`}
              >
                <Typography>{category}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Scrollbar>
                  <TableContainer sx={{ overflow: "unset" }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Category</TableCell>
                          <TableCell>Expires At</TableCell>
                          <TableCell>Last Update</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {staffalldocuments[1][category]?.map((_data, index) => (
                          <ComplianceTableRow {..._data} key={index} />
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Scrollbar>
              </AccordionDetails>
            </Accordion>
          )
        )}
      </StyledBox>

      {/* -------------------- List Document -------------------- */}
      <Dialog
        open={openListModal}
        onClose={handleCloseListModal}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Document List</DialogTitle>
        <Divider />
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell>File Name</TableCell>
                  <TableCell>Expires At</TableCell>
                  <TableCell>Last Update</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell> {/* New column for download */}
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Render a single table with documents where fileName is not empty */}
                {(
                  Object.keys(
                    staffalldocuments[1]
                  ) as (keyof staffAllDocuments)[]
                )
                  .flatMap((category) =>
                    staffalldocuments[1][category]?.filter(
                      (doc) => doc.fileName
                    )
                  )
                  .map((_data, index) => (
                    <TableRow key={index}>
                      <TableCell>{_data.documentSubCategory}</TableCell>
                      <TableCell>{_data.fileName}</TableCell>
                      <TableCell>
                        {_data.expiryDate
                          ? moment(_data.expiryDate).format("LL")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {_data.lastUpdated
                          ? moment(_data.lastUpdated).format("LL")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            _data.expiry
                              ? "Expired"
                              : _data.status
                              ? "Active"
                              : "Not Specified"
                          }
                          color={
                            _data.expiry
                              ? "error"
                              : _data.status
                              ? "success"
                              : "warning"
                          }
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {_data.downloadURL ? (
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            {/* Download button */}
                            <IconButton
                              href={_data.downloadURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              color="primary"
                              aria-label="download"
                            >
                              <DownloadIcon />
                            </IconButton>

                            {/* Edit button */}
                            <IconButton
                              color="default"
                              aria-label="edit"
                              onClick={() => handleOpenDocumentEditModal(_data)}
                            >
                              <EditIcon />
                            </IconButton>

                            {/* Delete button */}
                            <IconButton
                              color="error"
                              aria-label="delete"
                              onClick={() =>
                                handleOpenDocumentDeleteModal(_data)
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={handleCloseListModal}
          >
            Close
          </Button>
          <Button variant="contained" onClick={handleOpenComplianceModal}>
            Add Document
          </Button>
        </DialogActions>
      </Dialog>

      {/* -------------------- Add Document -------------------- */}
      <Dialog
        open={openComplianceModal}
        onClose={handleCloseComplianceModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Compliance</DialogTitle>
        <Divider />
        <DialogContent>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={category || ""}
              onChange={(e) => setCategory(e.target.value)}
              label="Category"
            >
              {/* Grouped Category and Subcategory Dropdown */}
              {subcategories &&
                subcategories
                  .reduce((acc: any, curr: any) => {
                    const categoryGroup = acc.find(
                      (group: any) => group.category === curr.categoryName
                    );
                    if (categoryGroup) {
                      categoryGroup.items.push(curr);
                    } else {
                      acc.push({ category: curr.categoryName, items: [curr] });
                    }
                    return acc;
                  }, [])
                  .map((group: any) => [
                    <MenuItem key={`${group.category}-header`} disabled>
                      <strong>{group.category}</strong>
                    </MenuItem>,
                    ...group.items.map((item: any) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.subCategoryName}
                      </MenuItem>
                    ))
                  ])}
            </Select>
          </FormControl>

          <TextField
            type="file"
            fullWidth
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              setFile(target.files ? target.files[0] : null);
            }}
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={handleCloseComplianceModal}
          >
            Cancel
          </Button>
          <LoadingButton
            onClick={handleSubmit}
            loading={loading}
            variant="contained"
          >
            Submit
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* -------------------- Edit  Documents -------------------- */}
      <Dialog
        open={openDocumentEditModal}
        onClose={handleCloseDocumentEditModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Document Edit</DialogTitle>
        <Divider />
        <DialogContent>
          <Stack spacing={2}>
            <Box sx={{ width: "100%" }}>
              <DatePicker
                sx={{ width: "100%" }}
                className="date-picker"
                value={selectedDate}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: { width: "100%" } // Ensure DatePicker has full width
                  }
                }}
              />
              {error && (
                <FormHelperText sx={{ color: "#FF5630", mt: 1 }}>
                  {error}
                </FormHelperText>
              )}
            </Box>
            <Box sx={{ width: "100%" }}>
              <TextField
                type="file"
                fullWidth
                sx={{ width: "100%" }} // Ensure TextField has full width
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  setFile(target.files ? target.files[0] : null);
                }}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={handleCloseDocumentEditModal}
          >
            Close
          </Button>
          <Button variant="contained" onClick={handleSubmitDocumentEditModal}>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* -------------------- Delete  Documents -------------------- */}
      <Dialog
        open={openDocumentDeleteModal}
        onClose={handleCloseDocumentDeleteModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Document Delete</DialogTitle>
        <Divider />
        <DialogContent>
          <Typography>
            Are you sure, you want to delete this document?
          </Typography>
        </DialogContent>
        <DialogActions>
          {/* <Button variant="contained" onClick={handleCloseDocumentDeleteModal}>
            Cancel
          </Button> */}
          <Button
            variant="contained"
            color="error"
            onClick={handleCloseDocumentDeleteModal}
          >
            No
          </Button>
          <Button variant="contained" onClick={confirmDocumentDelete}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </StyledPaper>
  );
}
