import React, { useEffect } from "react";

export default function SuccessStep({ firstName, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="vr-success-content">
      <div className="vr-success-icon">
        <i className="pi pi-check-circle" />
      </div>
      <h2 className="vr-heading">Welcome, {firstName}!</h2>
      <p className="vr-subtext">You're all set. Redirecting...</p>
    </div>
  );
}
