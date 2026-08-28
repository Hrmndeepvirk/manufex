import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import CustomInput from "@inputs/CustomInput";
import CustomBarcodeInput from "@inputs/CustomBarcodeInput";
import CustomForm from "@inputs/CustomForm";
import CustomDialog from "@shared/overlays/CustomDialog";
import formValidation, { showFormErrors } from "@formValidations";
import CustomCurrencyInput from "../../../../../../shared/inputs/CustomCurrencyInput";

import CustomDropdown from "@inputs/CustomDropdown";
import CustomNumberInput from "../../../../../../shared/inputs/CustomNumberInput";
import { addOrUpdateCatalog, getServicesForPaysFor } from "../../../../../../store/settings/inventory/catalogActions";
import { addSubVariationInCatalogVariation } from "../../../../../../store/settings/inventory/catalogVariationActions";
import CustomImageInput from "@shared/inputs/CustomImageInput";
import CustomMultiSelect from "@inputs/CustomMultiSelect";
import CustomInputDropdown from "../../../../../../shared/inputs/CustomInputDropdown";
import CustomField from "../../../../../../shared/inputs/CustomField";
import { UnitPricingTypes } from "../../../../../../utils/dropdownConstants";
import { percentageDifference } from "../../../../../../utils/taxHelpers";

function AddEditSubVariationForm({
  selectedSubVariation,
  selectedVariation,
  show,
  onHide,
  item,
  getVariations,
}) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [serviceOptions, setServiceOptions] = useState([]);

  const [data, setData] = useState({
    images: [],
    title: "",
    sku: "",
    upc: "",
    wholesaleCost: 0,
    price: 0,
    includesTax: false,
    minimumQuantity: 1,
    defaultQuantity: 1,
    maximumQuantity: 1,
    filterSets: [],
    tags: [],
    allowUnlimited: false,
    paysFor: [],
    moreThan1: 0,
    unitDiscount1: { value: 0, unit: "FIXED" },
    moreThan2: 0,
    unitDiscount2: { value: 0, unit: "FIXED" },
    moreThan3: 0,
    unitDiscount3: { value: 0, unit: "FIXED" },
  });

  useEffect(() => {
    if (show) {
      dispatch(getServicesForPaysFor(setServicesLoading, (services) => {
        setServiceOptions(services);
      }));
    }
  }, [show]);

  useEffect(() => {
    if (selectedSubVariation) {
      setData({
        images: selectedSubVariation.images || [],
        title: selectedSubVariation.title || "",
        sku: selectedSubVariation.sku || "",
        upc: selectedSubVariation.upc || "",
        wholesaleCost: selectedSubVariation.wholesaleCost || 0,
        price: selectedSubVariation.price || 0,
        includesTax: selectedSubVariation.includesTax || false,
        minimumQuantity: selectedSubVariation.minimumQuantity || 1,
        defaultQuantity: selectedSubVariation.defaultQuantity || 1,
        maximumQuantity: selectedSubVariation.maximumQuantity || 1,
        allowUnlimited: selectedSubVariation.allowUnlimited || false,
        filterSets: selectedSubVariation.filterSets || [],
        tags: selectedSubVariation.tags || [],
        paysFor: selectedSubVariation.paysFor || [],
        moreThan1: selectedSubVariation.moreThan1 || 0,
        unitDiscount1: selectedSubVariation.unitDiscount1 || {
          value: 0,
          unit: "FIXED",
        },
        moreThan2: selectedSubVariation.moreThan2 || 0,
        unitDiscount2: selectedSubVariation.unitDiscount2 || {
          value: 0,
          unit: "FIXED",
        },
        moreThan3: selectedSubVariation.moreThan3 || 0,
        unitDiscount3: selectedSubVariation.unitDiscount3 || {
          value: 0,
          unit: "FIXED",
        },
      });
    }
  }, [selectedSubVariation]);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
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
  let _ignore = useMemo(() => {
    let arr = [];
    if (!item?.upcRequired) arr.push("upc");
    if (!item?.skuRequired) arr.push("sku");
    return arr;
  }, [item?.upcRequired, item?.skuRequired]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData, _ignore)) {
      if (selectedVariation?._id) {
        dispatch(
          addSubVariationInCatalogVariation(
            id,
            selectedVariation?._id,
            data,
            setLoading,
            (success, formErrors) => {
              if (success) {
                _onHide();
                getVariations();
              } else {
                setData((prev) => ({ ...prev, formErrors }));
              }
            }
          )
        );
      } else {
        dispatch(
          addOrUpdateCatalog(
            selectedSubVariation._id,
            data,
            setLoading,
            (success, formErrors) => {
              if (success) {
                _onHide();
                getVariations();
              } else {
                setData((prev) => ({ ...prev, formErrors }));
              }
            }
          )
        );
      }
    }
  };

  function _onHide() {
    onHide();
    setData({
      images: [],
      title: "",
      sku: "",
      upc: "",
      wholesaleCost: 0,
      price: 0,
      includesTax: false,
      minimumQuantity: 1,
      defaultQuantity: 1,
      maximumQuantity: 1,
      filterSets: [],
      tags: [],
      allowUnlimited: false,
      paysFor: [],
      moreThan1: 0,
      unitDiscount1: { value: 0, unit: "FIXED" },
      moreThan2: 0,
      unitDiscount2: { value: 0, unit: "FIXED" },
      moreThan3: 0,
      unitDiscount3: { value: 0, unit: "FIXED" },
    });
  }

  return (
    <CustomDialog
      title="Add Sub Variation"
      visible={show}
      onHide={_onHide}
      size="large"
    >
      <CustomForm
        onSubmit={handleSubmit}
        submitLabel="Save"
        submitLoading={loading}
        onCancel={_onHide}
      >
        <CustomImageInput
          data={data}
          onChange={handleChange}
          name="images"
          multiple
          limit={2}
        />
        <CustomInput
          data={data}
          onChange={handleChange}
          name="title"
          required
          col={12}
        />
        <CustomBarcodeInput
          data={data}
          onChange={handleChange}
          name="sku"
          label="SKU"
          col={6}
          required={item?.skuRequired}
          scanLabel="Scan SKU"
          scanTitle="Scan SKU Barcode"
        />
        <CustomBarcodeInput
          data={data}
          onChange={handleChange}
          name="upc"
          label="UPC"
          col={6}
          required={item?.upcRequired}
          scanLabel="Scan UPC"
          scanTitle="Scan UPC Barcode"
        />

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
          // extraHeaders={
          //   <span
          //     title="Whether the product price includes tax"
          //     // onClick={() => setShowCalculation(true)}
          //   >
          //     <i className="pi pi-calculator"></i>
          //   </span>
          // }
        />

        <CustomNumberInput
          data={data}
          onChange={handleChange}
          name="minimumQuantity"
          required
          col={3}
        />
        <CustomNumberInput
          data={data}
          onChange={handleChange}
          name="defaultQuantity"
          required
          col={3}
        />
        <CustomNumberInput
          data={data}
          onChange={handleChange}
          name="maximumQuantity"
          required
          col={3}
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="allowUnlimited"
          booleanOptions
          col={3}
        />
        <CustomMultiSelect
          data={data}
          onChange={handleChange}
          name="filterSets"
          optionsType={"filterSets"}
          col={6}
        />
        <CustomMultiSelect
          data={data}
          onChange={handleChange}
          name="tags"
          optionsType={"tags"}
          col={6}
        />
        <CustomMultiSelect
          data={data}
          onChange={handleChange}
          name="paysFor"
          label="Pays For"
          options={serviceOptions}
          loading={servicesLoading}
          col={12}
          filter
          filterPlaceholder="Search services..."
        />
        <CustomDropdown
          name="moreThan1"
          label="More Than"
          options={UnitPricingTypes}
          onChange={handleChange}
          data={data}
          col={5}
        />
        <CustomInputDropdown
          name="unitDiscount1"
          label="Unit Discount"
          data={data}
          onChange={handleChange}
          optionsType="AmountUnits"
          col={6}
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
                (item) => item?._id > data?.moreThan1
              )}
              onChange={handleChange}
              data={data}
              col={5}
            />
            <CustomInputDropdown
              name="unitDiscount2"
              label="Unit Discount"
              data={data}
              onChange={handleChange}
              optionsType="AmountUnits"
              col={6}
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
                (item) => item?._id > data?.moreThan2
              )}
              col={5}
            />
            <CustomInputDropdown
              name="unitDiscount3"
              label="Unit Discount"
              data={data}
              onChange={handleChange}
              optionsType="AmountUnits"
              col={6}
            />
            {data?.wholesaleCost > 0 && (
              <CustomField label="Markup">
                {getMarkup(data?.unitDiscount3)}
              </CustomField>
            )}
          </>
        ) : null}
      </CustomForm>
    </CustomDialog>
  );
}
export default React.memo(AddEditSubVariationForm);
