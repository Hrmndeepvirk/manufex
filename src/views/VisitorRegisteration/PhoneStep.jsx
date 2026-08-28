import React, { useState } from "react";

export default function PhoneStep({ data, handleChange }) {
  const [consent, setConsent] = useState(data.marketingConsent !== false);

  const handleConsentToggle = () => {
    const newVal = !consent;
    setConsent(newVal);
    handleChange({ name: "marketingConsent", value: newVal });
  };

  return (
    <div className="vr-step-inner">
      <h2 className="vr-heading">What is your mobile phone number?</h2>
      <div className="vr-field">
        <input
          type="tel"
          name="mobilePhone"
          value={data.mobilePhone || ""}
          onChange={(e) =>
            handleChange({ name: "mobilePhone", value: e.target.value })
          }
          placeholder="212-555-2222"
          autoFocus
          className="vr-native-input"
        />
        {/* <p className="">
        Your mobile phone number is your ID. We will never use it to spam or share it with others.
      </p> */}
      </div>

      <div className="vr-checkbox-field" onClick={handleConsentToggle}>
        <input
          type="checkbox"
          checked={consent}
          onChange={handleConsentToggle}
          readOnly
        />
        <span className="vr-checkbox-label">
          I consent to receive recurring marketing/promotional updates
        </span>
      </div>
      <p className="vr-disclaimer">
        By providing your mobile number and checking the above box, you agree to
        related text messages from Valence at the cell number you provided when
        signing up. Reply STOP to unsubscribe. Message frequency varies. Message
        & data rates may apply.
      </p>
    </div>
  );
}
