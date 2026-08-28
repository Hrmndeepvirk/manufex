import React, { useState, useRef } from "react";

export default function BirthdayStep({ data, handleChange }) {
  const [mm, setMm] = useState("");
  const [dd, setDd] = useState("");
  const [yyyy, setYyyy] = useState("");
  const ddRef = useRef(null);
  const yyyyRef = useRef(null);

  const updateDob = (month, day, year) => {
    if (month && day && year && year.length === 4) {
      const dob = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      handleChange({ name: "dob", value: dob });
    } else {
      handleChange({ name: "dob", value: "" });
    }
  };

  const handleMm = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 2);
    setMm(val);
    updateDob(val, dd, yyyy);
    if (val.length === 2) ddRef.current?.focus();
  };

  const handleDd = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 2);
    setDd(val);
    updateDob(mm, val, yyyy);
    if (val.length === 2) yyyyRef.current?.focus();
  };

  const handleYyyy = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
    setYyyy(val);
    updateDob(mm, dd, val);
  };

  return (
    <div className="vr-step-inner">
      <h2 className="vr-heading">Your date of birth</h2>
      <div className="vr-birthday-fields">
        <div className="vr-birthday-input">
          <input
            type="text"
            inputMode="numeric"
            value={mm}
            onChange={handleMm}
            placeholder="MM"
            maxLength={2}
            autoFocus
          />
        </div>
        <div className="vr-birthday-input">
          <input
            ref={ddRef}
            type="text"
            inputMode="numeric"
            value={dd}
            onChange={handleDd}
            placeholder="DD"
            maxLength={2}
          />
        </div>
        <div className="vr-birthday-input vr-birthday-year">
          <input
            ref={yyyyRef}
            type="text"
            inputMode="numeric"
            value={yyyy}
            onChange={handleYyyy}
            placeholder="YYYY"
            maxLength={4}
          />
        </div>
      </div>
    </div>
  );
}
