import React, { useState, useEffect } from "react";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomForm from "@inputs/CustomForm";
import CustomPassword from "../../../shared/inputs/CustomPassword";
import { useDispatch } from "react-redux";
import { updateMember } from "../../../store/member/memberActions";

export default function EditAccessCode({ visible, onHide, data, setData }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    accessCode: "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        accessCode: data?.accessCode,
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

  return (
    <CustomDialog title="Edit Access Code" visible={visible} onHide={onHide}>
      <CustomForm onSubmit={handleSubmit} onCancel={onHide}>
        <CustomPassword
          data={form}
          onChange={handleChange}
          name="accessCode"
          col={12}
          required
        />
      </CustomForm>
    </CustomDialog>
  );
}
