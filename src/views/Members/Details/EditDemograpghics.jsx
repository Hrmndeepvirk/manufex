import React, { useState, useEffect } from "react";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomForm from "@inputs/CustomForm";
import CustomInput from "../../../shared/inputs/CustomInput";
import CustomPhoneInput from "../../../shared/inputs/CustomPhoneInput";
import CustomAddress from "../../../shared/inputs/CustomAddress";
import { useDispatch } from "react-redux";
import { updateMember } from "../../../store/member/memberActions";
import { useResourceRequest } from "../../../hooks/useResourceRequest";

export default function EditDemographics({ visible, onHide, data, setData }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    address: {},
    primaryPhone: "",
    email: "",
    mobilePhone: "",
    workPhone: "",
    govtId: "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        address: data.address || {},
        primaryPhone: data.primaryPhone || "",
        email: data.email || "",
        mobilePhone: data.mobilePhone || "",
        workPhone: data.workPhone || "",
        govtId: data.govtId || "",
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
    <CustomDialog title="Edit Demographics" visible={visible} onHide={onHide}>
      <CustomForm onSubmit={handleSubmit} onCancel={onHide} buttons={requestButtons}>
        <CustomAddress
          data={form}
          onChange={handleChange}
          name="address"
          col={12}
          required
        />
        <CustomPhoneInput
          data={form}
          onChange={handleChange}
          name="primaryPhone"
          col={6}
          required
        />
        <CustomInput
          data={form}
          onChange={handleChange}
          name="email"
          col={6}
          requiredx
        />
        <CustomPhoneInput
          data={form}
          onChange={handleChange}
          name="mobilePhone"
          col={6}
        />
        <CustomPhoneInput
          data={form}
          onChange={handleChange}
          name="workPhone"
          col={6}
        />
        <CustomInput
          data={form}
          onChange={handleChange}
          name="govtId"
          col={12}
        />
      </CustomForm>
    </CustomDialog>
  );
}
