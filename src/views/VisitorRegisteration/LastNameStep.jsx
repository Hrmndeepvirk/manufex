import React from "react";

export default function LastNameStep({ data, handleChange }) {
  return (
    <div className="vr-step-inner">
      <h2 className="vr-heading">What is your last name?</h2>
      <div className="vr-field">
        <input
          type="text"
          name="lastName"
          value={data.lastName || ""}
          onChange={(e) => handleChange({ name: "lastName", value: e.target.value })}
          autoFocus
          className="vr-native-input"
        />
      </div>
    </div>
  );
}
