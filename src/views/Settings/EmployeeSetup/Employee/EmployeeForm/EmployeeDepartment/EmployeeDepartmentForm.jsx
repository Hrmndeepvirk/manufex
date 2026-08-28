import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CustomForm from "@inputs/CustomForm";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomDropdown from "@inputs/CustomDropdown";
import formValidation, { showFormErrors } from "@formValidations";
import {
  addOrUpdateEmployeeDepartment,
  getEmployeeDepartment,
} from "@store/settings/employeeSetup/manageEmployee/employeeDepartmentActions";
import { getJobTitlesForDepartment } from "../../../../../../store/settings/employeeSetup/manageEmployee/employeeDepartmentActions";
import CustomCurrencyInput from "../../../../../../shared/inputs/CustomCurrencyInput";

function EmployeeDepartmentForm({
  show,
  onHide,
  departmentId,
  employeeDepartmentList,
  getDepartments,
}) {
  const dispatch = useDispatch();
  const [jobTitles, setJobTitles] = useState([]);
  const departments = useSelector((state) => state.dropdown.departments);

  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    department: null,
    jobTitle: null,
    wage: 0,
  });

  const assignedDepartmentIds = employeeDepartmentList.map(
    (d) => d?.department?._id,
  );

  const availableDepartments = departments.filter(
    (dept) => !assignedDepartmentIds.includes(dept._id),
  );

  useEffect(() => {
    if (departmentId) {
      dispatch(
        getEmployeeDepartment(id, departmentId, setLoading, (res) => {
          setData({
            department: res.department,
            wage: res.wage,
          });
        }),
      );
    }
  }, [departmentId]);

  useEffect(() => {
    if (data.department) {
      dispatch(
        getJobTitlesForDepartment(
          id,
          data.department,
          setLoading,
          (success, eventData) => {
            if (success) {
              setJobTitles(eventData.jobTitles);
            }
          },
        ),
      );
    }
  }, [data.department]);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData, ["jobTitle"])) {
      if (id) {
        dispatch(
          addOrUpdateEmployeeDepartment(
            id,
            departmentId,
            data,
            setLoading,
            (success, formErrors) => {
              if (success) {
                getDepartments();
                onHide();
              } else {
                setData((prev) => ({ ...prev, formErrors }));
              }
            },
          ),
        );
      }
    }
  };

  useEffect(() => {
    if (data.jobTitle && jobTitles.length > 0) {
      const selected = jobTitles.find((j) => j._id === data.jobTitle);

      if (selected) {
        setData((prev) => ({
          ...prev,
          wage: selected.defaultWage,
        }));
      }
    }
  }, [data.jobTitle, jobTitles]);

  return (
    <CustomDialog title="Employee Department" visible={show} onHide={onHide}>
      <CustomForm
        onSubmit={handleSubmit}
        submitLabel="Save"
        submitLoading={loading}
        onCancel={onHide}
      >
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="department"
          loading={loading}
          options={availableDepartments}
          // optionsType="departments"
          required
          col={12}
        />

        {data?.department && (
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="jobTitle"
            col={12}
            options={jobTitles}
          />
        )}
        <CustomCurrencyInput
          data={data}
          onChange={handleChange}
          name="wage"
          col={12}
          required
        />
      </CustomForm>
    </CustomDialog>
  );
}
export default React.memo(EmployeeDepartmentForm);
