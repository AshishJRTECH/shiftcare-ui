import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import { Box, Container, Typography } from "@mui/material";
import { useParams } from "next/navigation";

export default function ExamplePage() {
  const { id } = useParams();

  // Replace this URL with your actual PDF file path or dynamic URL
  const pdfUrl = `/pdf/ADMIN-SECTION.pdf`; // e.g., public/pdf/ADMIN-SECTION.pdf

  return (
    <DashboardLayout>
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Web Guidance
        </Typography>
        {/* <Typography variant="body1" gutterBottom>
          Below is the PDF document content:
        </Typography> */}

        <Box
          sx={{
            height: "80vh",
            border: "1px solid #ccc",
            borderRadius: 2,
            overflow: "hidden"
          }}
        >
          <iframe
            src={pdfUrl}
            width="100%"
            height="100%"
            style={{ border: "none" }}
          />
        </Box>
      </Container>
    </DashboardLayout>
  );
}
