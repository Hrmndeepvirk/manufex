import { services } from "../data/siteContent";
import SectionHeading from "./SectionHeading";

export default function ServicesSection() {
  return (
    <section className="manufacturing-section manufacturing-services" id="services">
      <div className="manufacturing-container">
        <SectionHeading
          eyebrow="Services"
          title="Advanced Industrial Service"
          description="Focused manufacturing support for facilities that need precision, reliability, and scalable production systems."
          align="center"
        />

        <div className="manufacturing-card-grid">
          {services.map((service) => (
            <article className="manufacturing-service-card" key={service.title}>
              <div className="manufacturing-service-card__icon">
                <i className={service.icon} aria-hidden="true" />
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <span className="manufacturing-card-action" aria-hidden="true">
                <i className="pi pi-arrow-up-right" />
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
