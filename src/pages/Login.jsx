import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CustomForm from "@inputs/CustomForm";
import CustomInput from "@inputs/CustomInput";
import CustomPassword from "@inputs/CustomPassword";
import CustomCheckbox from "@inputs/CustomCheckbox";
import AuthLayout from "../components/auth/AuthLayout";
import { loginAction } from "@store/user/userActions";
import formValidation, { showFormErrors } from "@formValidations";
import { isAuthenticated } from "@services/auth";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      dispatch(
        loginAction(data, setLoading, (_, err) => {
          if (err) {
            setData((prev) => ({ ...prev, formErrors: err }));
          } else {
            navigate("/dashboard");
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

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Log in to your dashboard and manage your gym business seamlessly."
      footerContent={
        <Link to="/visitor-registeration" className="text-highlight font-semibold">
          New Visitor? Want to register?
        </Link>
      }
    >
      <CustomForm
        onSubmit={handleLogin}
        submitLabel="Log In"
        submitLoading={loading}
        fullWidthButtons
      >
        <CustomInput
          data={data}
          onChange={handleChange}
          name="email"
          required
          col={12}
        />
        <CustomPassword
          data={data}
          onChange={handleChange}
          name="password"
          required
          col={12}
        />
        <CustomCheckbox
          data={data}
          onChange={handleChange}
          name="rememberMe"
          label="Remember Me"
          col={6}
        />
        <Link
          to="/forgot-password"
          className="c-col-6 text-right text-highlight font-semibold"
        >
          Forgot Password?
        </Link>
      </CustomForm>
    </AuthLayout>
  );
}
