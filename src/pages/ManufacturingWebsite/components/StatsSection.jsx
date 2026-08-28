import { stats } from "../data/siteContent";

export default function StatsSection() {
  return (
    <section className="manufacturing-stats">
      <div className="manufacturing-container manufacturing-stats__grid">
        {stats.map((stat) => (
          <div className="manufacturing-stat" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
