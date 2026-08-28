import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomInput from "@inputs/CustomInput";
import CustomTextArea from "@inputs/CustomTextArea";
import CustomCheckbox from "@inputs/CustomCheckbox";
import CustomChipInput from "@inputs/CustomChipInput";
import formValidation, { showFormErrors } from "@formValidations";
import {
  getAgreementCategory,
  addOrUpdateAgreementCategory,
} from "@store/settings/agreementSetup/agreementCategoryActions";

function AgreementCategoriesForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    subCategories: [],
    isActive: true,
  });

  useEffect(() => {
    if (id) {
      dispatch(
        getAgreementCategory(id, setLoading, (res) => {
          setData({
            title: res.title || "",
            description: res.description || "",
            subCategories: res.subCategories || [],
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
        addOrUpdateAgreementCategory(
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
      backText="Agreement Categories"
      onSubmit={handleSubmit}
      submitLoading={loading}
    >
      <CustomCard title="Agreement Categories">
        <CustomInput
          data={data}
          onChange={handleChange}
          name="title"
          required
        />

        <CustomChipInput
          data={data}
          onChange={handleChange}
          name="subCategories"
          col={6}
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
          col={12}
        />
      </CustomCard>
    </FormPageLayout>
  );
}
export default React.memo(AgreementCategoriesForm);
