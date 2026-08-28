import React, { useState, useEffect } from "react";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomForm from "@inputs/CustomForm";
import CustomPassword from "@shared/inputs/CustomPassword";
import formValidation, { showFormErrors } from "@formValidations";
import { useDispatch } from "react-redux";
import { eventEmployeeVerification } from "../../../store/calendar/calendarEventActions";

export default function EmployeeVerificationDialog({
  id,
  selectedEmployee,
  visible,
  onHide,
  onSuccess,
}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    accessCode: "",
  });

  const handleCancel = () => {
    onHide();
    setData({ accessCode: "" });
  };

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      accessCode: data?.accessCode,
      employeeId: selectedEmployee,
    };
    if (showFormErrors(data, setData)) {
      dispatch(
        eventEmployeeVerification(
          id,
          setLoading,
          payload,
          (success, formErrors) => {
            if (success) {
              onSuccess && onSuccess(selectedEmployee);
              handleCancel();
            } else {
              setData((prev) => ({ ...prev, formErrors }));
            }
          },
        ),
      );
    }
  };
  return (
    <CustomDialog
      title="Verify Employee"
      visible={visible}
      onHide={handleCancel}
    >
      <CustomForm
        onSubmit={handleSubmit}
        submitLabel="Verify"
        submitLoading={loading}
        onCancel={onHide}
      >
        <CustomPassword
          data={data}
          onChange={handleChange}
          name="accessCode"
          col={12}
          required
        />
      </CustomForm>
    </CustomDialog>
  );
}
