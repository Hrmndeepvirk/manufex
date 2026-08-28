import MarketingHeader from "./components/MarketingHeader";
import MarketingFooter from "./components/MarketingFooter";
import SectionHeading from "./components/SectionHeading";
import StatsSection from "./components/StatsSection";
import CTASection from "./components/CTASection";
import { aboutValues, features, images } from "./data/siteContent";

export default function ManufacturingAbout() {
  document.title = "Manufex";

  return (
    <div className="manufacturing-site">
      <MarketingHeader />
      <main>
        <section className="manufacturing-page-hero">
          <div className="manufacturing-page-hero__media" aria-hidden="true" />
          <div className="manufacturing-container manufacturing-page-hero__content">
            <span className="manufacturing-eyebrow">[ About Manufex ]</span>
            <h1>Industrial Expertise for Production Teams Moving Forward</h1>
            <p>
              Manufex is a fictional manufacturing partner created for
              a premium B2B website demo, built around precision, reliability,
              and modern production systems.
            </p>
          </div>
        </section>

        <section className="manufacturing-section manufacturing-about-page">
          <div className="manufacturing-container manufacturing-about-page__grid">
            <div>
              <SectionHeading
                eyebrow="Company"
                title="Built Around Real Manufacturing Priorities"
                description="This demo page gives the brand a clear story while keeping content structured for easy replacement later."
              />
              {aboutValues.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>

            <div className="manufacturing-about-page__panel">
              <img
                src={images.aboutWide}
                alt="Industrial engineer working near automated production machinery"
              />
              <div>
                <strong>Engineering-led manufacturing</strong>
                <span>Automation, installation, quality, and process support.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="manufacturing-section manufacturing-about-values">
          <div className="manufacturing-container">
            <SectionHeading
              eyebrow="Capabilities"
              title="What Shapes Our Work"
              description="A compact capability system for the About page, reusing the same content model as the Home page feature cards."
              align="center"
            />
            <div className="manufacturing-card-grid manufacturing-card-grid--compact">
              {features.slice(0, 3).map((feature) => (
                <article className="manufacturing-service-card" key={feature.title}>
                  <div className="manufacturing-service-card__icon">
                    <i className={feature.icon} aria-hidden="true" />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <StatsSection />
        <CTASection />
      </main>
      <MarketingFooter />
    </div>
  );
}
