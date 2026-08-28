import React from "react";
import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomDropdown from "@inputs/CustomDropdown";
import CustomCalendarInput from "@inputs/CustomCalendarInput";
import { requiredFieldsValidation, showFormErrors } from "@formValidations";
import Service from "../../common/Service";
import AccessedFee from "../../common/AccessedFee";
import CustomListItem from "@shared/cards/CustomListItem";
import { useSellPlan } from "./SellPlanContext";

function AgreementForm({}) {
  const {
    // getServerDate,
    membershipType,
    isAgreementDetailsValid,
    planLoading,
    planData,
    agreementData,
    setAgreementData,
    onCancel,
    goNext,
    agreementRequiredFields,
  } = useSellPlan();

  const handleChange = ({ name, value }) => {
    let formErrors = requiredFieldsValidation(
      name,
      value,
      agreementData,
      agreementRequiredFields,
    );
    setAgreementData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleNext = () => {
    if (isAgreementDetailsValid()) {
      goNext(2, "payment-amount");
    }
  };

  const isRequired = (name) => agreementRequiredFields.includes(name);

  return (
    <FormPageLayout
      noPadding
      backText="Plans"
      submitLabel="Next"
      onSubmit={handleNext}
      onCancel={onCancel}
      pageLoading={planLoading}
    >
      <CustomCard title="Membership">
        <CustomListItem data={agreementData} name="" label="Agreement Number" />
        <CustomListItem data={planData} name="club" />
        <CustomListItem
          data={membershipType}
          name="title"
          label="Membership Type"
        />
        <CustomListItem
          data={planData}
          name="billingFrequency"
          label="How often will clients be charged"
        />
      </CustomCard>

      <CustomCard title="Sales Information">
        <CustomDropdown
          name="salesPerson"
          data={agreementData}
          onChange={handleChange}
          optionsType="employees"
          filter
          required={isRequired("salesPerson")}
          required
        />

        <CustomDropdown
          name="referredBy"
          data={agreementData}
          onChange={handleChange}
          optionsType={"members"}
          filter
          required={isRequired("referredBy")}
        />

        <CustomDropdown
          name="campaign"
          data={agreementData}
          onChange={handleChange}
          optionsType="campaigns"
          filter
          required={isRequired("campaign")}
          required
        />
      </CustomCard>
      <CustomCard title="Dates">
        <CustomCalendarInput
          name="memberSince"
          data={agreementData}
          disabled
          onChange={handleChange}
        />
        <CustomCalendarInput
          name="signDate"
          data={agreementData}
          onChange={handleChange}
          // minDate={getServerDate()}
          required={isRequired("signDate")}
        />
        <CustomCalendarInput
          name="beginDate"
          data={agreementData}
          onChange={handleChange}
          // minDate={getServerDate()}
          required={isRequired("beginDate")}
        />
      </CustomCard>
      <CustomCard title="Services">
        <Service
          agreementInfo={agreementData}
          setAgreementInfo={setAgreementData}
        />
      </CustomCard>
      <CustomCard title="Accessed Fees">
        <AccessedFee
          agreementInfo={agreementData}
          setAgreementInfo={setAgreementData}
        />
      </CustomCard>
    </FormPageLayout>
  );
}

export default React.memo(AgreementForm);
