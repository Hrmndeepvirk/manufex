import React from "react";

export default function ActivationCodeStep({ data, handleChange, onNext, loading }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && data.activationCode) onNext();
  };

  return (
    <div className="visitor-registration-activation">
      <div className="vr-activation-content">
        <h2 className="vr-heading">Enter Your Activation Code to Begin</h2>
        <p className="vr-subtext">
          Your activation code is provided by your facility. Enter it below to get started.
        </p>
        <div className="vr-activation-input">
          <input
            type="text"
            name="activationCode"
            value={data.activationCode || ""}
            onChange={(e) => handleChange({ name: "activationCode", value: e.target.value })}
            onKeyDown={handleKeyDown}
            placeholder="Activation Code"
            autoFocus
          />
        </div>
        <button
          className="vr-btn-signin"
          onClick={onNext}
          disabled={loading || !data.activationCode}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </div>
    </div>
  );
}
