import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useResourceRequest } from "../../../../hooks/useResourceRequest";

import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomInput from "@inputs/CustomInput";
import CustomTextArea from "@inputs/CustomTextArea";
import CustomCheckbox from "@inputs/CustomCheckbox";
import CustomDropdown from "@inputs/CustomDropdown";
import formValidation, { showFormErrors } from "@formValidations";
import {
  getDiscount,
  addOrUpdateDiscount,
} from "@store/settings/pointOfSale/discountActions";
import CustomInputDropdown from "../../../../shared/inputs/CustomInputDropdown";
import CustomCalendarInput from "../../../../shared/inputs/CustomCalendarInput";
import CustomMultiSelect from "../../../../shared/inputs/CustomMultiSelect";
import CustomNumberInput from "../../../../shared/inputs/CustomNumberInput";
import AddCatalog from "./AddCatalog";
import AddSalesCode from "./AddSalesCode";

const getIds = (arr) => arr?.map((item) => (typeof item === "string" ? item : item._id)) || [];

const resolveIds = (ids, source) => {
  if (!ids?.length || !source?.length) return [];
  return ids
    .map((id) => {
      if (typeof id === "object" && id._id) return id;
      return source.find((item) => item._id === id);
    })
    .filter(Boolean);
};

const getDiscountAmountError = (amount, unit) => {
  const rawAmount = amount?.value ?? amount;
  if (
    rawAmount === "" ||
    rawAmount === null ||
    rawAmount === undefined ||
    (typeof rawAmount === "string" && rawAmount.trim() === "")
  ) {
    return "Amount is required!";
  }
  const normalizedAmount = Number(rawAmount);
  if (!Number.isFinite(normalizedAmount)) {
    return "Amount is required!";
  }
  if (normalizedAmount < 0) {
    return "Amount cannot be negative!";
  }
  if (unit === "PERCENT" && normalizedAmount > 100) {
    return "Percentage cannot exceed 100%!";
  }
  return "";
};

const buildAmountFormErrors = (state) => {
  const formErrors = {};
  const amountError = getDiscountAmountError(state.amount, state.amount?.unit);
  if (amountError) {
    formErrors.amount = amountError;
  }

  if (state.isMultiItemDiscount) {
    const multiItemDiscountErrors = state.multiItemDiscounts.map((discount) => {
      const rowError = getDiscountAmountError(discount.amount, discount.amount?.unit);
      return rowError ? { amount: rowError } : {};
    });

    if (multiItemDiscountErrors.some((rowError) => Object.keys(rowError).length > 0)) {
      formErrors.multiItemDiscounts = multiItemDiscountErrors;
    }
  }

  return formErrors;
};

function DiscountForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const catalogItems = useSelector(
    (state) => state.settings.inventory.catalogItems
  );
  const employees = useSelector((state) => state.dropdown.employees || []);

  const [loading, setLoading] = useState(false);
  const [rawDiscount, setRawDiscount] = useState(null);
  const [data, setData] = useState({
    title: "",
    description: "",
    discountCode: "",
    amount: {
      value: 0,
      unit: "FIXED",
    },
    availableDiscount: null,
    startDate: "",
    endDate: "",
    indefinite: false,
    canBeCombined: false,
    canCombineDiscountWith: [],
    isThisItemBogo: false,
    bogoItems: [],
    services: [],
    salesCode: [],
    isMultiItemDiscount: false,
    multiItemDiscounts: [
      {
        noOfItems: 0,
        amount: {
          value: 0,
          unit: "FIXED",
        },
      },
    ],
    applyOnSpecificTime: false,
    days: [],
    startTime: "",
    endTime: "",
    availableOnline: false,
    howThisDiscountUsed: "POS",
    limitTotalUse: false,
    totalUse: 0,
    usePerUser: 0,
    isActive: true,
  });

  useEffect(() => {
    if (id) {
      dispatch(
        getDiscount(id, setLoading, (res) => {
          setRawDiscount(res);
          setData({
            title: res.title || "",
            description: res.description || "",
            discountCode: res.discountCode || "",
            amount: res.amount || { value: 0, unit: "FIXED" },
            availableDiscount: res.availableDiscount || null,
            startDate: res.startDate || "",
            endDate: res.endDate || "",
            indefinite: res.indefinite || false,
            canBeCombined: res.canBeCombined || false,
            canCombineDiscountWith: res.canCombineDiscountWith || [],
            isThisItemBogo: res.isThisItemBogo || false,
            bogoItems: resolveIds(res.bogoItems, catalogItems),
            services: resolveIds(res.services, catalogItems),
            salesCode: resolveIds(res.salesCode, employees),
            isMultiItemDiscount: res.isMultiItemDiscount || false,
            multiItemDiscounts: res.multiItemDiscounts || [
              {
                noOfItems: 0,
                amount: {
                  value: 0,
                  unit: "FIXED",
                },
              },
            ],
            applyOnSpecificTime: res.applyOnSpecificTime || false,
            days: res.days || [],
            startTime: res.startTime || "",
            endTime: res.endTime || "",
            availableOnline: res.availableOnline || false,
            howThisDiscountUsed: res.howThisDiscountUsed || "POS",
            limitTotalUse: res.limitTotalUse || false,
            totalUse: res.totalUse || 0,
            usePerUser: res.usePerUser || 0,
            isActive: res.isActive || false,
          });
        })
      );
    }
  }, [id]);

  // Re-resolve catalog items and sales codes once they're loaded in the store
  useEffect(() => {
    if (!rawDiscount) return;
    const updates = {};
    if (catalogItems.length) {
      updates.services = resolveIds(rawDiscount.services, catalogItems);
      updates.bogoItems = resolveIds(rawDiscount.bogoItems, catalogItems);
    }
    if (employees.length) {
      updates.salesCode = resolveIds(rawDiscount.salesCode, employees);
    }
    if (Object.keys(updates).length) {
      setData((prev) => ({ ...prev, ...updates }));
    }
  }, [catalogItems, employees, rawDiscount]);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    if (name === "amount") {
      formErrors = {
        ...formErrors,
        amount: getDiscountAmountError(value, value?.unit),
      };
    }
    if (name === "canBeCombined" && !value) {
      setData((prev) => ({ ...prev, [name]: value, canCombineDiscountWith: [], formErrors }));
    } else {
      setData((prev) => ({ ...prev, [name]: value, formErrors }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let ignoreFields = ["services", "bogoItems", "salesCode", "canCombineDiscountWith"];
    if (data.indefinite) {
      ignoreFields.push("endDate");
    }
    if (!data.applyOnSpecificTime) {
      ignoreFields.push("days");
      ignoreFields.push("startTime");
      ignoreFields.push("endTime");
    }

    if (showFormErrors(data, setData, ignoreFields)) {
      const amountErrors = buildAmountFormErrors(data);
      if (Object.keys(amountErrors).length > 0) {
        setData((prev) => ({
          ...prev,
          formErrors: {
            ...prev.formErrors,
            ...amountErrors,
          },
        }));
        return;
      }

      const payload = {
        ...data,
        services: getIds(data.services),
        bogoItems: getIds(data.bogoItems),
        salesCode: getIds(data.salesCode),
      };
      dispatch(
        addOrUpdateDiscount(id, payload, setLoading, (success, formErrors) => {
          if (success) {
            navigate(-1);
          } else {
            setData((prev) => ({ ...prev, formErrors }));
          }
        })
      );
    }
  };

  const handleAdd = () => {
    const newDiscount = {
      noOfItems: 0,
      amount: {
        value: 0,
        unit: "FIXED",
      },
    };
    setData((prevData) => ({
      ...prevData,
      multiItemDiscounts: [...prevData.multiItemDiscounts, newDiscount],
    }));
  };

  const handleRemove = (indexToRemove) => {
    setData((prevData) => ({
      ...prevData,
      multiItemDiscounts: prevData.multiItemDiscounts.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const handleMultiItemDiscountChange = (index, { name, value }) => {
    setData((prev) => {
      const updatedDiscounts = prev.multiItemDiscounts.map((discount, idx) => {
        if (idx === index) {
          return { ...discount, [name]: value };
        }
        return discount;
      });

      const nextFormErrors = { ...(prev.formErrors || {}) };
      if (name === "amount") {
        const rowErrors = [...(nextFormErrors.multiItemDiscounts || [])];
        rowErrors[index] = {
          ...(rowErrors[index] || {}),
          amount: getDiscountAmountError(value, value?.unit),
        };
        nextFormErrors.multiItemDiscounts = rowErrors;
      }

      return { ...prev, multiItemDiscounts: updatedDiscounts, formErrors: nextFormErrors };
    });
  };


  const { buttons } = useResourceRequest({
    permission: "REQUEST-DISCOUNTS",
    targetCollection: "DISCOUNT",
    id,
    data,
    setData,
    ignore: (d) => {
      const list = ["services", "bogoItems", "salesCode", "canCombineDiscountWith"];
      if (d.indefinite) list.push("endDate");
      if (!d.applyOnSpecificTime) list.push("days", "startTime", "endTime");
      return list;
    },
    buildChangedData: (d) => {
      const { formErrors: _f, ...rest } = d;
      return {
        ...rest,
        services: getIds(d.services),
        bogoItems: getIds(d.bogoItems),
        salesCode: getIds(d.salesCode),
      };
    },
  });

  return (
    <FormPageLayout
      buttons={buttons}
      backText="Discount"
      onSubmit={handleSubmit}
      submitLoading={loading}
    >
      <CustomCard title="Discount Details">
        <CustomInput
          data={data}
          onChange={handleChange}
          name="title"
          required
        />
        <CustomInput
          data={data}
          onChange={handleChange}
          name="discountCode"
          required
        />
        <CustomInputDropdown
          data={data}
          onChange={handleChange}
          name="amount"
          optionsType="AmountUnits"
          required
          type="number"
          min={0}
          step="0.01"
          max={data?.amount?.unit === "PERCENT" ? 100 : undefined}
          errorMessage={data?.formErrors?.amount}
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="availableDiscount"
        />
        <CustomCalendarInput
          data={data}
          onChange={handleChange}
          name="startDate"
          dateString
          col={data?.indefinite ? 4 : 3}
          required
        />
        {!data?.indefinite && (
          <CustomCalendarInput
            data={data}
            onChange={handleChange}
            name="endDate"
            dateString
            col={data?.indefinite ? 4 : 3}
            required
          />
        )}
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="indefinite"
          label="No End Date"
          booleanOptions
          col={data?.indefinite ? 4 : 2}
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="canBeCombined"
          booleanOptions
          label="Can be combined with other discounts?"
        />
        {data?.canBeCombined && (
          <CustomMultiSelect
            data={data}
            onChange={handleChange}
            name="canCombineDiscountWith"
            optionsType="discounts"
          />
        )}
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="isThisItemBogo"
          booleanOptions
        />
        <CustomCheckbox
          data={data}
          onChange={handleChange}
          name="isMultiItemDiscount"
          label="Multi-Item Discount?"
          col={12}
        />
        {data?.isMultiItemDiscount && (
          <>
            {data?.multiItemDiscounts?.map((discount, index) => (
              <>
                <CustomNumberInput
                  data={discount}
                  onChange={(e) => handleMultiItemDiscountChange(index, e)}
                  name="noOfItems"
                  required
                />
                <CustomInputDropdown
                  data={discount}
                  onChange={(e) => handleMultiItemDiscountChange(index, e)}
                  name="amount"
                  optionsType="AmountUnits"
                  required
                  type="number"
                  min={0}
                  step="0.01"
                  max={discount?.amount?.unit === "PERCENT" ? 100 : undefined}
                  errorMessage={data?.formErrors?.multiItemDiscounts?.[index]?.amount}
                />
                <div className="col-4">
                  {index ? (
                    <i
                      className="pi pi-minus-circle mt-3 cursor-pointer"
                      onClick={() => handleRemove(index)}
                    ></i>
                  ) : (
                    <i
                      className="pi pi-plus-circle mt-3 cursor-pointer"
                      onClick={handleAdd}
                    ></i>
                  )}
                </div>
              </>
            ))}
          </>
        )}
        <CustomCheckbox
          data={data}
          onChange={handleChange}
          name="applyOnSpecificTime"
          label="Apply on specific days and time?"
          col={12}
        />
        {data?.applyOnSpecificTime && (
          <>
            <CustomMultiSelect
              data={data}
              onChange={handleChange}
              name="days"
              optionsType="WeekDays"
              required
            />
            <CustomCalendarInput
              data={data}
              onChange={handleChange}
              name="startTime"
              timeOnly
              required
            />
            <CustomCalendarInput
              data={data}
              onChange={handleChange}
              name="endTime"
              timeOnly
              required
            />
          </>
        )}
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="availableOnline"
          label="Available Online?"
          booleanOptions
          col={3}
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="howThisDiscountUsed"
          label="How is this discount used?"
          optionsType="DiscountUsedIn"
          col={3}
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="limitTotalUse"
          booleanOptions
          label="Limit total uses?"
          col={2}
        />
        {data?.limitTotalUse && (
          <>
            <CustomNumberInput
              data={data}
              onChange={handleChange}
              name="totalUse"
              col={2}
            />
            <CustomNumberInput
              data={data}
              onChange={handleChange}
              name="usePerUser"
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
        />
      </CustomCard>

      <AddCatalog
        data={data}
        onChange={handleChange}
        name="services"
        label="Catalog Items"
      />
      {data?.isThisItemBogo && (
        <AddCatalog
          data={data}
          onChange={handleChange}
          name="bogoItems"
          label="BOGO Catalog Items"
        />
      )}
      <AddSalesCode
        data={data}
        onChange={handleChange}
        name="salesCode"
        label="Sales Code"
      />
    </FormPageLayout>
  );
}
export default React.memo(DiscountForm);
