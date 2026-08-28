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
import CustomNumberInput from "@inputs/CustomNumberInput";
import PrimaryButton from "@shared/buttons/PrimaryButton";
import formValidation, { showFormErrors } from "@formValidations";
import { getAgreementPlans } from "@store/settings/agreementSetup/agreementPlanActions";
import {
  getGroupPlan,
  addOrUpdateGroupPlan,
} from "@store/settings/agreementSetup/groupPlanActions";

function GroupPlanForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  const agreementPlans = useSelector(
    (state) => state.settings.agreementSetup.agreementPlans,
  );
  const assessedFees = useSelector((state) => state.dropdown.assessedFees);

  const [data, setData] = useState({
    title: "",
    description: "",
    agreementPlans: [],
    planDiscounts: [],
    planFees: {},
    isActive: true,
  });

  useEffect(() => {
    dispatch(getAgreementPlans());
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(
        getGroupPlan(id, setPageLoading, (res) => {
          const feesMap = {};
          (res.planFees || []).forEach((item) => {
            feesMap[item.plan] = item.assessedFees || [];
          });
          setData({
            title: res.title || "",
            description: res.description || "",
            agreementPlans: res.agreementPlans || [],
            planDiscounts: (res.planDiscounts || []).map((item) => ({
              planId: item.plan,
              discountType: item.discountType || "FLAT",
              flatAmount: item.flatAmount || 0,
              percentage: item.percentage || 0,
              tiers: item.tiers || [],
            })),
            planFees: feesMap,
            isActive: res.isActive,
          });
        }),
      );
    }
  }, [id]);

  const handleChange = ({ name, value }) => {
    const formErrors = formValidation(name, value, data);
    if (name === "agreementPlans") {
      setData((prev) => ({
        ...prev,
        agreementPlans: value,
        planDiscounts: syncPlanDiscounts(prev.planDiscounts, value),
        planFees: syncPlanFees(prev.planFees, value, agreementPlans),
        formErrors,
      }));
      return;
    }
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const updatePlanDiscount = (planId, updates) => {
    setData((prev) => ({
      ...prev,
      planDiscounts: prev.planDiscounts.map((item) =>
        item.planId === planId ? { ...item, ...updates } : item,
      ),
    }));
  };

  const togglePlanFee = (planId, feeId, checked) => {
    setData((prev) => {
      const existing = prev.planFees?.[planId] || [];
      const next = checked
        ? Array.from(new Set([...existing, feeId]))
        : existing.filter((id) => id !== feeId);
      return {
        ...prev,
        planFees: { ...prev.planFees, [planId]: next },
      };
    });
  };

  const addTier = (planId) => {
    setData((prev) => ({
      ...prev,
      planDiscounts: prev.planDiscounts.map((item) =>
        item.planId === planId
          ? {
              ...item,
              tiers: [
                ...item.tiers,
                { minMembers: 2, type: "PERCENTAGE", value: 0 },
              ],
            }
          : item,
      ),
    }));
  };

  const updateTier = (planId, index, updates) => {
    setData((prev) => ({
      ...prev,
      planDiscounts: prev.planDiscounts.map((item) => {
        if (item.planId !== planId) return item;
        const tiers = [...item.tiers];
        tiers[index] = { ...tiers[index], ...updates };
        return { ...item, tiers };
      }),
    }));
  };

  const removeTier = (planId, index) => {
    setData((prev) => ({
      ...prev,
      planDiscounts: prev.planDiscounts.map((item) => {
        if (item.planId !== planId) return item;
        return { ...item, tiers: item.tiers.filter((_, i) => i !== index) };
      }),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      const payload = {
        title: data.title,
        description: data.description,
        agreementPlans: data.agreementPlans,
        planDiscounts: data.planDiscounts.map((item) => ({
          plan: item.planId,
          discountType: item.discountType,
          flatAmount: item.flatAmount,
          percentage: item.percentage,
          tiers: item.tiers,
        })),
        planFees: Object.entries(data.planFees).map(([planId, fees]) => ({
          plan: planId,
          assessedFees: fees,
        })),
        isActive: data.isActive,
      };
      dispatch(
        addOrUpdateGroupPlan(id, payload, setLoading, (success, formErrors) => {
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
      backText="Group Plan"
      onSubmit={handleSubmit}
      submitLoading={loading}
      pageLoading={pageLoading}
    >
      <CustomCard title="Group Plan Details">
        <CustomInput
          data={data}
          onChange={handleChange}
          name="title"
          required
        />
        <CustomTextArea
          data={data}
          onChange={handleChange}
          name="description"
        />
        <CustomMultiSelect
          data={data}
          onChange={handleChange}
          name="agreementPlans"
          label="Agreement Plans"
          options={agreementPlans}
          required
          col={12}
        />
        {data.agreementPlans.length > 0 && (
          <div className="c-col-12 flex flex-column gap-3">
            {data.agreementPlans.map((planId) => {
              const plan = agreementPlans.find((p) => p._id === planId);
              const discount = data.planDiscounts.find(
                (item) => item.planId === planId,
              );
              const planAssessedFees = normalizeIds(plan?.assessedFee);
              const selectedFees = data.planFees?.[planId] || [];
              return (
                <div
                  key={planId}
                  className="border-1 border-round-md p-3 surface-50"
                >
                  <div className="font-semibold mb-2">
                    {plan?.title || "Agreement Plan"}
                  </div>
                  <CustomDropdown
                    name={`discountType-${planId}`}
                    label="Discount Type"
                    optionsType="GroupPlanDiscountTypes"
                    value={discount?.discountType || "FLAT"}
                    onChange={({ value }) =>
                      updatePlanDiscount(planId, { discountType: value })
                    }
                    col={6}
                  />
                  {discount?.discountType === "FLAT" && (
                    <CustomNumberInput
                      name={`flatAmount-${planId}`}
                      label="Flat Discount"
                      value={discount?.flatAmount || 0}
                      onChange={({ value }) =>
                        updatePlanDiscount(planId, { flatAmount: value })
                      }
                      col={6}
                      prefix="$"
                    />
                  )}
                  {discount?.discountType === "PERCENTAGE" && (
                    <CustomNumberInput
                      name={`percentage-${planId}`}
                      label="Percentage Discount"
                      value={discount?.percentage || 0}
                      onChange={({ value }) =>
                        updatePlanDiscount(planId, { percentage: value })
                      }
                      col={6}
                      suffix="%"
                    />
                  )}
                  {discount?.discountType === "TIERED" && (
                    <div className="c-col-12 flex flex-column gap-2">
                      {discount?.tiers?.map((tier, index) => (
                        <div
                          key={`${planId}-tier-${index}`}
                          className="flex align-items-center gap-2 flex-wrap"
                        >
                          <CustomNumberInput
                            name={`minMembers-${planId}-${index}`}
                            label="Min Members"
                            value={tier.minMembers}
                            onChange={({ value }) =>
                              updateTier(planId, index, { minMembers: value })
                            }
                            col={3}
                          />
                          <CustomDropdown
                            name={`tierType-${planId}-${index}`}
                            label="Type"
                            optionsType="GroupPlanTierTypes"
                            value={tier.type}
                            onChange={({ value }) =>
                              updateTier(planId, index, { type: value })
                            }
                            col={3}
                          />
                          <CustomNumberInput
                            name={`tierValue-${planId}-${index}`}
                            label="Value"
                            value={tier.value}
                            onChange={({ value }) =>
                              updateTier(planId, index, { value })
                            }
                            col={3}
                            prefix={tier.type === "FLAT" ? "$" : undefined}
                            suffix={
                              tier.type === "PERCENTAGE" ? "%" : undefined
                            }
                          />
                          <PrimaryButton
                            icon="pi pi-trash"
                            severity="secondary"
                            onClick={() => removeTier(planId, index)}
                          />
                        </div>
                      ))}
                      <PrimaryButton
                        label="Add Tier"
                        icon="pi pi-plus"
                        severity="secondary"
                        onClick={() => addTier(planId)}
                      />
                    </div>
                  )}
                  {planAssessedFees.length > 0 && (
                    <div className="c-col-12 mt-3">
                      <div className="font-semibold mb-2">Assessed Fees</div>
                      <div className="flex flex-column gap-2">
                        {planAssessedFees.map((feeId) => {
                          const fee = assessedFees.find(
                            (item) => item._id === feeId,
                          );
                          return (
                            <CustomCheckbox
                              key={`${planId}-${feeId}`}
                              name={`fee-${planId}-${feeId}`}
                              label={fee?.title || "Assessed Fee"}
                              value={selectedFees.includes(feeId)}
                              onChange={({ value }) =>
                                togglePlanFee(planId, feeId, value)
                              }
                              col={12}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        <CustomCheckbox
          data={data}
          onChange={handleChange}
          name="isActive"
          label="Active"
          col={12}
        />
      </CustomCard>
    </FormPageLayout>
  );
}

function syncPlanDiscounts(existing, planIds) {
  const current = existing || [];
  const byId = new Map(current.map((item) => [item.planId, item]));
  return (planIds || []).map((planId) => {
    if (byId.has(planId)) return byId.get(planId);
    return {
      planId,
      discountType: "FLAT",
      flatAmount: 0,
      percentage: 0,
      tiers: [],
    };
  });
}

function syncPlanFees(existing, planIds, plans) {
  const current = existing || {};
  const next = {};
  (planIds || []).forEach((planId) => {
    if (current[planId]) {
      next[planId] = current[planId];
      return;
    }
    const plan = plans.find((p) => p._id === planId);
    next[planId] = normalizeIds(plan?.assessedFee);
  });
  return next;
}

function normalizeIds(values) {
  if (!values?.length) return [];
  return values
    .map((item) => (typeof item === "object" ? item?._id : item))
    .filter(Boolean);
}

export default React.memo(GroupPlanForm);
