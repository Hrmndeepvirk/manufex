import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import formValidation, { showFormErrors } from "@formValidations";
import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomInput from "@inputs/CustomInput";
import CustomPhoneInput from "@inputs/CustomPhoneInput";
import CustomTextArea from "@inputs/CustomTextArea";
import CustomDropdown from "@inputs/CustomDropdown";
import CustomAddress from "@inputs/CustomAddress";

import { addOrUpdateEmployee } from "@store/settings/employeeSetup/employeeActions";
import CustomCalendarInput from "../../../../../shared/inputs/CustomCalendarInput";

function General({ employee, onSaveSuccess }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const hireDateBeforeDobMessage =
    "Hiring Date cannot be earlier than Date of Birth!";
  const [data, setData] = useState({
    hireDate: "",
    adpId: "",
    createdAt: "",
    contactName: "",
    primaryPhone: "",
    workPhone: "",
    mobilePhone: "",
    faxPhone: "",
    emergencyPhone: "",
    address: {},
    emailNotification: true,
    onlineNickName: "",
    alternateEmail: "",
    bio: "",
    facebook: "",
    instagram: "",
    x: "",
    linkedin: "",
  });

  useEffect(() => {
    if (employee) {
      setData({
        hireDate: employee.hireDate || "",
        adpId: employee.adpId || "",
        createdAt: employee.createdAt || "",
        contactName: employee.contactName || "",
        primaryPhone: employee.primaryPhone || "",
        workPhone: employee.workPhone || "",
        mobilePhone: employee.mobilePhone || "",
        faxPhone: employee.faxPhone || "",
        emergencyPhone: employee.emergencyPhone || "",
        address: employee.addressLine1
          ? {
              value: [employee.addressLine1, employee.city, employee.state, employee.zipCode].filter(Boolean).join(", "),
              addressLine1: employee.addressLine1 || "",
              addressLine2: employee.addressLine2 || "",
              city: employee.city || "",
              state: employee.state || "",
              zipCode: employee.zipCode || "",
            }
          : {},
        emailNotification: employee.emailNotification || "",
        onlineNickName: employee.onlineNickName || "",
        alternateEmail: employee.alternateEmail || "",
        bio: employee.bio || "",
        facebook: employee.facebook || "",
        instagram: employee.instagram || "",
        x: employee.x || "",
        linkedin: employee.linkedin || "",
      });
    }
  }, [employee]);

  const employeeDobDate = useMemo(() => {
    if (!employee?.dob) return null;
    const dobDate = new Date(employee.dob);
    if (Number.isNaN(dobDate.getTime())) return null;
    dobDate.setHours(0, 0, 0, 0);
    return dobDate;
  }, [employee?.dob]);

  const isHireDateBeforeDob = (hireDate) => {
    if (!employeeDobDate || !hireDate) return false;

    const hireDateValue = new Date(hireDate);
    if (Number.isNaN(hireDateValue.getTime())) return false;
    hireDateValue.setHours(0, 0, 0, 0);

    return hireDateValue < employeeDobDate;
  };

  useEffect(() => {
    if (!data.hireDate || !employeeDobDate) return;

    const hireDateValue = new Date(data.hireDate);
    if (Number.isNaN(hireDateValue.getTime())) return;
    hireDateValue.setHours(0, 0, 0, 0);

    const invalid = hireDateValue < employeeDobDate;

    setData((prev) => {
      const currentError = prev.formErrors?.hireDate || "";

      if (invalid) {
        if (currentError === hireDateBeforeDobMessage) return prev;
        return {
          ...prev,
          formErrors: {
            ...(prev.formErrors || {}),
            hireDate: hireDateBeforeDobMessage,
          },
        };
      }

      if (currentError !== hireDateBeforeDobMessage) return prev;

      return {
        ...prev,
        formErrors: {
          ...(prev.formErrors || {}),
          hireDate: "",
        },
      };
    });
  }, [data.hireDate, employeeDobDate]);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data, ["primaryPhone"]);

    if (name === "hireDate") {
      if (isHireDateBeforeDob(value)) {
        formErrors.hireDate = hireDateBeforeDobMessage;
      } else {
        formErrors.hireDate = "";
      }
    }

    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = async (e, next) => {
    e.preventDefault();

    if (isHireDateBeforeDob(data.hireDate)) {
      setData((prev) => ({
        ...prev,
        formErrors: {
          ...prev.formErrors,
          hireDate: hireDateBeforeDobMessage,
        },
      }));
      return;
    }

    if (showFormErrors(data, setData, ["primaryPhone"])) {
      const { address, ...rest } = data;
      const payload = {
        ...rest,
        addressLine1: address?.addressLine1 || "",
        addressLine2: address?.addressLine2 || "",
        city: address?.city || "",
        state: address?.state || "",
        zipCode: address?.zipCode || "",
      };
      dispatch(
        addOrUpdateEmployee(id, payload, setLoading, (success, formErrors) => {
          if (success) {
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
    <>
      <FormPageLayout
        backText="Employees"
        submitLoading={loading}
        onSubmit={handleSubmit}
        onSubmitNextTab={handleSubmit}
      >
        <CustomCard title="Employment" size={6}>
          <CustomCalendarInput
            data={data}
            onChange={handleChange}
            name="hireDate"
            minDate={employeeDobDate || undefined}
            dateString
            readOnlyInput
          />
          <CustomInput data={data} onChange={handleChange} name="adpId" />
          <CustomCalendarInput
            data={data}
            onChange={handleChange}
            name="createdAt"
            disabled
            hideIcon
          />
        </CustomCard>
        <CustomCard title="Contact" size={6}>
          <CustomInput
            data={data}
            onChange={handleChange}
            name="contactName"
          />

          <CustomPhoneInput
            data={data}
            onChange={handleChange}
            name="primaryPhone"
          />

          <CustomPhoneInput data={data} onChange={handleChange} name="workPhone" />
          <CustomPhoneInput data={data} onChange={handleChange} name="mobilePhone" />
          <CustomPhoneInput data={data} onChange={handleChange} name="faxPhone" />

          <CustomPhoneInput
            data={data}
            onChange={handleChange}
            name="emergencyPhone"
          />

          <CustomAddress
            data={data}
            onChange={handleChange}
            name="address"
            col={12}
          />

          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="emailNotification"
            booleanOptions
          />
          
        </CustomCard>
        <CustomCard title="Online" size={6}>
          <CustomInput
            data={data}
            onChange={handleChange}
            name="onlineNickName"
          />
          <CustomInput
            data={data}
            onChange={handleChange}
            name="alternateEmail"
          />
          <CustomInput data={data} onChange={handleChange} name="facebook" />
          <CustomInput data={data} onChange={handleChange} name="instagram" />
          <CustomInput data={data} onChange={handleChange} name="x" />
          <CustomInput data={data} onChange={handleChange} name="linkedin" />
          <CustomTextArea data={data} onChange={handleChange} name="bio" />
        </CustomCard>
      </FormPageLayout>
    </>
  );
}
export default React.memo(General);
