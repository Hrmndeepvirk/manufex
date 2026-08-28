import React from "react";

export default function PersonMatchStep({ member, matchSource, onConfirm, onNotMe }) {
  const sourceText = matchSource === "phone" ? "mobile phone number" : "e-mail";
  const fullName = `${member?.firstName || ""} ${member?.lastName || ""}`.trim();

  return (
    <div className="vr-step-inner">
      <h2 className="vr-heading">
        Based on your {sourceText}, we found the following details.
      </h2>
      <div className="vr-match-list">
        <button className="vr-match-card" onClick={onConfirm}>
          <span className="vr-match-name">{fullName || "Member"}</span>
          <i className="pi pi-arrow-right" />
        </button>
      </div>
      <button className="vr-not-me-link" onClick={onNotMe}>
        That's not me <i className="pi pi-arrow-right" />
      </button>
    </div>
  );
}
