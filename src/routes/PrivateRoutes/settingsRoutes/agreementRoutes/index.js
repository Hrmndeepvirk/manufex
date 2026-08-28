import { lazy } from "react";

const AgreementTemplateForm = lazy(() =>
  import(
    "@views/Settings/AgreementSetup/AgreementTemplate/AgreementTemplateForm"
  )
);

const AgreementCategoriesForm = lazy(() =>
  import(
    "@views/Settings/AgreementSetup/AgreementCategories/AgreementCategoriesForm"
  )
);

const AgreementPromotionForm = lazy(() =>
  import(
    "@views/Settings/AgreementSetup/AgreementPromotion/AgreementPromotionForm"
  )
);

const AccessedFeeForm = lazy(() =>
  import("@views/Settings/AgreementSetup/AccessedFee/AccessedFeeForm")
);

const AgreementPlanForm = lazy(() =>
  import(
    "../../../../views/Settings/AgreementSetup/AgreementPlan/AgreementPlanForm"
  )
);

const GroupPlanForm = lazy(() =>
  import("@views/Settings/AgreementSetup/GroupPlan/GroupPlanForm")
);

const AgreementRoutes = [
  {
    name: "Add Agreement Template",
    component: AgreementTemplateForm,
    path: "/agreement-template/:id?",
    exact: true,
  },
  {
    name: "Add Agreement Categories",
    component: AgreementCategoriesForm,
    path: "/agreement-categories/:id?",
    exact: true,
  },
  {
    name: "Add Agreement Promotion",
    component: AgreementPromotionForm,
    path: "/agreement-promotion/:id?",
    exact: true,
  },
  {
    name: "Add Accessed Fee",
    component: AccessedFeeForm,
    path: "/assessed-fee/:id?",
    exact: true,
  },
  {
    name: "Add Agreement Plan",
    component: AgreementPlanForm,
    path: "/agreement-plan/:id?",
    exact: true,
  },
  {
    name: "Add Group Plan",
    component: GroupPlanForm,
    path: "/group-plan/:id?",
    exact: true,
  },
];
export default AgreementRoutes;
