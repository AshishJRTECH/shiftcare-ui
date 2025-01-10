import { getAllTemplateDocuments } from "@/api/functions/client.api";
import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import { Container, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import TemplateSubsection from "./template-subsection";

// import { useParams } from "next/navigation";

export default function DocumentTemplate() {
  //   const { id } = useParams();
  const {
    data: templatedata,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["templates_document_list_admin"],
    queryFn: () => getAllTemplateDocuments() // pass the id as an object
  });

  // useEffect(() => {
  //   console.log("============ Template Data =============", templatedata);
  // }, [templatedata]);

  return (
    <DashboardLayout>
      <Container>
        {templatedata && (
          <TemplateSubsection templates={templatedata}></TemplateSubsection>
        )}
      </Container>
    </DashboardLayout>
  );
}
