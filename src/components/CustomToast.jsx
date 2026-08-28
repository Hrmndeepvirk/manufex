import React, { useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { useSelector } from "react-redux";

export default function CustomToast() {
  const toast = useRef(null);
  const toastInfo = useSelector((state) => state.common.toast);

  useEffect(() => {
    if (toastInfo) {
      toast.current.show({
        severity: toastInfo.type,
        summary: toastInfo.title,
        detail: toastInfo.description,
        life: toastInfo.life,
        content: (props) => (
          <div className="my-auto">
            {props.message.title && (
              <div className="font-bold text-lg">{props.message.title}</div>
            )}
            {props.message.detail && <div>{props.message.detail}</div>}
          </div>
        ),
      });
    }
  }, [toastInfo]);

  return <Toast ref={toast} />;
}
