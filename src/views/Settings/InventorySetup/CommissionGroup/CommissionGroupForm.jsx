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
import CustomPickList from "@inputs/CustomPickList";
import {
  addOrUpdateCommissionGroup,
  getCommissionGroup,
} from "../../../../store/settings/inventory/commissionGroupActions";

function CommissionGroupForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    commissionType: "PRODUCT",
    catalogs: [],
    employees: [],
    departments: [],
    isActive: true,
  });

  useEffect(() => {
    if (id) {
      dispatch(
        getCommissionGroup(id, setLoading, (res) => {
          setData({
            title: res.title || "",
            description: res.description || "",
            commissionType: res.commissionType,
            isActive: res.isActive,
            catalogs: res?.catalogs,
            employees: res?.employees,
            departments: res?.departments,
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
        addOrUpdateCommissionGroup(
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
    permission: "REQUEST-COMMISSION-GROUP",
    targetCollection: "COMMISSION_GROUP",
    id,
    data,
    setData,
  });

  return (
    <FormPageLayout
      buttons={buttons}
      backText="Commission Groups"
      onSubmit={handleSubmit}
      submitLoading={loading}
    >
      <CustomCard title="Commission Group Details">
        <CustomInput
          data={data}
          onChange={handleChange}
          name="title"
          required
        />

        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="commissionType"
          options={[
            { title: "Product", _id: "PRODUCT" },
            { title: "Service", _id: "SERVICE" },
          ]}

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
      <CustomCard title="Departments">
        <CustomPickList
          data={data}
          onChange={handleChange}
          name="departments"
          optionsType="departments"
          required
          hideLabel
        />
      </CustomCard>
    </FormPageLayout>
  );

  
}
export default React.memo(CommissionGroupForm);
