import React from "react";

export default function VisitorTypeStep({ onSelect }) {
  return (
    <div className="vr-step-inner">
      <h2 className="vr-heading">What would you like to do?</h2>
      <div className="vr-type-list">
        <button className="vr-type-card" onClick={() => onSelect("PROSPECT")}>
          <span>I'm visiting as a guest</span>
          <i className="pi pi-arrow-right" />
        </button>
        <button className="vr-type-card" onClick={() => onSelect("MEMBER")}>
          <span>I'm interested in joining</span>
          <i className="pi pi-arrow-right" />
        </button>
      </div>
    </div>
  );
}
