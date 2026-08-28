import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomInput from "@inputs/CustomInput";
import CustomPhoneInput from "@inputs/CustomPhoneInput";

import formValidation, { showFormErrors } from "@formValidations";
import sanitizeInput from "@utils/inputSanitizer";

import { updateCompany } from "@store/settings/business/companyActions";
import CustomDropdown from "@shared/inputs/CustomDropdown";
import { TimeZones } from "@utils/dropdownConstants";
import { Currencies } from "../../../../utils/dropdownConstants";

function CompanyForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const company = useSelector((state) => state.settings.business.company);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    legalName: "",
    name: "",
    shortName: "",
    timeZone: "",
    multiClubInOut: false,
    clockInDepartmentRequired: false,
    currency: null,
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    primaryEmail: "",
    alternateEmail: "",
    workNumber: "",
    workExtention: "",
    faxNumber: "",
    companyUrl: "",
    companyCode: "",
    batchId: "",
    retryOffsetDays: 1,
    maxRetries: 3,
  });

  useEffect(() => {
    if (company) {
      setData({
        legalName: company.legalName || "",
        name: company.name || "",
        shortName: company.shortName || "",
        timeZone: company.timeZone || "",
        multiClubInOut: company.multiClubInOut || false,
        clockInDepartmentRequired: company.clockInDepartmentRequired || false,
        addressLine1: company.addressLine1 || "",
        addressLine2: company.addressLine2 || "",
        city: company.city || "",
        state: company.state || "",
        country: company.country || "",
        zipCode: company.zipCode || "",
        primaryEmail: company.primaryEmail || "",
        alternateEmail: company.alternateEmail || "",
        workNumber: company.workNumber || "",
        workExtention: company.workExtention || "",
        faxNumber: company.faxNumber || "",
        companyUrl: company.companyUrl || "",
        companyCode: company.companyCode || "",
        batchId: company.batchId || "",
        retryOffsetDays: company.billingSettings?.retryOffsetDays ?? 1,
        maxRetries: company.billingSettings?.maxRetries ?? 3,
        currency: company?.currency?.code || "USD",
      });
    }
  }, [company]);

  const handleChange = ({ name, value }) => {
    value = sanitizeInput(name, value);
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      let payload = { ...data };
      payload.currency = Currencies.find((cur) => cur.code === data.currency);
      payload.billingSettings = {
        retryOffsetDays: data.retryOffsetDays,
        maxRetries: data.maxRetries,
      };

      dispatch(
        updateCompany(payload, setLoading, (success, formErrors) => {
          if (success) {
            navigate(-1);
          } else {
            setData((prev) => ({ ...prev, formErrors }));
          }
        })
      );
    }
  };

  return (
    <FormPageLayout
      backText="Company Details"
      onSubmit={handleSubmit}
      submitLoading={loading}
      
    >
      <CustomCard title="General Details" size={6}>
        <CustomInput
          data={data}
          onChange={handleChange}
          name="legalName"
          required
        />
        <CustomInput data={data} onChange={handleChange} name="name" required />
        <CustomInput
          data={data}
          onChange={handleChange}
          name="shortName"
          required
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="timeZone"
          options={TimeZones}
          helpText="Changing time zone here will affect all cron jobs."
          required
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="multiClubInOut"
          label="Allow Multi-Club Clock In/Out"
          booleanOptions
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="clockInDepartmentRequired"
          booleanOptions
        />
        <CustomInput
          data={data}
          onChange={handleChange}
          name="taxId"
          required
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="currency"
          optionsType="Currencies"
        />
      </CustomCard>

      <CustomCard title="Address" size={6}>
        <CustomInput
          data={data}
          onChange={handleChange}
          name="addressLine1"
          required
        />
        <CustomInput data={data} onChange={handleChange} name="addressLine2" />
        <CustomInput data={data} onChange={handleChange} name="city" required />
        <CustomInput
          data={data}
          onChange={handleChange}
          name="state"
          required
        />
        <CustomInput
          data={data}
          onChange={handleChange}
          name="country"
          required
        />
        <CustomInput
          data={data}
          onChange={handleChange}
          name="zipCode"
          required
        />
      </CustomCard>
      <CustomCard title="Contact Information" size={6}>
        <CustomInput
          data={data}
          onChange={handleChange}
          name="primaryEmail"
          required
        />
        <CustomInput
          data={data}
          onChange={handleChange}
          name="alternateEmail"
        />
        <CustomPhoneInput data={data} onChange={handleChange} name="workNumber" />
        <CustomInput data={data} onChange={handleChange} name="workExtention" />
        <CustomInput data={data} onChange={handleChange} name="faxNumber" />
        <CustomInput data={data} onChange={handleChange} name="companyUrl" />
      </CustomCard>
      <CustomCard title="Data Export" size={6}>
        <CustomInput data={data} onChange={handleChange} name="companyCode" />
        <CustomInput data={data} onChange={handleChange} name="batchId" />
        <CustomInput
          data={data}
          onChange={handleChange}
          name="retryOffsetDays"
          label="Retry Offset Days"
          keyfilter="int"
        />
        <CustomInput
          data={data}
          onChange={handleChange}
          name="maxRetries"
          label="Max Retries"
          keyfilter="int"
        />
      </CustomCard>
    </FormPageLayout>
  );
}
export default React.memo(CompanyForm);
