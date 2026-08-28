import { trustHighlights } from "../data/siteContent";

export default function TrustHighlights() {
  return (
    <section className="manufacturing-trust" aria-label="Trust highlights">
      <div className="manufacturing-container manufacturing-trust__grid">
        {trustHighlights.map((item) => (
          <article className="manufacturing-trust-card" key={item.title}>
            <i className={item.icon} aria-hidden="true" />
            <div>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
