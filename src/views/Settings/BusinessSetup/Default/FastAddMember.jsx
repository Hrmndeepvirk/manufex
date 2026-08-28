import React from "react";
import CustomCard from "@shared/cards/CustomCard";
import CustomCheckbox from "@inputs/CustomCheckbox";

const checkboxFields = [
  { label: "Image", name: "image" },
  { label: "Bar Code", name: "barCode" },
  { label: "Note", name: "note" },
  { label: "First Name", name: "firstName" },
  { label: "MI", name: "MI" },
  { label: "Last Name", name: "lastName" },
  { label: "Gender", name: "gender" },
  { label: "Date of Birth", name: "dob" },
  { label: "Govt Id", name: "govtId" },
  { label: "Primary Number", name: "primaryPhone" },
  { label: "Mobile Number", name: "mobilePhone" },
  { label: "Work Number", name: "workNumber" },
  { label: "Work Ext", name: "workExt" },
  { label: "Address", name: "address" },
  { label: "Lead Priority", name: "leadPriority" },
  { label: "Sales Person", name: "salesPerson" },
  { label: "Campaign", name: "campaign" },
  { label: "Issued On", name: "issuedOn" },
  { label: "Tour On", name: "tourOn" },
  { label: "Start On", name: "startOn" },
  { label: "Begin On", name: "beginOn" },
];

function FastAddMember({ data, onChange }) {
  return (
    <CustomCard title="Fast Add Member Specifications" size={6}>
      {checkboxFields.map((item) => (
        <CustomCheckbox
          key={item.name}
          label={item.label}
          name={item.name}
          onChange={onChange}
          extraClassName="c-col-12 md:c-col-2"
          col={2}
          checked={data.fastAddRequiredFields.includes(item.name)}
        />
      ))}
    </CustomCard>
  );
}

export default React.memo(FastAddMember);
export { checkboxFields };
