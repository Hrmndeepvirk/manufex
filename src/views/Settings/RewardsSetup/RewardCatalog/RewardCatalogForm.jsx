import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomInput from "@inputs/CustomInput";
import CustomTextArea from "@inputs/CustomTextArea";
import CustomCheckbox from "@inputs/CustomCheckbox";
import CustomDropdown from "@inputs/CustomDropdown";
import formValidation, { showFormErrors } from "@formValidations";
import CustomNumberInput from "@inputs/CustomNumberInput";
import CustomMultiSelect from "@inputs/CustomMultiSelect";
import CustomInputDropdown from "@inputs/CustomInputDropdown";
import {
  addOrUpdateRewardsCatalog,
  getRewardsCatalog,
} from "../../../../store/settings/rewards/rewardCatalogActions";

function RewardCatalogForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    points: 0,
    membershipTypes: [],
    posFilterType: "PROFIT_CENTERS",
    profitCenters: [],
    catalogItems: [],
    categories: [],
    canBeRedeemed: "ONE_TIME",
    redeemLimit: {
      value: 1,
      unit: "YEAR",
    },
    isActive: true,
  });

  useEffect(() => {
    if (id) {
      dispatch(
        getRewardsCatalog(id, setPageLoading, (res) => {
          setData({
            title: res.title || "",
            description: res.description || "",
            points: res.points || 0,
            membershipTypes: res.membershipTypes || [],
            posFilterType: res.posFilterType || (res.catalogItems?.length ? "CATALOG_ITEMS" : "PROFIT_CENTERS"),
            profitCenters: res.profitCenters || [],
            catalogItems: res.catalogItems || [],
            categories: res.categories || [],
            canBeRedeemed: res.canBeRedeemed || "ONE_TIME",
            redeemLimit: res.redeemLimit || { value: 1, unit: "YEAR" },
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
    const ignore = ["profitCenters", "catalogItems", "categories"];
    if (showFormErrors(data, setData, ignore)) {
      const { formErrors, ...payload } = data;
      dispatch(
        addOrUpdateRewardsCatalog(
          id,
          payload,
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
      backText="Reward Catalog"
      onSubmit={handleSubmit}
      submitLoading={loading}
      pageLoading={pageLoading}
    >
      <CustomCard title="Reward Catalog Details">
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
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="posFilterType"
          optionsType="PosEarningFilterTypes"
          label="Filter By"
        />
        {data.posFilterType === "PROFIT_CENTERS" && (
          <CustomMultiSelect
            data={data}
            onChange={handleChange}
            name="profitCenters"
            optionsType="profitCenters"
            col={12}
          />
        )}
        {data.posFilterType === "CATALOG_ITEMS" && (
          <CustomMultiSelect
            data={data}
            onChange={handleChange}
            name="catalogItems"
            optionsType="catalogItems"
            col={12}
          />
        )}
        <CustomMultiSelect
          data={data}
          onChange={handleChange}
          name="categories"
          optionsType="catalogCategories"
          col={12}
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="canBeRedeemed"
          optionsType="RewardItemCanBeRedeemedTypes"
        />
        {data?.canBeRedeemed === "MULTIPLE_TIMES" && (
          <CustomInputDropdown
            data={data}
            onChange={handleChange}
            name="redeemLimit"
            label={`Redeem Limit Per ${
              data?.redeemLimit?.unit && data?.redeemLimit?.unit?.toLowerCase()
            }`}
            optionsType="IntervalPerUnitTypes"
            required
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
export default React.memo(RewardCatalogForm);
