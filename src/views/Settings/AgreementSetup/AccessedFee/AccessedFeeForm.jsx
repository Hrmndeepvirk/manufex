import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomInput from "@inputs/CustomInput";
import CustomTextArea from "@inputs/CustomTextArea";
import CustomCheckbox from "@inputs/CustomCheckbox";
import CustomDropdown from "@inputs/CustomDropdown";
import CustomInputDropdown from "@inputs/CustomInputDropdown";
import CustomCurrencyInput from "@inputs/CustomCurrencyInput";
import CustomCalendarInput from "@inputs/CustomCalendarInput";
import CustomPickList from "@inputs/CustomPickList";
import formValidation, { showFormErrors } from "@formValidations";
import {
  AmountUnits,
  daysOptions,
  DeclineDaysOptions,
  preferedDueDay,
} from "@utils/dropdownConstants";
import {
  addOrUpdateAccessedFee,
  getAccessedFee,
} from "@store/settings/agreementSetup/accessedFeeActions";

function AccessedFeeForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    // General
    title: "",
    description: "",
    type: "ANNUAL_FEE", // default dropdown
    profitCenter: "",
    isRecurring: false,
    amount: "",
    isActive: true,

    // Dynamic Discount (default unit FIXED)
    discount1: { value: "", unit: "FIXED" },
    discount2: { value: "", unit: "FIXED" },
    discount3: { value: "", unit: "FIXED" },

    // Preferred Due Date (for ANNUAL_FEE / LATE_FEE / DECLINE_FEE)
    dueDateDeterminedBy: "SPECIFIC_DATE",
    preferredDate: null,
    noOfDays: null,
    catalogItems: [],
    clubs: [],
    membershipPlans: [],
  });

  useEffect(() => {
    if (id) {
      dispatch(
        getAccessedFee(id, setLoading, (res) => {
          setData({
            title: res.title,
            description: res.description,
            type: res.type,
            profitCenter: res.profitCenter,
            amount: res.amount,
            isRecurring: res.isRecurring,
            noOfDays: res.noOfDays,
            dueDateDeterminedBy: res.dueDateDeterminedBy,
            preferredDate: res.preferredDate,
            clubs: res.clubs,
            catalogItems: res.catalogItems,
            discount1: res.discount1,
            discount2: res.discount2,
            discount3: res.discount3,
            isActive: res.isActive,
          });
        }),
      );
    }
  }, [id]);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const ignore = data.type !== "NO_SHOW_FEE" ? ["catalogItems"] : [];
    if (showFormErrors(data, setData, ignore)) {
      dispatch(
        addOrUpdateAccessedFee(id, data, setLoading, (success, formErrors) => {
          if (success) {
            navigate(-1);
          } else {
            setData((prev) => ({ ...prev, formErrors }));
          }
        }),
      );
    }
  };

  return (
    <FormPageLayout
      backText="Assessed Fee"
      onSubmit={handleSubmit}
      submitLoading={loading}
    >
      <CustomCard title="General">
        <CustomInput
          data={data}
          onChange={handleChange}
          name="title"
          required
        />

        <CustomDropdown
          name="type"
          onChange={handleChange}
          optionsType="AccessedFeeTypes"
          data={data}
        />

        <CustomDropdown
          name="profitCenter"
          onChange={handleChange}
          optionsType="profitCenters"
          data={data}
          required
        />
        {(data?.type === "ANNUAL_FEE" || data?.type === "FREEZE_FEE") && (
          <CustomDropdown
            name="isRecurring"
            booleanOptions
            onChange={handleChange}
            data={data}
            label="Is this a recurring item?"
          />
        )}

        <CustomCurrencyInput
          name="amount"
          data={data}
          onChange={handleChange}
        />

        <CustomTextArea
          data={data}
          onChange={handleChange}
          name="description"
        />
        <CustomCheckbox
          data={data}
          onChange={handleChange}
          name="isActive"
          label="Active"
          col={12}
        />
      </CustomCard>

      <CustomCard title="Dynamic Discount">
        <CustomInputDropdown
          name="discount1"
          options={AmountUnits}
          label={"First time discount"}
          onChange={handleChange}
          data={data}
        />
        <CustomInputDropdown
          name="discount2"
          options={AmountUnits}
          label={"Second time discount"}
          onChange={handleChange}
          data={data}
        />
        <CustomInputDropdown
          name="discount3"
          options={AmountUnits}
          label={"Third time discount"}
          onChange={handleChange}
          data={data}
        />
      </CustomCard>

      {data?.type === "ANNUAL_FEE" && (
        <CustomCard title="Preffered Due Date">
          <CustomDropdown
            name="dueDateDeterminedBy"
            label="Choose how the prefered due day will be determined"
            options={preferedDueDay}
            onChange={handleChange}
            data={data}
          />

          {data?.dueDateDeterminedBy === "SPECIFIC_DATE" ? (
            <CustomCalendarInput
              name="preferredDate"
              onChange={handleChange}
              data={data}
            />
          ) : (
            <CustomDropdown
              name="noOfDays"
              options={daysOptions}
              onChange={handleChange}
              data={data}
            />
          )}
        </CustomCard>
      )}

      {(data?.type === "LATE_FEE" || data?.type === "DECLINE_FEE") && (
        <CustomCard col="12" title="Preferred Due Date">
          <CustomDropdown
            name="noOfDays"
            label="Choose how the prefered due day will be determined"
            options={
              data?.type === "LATE_FEE" ? daysOptions : DeclineDaysOptions
            }
            onChange={handleChange}
            data={data}
          />
        </CustomCard>
      )}

      {data?.type === "NO_SHOW_FEE" && (
        <CustomCard col="12" title="Catalouge Items">
          <CustomPickList
            data={data}
            onChange={handleChange}
            name="catalogItems"
            optionsType="catalogItems"
            required
            hideLabel
          />
        </CustomCard>
      )}

      <CustomCard title="Clubs" size={6}>
        <CustomPickList
          data={data}
          onChange={handleChange}
          name="clubs"
          optionsType="clubs"
          required
          hideLabel
        />
      </CustomCard>

      {data?.type === "ANNUAL_FEE" && (
        <CustomCard col="12" title="Membership Plans">
          {/* TODO: add picklist for the the membership plans  */}
        </CustomCard>
      )}
    </FormPageLayout>
  );
}
export default React.memo(AccessedFeeForm);
