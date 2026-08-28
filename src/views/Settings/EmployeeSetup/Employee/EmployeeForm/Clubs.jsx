import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import formValidation, { showFormErrors } from "@formValidations";
import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomPickList from "@inputs/CustomPickList";

import { addOrUpdateEmployee } from "@store/settings/employeeSetup/employeeActions";
import { getAllDropdownDataAction } from "@store/dropdown/dropdownActions";

function Clubs({ employee, onSaveSuccess }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    clubs: [],
    reportDataAccess: [],
  });

  useEffect(() => {
    if (employee) {
      setData({
        clubs: employee.clubs || [],
        reportDataAccess: employee.reportDataAccess || [],
      });
    }
  }, [employee]);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = async (e, next) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      dispatch(
        addOrUpdateEmployee(id, data, setLoading, (success, formErrors) => {
          if (success) {
            dispatch(getAllDropdownDataAction());
            if (next) {
              onSaveSuccess?.();
            } else {
              navigate(-1);
            }
          } else {
            setData((prev) => ({ ...prev, formErrors }));
          }
        })
      );
    }
  };

  return (

    <FormPageLayout
      backText="Employees"
      submitLoading={loading}
      onSubmit={handleSubmit}
      onSubmitNextTab={handleSubmit}
    >
      <CustomCard title="Report Data Access" size={6}>
        <CustomPickList
          data={data}
          onChange={handleChange}
          name="reportDataAccess"
          optionsType="clubs"
          required
          hideLabel
        />
      </CustomCard>
      <CustomCard title="Clubs" size={6}>
        <CustomPickList 
          data={data}
          onChange={handleChange}
          name="clubs"
          optionsType="clubs"
          required
          hideLabel
        />
      </CustomCard>
    </FormPageLayout>
  );
}

export default React.memo(Clubs);
