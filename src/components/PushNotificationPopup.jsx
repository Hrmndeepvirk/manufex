import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearPushNotification } from "@store/common/commonSlice";

const AUTO_DISMISS_MS = 5000;

function PushNotificationPopup() {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.common.pushNotification);
  const timerRef = useRef(null);

  useEffect(() => {
    if (notification) {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        dispatch(clearPushNotification());
      }, AUTO_DISMISS_MS);
    }
    return () => clearTimeout(timerRef.current);
  }, [notification]);

  if (!notification) return null;

  return (
    <div className="push-notification-popup">
      <div className="push-notification-popup__header">
        <span className="push-notification-popup__app-label">
          <i className="pi pi-bell" />
          Impact Zone
        </span>
        <button
          className="push-notification-popup__close"
          onClick={() => dispatch(clearPushNotification())}
        >
          <i className="pi pi-times" />
        </button>
      </div>

      <div className="push-notification-popup__body">
        {notification.title && (
          <div className="push-notification-popup__title">{notification.title}</div>
        )}
        {notification.body && (
          <div className="push-notification-popup__message">{notification.body}</div>
        )}
      </div>

      <div className="push-notification-popup__progress">
        <div key={Date.now()} className="push-notification-popup__progress-bar" />
      </div>
    </div>
  );
}

export default React.memo(PushNotificationPopup);
