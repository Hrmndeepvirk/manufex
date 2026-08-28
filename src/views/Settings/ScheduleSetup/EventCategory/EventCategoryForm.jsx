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
  getEventCategory,
  addOrUpdateEventCategory,
} from "@store/settings/scheduleSetup/eventCategoryActions";
import { useCan } from "../../../../hooks/useCan";
import { useResourceRequest } from "../../../../hooks/useResourceRequest";

function EventCategoryForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  const canEdit = useCan("EDIT-EVENT-CATEGORIES");
  const [data, setData] = useState({
    title: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    if (id) {
      dispatch(
        getEventCategory(id, setPageLoading, (res) => {
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
        addOrUpdateEventCategory(
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

  const { buttons } = useResourceRequest({
    permission: "REQUEST-EVENT-CATEGORIES",
    targetCollection: "EVENT_CATEGORY",
    id,
    data,
    setData,
    buildChangedData: (d) => ({
      title: d.title,
      description: d.description,
      isActive: d.isActive,
    }),
  });

  return (
    <FormPageLayout
      backText="Event Category"
      onSubmit={canEdit ? handleSubmit : undefined}
      submitLoading={loading}
      pageLoading={pageLoading}
      buttons={buttons}
    >
      <CustomCard title="Event Category">
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
          col={12}
        />
      </CustomCard>
    </FormPageLayout>
  );
}
export default React.memo(EventCategoryForm);
