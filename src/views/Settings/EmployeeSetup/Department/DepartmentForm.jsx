import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useResourceRequest } from "../../../../hooks/useResourceRequest";
import { useCan } from "../../../../hooks/useCan";

import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomInput from "@inputs/CustomInput";
import CustomTextArea from "@inputs/CustomTextArea";
import CustomCheckbox from "@inputs/CustomCheckbox";
import CustomDropdown from "@shared/inputs/CustomDropdown";

import formValidation, { showFormErrors } from "@formValidations";
import {
  addOrUpdateDepartment,
} from "@store/settings/employeeSetup/departmentActions";

function DepartmentForm({ department, pageLoading, onSaveSuccess }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    departmentCode: "",
    showInCalender: true,
    visibleOnline: true,
    shiftPlanner: true,
    salesPersonOnline: true,
    isActive: true,
  });

  useEffect(() => {
    if (department) {
      setData({
        title: department.title || "",
        description: department.description || "",
        departmentCode: department.departmentCode || "",
        showInCalender: department.showInCalender,
        visibleOnline: department.visibleOnline,
        shiftPlanner: department.shiftPlanner,
        salesPersonOnline: department.salesPersonOnline,
        isActive: department.isActive,
      });
    }
  }, [department]);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = (e, next) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      dispatch(
        addOrUpdateDepartment(id, data, setLoading, (success, payload) => {
          if (success) {
            if (next) {
              onSaveSuccess?.(payload?._id);
            } else {
              navigate(-1);
            }
          } else {
            setData((prev) => ({ ...prev, formErrors: payload }));
          }
        }),
      );
    }
  };


  const canDirectSave = useCan(id ? "EDIT-DEPARTMENTS" : "CREATE-DEPARTMENTS");

  const { buttons: requestButtons } = useResourceRequest({
    permission: "REQUEST-DEPARTMENTS",
    targetCollection: "DEPARTMENT",
    id,
    data,
    setData,
  });

  const buttons = canDirectSave ? [] : requestButtons;

  return (
    <FormPageLayout
      buttons={buttons}
      backText="Department"
      onSubmit={canDirectSave ? handleSubmit : undefined}
      onSubmitNextTab={onSaveSuccess && canDirectSave ? handleSubmit : undefined}
      submitLoading={loading}
      pageLoading={pageLoading}
    >
      <CustomCard title="Department">
        <CustomInput
          data={data}
          onChange={handleChange}
          name="title"
          required
          maxLength={100}
        />

        <CustomInput
          data={data}
          onChange={handleChange}
          name="departmentCode"
          required
        />

        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="showInCalender"
          booleanOptions
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="visibleOnline"
          booleanOptions
        />
        {id && (
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="shiftPlanner"
            booleanOptions
          />
        )}
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="salesPersonOnline"
          booleanOptions
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
export default React.memo(DepartmentForm);
