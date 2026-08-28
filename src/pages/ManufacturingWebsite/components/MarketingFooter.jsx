import { Link } from "react-router-dom";
import { company } from "../data/siteContent";

export default function MarketingFooter() {
  return (
    <footer className="manufacturing-footer" id="contact">
      <div className="manufacturing-footer__inner">
        <div className="manufacturing-footer__brand">
          <Link className="manufacturing-logo" to="/">
            <span className="manufacturing-logo-mark">
              <i className="pi pi-slack" aria-hidden="true" />
            </span>
            <span>{company.name}</span>
          </Link>
          <p>
            Modern manufacturing, automation, and engineering support for teams
            building serious industrial capacity.
          </p>
          <div className="manufacturing-socials" aria-label="Social links">
            <a href="#" aria-label="LinkedIn">
              <i className="pi pi-linkedin" />
            </a>
            <a href="#" aria-label="Twitter">
              <i className="pi pi-twitter" />
            </a>
            <a href="#" aria-label="Facebook">
              <i className="pi pi-facebook" />
            </a>
          </div>
        </div>

        <div>
          <h3>Company</h3>
          <Link to="/about">About Us</Link>
          <a href="#services">Services</a>
          <a href="#projects">Projects</a>
        </div>

        <div>
          <h3>Services</h3>
          <a href="#services">Industrial Automation</a>
          <a href="#services">Equipment Installation</a>
          <a href="#services">Process Optimization</a>
          <a href="#services">Machine Maintenance</a>
        </div>

        <div>
          <h3>Contact</h3>
          <a href={`mailto:${company.email}`}>{company.email}</a>
          <a href={`tel:${company.phone.replace(/[^+\d]/g, "")}`}>{company.phone}</a>
          <p>{company.address}</p>
        </div>
      </div>
      <div className="manufacturing-footer__bottom">
        © 2026 {company.name}. All rights reserved.
      </div>
    </footer>
  );
}
