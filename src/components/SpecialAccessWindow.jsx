import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearForbidden } from "@store/common/commonSlice";

import CustomForm from "@inputs/CustomForm";
import CustomPassword from "@inputs/CustomPassword";
import formValidation, { showFormErrors } from "@formValidations";
import CustomDialog from "@shared/overlays/CustomDialog";
import { requestAccess } from "@store/common/commonActions";
import {
  cancelPendingForbiddenRequest,
  retryPendingForbiddenRequest,
} from "@services/api";
import {
  clearAuthenticatedAccess,
  isAuthenticatedAccess,
} from "@services/auth";

function SpecialAccessWindow() {
  const dispatch = useDispatch();
  const { isForbidden } = useSelector((state) => state.common);
  const { forbiddenMessage } = useSelector((state) => state.common);

  const [activeSession, setActiveSession] = useState(null);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ accessCode: "" });

  const [timeLeft, setTimeLeft] = useState(0);
  useEffect(() => {
    CheckAccess();
  }, []);

  function CheckAccess() {
    let access = isAuthenticatedAccess();
    if (access) {
      const accessData = access?.data || {};
      let { accessName, exp } = accessData;
      exp = exp * 1000;
      const now = Date.now();
      const remaining = Math.max(0, exp - now);
      setTimeLeft(remaining);
      setActiveSession({ accessName, exp });
    }
  }

  function ClearAccessSession() {
    clearAuthenticatedAccess(() => {
      setTimeLeft(0);
      setActiveSession(null);
    });
  }

  useEffect(() => {
    if (!timeLeft) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft <= 0 && activeSession) {
      ClearAccessSession();
    }
  }, [timeLeft, activeSession]);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      dispatch(
        requestAccess(data, setLoading, (success, formErrors) => {
          if (success) {
            dispatch(clearForbidden());
            CheckAccess();
            void retryPendingForbiddenRequest();
            setData({ accessCode: "" });
          } else {
            setData((prev) => ({ ...prev, formErrors }));
          }
        })
      );
    }
  };

  const onHide = () => {
    void cancelPendingForbiddenRequest();
    dispatch(clearForbidden());
  };

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <>
      {activeSession && (
        <>
          <div className="special-access-box"></div>
          <div className="special-session-info my-auto">
            <span>{activeSession?.accessName}</span>{" "}
            <span>
              {minutes}:{seconds < 10 ? "0" : ""}
              {seconds}
            </span>
            <span title="Clear Session" onClick={ClearAccessSession}>
              <i className="pi pi-times"></i>
            </span>
          </div>
        </>
      )}
      <CustomDialog title="Access Denied" visible={isForbidden} onHide={onHide}>
        <CustomForm
          onSubmit={handleSubmit}
          submitLabel="Request Access"
          submitLoading={loading}
          onCancel={onHide}
          fullWidthButtons
        >
          <div className="text-color-primary c-col-12">{forbiddenMessage}</div>
          <CustomPassword
            data={data}
            onChange={handleChange}
            name="accessCode"
            required
            col={12}
          />
        </CustomForm>
      </CustomDialog>
    </>
  );
}
export default React.memo(SpecialAccessWindow);
