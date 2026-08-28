import React from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomForm from "@inputs/CustomForm";
import CustomDialog from "@shared/overlays/CustomDialog";
import { useNavigate } from "react-router-dom";
import { clearUnAuthenticated } from "../store/common/commonSlice";
import { logoutAction } from "@store/user/userActions";

function OnUnAuthenticatedWindow() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isUnAuthenticated } = useSelector((state) => state.common);
  const { unAuthenticatedMessage } = useSelector((state) => state.common);

  function onLogout() {
    dispatch(clearUnAuthenticated());
    dispatch(logoutAction(navigate));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onLogout();
  }
  return (
    <>
      <CustomDialog
        title="Session Expired"
        visible={isUnAuthenticated}
        onHide={handleSubmit}
      >
        <CustomForm
          onSubmit={handleSubmit}
          submitLabel="Login Again"
          fullWidthButtons
        >
          <div className="text-color-primary c-col-12">
            {unAuthenticatedMessage}
          </div>
        </CustomForm>
      </CustomDialog>
    </>
  );
}
export default React.memo(OnUnAuthenticatedWindow);
