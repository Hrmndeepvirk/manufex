import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { company, navItems } from "../data/siteContent";
import MarketingButton from "./MarketingButton";

export default function MarketingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("manufacturing-menu-open", menuOpen);
    return () => document.body.classList.remove("manufacturing-menu-open");
  }, [menuOpen]);

  const renderLink = (item) => {
    if (item.path.startsWith("#")) {
      return (
        <a key={item.label} href={item.path} onClick={() => setMenuOpen(false)}>
          {item.label}
        </a>
      );
    }

    return (
      <NavLink key={item.label} to={item.path}>
        {item.label}
      </NavLink>
    );
  };

  return (
    <header className="manufacturing-header">
      <Link className="manufacturing-logo" to="/" aria-label={`${company.name} home`}>
        <span className="manufacturing-logo-mark">
          <i className="pi pi-slack" aria-hidden="true" />
        </span>
        <span>{company.name}</span>
      </Link>

      <nav className="manufacturing-nav" aria-label="Main navigation">
        {navItems.map(renderLink)}
      </nav>

      <div className="manufacturing-header-actions">
        <MarketingButton href="#contact" icon="pi pi-send">
          Get a Quote
        </MarketingButton>
        <button
          className="manufacturing-menu-toggle"
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </div>

      <div className={`manufacturing-mobile-nav ${menuOpen ? "is-open" : ""}`}>
        {navItems.map(renderLink)}
        <MarketingButton href="#contact" icon="pi pi-send">
          Get a Quote
        </MarketingButton>
      </div>
    </header>
  );
}
