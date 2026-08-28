import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomInput from "@inputs/CustomInput";
import CustomTextArea from "@inputs/CustomTextArea";
import CustomCheckbox from "@inputs/CustomCheckbox";
import CustomMultiSelect from "@inputs/CustomMultiSelect";
import CustomDropdown from "@inputs/CustomDropdown";
import CustomPickList from "@inputs/CustomPickList";
import CustomInputDropdown from "@inputs/CustomInputDropdown";
import CustomNumberInput from "@inputs/CustomNumberInput";
import formValidation, { showFormErrors } from "@formValidations";
import {
  getMemberShipTypes,
  addOrUpdateMemberShipType,
  getMemberShipType,
} from "@store/settings/memberSetup/membershipTypeActions";
import { useResourceRequest } from "../../../../hooks/useResourceRequest";
import {
  SpecialRestrictionTypes,
  MaximumDaysAllowedPerTypes,
} from "@utils/dropdownConstants";
import ServiceSelection from "../../Common/ServiceSelection";

function MemberShipTypeForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const existingMembershipTypes = useSelector(
    (state) => state.settings.memberSetup.membership,
  );

  useEffect(() => {
    dispatch(getMemberShipTypes());
  }, [dispatch]);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    isActive: true,
    discount: [],
    services: [],
    accessRestriction: false,
    accessSchedule: null,
    remoteCheckin: false,
    transferToAnotherType: null,
    specialRestrictions: [],
    minimumAgeAllowed: 0,
    maximumAgeAllowed: 0,
    maximumDistanceAllowed: { value: 1, unit: "km" },
    maximumDaysAllowed: 0,
    per: "WEEK",
    clubs: [],
  });

  useEffect(() => {
    if (id) {
      dispatch(
        getMemberShipType(id, setPageLoading, (res) => {
          setData({
            title: res?.title,
            description: res?.description,
            discount: res?.discount,
            accessRestriction: res?.accessRestriction,
            accessSchedule: res?.accessSchedule,
            remoteCheckin: res?.remoteCheckin,
            services: res.services,
            transferToAnotherType: res?.transferToAnotherType,
            specialRestrictions: res?.specialRestrictions,
            minimumAgeAllowed: res?.minimumAgeAllowed,
            maximumAgeAllowed: res?.maximumAgeAllowed,
            maximumDistanceAllowed: res?.maximumDistanceAllowed || {
              value: "",
              unit: "km",
            },
            maximumDaysAllowed: res?.maximumDaysAllowed,
            per: res?.per,
            clubs: res?.clubs,
            isActive: res?.isActive,
          });
        }),
      );
    }
  }, [id]);

  let _ignore = ["services"];

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data, _ignore);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = (e) => {

    e.preventDefault();
    if (showFormErrors(data, setData, _ignore)) {
      dispatch(
        addOrUpdateMemberShipType(
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
    permission: "REQUEST-MEMBERSHIP-TYPES",
    targetCollection: "MEMBERSHIP_TYPE",
    id,
    data,
    setData,
    ignore: _ignore,
  });

  return (
    <FormPageLayout
      backText="Membership Type"
      onSubmit={handleSubmit}
      submitLoading={loading}
      pageLoading={pageLoading}
      buttons={buttons}
    >
      <CustomCard title="Membership Type">
        <CustomInput
          data={data}
          onChange={handleChange}
          name="title"
          required
        />

        <CustomMultiSelect
          name="discount"
          data={data}
          onChange={handleChange}
          optionsType="discounts"
        />

        <CustomDropdown
          name="accessRestriction"
          onChange={handleChange}
          booleanOptions
          data={data}
        />

        {data?.accessRestriction && (
          <CustomDropdown
            name="accessSchedule"
            onChange={handleChange}
            optionsType="accessSchedules"
            data={data}
          />
        )}

        <CustomDropdown
          name="remoteCheckin"
          onChange={handleChange}
          booleanOptions
          data={data}
        />
        <CustomDropdown
          name="transferToAnotherType"
          onChange={handleChange}
          options={existingMembershipTypes}
          data={data}
        />

        {/* need to clarify the club credit amount input field as not stored in backend */}

        <CustomMultiSelect
          name="specialRestrictions"
          data={data}
          onChange={handleChange}
          options={SpecialRestrictionTypes}
        />
        {(data?.specialRestrictions ?? []).includes("BY_AGE") && (
          <>
            <CustomNumberInput
              name="minimumAgeAllowed"
              data={data}
              onChange={handleChange}
              min={0}
              max={data?.maximumAgeAllowed && data?.maximumAgeAllowed}
              useGrouping={false}
            />
            <CustomNumberInput
              name="maximumAgeAllowed"
              data={data}
              onChange={handleChange}
              max={100}
              useGrouping={false}
            />
          </>
        )}
        {(data?.specialRestrictions ?? []).includes("BY_LOCATION") && (
          <>
            <CustomInputDropdown
              name="maximumDistanceAllowed"
              options={[
                {
                  _id: "km",
                  title: "Km",
                },
                {
                  _id: "miles",
                  title: "Miles",
                },
              ]}
              onChange={handleChange}
              keyfilter="pnum"
              data={data}
            />
          </>
        )}
        {(data?.specialRestrictions ?? []).includes("BY_DAYS") && (
          <>
            <CustomNumberInput
              name="maximumDaysAllowed"
              data={data}
              onChange={handleChange}
              col={2}
            />
            <CustomDropdown
              name="per"
              options={MaximumDaysAllowedPerTypes}
              onChange={handleChange}
              data={data}
              col={2}
            />
          </>
        )}

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
      <ServiceSelection
        initialServices={data.services}
        onServicesChange={(services) => {
          console.log("services==>", services);

          handleChange({ name: "services", value: services });
        }}
        errorMessage={data?.formErrors?.services}
      />
 
    </FormPageLayout>
  );
}
export default React.memo(MemberShipTypeForm);
