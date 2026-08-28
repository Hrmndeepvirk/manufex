import MarketingButton from "./MarketingButton";
import { images } from "../data/siteContent";

export default function HeroSection() {
  return (
    <section className="manufacturing-hero">
      <div className="manufacturing-hero__media" aria-hidden="true">
        <img src={images.hero} alt="" />
      </div>
      <div className="manufacturing-hero__overlay" />
      <div className="manufacturing-container manufacturing-hero__content">
        <div className="manufacturing-hero__copy">
          <span className="manufacturing-eyebrow">[ Industrial Manufacturing ]</span>
          <h1>Modern Industrial Manufacturing</h1>
          <p>
            Manufex helps production teams design, automate, and scale modern
            industrial manufacturing systems with confidence.
          </p>
          <div className="manufacturing-hero__actions">
            <MarketingButton href="#contact" icon="pi pi-send">
              Get a Quote
            </MarketingButton>
            <MarketingButton href="#services" variant="light" icon="pi pi-arrow-down">
              Our Services
            </MarketingButton>
          </div>
        </div>

        <div className="manufacturing-hero__proof" aria-label="Company highlights">
          <div>
            <strong>Automation</strong>
            <span>Smart Production</span>
          </div>
          <div>
            <strong>ISO Certified</strong>
            <span>Global Standards</span>
          </div>
          <div>
            <strong>Technology</strong>
            <span>Modern Systems</span>
          </div>
        </div>
      </div>
    </section>
  );
}
