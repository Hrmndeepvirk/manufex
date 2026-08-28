import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useResourceRequest } from "../../../../hooks/useResourceRequest";
import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomInput from "@inputs/CustomInput";
import CustomTextArea from "@inputs/CustomTextArea";
import CustomCheckbox from "@inputs/CustomCheckbox";
import CustomDropdown from "@inputs/CustomDropdown";
import CustomInputDropdown from "@inputs/CustomInputDropdown";
import CustomNumberInput from "@inputs/CustomNumberInput";
import ServiceSelection from "../../Common/ServiceSelection";
import CustomCalendarInput from "@inputs/CustomCalendarInput";
import CustomPickList from "@inputs/CustomPickList";
import formValidation, { showFormErrors } from "@formValidations";
import {
  AgreementTypeIntervals,
  AutoPayOptionsTypes,
  howOftenClientsWillBeChargedOptions,
  whatHappensAfterAutopayPaymentsTypes,
  WhenWillClientsBeCharged,
} from "@utils/dropdownConstants";
import CustomEditor from "@inputs/CustomEditor";
import {
  addOrUpdateAgreementPlan,
  getAgreementPlan,
} from "@store/settings/agreementSetup/agreementPlanActions";

function AgreementPlanForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const agreementCategories = useSelector(
    (state) => state.dropdown.agreementCategories,
  );

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  const [data, setData] = useState({
    title: "",
    category: null,
    subCategory: null,
    club: null,
    membershipType: null,
    agreementTemplate: null,
    isOneTimePlan: true,

    // These special fields will store objects { value, unit }
    reavailableAfter: { value: "", unit: "YEAR" },
    freezingTerm: { value: "", unit: "MONTH" },
    freezingTermPer: { value: "", unit: "YEAR" },
    cancellingTerm: { value: "", unit: "MONTH" },

    services: [],
    assessedFee: [],

    // Contract Options
    autoPay: "ON_SET_SCHEDULE",
    howOftenWillClientsBeCharged: "UNTIL_CANCEL",
    timePeriod: 1,
    interval: "MONTH",
    whenWillClientsBeCharged: "ON_SALE_DATE",
    date: null,
    noOfAutopays: "",
    whatHappensAfterAutopayPayments: "CONTRACT_EXPIRES",

    // Online section
    sellOnline: false,
    onlineDescription: "",

    // Status
    isActive: true,
  });

  useEffect(() => {
    if (id) {
      dispatch(
        getAgreementPlan(id, setPageLoading, (res) => {
          setData({
            title: res.title || "",
            category: res.category || null,
            subCategory: res.subCategory || null,
            description: res.description,
            club: res.club || null,
            membershipType: res.membershipType || null,
            agreementTemplate: res.agreementTemplate || null,
            isOneTimePlan: res.isOneTimePlan ?? true,

            reavailableAfter: res.reavailableAfter || {
              value: "",
              unit: "YEAR",
            },
            freezingTerm: res.freezingTerm || { value: "", unit: "MONTH" },
            freezingTermPer: res.freezingTermPer || { value: "", unit: "YEAR" },
            cancellingTerm: res.cancellingTerm || { value: "", unit: "MONTH" },

            services: res.services || [],
            assessedFee: res.assessedFee || [],

            autoPay: res.autoPay || "ON_SET_SCHEDULE",
            howOftenWillClientsBeCharged:
              res.howOftenWillClientsBeCharged || "UNTIL_CANCEL",
            timePeriod: res.timePeriod || "",
            interval: res.interval || "MONTH",
            whenWillClientsBeCharged:
              res.whenWillClientsBeCharged || "ON_SALE_DATE",
            date: res.date || null,
            noOfAutopays: res.noOfAutopays || "",
            whatHappensAfterAutopayPayments:
              res.whatHappensAfterAutopayPayments || "CONTRACT_EXPIRES",

            sellOnline: res.sellOnline ?? false,
            onlineDescription: res.onlineDescription || "",
            isActive: res.isActive ?? true,
          });
        }),
      );
    }
  }, [id]);

  const _subCategoryOptions = useMemo(() => {
    if (!data.category) return [];
    const selected = agreementCategories.find((c) => c._id === data.category);
    if (!selected?.subCategories?.length) return [];
    return selected.subCategories.map((sc) => ({ _id: sc, title: sc }));
  }, [data.category, agreementCategories]);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    if (name === "category") {
      setData((prev) => ({ ...prev, [name]: value, subCategory: null, formErrors }));
      return;
    }
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      dispatch(
        addOrUpdateAgreementPlan(
          id,
          data,
          setLoading,
          (success, formErrors) => {
            if (success) {
              navigate(-1);
            } else {
              setData((prev) => ({ ...prev, formErrors }));
            }
          },
        ),
      );
    }
  };


  const { buttons } = useResourceRequest({
    permission: "REQUEST-PAYMENT-PLANS-TYPE",
    targetCollection: "AGREEMENT_PLAN",
    id,
    data,
    setData,
  });

  return (
    <FormPageLayout
      buttons={buttons}
      backText="Agreement Plan"
      onSubmit={handleSubmit}
      submitLoading={loading}
      pageLoading={pageLoading}
    >
      <CustomCard title="General">
        <CustomInput
          data={data}
          onChange={handleChange}
          name="title"
          required
        />
        <CustomDropdown
          name="category"
          optionsType={"agreementCategories"}
          onChange={handleChange}
          data={data}
          required
        />
        <CustomDropdown
          name="subCategory"
          options={_subCategoryOptions}
          onChange={handleChange}
          data={data}
        />
        <CustomDropdown
          name="club"
          optionsType={"clubs"}
          onChange={handleChange}
          data={data}
          required
        />
        <CustomDropdown
          name="membershipType"
          optionsType={"membershipTypes"}
          onChange={handleChange}
          data={data}
          required
        />
        <CustomDropdown
          name="agreementTemplate"
          optionsType={"agreementTemplates"}
          onChange={handleChange}
          data={data}
          required
        />
        <CustomDropdown
          name="isOneTimePlan"
          booleanOptions
          onChange={handleChange}
          data={data}
        />
        {data?.isOneTimePlan && (
          <CustomInputDropdown
            name="reavailableAfter"
            options={AgreementTypeIntervals}
            onChange={handleChange}
            data={data}
          />
        )}
        <CustomInputDropdown
          name="freezingTerm"
          options={AgreementTypeIntervals}
          onChange={handleChange}
          data={data}
        />{" "}
        <CustomInputDropdown
          name="freezingTermPer"
          options={AgreementTypeIntervals}
          onChange={handleChange}
          data={data}
        />
        <CustomInputDropdown
          name="cancellingTerm"
          options={AgreementTypeIntervals}
          onChange={handleChange}
          data={data}
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

      <ServiceSelection
        initialServices={data.services}
        onServicesChange={(services) =>
          handleChange({ name: "services", value: services })
        }
        errorMessage={data?.formErrors?.services}
      />

      <CustomCard title="Assessed Fee">
        <CustomPickList
          data={data}
          onChange={handleChange}
          name="assessedFee"
          optionsType="assessedFees"
          required
          hideLabel
        />
      </CustomCard>

      <CustomCard title="Contract Options" size={6}>
        <CustomDropdown
          name="autoPay"
          options={AutoPayOptionsTypes}
          onChange={handleChange}
          data={data}
        />

        {data?.autoPay === "ON_SET_SCHEDULE" && (
          <>
            <CustomDropdown
              name="howOftenWillClientsBeCharged"
              options={howOftenClientsWillBeChargedOptions}
              onChange={handleChange}
              data={data}
            />
            <CustomDropdown
              name="interval"
              options={AgreementTypeIntervals}
              onChange={handleChange}
              data={data}
              col={2}
            />
            <CustomNumberInput
              name="timePeriod"
              onChange={handleChange}
              suffix={data?.interval?.toLowerCase()}
              data={data}
              col={2}
            />
            {data?.howOftenWillClientsBeCharged === "NO_OF_AUTOPAYS" && (
              <CustomNumberInput
                name="noOfAutopays"
                onChange={handleChange}
                data={data}
              />
            )}

            <>
              <CustomDropdown
                name="whenWillClientsBeCharged"
                options={WhenWillClientsBeCharged}
                onChange={handleChange}
                data={data}
              />

              {data?.whenWillClientsBeCharged === "SPECIFIC_DATE" && (
                <CustomCalendarInput
                  name="date"
                  data={data}
                  onChange={handleChange}
                />
              )}
              {data?.howOftenWillClientsBeCharged === "NO_OF_AUTOPAYS" && (
                <CustomDropdown
                  name="whatHappensAfterAutopayPayments"
                  options={whatHappensAfterAutopayPaymentsTypes}
                  onChange={handleChange}
                  data={data}
                />
              )}
            </>
          </>
        )}

        <CustomDropdown
          name="sellOnline"
          booleanOptions
          onChange={handleChange}
          data={data}
        />

        {data?.sellOnline && (
          <CustomEditor
            name="onlineDescription"
            onTextChange={handleChange}
            data={data}
          />
        )}
      </CustomCard>
    </FormPageLayout>
  );
}

export default React.memo(AgreementPlanForm);
