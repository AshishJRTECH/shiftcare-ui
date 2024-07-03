import { getAllShiftNotes } from "@/api/functions/client.api";
import { Shift, ShiftNotes } from "@/interface/shift.interface";
import StyledPaper from "@/ui/Paper/Paper";
import styled from "@emotion/styled";
import { CircularProgress, Divider, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React from "react";
import Iconify from "../Iconify/Iconify";
import Image from "next/image";
import assets from "@/json/assets";
import prettyBytes from "pretty-bytes";
import Link from "next/link";

const StyledBox = styled(Box)`
  padding: 15px 10px;
  h5 {
    margin-bottom: 15px;
  }
  .MuiStack-root {
    padding-left: 10px;
    .line {
      border: 2px solid #ccc;
    }
    .floating-element {
      width: 30px;
      height: 30px;
      /* padding: 3px; */
      display: flex;
      align-items: center;
      border-radius: 50%;
      justify-content: center;
      position: absolute;
      top: 13px;
      left: -45px;
      color: #fff;
    }
    .file {
      margin-top: 20px;
      width: 280px;
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 5px;
      > div {
        flex: 1;
        p {
          width: 175px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      a {
        display: flex;
        align-items: center;
      }
      img {
        width: 30px;
        height: 30px;
        aspect-ratio: 1/1;
        &.file_image {
          width: 45px;
          height: 45px;
        }
      }
    }
  }
`;

export default function ShiftRelatedNotes({ shift }: { shift?: Shift }) {
  const { data, isLoading } = useQuery({
    queryKey: ["all_shift_notes", shift?.client.id],
    queryFn: () => getAllShiftNotes({ id: shift?.client.id.toString() })
  });

  const getIcon = (noteType: string) => {
    switch (noteType) {
      case "Enquiry":
        return (
          <Box className="floating-element" sx={{ backgroundColor: "#ff851b" }}>
            <Iconify icon="iconamoon:search-bold" />
          </Box>
        );
      case "Notes":
        return (
          <Box className="floating-element" sx={{ backgroundColor: "#00a65a" }}>
            <Iconify icon="ic:sharp-person" />
          </Box>
        );
      case "Incident":
        return (
          <Box className="floating-element" sx={{ backgroundColor: "#0073b7" }}>
            <Iconify icon="ph:flag-fill" />
          </Box>
        );
      case "Injury":
        return (
          <Box className="floating-element" sx={{ backgroundColor: "#dd4b39" }}>
            <Iconify icon="fa:ambulance" />
          </Box>
        );
      case "Feedback":
        return (
          <Box className="floating-element" sx={{ backgroundColor: "#ff851b" }}>
            <Iconify icon="ep:warning-filled" />
          </Box>
        );
    }
  };

  return (
    <StyledBox>
      <Typography variant="h5">Notes</Typography>
      <Stack direction="row" gap={3}>
        <Box className="line" />
        <Box
          sx={
            isLoading
              ? {
                  height: "200px",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }
              : {}
          }
        >
          {isLoading ? (
            <CircularProgress />
          ) : (
            (Object.values(data || {}).flat() as ShiftNotes[]).map((_data) => {
              return (
                <StyledPaper
                  key={_data.id}
                  sx={{ position: "relative", marginBottom: "20px" }}
                >
                  {getIcon(_data.shiftNotesCategories)}
                  <Typography>
                    <strong>{_data.addedByEmployee}</strong> added{" "}
                    {_data.shiftNotesCategories} for{" "}
                    <strong>{_data.clientName}</strong> dated{" "}
                    {moment.unix(_data.epochDate).format("DD/MM/YYYY")}
                  </Typography>
                  <Divider sx={{ marginBlock: "10px" }} />
                  <Typography sx={{ marginBottom: "8px" }}>
                    <strong>{_data.subject}</strong>
                  </Typography>
                  <Box dangerouslySetInnerHTML={{ __html: _data.notes }} />
                  {_data.documents.map((_document) => (
                    <Stack
                      direction="row"
                      className="file"
                      key={_document.downloadURL}
                      gap={1}
                    >
                      <Image
                        src={assets.file_icon}
                        alt="File Icon"
                        width={512}
                        height={512}
                        className="file_image"
                      />
                      <Box>
                        <Typography sx={{ fontSize: "15px" }}>
                          {_document.fileName}
                        </Typography>
                        <Typography variant="caption">
                          {prettyBytes(_document.fileSize)}
                        </Typography>
                      </Box>
                      <Link href={_document.downloadURL} download>
                        <Image
                          src={assets.download}
                          alt="download"
                          width={512}
                          height={512}
                        />
                      </Link>
                    </Stack>
                  ))}
                </StyledPaper>
              );
            })
          )}
        </Box>
      </Stack>
    </StyledBox>
  );
}
