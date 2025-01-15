import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import { Container, Grid, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import DocumentTemplateInside from "../template-document-inside";

export default function Documents() {
  const { id } = useParams();
  return (
    <DashboardLayout>
      <Container>
        {/* <Typography variant="h4" component="h1" gutterBottom>
          Documents {id}
        </Typography>
        <Typography variant="body1">Documents...</Typography> */}
        <Grid item lg={12} md={12} sm={12} xs={12}>
          {/* <ClientDocuments document_data={data.documents} /> */}
          <DocumentTemplateInside></DocumentTemplateInside>
        </Grid>
      </Container>
    </DashboardLayout>
  );
}
