import React, { useState, useEffect } from "react";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomForm from "@inputs/CustomForm";
import CustomInput from "../../../shared/inputs/CustomInput";
import CustomDropdown from "../../../shared/inputs/CustomDropdown";
import CustomCalendarInput from "../../../shared/inputs/CustomCalendarInput";
import { useDispatch } from "react-redux";
import { updateMember } from "../../../store/member/memberActions";
import { useResourceRequest } from "../../../hooks/useResourceRequest";

export default function EditPersonal({ visible, onHide, data, setData }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    socialSecurity: "",
    occupation: "",
    employer: "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        gender: data.gender || "",
        dob: data.dob || "",
        socialSecurity: data.socialSecurity || "",
        occupation: data.occupation || "",
        employer: data.employer || "",
      });
    }
  }, [data]);

  const handleChange = ({ name, value }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      updateMember(data._id, form, (success, formErrors) => {
        if (success) {
          onHide();
          setData((prev) => ({ ...prev, ...form }));
        } else {
          setForm((prev) => ({ ...prev, formErrors }));
        }
      })
    );
  };

  const { buttons: requestButtons } = useResourceRequest({
    permission: "REQUEST-PERSONAL-INFORMATION",
    targetCollection: "MEMBER",
    id: data?._id,
    data: form,
    setData: setForm,
  });

  return (
    <CustomDialog
      title="Edit Personal Details"
      visible={visible}
      onHide={onHide}
    >
      <CustomForm onSubmit={handleSubmit} onCancel={onHide} buttons={requestButtons}>
        <CustomInput
          data={form}
          onChange={handleChange}
          name="firstName"
          col={6}
          required
        />
        <CustomInput
          data={form}
          onChange={handleChange}
          name="lastName"
          col={6}
          required
        />

        <CustomDropdown
          data={form}
          onChange={handleChange}
          name="gender"
          optionsType={"GenderTypes"}
          col={6}
        />
        <CustomCalendarInput
          data={form}
          onChange={handleChange}
          name="dob"
          col={6}
          dateString
        />
        <CustomInput
          data={form}
          onChange={handleChange}
          name="socialSecurity"
          col={6}
        />
        <CustomInput
          data={form}
          onChange={handleChange}
          name="occupation"
          col={6}
        />
        <CustomInput
          data={form}
          onChange={handleChange}
          name="employer"
          col={12}
        />
      </CustomForm>
    </CustomDialog>
  );
}
