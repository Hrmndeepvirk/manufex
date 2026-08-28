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
import {
  getTax,
  addOrUpdateTax,
  getTaxes,
} from "@store/settings/pointOfSale/taxActions";
import { TaxRateTypeDropdown } from "@utils/dropdownConstants";
import CustomPickList from "@inputs/CustomPickList";
import CustomNumberInput from "../../../../shared/inputs/CustomNumberInput";

function TaxForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const availableTaxes = useSelector((state) => state.settings.pointOfSale.tax);

  useEffect(() => {
    dispatch(getTaxes());
  }, [dispatch]);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    taxRatePercentage: 0,
    availableTaxRate: null,
    clubs: [],
    taxRateType: "STATE",
    isActive: true,
  });

  useEffect(() => {
    if (id) {
      dispatch(
        getTax(id, setLoading, (res) => {
          setData({
            title: res.title || "",
            description: res.description || "",
            taxRatePercentage: res.taxRatePercentage || 0,
            clubs: res.clubs || [],
            availableTaxRate: res.availableTaxRate || null,
            taxRateType: res.taxRateType || null,
            isActive: res.isActive,
          });
        })
      );
    }
  }, [id]);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      dispatch(
        addOrUpdateTax(id, data, setLoading, (success, formErrors) => {
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
      backText="Tax"
      onSubmit={handleSubmit}
      submitLoading={loading}
    >
      <CustomCard title="Tax">
        <CustomInput
          data={data}
          onChange={handleChange}
          name="title"
          required
        />
        <CustomNumberInput
          data={data}
          onChange={handleChange}
          name="taxRatePercentage"
          required
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="availableTaxRate"
          options={availableTaxes}
        />

        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="taxRateType"
          required
          options={TaxRateTypeDropdown}
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
        />
      </CustomCard>
      <CustomCard title="Clubs">
        <CustomPickList
          data={data}
          onChange={handleChange}
          name="clubs"
          optionsType="clubs"
          required
          hideLabel
        />
      </CustomCard>
    </FormPageLayout>
  );
}
export default React.memo(TaxForm);
