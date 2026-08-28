import React from "react";
import PrimaryButton from "../../shared/buttons/PrimaryButton";

export default function SignInStep({
  company,
  brandStyle,
  onNext,
  onChangeAccount,
}) {
  const logoObj = company?.brandAssets?.logo;
  const logo =
    logoObj?.primary || logoObj?.square || logoObj?.horizontal || null;

  return (
    <div className="visitor-registration-signin" style={brandStyle}>
      <div className="vr-signin-content">
        <div className="vr-company-logo">
          {logo ? (
            <img src={logo} alt={company?.name || "Company"} />
          ) : (
            <div className="vr-logo-placeholder">
              <i className="pi pi-building" />
            </div>
          )}
        </div>
        <PrimaryButton
          label={"Sign In"}
          iconPos={"right"}
          onClick={onNext}
          className={"vr-btn-signin"}
          icon={"pi pi-arrow-right"}
        />
      </div>
      <div className="vr-signin-footer">
        <div className="vr-footer-col">QR</div>
        <div className="vr-footer-col">Powered by Valence</div>
        <div className="vr-footer-col">
          <button onClick={onChangeAccount}>Change Account</button>
        </div>
      </div>
    </div>
  );
}
