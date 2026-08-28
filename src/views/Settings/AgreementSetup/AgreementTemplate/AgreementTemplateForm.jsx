import React, { lazy } from "react";
import { useParams } from "react-router-dom";
import FormPageLayout from "@shared/layout/FormPageLayout";
// import PageBuilder from "@shared/pageBuilder/PageBuilder";

const PageBuilder = lazy(() => import("@shared/pageBuilder/PageBuilder"));

function AgreementTemplateForm() {
  const { id } = useParams();

  return (
    <FormPageLayout backText="Agreement Template" hideCancel>
      <PageBuilder id={id} />
    </FormPageLayout>
  );
}
export default React.memo(AgreementTemplateForm);
