import React from "react";
import CustomCard from "@shared/cards/CustomCard";
import CustomCheckbox from "@inputs/CustomCheckbox";

const checkboxFields = [
  { label: "Sales Person", name: "salesPerson" },
  { label: "Referred By", name: "referredBy" },
  { label: "Campaign", name: "campaign" },
  { label: "Member Since", name: "memberSince" },
  { label: "Sign Date", name: "signDate" },
  { label: "Begin Date", name: "beginDate" },
];

function AgreementPlans({ data, onChange }) {
  return (
    <CustomCard title="Agreement Plan Specifications" size={6}>
      {checkboxFields.map((item) => (
        <CustomCheckbox
          key={item.name}
          label={item.label}
          name={item.name}
          onChange={onChange}
          extraClassName="c-col-12 md:c-col-2"
          col={2}
          checked={data.agreementPlanRequiredFields.includes(item.name)}
        />
      ))}
    </CustomCard>
  );
}

export default React.memo(AgreementPlans);
export { checkboxFields as agreementCheckboxFields };
