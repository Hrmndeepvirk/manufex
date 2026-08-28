import React from "react";

import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomDropdown from "@inputs/CustomDropdown";
import CustomCheckbox from "../../../../shared/inputs/CustomCheckbox";
import PaymentCard from "@shared/cards/PaymentCard";
import { useSellPlan } from "./SellPlanContext";

function BillingInfo() {
  const {
    memberData,
    loading,
    reavailabilityWarning,
    onSubmit,
    data,
    handleCreditChange,
    CardInput,
    validations,
    selectedCard,
    setSelectedCard,
  } = useSellPlan();

  return (
    <FormPageLayout
      noPadding
      backText="Plans"
      submitLoading={loading}
      submitLabel="Submit"
      onSubmit={onSubmit}
    >
      {reavailabilityWarning && (
        <div className="c-col-12" style={{ paddingBottom: "0.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1rem",
              borderRadius: "6px",
              border: "1px solid var(--color-warning)",
              background: "rgba(255, 193, 7, 0.1)",
              color: "var(--text-color-primary)",
            }}
          >
            <i className="pi pi-exclamation-triangle" style={{ color: "var(--color-warning)" }} />
            <span>{reavailabilityWarning}</span>
          </div>
        </div>
      )}
      <CustomCard title="Membership Billing">
        <CustomDropdown name="paymentMethodType" />
        {CardInput({ handleCreditChange, data, validations })}

        <CustomCheckbox label="Enable Card on File" col={12} />
        <CustomCheckbox label="Use Payment Option from Club Account" col={12} />
        {memberData.customerPaymentProfiles.map((item) => (
          <div
            key={item.customerPaymentProfileId}
            className="c-col-12 md:c-col-4"
          >
            <PaymentCard
              data={item}
              value={selectedCard}
              onChange={(e) => setSelectedCard(e.value)}
            />
          </div>
        ))}
      </CustomCard>
    </FormPageLayout>
  );
}
export default React.memo(BillingInfo);
