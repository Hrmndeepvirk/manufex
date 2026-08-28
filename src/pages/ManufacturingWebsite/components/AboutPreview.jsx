import { Link } from "react-router-dom";
import { images, stats } from "../data/siteContent";
import MarketingButton from "./MarketingButton";
import SectionHeading from "./SectionHeading";

export default function AboutPreview() {
  return (
    <section className="manufacturing-section manufacturing-about-preview">
      <div className="manufacturing-container manufacturing-about-preview__grid">
        <div className="manufacturing-about-preview__images">
          <img
            src={images.aboutTall}
            alt="Industrial engineer inspecting automated machinery"
          />
          <img
            src={images.aboutWide}
            alt="Manufacturing equipment inside a production facility"
            loading="lazy"
          />
        </div>

        <div className="manufacturing-about-preview__content">
          <SectionHeading
            eyebrow="About Us"
            title="Precision Manufacturing. Built for Progress."
            description="We combine engineering discipline, automation expertise, and hands-on manufacturing support to help industrial clients improve how work gets made."
          />
          <p>
            From equipment installation to process optimization, our teams build
            manufacturing systems that perform under pressure and remain practical
            for the people who run them every day.
          </p>
          <p>
            The result is a partner that understands production realities: uptime,
            quality, safety, throughput, and the discipline required to improve all
            of them at once.
          </p>
          <div className="manufacturing-stat-row">
            {stats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
          <MarketingButton to="/about">More About Us</MarketingButton>
          <Link className="manufacturing-text-link" to="/about">
            View company profile
          </Link>
        </div>
      </div>
    </section>
  );
}
