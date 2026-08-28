import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import CustomInput from "@inputs/CustomInput";
import CustomForm from "@inputs/CustomForm";
import CustomOTP from "@inputs//CustomOTP";
import CustomPassword from "@inputs/CustomPassword";
import AuthLayout from "../components/auth/AuthLayout";
import {
  forgetPasswordAction,
  verifyOtpAndResetPasswordAction,
} from "@store/user/userActions";
import formValidation, { showFormErrors } from "@formValidations";
import { isAuthenticated } from "@services/auth";

export default function ForgetPassword() {
  const [timer, setTimer] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const [isOTPSent, setIsOTPSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
    otpCode: "",
  });

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      dispatch(
        verifyOtpAndResetPasswordAction(data, setLoading, (res, err) => {
          if (err) {
            setData((prev) => ({ ...prev, formErrors: err }));
          } else {
            navigate("/login");
          }
        }),
      );
    }
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData, ["password", "otpCode"])) {
      dispatch(
        forgetPasswordAction({ email: data.email }, setLoading, (res, err) => {
          if (err) {
            setData((prev) => ({ ...prev, formErrors: err }));
          } else {
            setIsOTPSent(true);
            setTimer(45);
          }
        }),
      );
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, []);

  const emailForm = () => (
    <CustomForm
      onSubmit={handleSendEmail}
      submitLabel="Send Reset OTP"
      fullWidthButtons
      submitLoading={loading}
    >
      <CustomInput
        data={data}
        onChange={handleChange}
        name="email"
        required
        col={12}
      />
      <Link
        to="/login"
        className="c-col-12 text-right text-highlight font-semibold"
      >
        Back to Login
      </Link>
    </CustomForm>
  );

  const otpForm = () => (
    <CustomForm
      onSubmit={handleVerifyOTP}
      submitLabel="Verify OTP"
      fullWidthButtons
      submitLoading={loading}
    >
      <CustomOTP
        data={data}
        onChange={handleChange}
        name="otpCode"
        required
        col={12}
        hideLabel
      />
      <CustomPassword
        data={data}
        onChange={handleChange}
        name="password"
        label="New Password"
        required
        col={12}
      />
      <div
        className="c-col-6 text-left text-highlight font-semibold cursor-pointer select-none"
        onClick={() => timer === 0 && handleSendEmail()}
      >
        Resend {timer > 0 ? `in ${timer} sec` : <span>Now</span>}
      </div>
      <Link
        to="/login"
        className="c-col-6 text-right text-highlight font-semibold"
      >
        Back to Login
      </Link>
    </CustomForm>
  );

  const title = isOTPSent ? "OTP Verification" : "Forgot Password?";
  const subtitle = isOTPSent
    ? `Enter the OTP sent to your email (${data.email}).`
    : "Enter your email to receive a password reset OTP.";

  return (
    <AuthLayout title={title} subtitle={subtitle}>
      {isOTPSent ? otpForm() : emailForm()}
    </AuthLayout>
  );
}
