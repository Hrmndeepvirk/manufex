import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomInput from "@inputs/CustomInput";
import CustomTextArea from "@inputs/CustomTextArea";

import formValidation, { showFormErrors } from "@formValidations";

import Permissions from "./Permissions";
import {
  addOrUpdateSecurityRole,
  getSecurityRole,
} from "@store/settings/employeeSetup/securityRoleActions";
import { userProfileAction } from "@store/user/userActions";

function SecurityRoleForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
  });
 
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const handlePermissionSelection = (selections) => {
    setSelectedPermissions(selections);
  };

  useEffect(() => {
    if (id) {
      dispatch(
        getSecurityRole(id, setPageLoading, (res) => {
          setSelectedPermissions(res.rawPermissions);
          setData({
            title: res.title,
            description: res.description,
          });
        })
      );
    }
  }, [id]);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);;
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      data.rawPermissions = selectedPermissions;
      dispatch(
        addOrUpdateSecurityRole(id, data, setLoading, (success, formErrors) => {
          if (success) {
            dispatch(userProfileAction(() => {}));
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
      backText="Security Roles"
      onSubmit={handleSubmit}
      submitLoading={loading}


      pageLoading={pageLoading}
    >
      <CustomCard title="General Information">
        <CustomInput
          data={data}
          onChange={handleChange}
          name="title"
          required
          maxLength={100}
        />
        <CustomTextArea
          data={data}
          onChange={handleChange}
          name="description"
        />
      </CustomCard>
      <Permissions
        selected={selectedPermissions}
        setSelected={handlePermissionSelection}
      />
    </FormPageLayout>
  );
}
export default React.memo(SecurityRoleForm);
