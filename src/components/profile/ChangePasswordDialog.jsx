import React, { useState, useEffect } from "react";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomForm from "@inputs/CustomForm";
import CustomPassword from "@inputs/CustomPassword";
import formValidation, { showFormErrors } from "@formValidations";
import { useDispatch } from "react-redux";
import { changePasswordAction } from "../../store/user/userActions";

function ChangePasswordDialog({ profile, visible, onHide }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((p) => ({ ...p, [name]: value, formErrors }));
  };

  const handleHide = () => onHide();

  const handleChangePassword = (e) => {
    e.preventDefault();

    if (showFormErrors(data, setData)) {
      dispatch(
        changePasswordAction(
          { password: data?.oldPassword, newPassword: data?.password },
          setLoading,
          (success) => {
            handleHide();
          },
        ),
      );
    }
  };

  const changeForm = () => (
    <CustomForm
      onSubmit={handleChangePassword}
      onCancel={handleHide}
      submitLoading={loading}
    >
      <CustomPassword
        data={data}
        onChange={handleChange}
        name="oldPassword"
        col={12}
        required
      />
      <CustomPassword
        data={data}
        onChange={handleChange}
        name="password"
        label="New Password"
        placeholder="Enter New Password"
        col={12}
        required
      />
      <CustomPassword
        data={data}
        onChange={handleChange}
        name="confirmPassword"
        label="Re-enter Password"
        col={12}
        required
      />

      {/* <div
        className="c-col-12 underline cursor-pointer text-right text-highlight font-semibold"
        onClick={() => setStep("EMAIL")}
      >
        Forgot Password?
      </div> */}
    </CustomForm>
  );

  return (
    <CustomDialog title="Reset Your Password" visible={visible} onHide={onHide}>
      {changeForm()}
    </CustomDialog>
  );
}

export default React.memo(ChangePasswordDialog);
