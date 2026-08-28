import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomInput from "@inputs/CustomInput";
import CustomTextArea from "@inputs/CustomTextArea";
import CustomCheckbox from "@inputs/CustomCheckbox";
import CustomColorPicker from "@inputs/CustomColorPicker";

import formValidation, { showFormErrors } from "@formValidations";
import { addOrUpdateAccessedSchedule } from "@store/settings/memberSetup/accessedScheduleActions";

function AssessedScheduleForm({ schedule, pageLoading, onSaveSuccess }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    shortName: "",
    color: "",
    isActive: true,
    schedule: {},
  });

  useEffect(() => {
    if (schedule) {
      setData({
        title: schedule.title || "",
        description: schedule.description || "",
        shortName: schedule.shortName || "",
        color: schedule.color || "",
        isActive: schedule.isActive,
        schedule: schedule.schedule || {},
      });
    }
  }, [schedule]);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = (e, next) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      dispatch(
        addOrUpdateAccessedSchedule(
          id,
          data,
          setLoading,
          (success, payload) => {
            if (success) {
              if (next) {
                onSaveSuccess?.(payload?._id);
              } else {
                navigate(-1);
              }
            } else {
              setData((prev) => ({ ...prev, formErrors: payload }));
            }
          },
        ),
      );
    }
  };

  return (
    <FormPageLayout
      backText="Accessed Schedule"
      onSubmit={handleSubmit}
      onSubmitNextTab={onSaveSuccess ? handleSubmit : undefined}
      submitLoading={loading}
      pageLoading={pageLoading}
    >
      <CustomCard title="Accessed Schedule">
        <CustomInput
          data={data}
          onChange={handleChange}
          name="title"
          required
        />

        <CustomInput
          data={data}
          onChange={handleChange}
          name="shortName"
          required
        />

        <CustomColorPicker name="color" data={data} onChange={handleChange} />
        <CustomTextArea
          data={data}
          onChange={handleChange}
          name="description"
        />

        {/* need to add type dropdown here with values accordingly */}

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
export default React.memo(AssessedScheduleForm);
