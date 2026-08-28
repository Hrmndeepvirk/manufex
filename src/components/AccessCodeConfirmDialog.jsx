import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomForm from "@inputs/CustomForm";
import CustomPassword from "@inputs/CustomPassword";
import { verifyEmployeeAccessCode } from "../store/checkin/checkinActions";

const INITIAL_DATA = { accessCode: "", formErrors: {} };

function AccessCodeConfirmDialog({ visible, onHide, employeeId, onVerified }) {
  const dispatch = useDispatch();
  const [data, setData] = useState({ ...INITIAL_DATA });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setData({ ...INITIAL_DATA });
    }
  }, [visible]);

  const handleChange = ({ name, value }) => {
    setData((prev) => ({
      ...prev,
      [name]: value,
      formErrors: { ...prev.formErrors, [name]: "" },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!employeeId) return;

    if (!data.accessCode) {
      setData((prev) => ({
        ...prev,
        formErrors: { accessCode: "Access Code is required!" },
      }));
      return;
    }

    dispatch(
      verifyEmployeeAccessCode(
        employeeId,
        data.accessCode,
        setLoading,
        (success, formErrors) => {
          if (success) {
            onVerified?.();
          } else {
            setData((prev) => ({
              ...prev,
              formErrors: formErrors || {
                accessCode: "Access code is not valid!",
              },
            }));
          }
        },
      ),
    );
  };

  return (
    <CustomDialog
      title="Enter Access Code"
      visible={visible}
      onHide={onHide}
      size="small"
    >
      <CustomForm
        onSubmit={handleSubmit}
        submitLabel="Verify"
        submitLoading={loading}
        onCancel={onHide}
      >
        <CustomPassword
          name="accessCode"
          label="Access Code"
          data={data}
          onChange={handleChange}
          col={12}
          required
        />
      </CustomForm>
    </CustomDialog>
  );
}

export default React.memo(AccessCodeConfirmDialog);
