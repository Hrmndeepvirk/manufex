import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomInput from "@inputs/CustomInput";
import CustomTextArea from "@inputs/CustomTextArea";
import CustomCheckbox from "@inputs/CustomCheckbox";
import CustomDropdown from "@shared/inputs/CustomDropdown";

import formValidation, { showFormErrors } from "@formValidations";
import {
  getLevel,
  addOrUpdateLevel,
} from "@store/settings/scheduleSetup/levelActions";
import { LevelTypes } from "@utils/dropdownConstants";

function LevelForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    type: "CLASS",
    isActive: true,
  });

  useEffect(() => {
    if (id) {
      dispatch(
        getLevel(id, setPageLoading, (res) => {
          setData({
            title: res.title || "",
            type: res.type || "",
            description: res.description || "",
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
        addOrUpdateLevel(id, data, setLoading, (success, formErrors) => {
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
      backText="Level"
      onSubmit={handleSubmit}
      submitLoading={loading}
      pageLoading={pageLoading}
    >
      <CustomCard title="Level">
        <CustomInput
          data={data}
          onChange={handleChange}
          name="title"
          required
        />

        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="type"
          options={LevelTypes}
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
          col={12}
        />
      </CustomCard>
    </FormPageLayout>
  );
}
export default React.memo(LevelForm);
