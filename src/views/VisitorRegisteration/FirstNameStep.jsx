import React from "react";

export default function FirstNameStep({ data, handleChange }) {
  return (
    <div className="vr-step-inner">
      <h2 className="vr-heading">What is your first name?</h2>
      <div className="vr-field">
        <input
          type="text"
          name="firstName"
          value={data.firstName || ""}
          onChange={(e) => handleChange({ name: "firstName", value: e.target.value })}
          autoFocus
          className="vr-native-input"
        />
      </div>
    </div>
  );
}
