import React, { useState } from "react";
import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomListItem from "@shared/cards/CustomListItem";
import CustomDropdown from "@inputs/CustomDropdown";
import { useSellPlan } from "./SellPlanContext";

function PlanForm({}) {
  const {
    membershipType,
    hasAgeRestriction,
    hasLocationRestriction,
    planData,
    planLoading,
    selectedMember,
    setSelectedMember,
    reavailabilityWarning,
    onCancel,
    goNext,
  } = useSellPlan();

  const [error, setError] = useState({});

  const handleNext = () => {
    const formErrors = {};
    if (!selectedMember) {
      formErrors.selectedMember = "Member is required!";
    }
    if (Object.keys(formErrors).length > 0) {
      setError(formErrors);
      return;
    }
    setError({});
    goNext(0, "personal");
  };

  return (
    <FormPageLayout
      noPadding
      backText="Plans"
      onCancel={onCancel}
      submitLabel="Next"
      onSubmit={handleNext}
      pageLoading={planLoading}
    >
      {reavailabilityWarning && (
        <div className="c-col-12">
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
            <i
              className="pi pi-exclamation-triangle"
              style={{ color: "var(--color-warning)" }}
            />
            <span>{reavailabilityWarning}</span>
          </div>
        </div>
      )}
      <CustomDropdown
        placeholder="Select Member"
        value={selectedMember}
        onChange={(e) => {
          setSelectedMember(e.value);
          setError({});
        }}
        errorMessage={error.selectedMember}
        optionsType={"members"}
        filter
        hideLabel
      />
      <CustomCard title="Plan Details" size={12}>
        <CustomListItem data={planData} name="title" label="Name" />
        <CustomListItem
          data={membershipType}
          name="title"
          label="Membership Type"
        />
        <CustomListItem data={planData} name="billingFrequency" label="Billing Frequency" />
        {(() => {
          const addOns = [
            ...planData.agreementServices,
            ...(planData.membershipType?.services || []),
          ];
          return addOns.length > 0 ? (
            <CustomListItem
              data={planData}l
              name=""
              value={addOns.map((s) => s.title).join(", ")}
              label="Add-ons"
            />
          ) : null;
        })()}
        {planData?.assessedFees?.length > 0 && (
          <CustomListItem
            data={planData}
            name="assessedFees"
            value={planData.assessedFees.map((fee) => fee.title).join(", ")}
            label="Club's Accessed Fees"
          />
        )}
        <>
          {hasAgeRestriction && (
            <CustomListItem
              label="Special Restrictions (Age)"
              value={`Between ${membershipType?.minimumAgeAllowed} years to ${
                membershipType?.maximumAgeAllowed
              } years`}
            />
          )}
          {hasLocationRestriction && (
            <CustomListItem
              label="Special Restrictions (Location)"
              value={`Within ${membershipType?.maximumDistanceAllowed?.value} ${membershipType?.maximumDistanceAllowed?.unit}`}
            />
          )}
        </>
      </CustomCard>
    </FormPageLayout>
  );
}

export default React.memo(PlanForm);
