import MarketingButton from "./MarketingButton";

export default function CTASection() {
  return (
    <section className="manufacturing-cta">
      <div className="manufacturing-container manufacturing-cta__inner">
        <span className="manufacturing-eyebrow">[ Start a Project ]</span>
        <h2>Ready to Build What&apos;s Next?</h2>
        <p>
          Partner with our engineering team to develop reliable, efficient, and
          future-ready manufacturing solutions.
        </p>
        <div className="manufacturing-cta__actions">
          <MarketingButton href="#contact" icon="pi pi-send">
            Get a Quote
          </MarketingButton>
          <MarketingButton href="#contact" variant="outline" icon="pi pi-phone">
            Contact Us
          </MarketingButton>
        </div>
      </div>
    </section>
  );
}
