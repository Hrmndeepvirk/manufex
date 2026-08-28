import React, { useState } from "react";
import CustomAddress from "@shared/inputs/CustomAddress";

export default function AddressStep({ data, handleChange, onSubmit, loading }) {
  const [manualEntry, setManualEntry] = useState(false);

  return (
    <div className="vr-step-inner">
      <h2 className="vr-heading">Please enter your home address</h2>

      {!manualEntry ? (
        <>
          <div className="vr-field">
            <CustomAddress
              name="address"
              label="Address"
              data={data}
              onChange={handleChange}
              col={12}
            />
          </div>
          <button
            className="vr-manual-link"
            onClick={() => setManualEntry(true)}
          >
            Enter address manually <i className="pi pi-arrow-right" />
          </button>
        </>
      ) : (
        <>
          <div className="vr-address-field">
            <div className="vr-address-label">Street number and name</div>
            <input
              type="text"
              name="street"
              value={data.street || ""}
              onChange={(e) => handleChange({ name: "street", value: e.target.value })}
              autoFocus
            />
          </div>
          <div className="vr-address-row">
            <div className="vr-address-field">
              <div className="vr-address-label">City / Town</div>
              <input
                type="text"
                name="city"
                value={data.city || ""}
                onChange={(e) => handleChange({ name: "city", value: e.target.value })}
              />
            </div>
            <div className="vr-address-field">
              <div className="vr-address-label">State / Region</div>
              <input
                type="text"
                name="state"
                value={data.state || ""}
                onChange={(e) => handleChange({ name: "state", value: e.target.value })}
              />
            </div>
          </div>
          <div className="vr-address-field" style={{ maxWidth: "50%" }}>
            <div className="vr-address-label">Zip / Postal Code</div>
            <input
              type="text"
              name="zipCode"
              value={data.zipCode || ""}
              onChange={(e) => handleChange({ name: "zipCode", value: e.target.value })}
            />
          </div>
          <button
            className="vr-btn-submit"
            onClick={onSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </>
      )}
    </div>
  );
}
