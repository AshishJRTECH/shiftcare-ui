import {
  TenplateAllDocuments,
  complianceData,
  documents,
  staffAllDocuments
} from "@/interface/common.interface";
import StyledPaper from "@/ui/Paper/Paper";
import Scrollbar from "@/ui/scrollbar";
import styled, { Interpolation } from "@emotion/styled";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FilledTextFieldProps,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedTextFieldProps,
  Select,
  StandardTextFieldProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  TextFieldVariants,
  Tooltip,
  Typography
} from "@mui/material";
import { Stack } from "@mui/system";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
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
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Theme } from "@emotion/react";
import { JSX } from "@emotion/react/jsx-runtime";
import { toast } from "sonner";
// import intakeValidationText from "@/json/messages/intakeValidationText";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { IDocumentSubCategory } from "@/interface/staff.interfaces";
import {
  addClientDocumentSubCategory,
  addTemplateDocument,
  deleteClientDocument,
  getClientCategory,
  getClientDocumentsCategory,
  getClientSub_Category,
  updateClientDocument
} from "@/api/functions/client.api";

const StyledBox = styled(Box)`
  th:not(:nth-of-type(1)),
  td:not(:nth-of-type(1)) {
    white-space: nowrap;
  }

  th,
  td {
    text-align: left;
  }
`;

function ComplianceTableRow({
  client,
  clientDocumentCategory,
  clientDocumentCategoryId,
  clientDocumentSubCategory,
  clientDocumentSubCategoryId,
  documentId,
  documentName,
  downloadURL,
  expiry,
  expiryDate,
  fileName,
  fileSize,
  fileType,
  isExpiryMandatory,
  lastUpdated,
  staffVisible,
  status,
  onClick // Accepting the onClick prop
}: any & { onClick?: () => void }) {
  // Add the type for onClick prop
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
      status: "Pending",
      color: "warning"
    };
  };

  return (
    <TableRow onClick={onClick}>
      {" "}
      {/* Apply onClick to the TableRow */}
      <TableCell>{clientDocumentSubCategory}</TableCell>
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

export default function TemplateSubsection({
  templates
}: {
  templates: any[];
}) {
  interface SubCategory {
    documentSubCategoryId: number | null; // Use appropriate types
    documentSubCategory: string | null;
  }

  console.log(
    "--------------------- staffalldocuments --------------------------",
    templates
  );

  const schema = yup.object().shape({
    // id: yup.string().required("Please select category"),
    // name: yup.string().trim().required(intakeValidationText.error.name)
    id: yup.string(),
    name: yup.string().trim()
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      id: "",
      name: ""
    }
  });

  const [subCat, setSubCat] = useState<SubCategory>({
    documentSubCategoryId: null,
    documentSubCategory: null
  });
  const [displayingDate, setDisplayingDate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubcategoryId] = useState<string>("");
  const [documentId, setDocumentId] = useState<string>("");
  const [openListModal, setOpenListModal] = useState(false);
  const [openComplianceModal, setOpenComplianceModal] = useState(false);
  const [openComplianceModalSubcategory, setOpenComplianceModalSubcategory] =
    useState(false);
  const [openComplianceModalDirect, setOpenComplianceModalDirect] =
    useState(false);
  const [openDocumentEditModal, setOpenDocumentEditModal] = useState(false);
  const [openDocumentDeleteModal, setOpenDocumentDeleteModal] = useState(false);
  const [category, setCategory] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Define the state for the DatePicker
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams(); // Employee ID
  const employeeId = Array.isArray(id) ? id[0] : id;
  const [expiryDateEnabled, setExpiryDateEnabled] = useState(false);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [convertedDate, setConvertedDate] = useState<Date | null>(null);

  const handleOpenAddDocumentSubcategory = () =>
    setOpenComplianceModalSubcategory(true);
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
  const handleCloseComplianceModalSubcategory = () => {
    setOpenComplianceModalSubcategory(false);
  };

  const handleCloseComplianceModalDirect = () => {
    setOpenComplianceModalDirect(false);
  };

  const handleSubmitDocumentEditModal = () => {
    setOpenDocumentEditModal(false);
    console.log("Selected file is as below:", file);
  };

  const handleOpenDocumentEditModal = (data: any) => {
    setDocumentId(data.documentId);
    setSubcategoryId(data.clientDocumentSubCategoryId);
    setFile(data.fileName ? data.fileName[0] : null);
    const date = new Date(data.expiryDate);
    // Extract the day, month, and year
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();

    // Format the date as dd/mm/yyyy
    const formattedDate = `${day}/${month}/${year}`;
    setDisplayingDate(formattedDate);
    // setExpiryDate(data.expiryDate); // Convert string to Date object

    setExpiryDateEnabled(data.isExpiryMandatory);
    console.log("Editable Data:", data);
    setOpenDocumentEditModal(true);
    setOpenListModal(false);
  };
  const handleCloseDocumentEditModal = () => {
    setOpenDocumentEditModal(false);
    setOpenListModal(true);
  };

  const handleOpenDocumentDeleteModal = (data: any) => {
    setDocumentId(data.documentId);
    console.log("Deletable-Data:", data.documentId);
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

  const { mutate: addSubcategory } = useMutation({
    mutationFn: addClientDocumentSubCategory,
    onSuccess: (resonse) => {
      queryClient.invalidateQueries({
        queryKey: ["admin_subcategory_list"]
      });
      toast.success(resonse.message);
      setLoading(false); // Stop loading on success
      setOpenComplianceModalSubcategory(false);
    },
    onError: (error) => {
      console.error("Error saving Compliance Data:", error);
      setLoading(false); // Stop loading on error
    }
  });

  // ---------------- To Add the Document Start Here ----------------
  const { mutate } = useMutation({
    mutationFn: addTemplateDocument,
    onSuccess: () => {
      setLoading(false); // Stop loading on success
      handleClose();
      queryClient.invalidateQueries({
        queryKey: ["templates_document_list_admin"]
      });
      // console.log("Compliance Data saved successfully");
    },
    onError: (error) => {
      console.error("Error saving Compliance Data:", error);
      setLoading(false); // Stop loading on error
    }
  });

  const onSubmit = (params: {
    subCategoryId: string;
    data: FormData;
    isExpiryMandatory: boolean;
    expiryDate: Date;
  }) => {
    mutate(params);
  };

  const handleSubmit = () => {
    if (category && file) {
      const formattedExpiryDate = expiryDate
        ? new Date(expiryDate).toLocaleDateString("en-GB").split("/").join("-")
        : null;

      if (formattedExpiryDate) {
        const [day, month, year] = formattedExpiryDate.split("-").map(Number);
        const dateObject = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
        setConvertedDate(dateObject);
        setLoading(true); // Start loading
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "isExpiryMandatory",
          expiryDateEnabled ? "true" : "false"
        );
        if (dateObject) {
          // Create a new date object representing the selected date at midnight UTC
          const utcDate = new Date(
            Date.UTC(
              dateObject.getFullYear(),
              dateObject.getMonth(),
              dateObject.getDate()
            )
          );

          // Get the ISO string
          const isoDateString = utcDate.toISOString();

          // Append to formData
          formData.append("expiryDate", isoDateString);
        }

        console.log(
          "Submitting data",
          {
            category,
            file,
            expiryDateEnabled,
            expiryDate: convertedDate
          },
          formData.get("file") // Check the file content
        );

        onSubmit({
          subCategoryId: category,
          data: formData,
          isExpiryMandatory: expiryDateEnabled,
          expiryDate: convertedDate ?? new Date()
        });

        setOpenComplianceModal(false);
        setOpenComplianceModalDirect(false);
        setOpenListModal(true);
      } else {
        setLoading(true); // Start loading
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "isExpiryMandatory",
          expiryDateEnabled ? "true" : "false"
        );

        onSubmit({
          subCategoryId: category,
          data: formData,
          isExpiryMandatory: expiryDateEnabled,
          expiryDate: new Date()
        });

        setOpenComplianceModal(false);
        setOpenComplianceModalDirect(false);
        setOpenListModal(true);
      }
    } else {
      console.log("Missing data", {
        category,
        file,
        expiryDateEnabled,
        expiryDate
      });
    }
  };

  // ---------------- To Add the Document End Here ----------------

  // ---------------- To Update the Document Start Here ----------------
  const { mutate: updateDocument } = useMutation({
    mutationFn: updateClientDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["templates_document_list_admin"]
      });
      setLoading(false);
      setOpenDocumentEditModal(false);
      setOpenListModal(true);
      // console.log("Compliance Data saved successfully");
      // setLoading(false); // Stop loading on success
      // handleClose();
      return toast.success("Document Data saved successfully");
    },
    onError: (error) => {
      console.error("Error saving Compliance Data:", error);
      setLoading(false); // Stop loading on error
    }
  });

  const onUpdate = (params: {
    subCategoryId: string;
    documentId: string;
    data: FormData;
    isExpiryMandatory: boolean;
    expiryDate: Date;
  }) => {
    updateDocument(params);
  };

  function parseExpiryDate(formattedExpiryDate: any) {
    if (!formattedExpiryDate) return null;

    const [day, month, year] = formattedExpiryDate.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  }

  const handleUpdate = () => {
    if (subCategoryId && file && documentId) {
      setLoading(true); // Start loading
      const formattedExpiryDate = expiryDate
        ? new Date(expiryDate).toLocaleDateString("en-GB").split("/").join("-")
        : null;

      // Inside your main code block
      const dateObject = parseExpiryDate(formattedExpiryDate);
      setConvertedDate(dateObject);
      setLoading(true); // Start loading

      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "isExpiryMandatory",
        expiryDateEnabled ? "true" : "false"
      );

      if (dateObject) {
        const utcDate = new Date(
          Date.UTC(
            dateObject.getFullYear(),
            dateObject.getMonth(),
            dateObject.getDate()
          )
        );
        const isoDateString = utcDate.toISOString();
        formData.append("expiryDate", isoDateString);
      }

      console.log(
        "Submitting data",
        {
          category,
          file,
          expiryDateEnabled,
          expiryDate: convertedDate
        },
        formData.get("file") // Check the file content
      );

      onUpdate({
        subCategoryId,
        documentId,
        data: formData,
        isExpiryMandatory: expiryDateEnabled,
        expiryDate: convertedDate ?? new Date()
      });

      setOpenComplianceModal(false);
      setOpenComplianceModalDirect(false);
      setOpenListModal(true);
    } else {
      console.log("Missing data in Edit", {
        subCategoryId,
        documentId,
        file,
        expiryDateEnabled,
        expiryDate
      });
      // handleClose();
      setOpenDocumentEditModal(false);
    }
  };
  // ---------------- To Update the Document End Here ----------------
  // ---------------- To Delete the Document Start Here ----------------
  const { mutate: deleteDoc, isPending } = useMutation({
    mutationFn: deleteClientDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["additional_document_list"]
      });
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

  // Fetch categories and subcategories
  const results = useQueries({
    queries: [
      {
        queryKey: ["category_list"],
        queryFn: getClientCategory
      },
      {
        queryKey: ["subcategory_list"],
        queryFn: getClientSub_Category
      }
    ]
  });

  useEffect(() => {
    console.log(
      "-------------: category and Subcategory :-------------",
      results
    );
  }, [results]);

  const [categoryResult, subCategoryResult] = results;

  const isLoading = categoryResult.isLoading || subCategoryResult.isLoading;
  const error = categoryResult.error || subCategoryResult.error;
  const subcategories = subCategoryResult.data;

  const {
    data,
    isLoading: loading2,
    isError
  } = useQuery({
    queryKey: ["admin_subcategory_list"],
    queryFn: () => getClientDocumentsCategory() // pass the id as an object
  });

  useEffect(() => {
    console.log(
      "-----------------: Client Document Category :-----------------",
      data
    );
  }, [data]);

  useEffect(() => {
    // Your reload logic here
    console.log("Component mounted and loaded once");

    // Optionally, you can place cleanup code here if needed
    return () => {
      // cleanup code
    };
  }, []); // Empty dependency array ensures this runs only once

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

  const handleRowClick = (data: any) => {
    // console.log("Selected Data:", data);
    // console.log("Selected Data File :", data.fileName);
    if (data.fileName !== null) {
      console.log("Selected Data:", data);
      console.log("Edit Dialog Box will be appear.");
      handleOpenDocumentEditModal(data);
    } else {
      setCategory(data?.documentSubCategoryId);
      setSubCat({
        documentSubCategoryId: data?.documentSubCategoryId,
        documentSubCategory: data?.documentSubCategory
      });
      setOpenComplianceModalDirect(true);
    }
  };

  // const handleAddSubCategorySubmit = () => {
  //   setOpenComplianceModalSubcategory(false);
  //   console.log("Sub category Addedd Successfully");
  // };

  // const handleAddSubCategorySubmit = (
  //   data: Omit<IDocumentSubCategory, "id" | "name"> & {
  //     id: string;
  //     name: string;
  //   }
  // ) => {
  //   const formattedData: IDocumentSubCategory = {
  //     id: data.id.trim(),
  //     name: data.name.trim()
  //   };

  //   // Assuming `mutate` is defined elsewhere for sending data
  //   // mutate({
  //   //   clientId: id.toString(), // Assuming `id` is defined in the scope
  //   //   data: formattedData
  //   // });

  //   console.log("Client ID::::::::::::::::::::::::::::::", id.toString());
  //   console.log("Formatted Data::::::::::::::::::::::::::::::", formattedData);
  // };

  const handleChange = (event: any) => {
    setCategoryId(event.target.value);
  };

  const handleAddSubCategorySubmit = (data: IDocumentSubCategory) => {
    const formattedData = {
      name: data.name.trim()
    };

    console.log("Formatted Data:", formattedData);

    addSubcategory({
      categoryId: categoryId,
      data: formattedData
    });

    // Call your mutate function here
  };

  return (
    <StyledPaper>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ paddingBottom: "15px" }}
      >
        <Typography variant="h5">Documents</Typography>
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            variant="contained"
            size="small"
            onClick={handleOpenAddDocumentSubcategory}
          >
            Add Document Sub-Category
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleOpenListModal}
          >
            Manage All
          </Button>
        </div>
      </Stack>
      <Divider />

      <StyledBox>
        {(Object.keys(templates[1]) as (keyof TenplateAllDocuments)[]).map(
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
                          <TableCell>Sub Category</TableCell>
                          <TableCell>Expires At</TableCell>
                          <TableCell>Last Update</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {templates[1][category]?.map(
                          (
                            _data: JSX.IntrinsicAttributes &
                              documents & { onClick?: () => void },
                            index: React.Key | null | undefined
                          ) => (
                            <ComplianceTableRow
                              {..._data}
                              key={index}
                              onClick={() => handleRowClick(_data)} // Pass the onClick handler here
                            />
                          )
                        )}
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
                {(Object.keys(templates[1]) as (keyof TenplateAllDocuments)[])
                  .flatMap((category) =>
                    templates[1][category]?.filter((doc: any) => doc.fileName)
                  )
                  .map((_data, index) => (
                    <TableRow key={index}>
                      <TableCell>{_data.clientDocumentSubCategory}</TableCell>
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
                              : "Pending"
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
                            <Tooltip title="Download Document">
                              <IconButton
                                href={_data.downloadURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                color="primary"
                                aria-label="download"
                              >
                                <DownloadIcon />
                              </IconButton>
                            </Tooltip>

                            {/* Edit button */}
                            <Tooltip title="Edit Document">
                              <IconButton
                                color="default"
                                aria-label="edit"
                                onClick={() =>
                                  handleOpenDocumentEditModal(_data)
                                }
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>

                            {/* Delete button */}
                            <Tooltip title="Delete Document">
                              <IconButton
                                color="error"
                                aria-label="delete"
                                onClick={() =>
                                  handleOpenDocumentDeleteModal(_data)
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
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

          {/* Checkbox for Expiry Date Option */}
          <FormControlLabel
            control={
              <Checkbox
                checked={expiryDateEnabled}
                onChange={(e) => setExpiryDateEnabled(e.target.checked)}
              />
            }
            label="Expiry date requirement for this doc?"
            sx={{ marginBottom: 2 }}
          />

          {/* Conditionally Render DatePicker */}
          {expiryDateEnabled && (
            <DatePicker
              label="Expiry Date"
              value={expiryDate}
              onChange={(newValue) => setExpiryDate(newValue)}
              slotProps={{
                textField: { fullWidth: true }
              }}
            />
          )}
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
            {/* <Box sx={{ width: "100%" }}> 
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
            </Box> */}
            <Box>
              <TextField
                type="file"
                fullWidth
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  setFile(target.files ? target.files[0] : null);
                }}
                sx={{ marginBottom: 2 }}
              />

              {/* Checkbox for Expiry Date Option */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={expiryDateEnabled}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setExpiryDateEnabled(checked);
                      if (!checked) {
                        setExpiryDate(null); // Clear expiry date if checkbox is unchecked
                      }
                    }}
                  />
                }
                label="Is expiry date requirement for this doc?"
                sx={{ marginBottom: 2 }}
              />

              <Typography>Current Expiry Date: {displayingDate}</Typography>
              {/* Conditionally Render DatePicker */}
              {expiryDateEnabled && (
                <DatePicker
                  label="Expiry Date"
                  value={expiryDate}
                  onChange={(newValue) => setExpiryDate(newValue)}
                  slotProps={{
                    textField: { fullWidth: true }
                  }}
                />
              )}
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
          <LoadingButton
            onClick={handleUpdate}
            loading={loading}
            variant="contained"
          >
            Update
          </LoadingButton>
          {/* <Button variant="contained" onClick={handleSubmitDocumentEditModal}>
            Update
          </Button> */}
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

      {/* -------------------- Direct Add Document -------------------- */}
      <Dialog
        open={openComplianceModalDirect}
        onClose={handleCloseComplianceModalDirect}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Compliance.</DialogTitle>
        <Divider />
        <DialogContent>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={subCat.documentSubCategoryId ?? ""} // Fallback to empty string for null
              onChange={(e) =>
                setSubCat({
                  ...subCat,
                  documentSubCategoryId: e.target.value
                    ? Number(e.target.value)
                    : null // Ensure to convert to number or null
                })
              }
              label="Category"
            >
              <MenuItem
                key={
                  subCat.documentSubCategoryId !== null
                    ? subCat.documentSubCategoryId
                    : 0
                } // Use 0 or another default for key
                value={
                  subCat.documentSubCategoryId !== null
                    ? subCat.documentSubCategoryId
                    : 0
                } // Same as above
              >
                {subCat.documentSubCategory || "Select a category"}
              </MenuItem>
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

          {/* Checkbox for Expiry Date Option */}
          <FormControlLabel
            control={
              <Checkbox
                checked={expiryDateEnabled}
                onChange={(e) => setExpiryDateEnabled(e.target.checked)}
              />
            }
            label="Is expiry date requirement for this doc?"
            sx={{ marginBottom: 2 }}
          />

          {/* Conditionally Render DatePicker */}
          {expiryDateEnabled && (
            <DatePicker
              label="Expiry Date"
              value={expiryDate}
              onChange={(newValue) => setExpiryDate(newValue)}
              slotProps={{
                textField: { fullWidth: true }
              }}
            />
          )}
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={handleCloseComplianceModalDirect}
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

      {/* -------------------- Add Document Sub category -------------------- */}
      <Dialog
        open={openComplianceModalSubcategory}
        onClose={handleCloseComplianceModalSubcategory}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Document Sub-category</DialogTitle>
        <Divider />
        <DialogContent>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleAddSubCategorySubmit)}>
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel id="category-label">Select Category</InputLabel>
                <Select
                  labelId="category-label"
                  value={categoryId}
                  onChange={handleChange}
                  label="Category"
                >
                  {/* Render Category Dropdown if data is not empty */}
                  {data && data.length > 0 ? (
                    data.map((item: any) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No categories available</MenuItem>
                  )}
                </Select>
              </FormControl>

              <TextField
                {...methods.register("name")}
                type="text"
                fullWidth
                label="Name"
                placeholder="Enter category name"
                sx={{ marginBottom: 2 }}
              />
            </form>
          </FormProvider>
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={handleCloseComplianceModalSubcategory}
          >
            Cancel
          </Button>
          <LoadingButton
            // onClick={handleAddSubCategorySubmit}
            onClick={methods.handleSubmit(handleAddSubCategorySubmit)}
            loading={loading}
            variant="contained"
          >
            Submit
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </StyledPaper>
  );
}
