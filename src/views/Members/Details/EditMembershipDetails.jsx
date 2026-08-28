import React, { useState, useEffect } from "react";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomForm from "@inputs/CustomForm";
import CustomInput from "@inputs/CustomInput";
import { useDispatch } from "react-redux";
import { updateMember } from "@store/member/memberActions";

export default function EditMembershipDetails({ visible, onHide, data, setData }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    barCode: "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        barCode: data.barCode || "",
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
      }),
    );
  };

  return (
    <CustomDialog
      title="Edit Membership Details"
      visible={visible}
      onHide={onHide}
    >
      <CustomForm onSubmit={handleSubmit} onCancel={onHide}>
        <CustomInput
          data={form}
          onChange={handleChange}
          name="barCode"
          col={12}
        />
      </CustomForm>
    </CustomDialog>
  );
}
