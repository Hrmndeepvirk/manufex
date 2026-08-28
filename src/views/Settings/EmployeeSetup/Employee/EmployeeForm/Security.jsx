import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import formValidation, { showFormErrors } from "@formValidations";
import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomInput from "@inputs/CustomInput";
import CustomPassword from "@inputs/CustomPassword";
import CustomDropdown from "@inputs/CustomDropdown";
import CustomPickList from "@inputs/CustomPickList";
import {
  addOrUpdateEmployee,
  getEmployeeAccessCode,
  requestPassword,
} from "@store/settings/employeeSetup/employeeActions";
import CustomCalendarInput from "../../../../../shared/inputs/CustomCalendarInput";
import CustomImageInput from "../../../../../shared/inputs/CustomImageInput";
import { substractYears } from "../../../../../utils/dateTime";

function Security({ employee, onSaveSuccess }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [accessCodeLoading, setAccessCodeLoading] = useState(false);
  const [showAccessCode, setShowAccessCode] = useState(false);
  const [data, setData] = useState({
    image: "",
    firstName: "",
    lastName: "",
    gender: "MALE",
    jobTitle: null,
    dob: null,
    socialSecurity: "",
    employeeId: "",
    accessCode: "",
    email: "",
    multiClubClockIn: false,
    securityRoles: [],
  });

  useEffect(() => {
    if (employee) {
      setData({
        image: employee.image || "",
        gender: employee.gender,
        firstName: employee.firstName || "",
        lastName: employee.lastName || "",
        jobTitle: employee.jobTitle || null,
        dob: employee.dob || "",
        socialSecurity: employee.socialSecurity || "",
        employeeId: employee.employeeId || "",
        accessCode: "",
        email: employee.email || "",
        multiClubClockIn: employee.multiClubClockIn || false,
        securityRoles: employee.securityRoles || [],
      });
      setShowAccessCode(false);
    }
  }, [employee]);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data, [
      "gender",
      "dob",
      "accessCode",
    ]);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleAccessCodeClick = () => {
    if (!id) return;

    if (data.accessCode) {
      setShowAccessCode((prev) => !prev);
      return;
    }

    dispatch(
      getEmployeeAccessCode(id, setAccessCodeLoading, (res) => {
        if (res?.accessCode) {
          setData((prev) => ({
            ...prev,
            accessCode: res.accessCode || "",
          }));
          setShowAccessCode(true);
        }
      }),
    );
  };

  const handleSubmit = async (e, next) => {
    e.preventDefault();
    if (showFormErrors(data, setData, ["gender", "dob", "accessCode"])) {
      dispatch(
        addOrUpdateEmployee(id, data, setLoading, (success, payload) => {
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

  return (
    <>
      <FormPageLayout
        backText="Employees"
        submitLoading={loading}
        onSubmit={handleSubmit}
        onSubmitNextTab={handleSubmit}
      >
        <CustomCard title="Personal">
          <CustomImageInput data={data} onChange={handleChange} name="image" />
          <CustomInput
            data={data}
            onChange={handleChange}
            name="firstName"
            required
          />
          <CustomInput
            data={data}
            onChange={handleChange}
            name="lastName"
            required
          />
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="jobTitle"
            optionsType="jobTitles"
            required
          />
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="gender"
            optionsType={"GenderTypes"}
          />
          <CustomCalendarInput
            data={data}
            onChange={handleChange}
            name="dob"
            label="Date of Birth"
            dateString
            readOnlyInput
            maxDate={substractYears(10)}
            minDate={substractYears(100)}
          />
          <CustomPassword
            data={data}
            onChange={handleChange}
            name="socialSecurity"
          />
        </CustomCard>
        <CustomCard
          title="System Access"
          buttons={
            id
              ? [
                  {
                    label: "Send Employee's New Password Via Email",
                    onClick: () => {
                      dispatch(requestPassword(id, setLoading));
                    },
                  },
                ]
              : []
          }
          actions
        >
          <CustomPassword
            data={data}
            onChange={handleChange}
            name="employeeId"
            label="Employee ID"
            required
          />
          <CustomInput
            data={data}
            onChange={handleChange}
            name="accessCode"
            type={showAccessCode ? "text" : "password"}
            inputRightElement={
              id ? (
                <i
                  className={`pi ${showAccessCode ? "pi-eye-slash" : "pi-eye"} cursor-pointer text-primary`}
                  title={
                    data.accessCode
                      ? showAccessCode
                        ? "Hide access code"
                        : "Show access code"
                      : "Load access code"
                  }
                  onClick={handleAccessCodeClick}
                  style={{
                    opacity: accessCodeLoading ? 0.6 : 1,
                    pointerEvents: accessCodeLoading ? "none" : "auto",
                  }}
                />
              ) : null
            }
            disabled={accessCodeLoading}
          />
          <CustomInput
            data={data}
            onChange={handleChange}
            type="email"
            name="email"
            required
          />
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="multiClubClockIn"
            label="Allow Multi-Club Clock In/Out"
            booleanOptions
          />
        </CustomCard>
        <CustomCard title="Security Roles">
          <CustomPickList
            data={data}
            onChange={handleChange}
            name="securityRoles"
            optionsType="securityRoles"
            required
            hideLabel
          />
        </CustomCard>
      </FormPageLayout>
    </>
  );
}
export default React.memo(Security);
