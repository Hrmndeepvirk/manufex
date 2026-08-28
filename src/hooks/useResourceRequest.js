import { useState } from "react";
import { useDispatch } from "react-redux";
import { showFormErrors } from "@formValidations";
import { customConfirmDialog } from "@shared/overlays/CustomConfirmDialog";
import { createRequest } from "@store/settings/employeeSetup/requestActions";
import { setToast } from "@store/common/commonSlice";
import { useCan } from "./useCan";

export const useResourceRequest = ({
  permission,
  targetCollection,
  id,
  data,
  setData,
  ignore = [],
  buildChangedData,
}) => {
  const dispatch = useDispatch();
  const canRequest = useCan(permission);
  const [requestLoading, setRequestLoading] = useState(false);
  const requestActionLabel = id ? "Request Edit" : "Request Add";

  const handleRequest = () => {
    const resolvedIgnore = typeof ignore === "function" ? ignore(data) : ignore;
    if (!showFormErrors(data, setData, resolvedIgnore)) return;

    customConfirmDialog({
      message: id
        ? "Submit these changes as an edit request? They will not apply until an approver reviews them."
        : "Submit this as a new-record request? It will not be created until an approver reviews it.",
      accept: () => {
        const defaultBuild = (d) => {
          const { formErrors: _f, ...rest } = d;
          return rest;
        };
        const payload = {
          requestType: permission,
          targetCollection,
          targetItem: id || null,
          changedData: (buildChangedData || defaultBuild)(data),
        };
        dispatch(
          createRequest(payload, setRequestLoading, (success, formErrors) => {
            if (success) {
              dispatch(
                setToast({
                  title: "Request Submitted",
                  description: `Your ${id ? "edit" : "add"} request is awaiting approver review.`,
                  type: "success",
                  life: 3000,
                }),
              );
            } else if (formErrors) {
              setData((prev) => ({ ...prev, formErrors }));
            }
          }),
        );
      },
      reject: () => {},
    });
  };

  const buttons = canRequest
    ? [
        {
          label: requestLoading ? "Submitting..." : requestActionLabel,
          onClick: handleRequest,
        },
      ]
    : [];

  return { canRequest, buttons };
};

export default useResourceRequest;
