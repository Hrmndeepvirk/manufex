export default function SectionHeading({ eyebrow, title, description, align = "left" }) {
  return (
    <div className={`manufacturing-section-heading manufacturing-section-heading--${align}`}>
      {eyebrow && <span className="manufacturing-eyebrow">[ {eyebrow} ]</span>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
