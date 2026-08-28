import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomInput from "@inputs/CustomInput";
import CustomTextArea from "@inputs/CustomTextArea";
import CustomCheckbox from "@inputs/CustomCheckbox";
import CustomDropdown from "@inputs/CustomDropdown";
import formValidation, { showFormErrors } from "@formValidations";
import {
  getCampaign,
  addOrUpdateCampaign,
} from "@store/settings/memberSetup/campaignActions";

function CampaignForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    campaignGroup: "",
    isActive: true,
  });

  useEffect(() => {
    if (id) {
      dispatch(
        getCampaign(id, setPageLoading, (res) => {
          setData({
            title: res.title || "",
            description: res.description || "",
            campaignGroup: res.campaignGroup || "",
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
        addOrUpdateCampaign(id, data, setLoading, (success, formErrors) => {
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
      backText="Campaign"
      onSubmit={handleSubmit}
      submitLoading={loading}
      pageLoading={pageLoading}
    >
      <CustomCard title="Campaign">
        <CustomInput
          data={data}
          onChange={handleChange}
          name="title"
          required
        />
        {/* will be altered, to dropdown input */}
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="campaignGroup"
          optionsType="campaignGroups"
          optionDisabled={(option) => option.isActive === false}
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
export default React.memo(CampaignForm);
