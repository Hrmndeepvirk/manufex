import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomInput from "@inputs/CustomInput";
import CustomTextArea from "@inputs/CustomTextArea";
import CustomCheckbox from "@inputs/CustomCheckbox";

import formValidation, { showFormErrors } from "@formValidations";
import {
  getCampaignGroup,
  addOrUpdateCampaignGroup,
} from "@store/settings/memberSetup/campaignGroupActions";

function CampaignGroupForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    if (id) {
      dispatch(
        getCampaignGroup(id, setPageLoading, (res) => {
          setData({
            title: res.title || "",
            description: res.description || "",
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
        addOrUpdateCampaignGroup(
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
      backText="Campaign Groups"
      onSubmit={handleSubmit}
      submitLoading={loading}
      pageLoading={pageLoading}
    >
      <CustomCard title="Campaign Group">
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
export default React.memo(CampaignGroupForm);
