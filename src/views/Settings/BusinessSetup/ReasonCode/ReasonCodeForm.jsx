import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomInput from "@inputs/CustomInput";
import CustomTextArea from "@inputs/CustomTextArea";
import CustomCheckbox from "@inputs/CustomCheckbox";

import formValidation, { showFormErrors } from "@formValidations";
import {
  getReasonCode,
  addOrUpdateReasonCode,
} from "@store/settings/business/reasonCodeActions";
import CustomDropdown from "@shared/inputs/CustomDropdown";
import { ReasonCodeTypes } from "@utils/dropdownConstants";

function ReasonCodeForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    codeType: null,
    isActive: true,
  });

  useEffect(() => {
    if (id) {
      dispatch(
        getReasonCode(id, setPageLoading, (res) => {
          setData({
            title: res.title || "",
            description: res.description || "",
            codeType: res.codeType || null,
            isActive: res.isActive,
          });
        }),
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
        addOrUpdateReasonCode(id, data, setLoading, (success, formErrors) => {
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
      backText="Reason Codes"
      onSubmit={handleSubmit}
      submitLoading={loading}
      pageLoading={pageLoading}
    >
      <CustomCard title="Reason Code">
        <CustomInput
          data={data}
          onChange={handleChange}
          name="title"
          required
          maxLength={100}
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="codeType"
          options={ReasonCodeTypes}
          required
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
    </FormPageLayout>
  );
}
export default React.memo(ReasonCodeForm);
