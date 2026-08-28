import React from "react";
import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomInput from "@inputs/CustomInput";
import CustomPhoneInput from "@inputs/CustomPhoneInput";
import CustomDropdown from "@inputs/CustomDropdown";
import CustomNumberInput from "@inputs/CustomNumberInput";
import CustomCalendarInput from "@inputs/CustomCalendarInput";
import CustomAddress from "@inputs/CustomAddress";
import formValidation from "@formValidations";
import CustomImageInput from "@shared/inputs/CustomImageInput";

import { useSellPlan } from "./SellPlanContext";
import { substractYears } from "../../../../utils/dateTime";

function PersonalForm() {
  const {
    isPersonalDetailsValid,
    memberLoading,
    memberData,
    setMemberData,
    onCancel,
    goNext,
  } = useSellPlan();

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, memberData);
    setMemberData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleNext = () => {
    if (isPersonalDetailsValid()) {
      goNext(1, "agreement");
    }
  };

  return (
    <FormPageLayout
      noPadding
      backText="Plans"
      submitLabel="Next"
      onSubmit={handleNext}
      onCancel={onCancel}
      pageLoading={memberLoading}
    >
      <CustomCard title="Personal">
        <CustomImageInput
          name="image"
          data={memberData}
          onChange={handleChange}
          required
        />

        <CustomNumberInput
          data={memberData}
          onChange={handleChange}
          name="barCode"
          required
          useGrouping={false}
        />
        <CustomInput
          data={memberData}
          onChange={handleChange}
          name="firstName"
          required
        />

        <CustomInput
          data={memberData}
          onChange={handleChange}
          name="lastName"
          required
        />
        <CustomDropdown
          data={memberData}
          onChange={handleChange}
          name="gender"
          required
          optionsType={"GenderTypes"}
        />
        <CustomCalendarInput
          data={memberData}
          onChange={handleChange}
          name="dob"
          dateString
          maxDate={substractYears(10)}
          minDate={substractYears(100)}
          required
        />

        <CustomInput
          data={memberData}
          onChange={handleChange}
          name="email"
          required
        />
        <CustomPhoneInput
          data={memberData}
          onChange={handleChange}
          name="primaryPhone"
          required
        />
        <CustomAddress
          data={memberData}
          onChange={handleChange}
          name="address"
          required
          col={12}
        />
      </CustomCard>

      <CustomCard title="Emergency Contact">
        <CustomInput
          data={memberData}
          onChange={handleChange}
          name="emergencyContactName"
          label={"Emergency Contact Name"}
          required
        />

        <CustomInput
          name="emergencyContactNumber"
          label="Emergency Contact Number"
          data={memberData}
          onChange={handleChange}
          required
        />
      </CustomCard>
    </FormPageLayout>
  );
}
export default React.memo(PersonalForm);
