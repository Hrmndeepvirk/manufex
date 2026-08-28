import React, { useState } from "react";

export default function EmailStep({ data, handleChange }) {
  const [consent, setConsent] = useState(data.emailConsent !== false);

  const handleConsentToggle = () => {
    const newVal = !consent;
    setConsent(newVal);
    handleChange({ name: "emailConsent", value: newVal });
  };

  return (
    <div className="vr-step-inner">
      <h2 className="vr-heading">What is your email?</h2>
      <div className="vr-field">
        <input
          type="email"
          name="email"
          value={data.email || ""}
          onChange={(e) => handleChange({ name: "email", value: e.target.value })}
          autoFocus
          className="vr-native-input"
        />
      </div>
      <div className="vr-checkbox-field" onClick={handleConsentToggle}>
        <input
          type="checkbox"
          checked={consent}
          onChange={handleConsentToggle}
          readOnly
        />
        <span className="vr-checkbox-label">
          Yes, I would like to receive email messages.
        </span>
      </div>
    </div>
  );
}
