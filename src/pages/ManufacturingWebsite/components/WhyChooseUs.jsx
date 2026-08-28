import { features, images } from "../data/siteContent";
import SectionHeading from "./SectionHeading";

export default function WhyChooseUs() {
  return (
    <section className="manufacturing-section manufacturing-why">
      <div className="manufacturing-container manufacturing-why__grid">
        <div className="manufacturing-why__content">
          <SectionHeading
            eyebrow="Why Choose Us"
            title="Manufacturing Support with Engineering Discipline"
            description="We build practical systems around quality, delivery, and the people responsible for keeping production moving."
          />
          <div className="manufacturing-feature-list">
            {features.map((feature) => (
              <article className="manufacturing-feature" key={feature.title}>
                <i className={feature.icon} aria-hidden="true" />
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="manufacturing-why__image">
          <img
            src={images.why}
            alt="Engineer reviewing production equipment in a factory"
            loading="lazy"
          />
          <div className="manufacturing-why__badge">
            <strong>24/7</strong>
            <span>Operational support for critical production windows</span>
          </div>
        </div>
      </div>
    </section>
  );
}
