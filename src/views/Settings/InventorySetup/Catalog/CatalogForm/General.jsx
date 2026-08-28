import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import formValidation, { showFormErrors } from "@formValidations";
import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomInput from "@inputs/CustomInput";
import CustomBarcodeInput from "@inputs/CustomBarcodeInput";
import CustomTextArea from "@inputs/CustomTextArea";
import CustomCheckbox from "@inputs/CustomCheckbox";
import CustomDropdown from "@inputs/CustomDropdown";
import CustomPickList from "@inputs/CustomPickList";
import CustomInputDropdown from "../../../../../shared/inputs/CustomInputDropdown";
import CustomMultiSelect from "../../../../../shared/inputs/CustomMultiSelect";
import CustomCurrencyInput from "../../../../../shared/inputs/CustomCurrencyInput";
import CustomNumberInput from "../../../../../shared/inputs/CustomNumberInput";
import CustomField from "../../../../../shared/inputs/CustomField";
import { UnitPricingTypes } from "../../../../../utils/dropdownConstants";
import { percentageDifference } from "../../../../../utils/taxHelpers";
import { addOrUpdateCatalog } from "../../../../../store/settings/inventory/catalogActions";
import CustomSimpleTable from "../../../../../shared/table/CustomSimpleTable";
import CustomDialog from "../../../../../shared/overlays/CustomDialog";
import { useCurrencyFormatter } from "../../../../../hooks/useCurrencyFormatter";
import CustomImageInput from "../../../../../shared/inputs/CustomImageInput";
import { getCatalogSubCategories } from "../../../../../store/settings/inventory/catalogSubCategoryActions";

import { clearCatalogSubCategories } from "../../../../../store/settings/inventory/inventorySlice";

import { getCatalogSubCategoryGroups } from "../../../../../store/settings/inventory/catalogSubCategoryGroupActions";

import { clearCatalogSubCategoryGroups } from "../../../../../store/settings/inventory/inventorySlice";

function General({ editItem, pageLoading, onSaveSuccess }) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { formatCurrency } = useCurrencyFormatter();
  const [loading, setLoading] = useState(false);

  const taxOptions = useSelector((state) => state.dropdown.tax);
  const clubsOptions = useSelector((state) => state.dropdown.clubs);

  const [data, setData] = useState({
    image: null,
    type: "PRODUCT",
    title: "",
    itemCaption: "",
    description: "",

    skuRequired: true,
    upcRequired: true,

    profitCenter: null,

    itemSold: "POS",
    isRecurring: false,
    isOneTimePurchaseable: false,
    reavailableAfter: { value: 1, unit: "YEARS" },
    isRedeemableAtLaterDate: false,
    isSoldOnline: false,
    onlineDescription: "",
    isActive: true,

    category: null,
    subCategory: null,
    subCategoryGroup: null,
    filterSets: [],
    tags: [],
    productType: "GENERAL",

    clubs: [],
    taxes: [],

    allowDiscount: false,
    defaultDiscount: null,
    overrideDiscount: false,
    isStockable: false,
    itemStarts: "UPON_PURCHASE",
    isExpireable: false,

    expiresIn: { value: 1, unit: "MONTHS" },

    moreThan1: 0,
    unitDiscount1: { value: 0, unit: "FIXED" },
    moreThan2: 0,
    unitDiscount2: { value: 0, unit: "FIXED" },
    moreThan3: 0,
    unitDiscount3: { value: 0, unit: "FIXED" },

    sku: "",
    upc: "",
    wholesaleCost: 0,
    netPrice: 0,
    unitPrice: 0,
    defaultPrice: 0,
    price: 0,
    includesTax: false,

    minimumQuantity: 1,
    defaultQuantity: 1,
    maximumQuantity: 1,
    allowUnlimited: false,

    canPayUsingPoints: false,
  });

  const subCategories = useSelector(
    (state) => state.settings.inventory.catalogSubCategories,
  );

  const subCategoryGroups = useSelector(
    (state) => state.settings.inventory.catalogSubCategoryGroups,
  );
  const isEditMode = !!editItem;

  useEffect(() => {
    if (editItem) {
      setData({
        type: editItem.type,
        skuRequired: editItem.skuRequired,
        upcRequired: editItem.upcRequired,

        image: (() => {
          const first = editItem.images?.[0];
          if (!first) return null;
          if (typeof first === "string") return first;
          return first?.url || null;
        })(),
        title: editItem.title,
        upc: editItem.upc,
        sku: editItem.sku,
        profitCenter: editItem.profitCenter,
        itemCaption: editItem.itemCaption,
        itemSold: editItem.itemSold,
        isRecurring: editItem.isRecurring,
        isOneTimePurchaseable: editItem.isOneTimePurchaseable,
        isRedeemableAtLaterDate: editItem.isRedeemableAtLaterDate,
        reavailableAfter: editItem.reavailableAfter,

        isSoldOnline: editItem.isSoldOnline,
        onlineDescription: editItem.onlineDescription,
        description: editItem.description,

        isActive: editItem.isActive,

        category: editItem.category || null,
        subCategory: editItem.subCategory || null,
        subCategoryGroup: editItem.subCategoryGroup || null,
        productType: editItem.productType,
        filterSets: editItem.filterSets,
        tags: editItem.tags,

        clubs: editItem.clubs,
        taxes: editItem.taxes,
        wholesaleCost: editItem.wholesaleCost,
        unitPrice: editItem.unitPrice,

        price: editItem.price,
        includesTax: editItem.includesTax,

        defaultPrice: editItem.defaultPrice,
        allowDiscount: editItem.allowDiscount,
        defaultDiscount: editItem.defaultDiscount,
        overrideDiscount: editItem.overrideDiscount,
        minimumQuantity: editItem.minimumQuantity,
        defaultQuantity: editItem.defaultQuantity,
        maximumQuantity: editItem.maximumQuantity,
        allowUnlimited: editItem.allowUnlimited,
        isStockable: editItem.isStockable,

        itemStarts: editItem.itemStarts,
        isExpireable: editItem.isExpireable,
        expiresIn: editItem.expiresIn,

        moreThan1: editItem.moreThan1,
        unitDiscount1: editItem.unitDiscount1,
        moreThan2: editItem.moreThan2,
        unitDiscount2: editItem.unitDiscount2,
        moreThan3: editItem.moreThan3,
        unitDiscount3: editItem.unitDiscount3,

        canPayUsingPoints: editItem.canPayUsingPoints,
      });
    }
  }, [editItem]);

  useEffect(() => {
    if (!data.category) return;

    if (!isEditMode) {
      dispatch(clearCatalogSubCategories());
      dispatch(clearCatalogSubCategoryGroups());

      setData((prev) => ({
        ...prev,
        subCategory: null,
        subCategoryGroup: null,
      }));
    }

    dispatch(getCatalogSubCategories(data.category));
  }, [data.category, dispatch]);

  useEffect(() => {
    if (!data.subCategory) return;

    if (!isEditMode) {
      dispatch(clearCatalogSubCategoryGroups());
      setData((prev) => ({
        ...prev,
        subCategoryGroup: null,
      }));
    }

    dispatch(getCatalogSubCategoryGroups(data.subCategory));
  }, [data.subCategory, dispatch]);

  let _ignore = useMemo(() => {
    let arr = ["category"];
    if (!data.upcRequired) arr.push("upc");
    if (!data.skuRequired) arr.push("sku");
    return arr;
  }, [data.upcRequired, data.skuRequired]);

  const handleChange = ({ name, value }) => {
    let updated = { [name]: value };

    if (name === "category") {
      updated.subCategory = null;
      updated.subCategoryGroup = null;
    }

    if (name === "subCategory") {
      updated.subCategoryGroup = null;
    }

    let formErrors = formValidation(name, value, data, _ignore);

    setData((prev) => ({
      ...prev,
      ...updated,
      formErrors,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData, _ignore)) {
      const { image, ...rest } = data;
      const payload = { ...rest, images: image ? [image] : [] };
      dispatch(
        addOrUpdateCatalog(id, payload, setLoading, (success, result) => {
          if (success) {
            onSaveSuccess?.(result);
          } else {
            setData((prev) => ({ ...prev, formErrors: result }));
          }
        }),
      );
    }
  };

  function getMarkup({ value, unit }) {
    if (data?.wholesaleCost && value) {
      let _price = data?.price;

      if (unit === "FIXED") {
        _price = _price - value;
      }

      if (unit === "PERCENT") {
        _price = (_price * (100 - value)) / 100;
      }

      const _diff = percentageDifference(data?.wholesaleCost, _price);
      return (
        <>
          {_diff > 0 ? (
            <span className="text-green">{_diff.toFixed(2) + "%"}</span>
          ) : _diff < 0 ? (
            <span className="text-red">{_diff.toFixed(2) + "%"}</span>
          ) : (
            <span>{_diff.toFixed(2) + "%"}</span>
          )}
        </>
      );
    } else {
      return null;
    }
  }

  const [showCalculation, setShowCalculation] = useState(false);

  const columns = [
    { field: "clubName", header: "Club Name" },
    { field: "unitPrice", header: "Unit Price" },
    { field: "totalTax", header: "Tax %" },
    { field: "netPrice", header: "Net Price" },
  ];

  let _taxOptions = useMemo(() => {
    if (taxOptions?.length && data?.clubs?.length) {
      return taxOptions.filter((item) =>
        Array.isArray(item?.clubs) &&
        item.clubs.some((club) => data.clubs.includes(club)),
      );
    }
    return [];
  }, [taxOptions, data.clubs]);

  let _clubTaxMap = useMemo(() => {
    let map = {};
    const selectedClubs = Array.isArray(data?.clubs) ? data.clubs : [];
    const selectedTaxes = Array.isArray(data?.taxes) ? data.taxes : [];

    selectedClubs.forEach((clubId) => {
      let _appliedTaxes = _taxOptions.filter((taxId) =>
        selectedTaxes.includes(taxId._id),
      );

      let clubTaxes = _appliedTaxes.filter(
        (tax) => Array.isArray(tax?.clubs) && tax.clubs.includes(clubId),
      );
      let totalTax = clubTaxes.reduce(
        (sum, tax) => sum + (tax.taxRatePercentage || 0),
        0,
      );
      let clubName =
        clubsOptions.find((club) => club._id === clubId)?.title ||
        clubsOptions.find((club) => club._id === clubId)?.name ||
        "";

      map[clubId] = {
        clubName,
        totalTax,
      };
    });
    return map ? Object.values(map) : [];
  }, [_taxOptions, data.clubs, data.taxes, clubsOptions]);

  let _calculatedClubTaxMap = useMemo(
    () => calculateClubPrices(_clubTaxMap, data, formatCurrency),
    [_clubTaxMap, data.price, data.includesTax, formatCurrency],
  );

  return (
    <>
      <CustomDialog
        title="Estimated Tax and Pricing"
        visible={showCalculation}
        onHide={() => setShowCalculation(false)}
        size="medium"
      >
        <CustomSimpleTable columns={columns} data={_calculatedClubTaxMap} />
      </CustomDialog>
      <FormPageLayout
        backText="Catalogs"
        submitLabel="Save & Next"
        submitLoading={loading}
        onSubmit={handleSubmit}
        pageLoading={pageLoading}
      >
        <CustomCard title="General Information">
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="type"
            options={[
              { title: "Product", _id: "PRODUCT" },
              { title: "Service", _id: "SERVICE" },
            ]}
            required
            disabled={!!editItem}
          />

          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="upcRequired"
            booleanOptions
          />
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="skuRequired"
            booleanOptions
          />
          <CustomImageInput
            data={data}
            onChange={handleChange}
            name="image"
          />
          <CustomInput
            data={data}
            onChange={handleChange}
            name="title"
            required
          />
          <CustomInput
            data={data}
            onChange={handleChange}
            name="itemCaption"
            required
          />
          <CustomBarcodeInput
            data={data}
            onChange={handleChange}
            name="sku"
            label="SKU"
            required={data?.skuRequired}
            scanLabel="Scan SKU"
            scanTitle="Scan SKU Barcode"
          />
          <CustomBarcodeInput
            data={data}
            onChange={handleChange}
            name="upc"
            label="UPC"
            required={data?.upcRequired}
            scanLabel="Scan UPC"
            scanTitle="Scan UPC Barcode"
          />
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="profitCenter"
            optionsType="profitCenters"
            required
          />
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="itemSold"
            label="How is this item sold?"
            optionsType="CatalogItemSoldTypes"
          />
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="isRecurring"
            label="Is this a recurring item?"
            booleanOptions
          />
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="isOneTimePurchaseable"
            label="Is this item available for one-time purchase?"
            booleanOptions
          />
          {data?.isOneTimePurchaseable && (
            <CustomInputDropdown
              data={data}
              onChange={handleChange}
              name="reavailableAfter"
              label="Re-available after"
              optionsType="TimeIntervalTypes"
            />
          )}
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="isRedeemableAtLaterDate"
            label="Can this item be rendered at a later date?"
            booleanOptions
          />
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="isSoldOnline"
            label="Is this item sold online?"
            booleanOptions
          />
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="canPayUsingPoints"
            label="Can this item be paid for using points?"
            booleanOptions
          />
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="allowUnlimited"
            booleanOptions
          />
          {data?.isSoldOnline && (
            <CustomTextArea
              data={data}
              onChange={handleChange}
              name="onlineDescription"
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
        <CustomCard title="Product Settings">
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="category"
            optionsType="catalogCategories"
            clearable
          />
          {data.category && (
            <CustomDropdown
              data={data}
              onChange={handleChange}
              name="subCategory"
              options={subCategories}
              optionLabel="title"
              optionValue="_id"
              placeholder="Select Sub Category"
              clearable
            />
          )}
          {data.subCategory && (
            <CustomDropdown
              data={data}
              onChange={handleChange}
              name="subCategoryGroup"
              options={subCategoryGroups}
              optionLabel="title"
              optionValue="_id"
              placeholder="Select Sub Category Group"
              clearable
            />
          )}

          <CustomMultiSelect
            data={data}
            onChange={handleChange}
            name="filterSets"
            optionsType={"filterSets"}
          />
          <CustomMultiSelect
            data={data}
            onChange={handleChange}
            name="tags"
            optionsType={"tags"}
          />
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="productType"
            optionsType="ProductTypes"
          />
        </CustomCard>
        <CustomCard title="Availability & Tax">
          <CustomPickList
            data={data}
            onChange={handleChange}
            name="clubs"
            optionsType="clubs"
          />
          <CustomPickList
            data={data}
            onChange={handleChange}
            name="taxes"
            options={_taxOptions}
          />
        </CustomCard>
        <CustomCard title="Pricing">
          <CustomCurrencyInput
            data={data}
            onChange={handleChange}
            name="wholesaleCost"
          />
          <CustomCurrencyInput
            data={data}
            onChange={handleChange}
            name="price"
            label={`Price (${data?.includesTax ? "Net Price" : "Unit Price"})`}
            required
          />
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="includesTax"
            booleanOptions
            required
            extraHeaders={
              <span
                title="Whether the product price includes tax"
                onClick={() => setShowCalculation(true)}
              >
                <i className="pi pi-calculator"></i>
              </span>
            }
          />
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="allowDiscount"
            booleanOptions
          />
          {data?.allowDiscount && (
            <>
              <CustomDropdown
                data={data}
                onChange={handleChange}
                name="defaultDiscount"
                optionsType="discounts"
              />
              <CustomDropdown
                data={data}
                onChange={handleChange}
                name="overrideDiscount"
                booleanOptions
              />
            </>
          )}
        </CustomCard>
        <CustomCard title="Quantity Information">
          {data?.allowUnlimited ? (
            <>
              <CustomInput data={{ minimumQuantity: "Unlimited Quantity" }} name="minimumQuantity" disabled col={4} />
              <CustomInput data={{ defaultQuantity: "Unlimited Quantity" }} name="defaultQuantity" disabled col={4} />
              <CustomInput data={{ maximumQuantity: "Unlimited Quantity" }} name="maximumQuantity" disabled col={4} />
            </>
          ) : (
            <>
              <CustomNumberInput
                data={data}
                onChange={handleChange}
                name="minimumQuantity"
                required
              />
              <CustomNumberInput
                data={data}
                onChange={handleChange}
                name="defaultQuantity"
                required
              />
              <CustomNumberInput
                data={data}
                onChange={handleChange}
                name="maximumQuantity"
                required
              />
            </>
          )}
          <CustomCurrencyInput
            data={data}
            onChange={handleChange}
            name="defaultPrice"
            disabled
          />
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="isStockable"
            booleanOptions
          />
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="itemStarts"
            optionsType="CatalogItemStartsTypes"
          />
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="isExpireable"
            booleanOptions
          />
          {data?.isExpireable && (
            <CustomInputDropdown
              data={data}
              onChange={handleChange}
              name="expiresIn"
              label={`Expires In (${
                data?.itemStarts === "UPON_PURCHASE"
                  ? "from the date of purchase"
                  : "from the date of first use"
              })`}
              optionsType="TimeIntervalTypes"
            />
          )}
        </CustomCard>
        <CustomCard title="Tiered Unit Pricing">
          <CustomDropdown
            name="moreThan1"
            label="More Than"
            options={UnitPricingTypes}
            onChange={handleChange}
            data={data}
            col={1}
          />
          <CustomInputDropdown
            name="unitDiscount1"
            label="Unit Discount"
            data={data}
            onChange={handleChange}
            optionsType="AmountUnits"
            col={2}
          />
          {data?.wholesaleCost > 0 && (
            <CustomField label="Markup">
              {getMarkup(data?.unitDiscount1)}
            </CustomField>
          )}

          {data?.moreThan1 ? (
            <>
              <CustomDropdown
                name="moreThan2"
                label="More Than"
                options={UnitPricingTypes?.filter(
                  (item) => item?._id > data?.moreThan1,
                )}
                onChange={handleChange}
                data={data}
                col={1}
              />
              <CustomInputDropdown
                name="unitDiscount2"
                label="Unit Discount"
                data={data}
                onChange={handleChange}
                optionsType="AmountUnits"
                col={2}
              />
              {data?.wholesaleCost > 0 && (
                <CustomField label="Markup">
                  {getMarkup(data?.unitDiscount2)}
                </CustomField>
              )}
            </>
          ) : null}

          {data?.moreThan1 && data?.moreThan2 ? (
            <>
              <CustomDropdown
                data={data}
                onChange={handleChange}
                name="moreThan3"
                label="More Than"
                options={UnitPricingTypes?.filter(
                  (item) => item?._id > data?.moreThan2,
                )}
                col={1}
              />
              <CustomInputDropdown
                name="unitDiscount3"
                label="Unit Discount"
                data={data}
                onChange={handleChange}
                optionsType="AmountUnits"
                col={2}
              />
              {data?.wholesaleCost > 0 && (
                <CustomField label="Markup">
                  {getMarkup(data?.unitDiscount3)}
                </CustomField>
              )}
            </>
          ) : null}
        </CustomCard>
      </FormPageLayout>
    </>
  );
}
export default React.memo(General);
function calculateClubPrices(_clubTaxMap = [], data = {}, formatCurrency) {
  const { price = 0, includesTax = false } = data;

  return _clubTaxMap.map((club) => {
    const taxRate = club.totalTax / 100;
    let unitPrice, netPrice;

    if (includesTax) {
      unitPrice = parseFloat((price / (1 + taxRate)).toFixed(2));
      netPrice = parseFloat(price?.toFixed(2));
    } else {
      unitPrice = parseFloat(price?.toFixed(2));
      netPrice = parseFloat((price * (1 + taxRate)).toFixed(2));
    }

    return {
      clubName: club.clubName,
      totalTax: club.totalTax,
      unitPrice: formatCurrency(unitPrice),
      netPrice: formatCurrency(netPrice),
    };
  });
}
