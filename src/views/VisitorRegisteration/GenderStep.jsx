import React from "react";

const genderOptions = [
  { label: "Female", value: "FEMALE" },
  { label: "Male", value: "MALE" },
  { label: "Unspecified", value: "OTHER" },
];

export default function GenderStep({ data, handleChange, onSelect }) {
  const handleClick = (value) => {
    handleChange({ name: "gender", value });
    setTimeout(() => onSelect(value), 300);
  };

  return (
    <div className="vr-step-inner">
      <h2 className="vr-heading">Your gender</h2>
      <div className="vr-gender-list">
        {genderOptions.map((opt) => (
          <button
            key={opt.value}
            className={`vr-gender-option ${data.gender === opt.value ? "selected" : ""}`}
            onClick={() => handleClick(opt.value)}
          >
            <span className="vr-radio-circle">
              <span className="vr-radio-dot" />
            </span>
            <span className="vr-gender-label">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
