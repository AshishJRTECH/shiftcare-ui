import { getTimeLine } from "@/api/functions/client.api";
import {
  Box,
  Chip,
  Container,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import NotesIcon from "@mui/icons-material/Notes";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import DescriptionIcon from "@mui/icons-material/Description";

// Helper function to group timeline entries by date
function groupByDate(entries: any[]) {
  const grouped: { [key: string]: any[] } = {};
  entries.forEach((entry) => {
    const [year, month, day] = entry.timestamp;
    const date = new Date(year, month - 1, day);
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }); // Format as dd MON, YYYY
    if (!grouped[formattedDate]) grouped[formattedDate] = [];
    grouped[formattedDate].push(entry);
  });
  return grouped;
}

// Helper function to calculate time ago
function timeAgo(timestamp: number[]) {
  const [year, month, day, hour, minute, second] = timestamp;
  const entryDate = new Date(year, month - 1, day, hour, minute, second);
  const currentDate = new Date();

  const diffTime = Math.abs(currentDate.getTime() - entryDate.getTime());

  // Calculate days
  const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

  if (diffDays > 0) {
    return `${diffDays} days ago`;
  }

  // Calculate hours
  const diffHours = Math.floor(diffTime / (1000 * 3600));
  if (diffHours > 0) {
    return `${diffHours} hours ago`;
  }

  // Calculate minutes
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  if (diffMinutes > 0) {
    return `${diffMinutes} minutes ago`;
  }

  // Calculate seconds
  const diffSeconds = Math.floor(diffTime / 1000);
  return `${diffSeconds} seconds ago`;
}

// Function to sort entries by timestamp in descending order (latest first)
function sortByTimestamp(entries: any[]) {
  return entries.sort((a, b) => {
    const timestampA = new Date(
      a.timestamp[0],
      a.timestamp[1] - 1,
      a.timestamp[2],
      a.timestamp[3],
      a.timestamp[4],
      a.timestamp[5]
    );
    const timestampB = new Date(
      b.timestamp[0],
      b.timestamp[1] - 1,
      b.timestamp[2],
      b.timestamp[3],
      b.timestamp[4],
      b.timestamp[5]
    );
    return timestampB.getTime() - timestampA.getTime(); // Descending order (latest first)
  });
}

// Function to get the appropriate icon based on entry type
function getEntryIcon(type: string) {
  switch (type) {
    case "Created":
      return <CheckCircleIcon sx={{ color: "green" }} />;
    case "Receipted":
      return <MonetizationOnIcon sx={{ color: "green" }} />;
    case "Void":
      return <CancelIcon sx={{ color: "red" }} />;
    case "Deleted":
      return <DeleteIcon sx={{ color: "#ff0000" }} />;
    case "Notes":
      return <DescriptionIcon sx={{ color: "#5e89c6" }} />;
    default:
      return <NotesIcon />;
  }
}

export default function TimeLine({ selectedInvoiceId }: any) {
  const { id } = useParams();

  // Fetching timeline data
  const {
    data: fetchTimeLine,
    isLoading: loadTimeLine,
    error: errorTimeLine
  } = useQuery<any>({
    queryKey: ["get_timeline", selectedInvoiceId],
    queryFn: () =>
      selectedInvoiceId ? getTimeLine(selectedInvoiceId) : Promise.reject(""),
    enabled: !!selectedInvoiceId
  });

  useEffect(() => {
    console.log("Selected ID::::::::::::::::::::::", selectedInvoiceId);
  }, [selectedInvoiceId]);

  useEffect(() => {
    console.log(":::::::Get Time Line:::::", fetchTimeLine);
  }, [fetchTimeLine]);

  // Render loading or error states
  if (loadTimeLine) {
    return (
      <Container>
        <Typography variant="body1">Loading timeline...</Typography>
      </Container>
    );
  }

  if (errorTimeLine) {
    return (
      <Container>
        <Typography variant="body1">Failed to load timeline.</Typography>
      </Container>
    );
  }

  // Sort timeline data by timestamp (latest first)
  const sortedTimeline = fetchTimeLine ? sortByTimestamp(fetchTimeLine) : [];

  // Group the sorted data by date
  const groupedTimeline = groupByDate(sortedTimeline);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Timeline
      </Typography>
      {Object.entries(groupedTimeline).map(
        ([date, entries]: [string, any[]]) => (
          <Box key={date} mb={4}>
            {/* Date Header with Red Chip */}
            <Chip
              label={date}
              sx={{
                backgroundColor: "#0d8fb9c7",
                color: "white",
                padding: "8px 16px", // Padding for better readability
                fontWeight: "bold", // Optional: to make the date stand out
                marginBottom: "16px" // Space between date and steps
              }}
            />
            <Stepper orientation="vertical">
              {entries.map((entry, index) => (
                <Step key={index} active={true}>
                  <StepLabel icon={getEntryIcon(entry.type)}>
                    {(() => {
                      const [year, month, day, hour, minute, second] =
                        entry.timestamp;
                      const entryDate = new Date(
                        year,
                        month - 1,
                        day,
                        hour,
                        minute,
                        second
                      );
                      const timeString = entryDate.toLocaleTimeString();
                      const timeAgoString = timeAgo(entry.timestamp); // Use the updated timeAgo function

                      return (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between"
                          }}
                        >
                          <span style={{ color: "grey" }}>{timeString}</span>
                          <span style={{ color: "grey" }}>{timeAgoString}</span>
                        </Box>
                      );
                    })()}
                  </StepLabel>
                  <StepContent>
                    <Box mb={2}>
                      <Typography variant="h6">{entry.subject}</Typography>
                      <Typography variant="body1">
                        {entry.description}
                      </Typography>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Box>
        )
      )}
    </Container>
  );
}
