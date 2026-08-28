import { useSelector } from "react-redux";
import logoLandscape from "@assets/images/AppLogoLandscape.png";
import logoSquare from "@assets/images/AppLogoSquare.png";

export default function AuthLayout({ title, children, footerContent }) {
  const company = useSelector((state) => state.company.details);
  const logoObj = company?.brandAssets?.logo;
  const companyLogo =
    logoObj?.primary || logoObj?.square || logoObj?.horizontal || null;
  const companyEmail = company?.email || null;
  return (
    <div className="auth-layout">
      {/* Left — Brand Panel */}
      <div className="auth-layout__left">
        <div className="auth-layout__brand">
          <img
            src={logoSquare}
            alt="Valence"
            className="auth-layout__brand-logo-square"
          />
          <img
            src={logoLandscape}
            alt="Valence"
            className="auth-layout__brand-logo-landscape"
          />
        </div>

        {/* Floating icon badges */}
        <div className="auth-layout__floating auth-layout__floating--1">
          <i className="bi bi-person-fill" />
        </div>
        <div className="auth-layout__floating auth-layout__floating--2">
          <i className="bi bi-lightning-fill" />
        </div>
        <div className="auth-layout__floating auth-layout__floating--3">
          <i className="bi bi-graph-up-arrow" />
        </div>

        <div className="auth-layout__hero">
          <h1 className="auth-layout__hero-title">
            The operating system for modern fitness clubs.
          </h1>
          <p className="auth-layout__hero-subtitle">
            Manage memberships, workouts, trainers, payments and your entire gym
            ecosystem from one powerful platform.
          </p>
        </div>
      </div>

      {/* Right — Form Panel */}
      <div className="auth-layout__right">
        {/* Mobile logo — visible only when left panel is hidden */}
        <div className="auth-layout__mobile-brand">
          <img
            src={logoSquare}
            alt="Valence"
            className="auth-layout__brand-logo-square"
          />
          <img
            src={logoLandscape}
            alt="Valence"
            className="auth-layout__brand-logo-landscape"
          />
        </div>

        <div className="auth-layout__card">
          {companyLogo && (
            <img
              src={companyLogo}
              alt={company?.name || "Company"}
              className="auth-layout__company-logo"
            />
          )}
          <h1 className="auth-layout__title text-primary">{title}</h1>
          {children}
          {footerContent && (
            <div className="auth-layout__footer">{footerContent}</div>
          )}
          {companyEmail && (
            <div className="auth-layout__support">
              Need help? <a href={`mailto:${companyEmail}`}>{companyEmail}</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
