import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomInput from "@inputs/CustomInput";
import CustomTextArea from "@inputs/CustomTextArea";
import CustomCheckbox from "@inputs/CustomCheckbox";
import CustomDropdown from "@inputs/CustomDropdown";
import formValidation, { showFormErrors } from "@formValidations";
import { TaxRateTypeDropdown } from "@utils/dropdownConstants";
import CustomPickList from "@inputs/CustomPickList";
import CustomNumberInput from "../../../../shared/inputs/CustomNumberInput";
import {
  addOrUpdatePointsEarningRule,
  getPointsEarningRule,
} from "../../../../store/settings/rewards/pointsEarningRuleActions";
import CustomMultiSelect from "../../../../shared/inputs/CustomMultiSelect";
import CustomInputDropdown from "../../../../shared/inputs/CustomInputDropdown";

function PointsEarningRuleForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    points: 0,
    pointsExpiresIn: { value: 365, unit: "DAYS" },
    membershipTypes: [],
    type: "BIRTHDAY",
    triggerOn: "1ST_INSTANCE",
    instanceNumber: 0,
    consecutiveInstances: 0,

    eventType: "CLASS",
    events: [],
    posFilterType: "PROFIT_CENTERS",
    profitCenters: [],
    catalogItems: [],
    isActive: true,
  });

  useEffect(() => {
    if (id) {
      dispatch(
        getPointsEarningRule(id, setPageLoading, (res) => {
          setData({
            title: res.title || "",
            description: res.description || "",
            points: res.points || 0,
            pointsExpiresIn: res.pointsExpiresIn || {
              value: 365,
              unit: "DAYS",
            },
            membershipTypes: res.membershipTypes || [],
            type: res.type || "BIRTHDAY",
            triggerOn: res.triggerOn || "1ST_INSTANCE",
            instanceNumber: res.instanceNumber || 0,
            consecutiveInstances: res.consecutiveInstances || 0,

            eventType: res.eventType || "CLASS",
            events: res.events || [],
            posFilterType: res.posFilterType || (res.catalogItems?.length ? "CATALOG_ITEMS" : "PROFIT_CENTERS"),
            profitCenters: res.profitCenters || [],
            catalogItems: res.catalogItems || [],
            isActive: res.isActive,
          });
        })
      );
    }
  }, [id]);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    let extra = {};
    if (name === "posFilterType") {
      if (value === "PROFIT_CENTERS") extra.catalogItems = [];
      if (value === "CATALOG_ITEMS") extra.profitCenters = [];
    }
    setData((prev) => ({ ...prev, [name]: value, ...extra, formErrors }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const ignore = [];
    if (data.type !== "EVENT") ignore.push("events");
    if (data.type !== "POS_PURCHASE" || data.posFilterType !== "PROFIT_CENTERS") ignore.push("profitCenters");
    if (data.type !== "POS_PURCHASE" || data.posFilterType !== "CATALOG_ITEMS") ignore.push("catalogItems");
    if (data.triggerOn !== "SPECIFIC_INSTANCE") ignore.push("instanceNumber");
    if (data.triggerOn !== "AFTER_CONSECUTIVE_INSTANCES") ignore.push("consecutiveInstances");
    if (showFormErrors(data, setData, ignore)) {
      dispatch(
        addOrUpdatePointsEarningRule(
          id,
          data,
          setLoading,
          (success, formErrors) => {
            if (success) {
              navigate(-1);
            } else {
              setData((prev) => ({ ...prev, formErrors }));
            }
          }
        )
      );
    }
  };

  return (
    <FormPageLayout
      backText="Points Earning Rule"
      onSubmit={handleSubmit}
      submitLoading={loading}
      pageLoading={pageLoading}
    >
      <CustomCard title="Points Earning Rule Details">
        <CustomInput
          data={data}
          onChange={handleChange}
          name="title"
          required
          maxLength={100}
        />
        <CustomNumberInput
          data={data}
          onChange={handleChange}
          name="points"
          required
        />
        <CustomMultiSelect
          data={data}
          onChange={handleChange}
          name="membershipTypes"
          optionsType="membershipTypes"
          label="Applicable Membership Types"
          required={["MEMBERSHIP_RENEW", "MEMBERSHIP_SIGNUP"].includes(
            data.type
          )}
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="type"
          optionsType="PointsEarningTypes"
          required
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="triggerOn"
          optionsType="PointsTriggerOnTypes"
          required
        />
        {data?.triggerOn === "SPECIFIC_INSTANCE" && (
          <CustomNumberInput
            data={data}
            onChange={handleChange}
            name="instanceNumber"
            required
          />
        )}
        {data?.triggerOn === "AFTER_CONSECUTIVE_INSTANCES" && (
          <CustomNumberInput
            data={data}
            onChange={handleChange}
            name="consecutiveInstances"
            label={`After ${
              data.consecutiveInstances > 0 ? data.consecutiveInstances : ""
            } Consecutive Instances`}
            required
          />
        )}
        <CustomInputDropdown
          data={data}
          onChange={handleChange}
          name="pointsExpiresIn"
          optionsType="TimeIntervalTypes"
          required
        />
        {data?.type === "POS_PURCHASE" && (
          <>
            <CustomDropdown
              data={data}
              onChange={handleChange}
              name="posFilterType"
              optionsType="PosEarningFilterTypes"
              label="Filter By"
              required
            />
            {data.posFilterType === "PROFIT_CENTERS" && (
              <CustomMultiSelect
                data={data}
                onChange={handleChange}
                name="profitCenters"
                optionsType="profitCenters"
                required
                col={12}
              />
            )}
            {data.posFilterType === "CATALOG_ITEMS" && (
              <CustomMultiSelect
                data={data}
                onChange={handleChange}
                name="catalogItems"
                optionsType="catalogItems"
                required
                col={12}
              />
            )}
          </>
        )}
        {data?.type === "EVENT" && (
          <CustomMultiSelect
            data={data}
            onChange={handleChange}
            name="events"
            optionsType="eventSetups"
            required
            col={12}
          />
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
        />
      </CustomCard>
    </FormPageLayout>
  );
}
export default React.memo(PointsEarningRuleForm);
