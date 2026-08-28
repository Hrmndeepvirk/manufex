import { lazy } from "react";
const CompanyForm = lazy(() =>
  import("@views/Settings/BusinessSetup/Company/CompanyForm")
);
const ReasonCode = lazy(() =>
  import("@views/Settings/BusinessSetup/ReasonCode/ReasonCodeForm")
);
const CustomizationForm = lazy(() =>
  import("@views/Settings/BusinessSetup/Customization/CustomizationForm")
);
const IposTerminalForm = lazy(() =>
  import("@views/Settings/BusinessSetup/IposTerminal/IposTerminalForm")
);

const BusinessRoutes = [
  {
    name: "Edit Company",
    component: CompanyForm,
    path: "/company",
    exact: true,
  },
  {
    name: "Add Reason Code",
    component: ReasonCode,
    path: "/reason-code/:id?",
    exact: true,
  },
  {
    name: "Edit Customization",
    component: CustomizationForm,
    path: "/customization",
    exact: true,
  },
  {
    name: "Add IPOS Terminal",
    component: IposTerminalForm,
    path: "/ipos-terminal/:id?",
    exact: true,
  },
];
export default BusinessRoutes;
