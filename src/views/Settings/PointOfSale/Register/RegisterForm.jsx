import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomInput from "@inputs/CustomInput";
import CustomTextArea from "@inputs/CustomTextArea";
import CustomCheckbox from "@inputs/CustomCheckbox";
import CustomDropdown from "@shared/inputs/CustomDropdown";

import formValidation, { showFormErrors } from "@formValidations";
import {
  getRegister,
  addOrUpdateRegister,
} from "@store/settings/pointOfSale/registerActions";
import CustomMultiSelect from "@shared/inputs/CustomMultiSelect";

function RegisterForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    club: null,
    autoCloseable: true,
    autoCloseableTime: "",
    amountToLeftIn: 0,
    departments: [],
    isActive: true,
  });

  useEffect(() => {
    if (id) {
      dispatch(
        getRegister(id, setLoading, (res) => {
          setData({
            title: res?.title || "",
            description: res?.description || "",
            club: res?.club || null,
            autoCloseable: res?.autoCloseable,
            autoCloseableTime: res?.autoCloseableTime || "",
            amountToLeftIn: res?.amountToLeftIn,
            departments: res?.departments || [],
            isActive: res?.isActive,
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
        addOrUpdateRegister(id, data, setLoading, (success, formErrors) => {
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
      backText="Register"
      onSubmit={handleSubmit}
      submitLoading={loading}
    >
      <CustomCard title="Register">
        <CustomInput
          data={data}
          onChange={handleChange}
          name="title"
          required
        />

        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="club"
          optionsType="clubs"
        />

        <CustomMultiSelect
          data={data}
          onChange={handleChange}
          name="departments"
          optionsType="departments"
        />

        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="autoCloseable"
          booleanOptions
        />
        {/* will be time input component */}
        {data?.autoCloseable && (
          <CustomInput
            data={data}
            onChange={handleChange}
            name="autoCloseableTime"
          />
        )}
        <CustomInput
          data={data}
          onChange={handleChange}
          name="amountToLeftIn"
          keyfilter="int"
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
export default React.memo(RegisterForm);
