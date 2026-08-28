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
  addOrUpdateProfitCenter,
  getProfitCenter,
} from "../../../../store/settings/inventory/profitCenterActions";

function ProfitCenterForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const profitCenters = useSelector(
    (state) => state.settings.inventory.profitCenters
  );

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    glCode: "",
    availableProfitCenter: null,
    parentProfitCenter: null,
    profitCenterCode: "",
    earningsCode: "",
    isParentProfitCenter: false,
    isActive: true,
  });

  useEffect(() => {
    if (id) {
      dispatch(
        getProfitCenter(id, setLoading, (res) => {
          setData({
            title: res.title,
            glCode: res.glCode,
            availableProfitCenter: res.availableProfitCenter || null,
            parentProfitCenter: res.parentProfitCenter || null,
            description: res.description,
            profitCenterCode: res.profitCenterCode,
            earningsCode: res.earningsCode,
            isActive: res.isActive,
            isParentProfitCenter: res.isParentProfitCenter,
          });
        })
      );
    }
  }, [id]);

  const handleChange = ({ name, value }) => {
    if (name === "glCode") {
      value = String(value ?? "")
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 20);
    }

    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      dispatch(
        addOrUpdateProfitCenter(id, data, setLoading, (success, formErrors) => {
          if (success) {
            navigate(-1);
          } else {
            setData((prev) => ({ ...prev, formErrors }));
          }
        })
      );
    }
  };

  const parentProfitCenterOptions = (profitCenters || []).filter(
    (profitCenter) =>
      profitCenter?.isParentProfitCenter ||
      profitCenter?._id === data?.parentProfitCenter
  );


  const { buttons } = useResourceRequest({
    permission: "REQUEST-PROFIT-CENTER",
    targetCollection: "PROFIT_CENTER",
    id,
    data,
    setData,
  });

  return (
    <FormPageLayout
      buttons={buttons}
      backText="Profit Centers"
      onSubmit={handleSubmit}
      submitLoading={loading}
    >
      <CustomCard title="Profit Center">
        <CustomInput
          data={data}
          onChange={handleChange}
          name="title"
          required
        />
        <CustomInput
          data={data}
          onChange={handleChange}
          name="glCode"
          required
          maxLength={20}
        />
        {/* <CustomDropdown
          data={data}
          onChange={handleChange}
          name="availableProfitCenter"
          optionsType="profitCenters"
        /> */}
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="parentProfitCenter"
          options={parentProfitCenterOptions}
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="isParentProfitCenter"
          booleanOptions
        />
        <CustomInput
          data={data}
          onChange={handleChange}
          name="profitCenterCode"
        />
        <CustomInput data={data} onChange={handleChange} name="earningsCode" />
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
export default React.memo(ProfitCenterForm);
