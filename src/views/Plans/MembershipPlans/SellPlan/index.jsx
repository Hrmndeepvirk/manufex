import React from "react";
import { SellPlanProvider, useSellPlan } from "./SellPlanContext";
import CustomTabView from "@shared/tabView/CustomTabView";
import PlanForm from "./PlanForm";
import PersonalForm from "./PersonalForm";
import AgreementForm from "./AgreementForm";
import PaymentAmount from "./PaymentAmounts";
import BillingInfo from "./BillingInfo";

function SellPlan() {
  const tabs = [
    {
      title: "Plan",
      content: <PlanForm />,
    },
    {
      title: "Personal",
      content: <PersonalForm />,
    },
    {
      title: "Agreement",
      content: <AgreementForm />,
    },
    {
      title: "Payment Amount",
      content: <PaymentAmount />,
    },
    {
      title: "Billing Info",
      content: <BillingInfo />,
    },
  ];

  return (
    <SellPlanProvider>
      <CustomTabView tabs={tabs} />
    </SellPlanProvider>
  );
}
export default React.memo(SellPlan);
