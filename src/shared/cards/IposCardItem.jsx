const CARD_BRAND_COLORS = {
  DISCOVER: "#ff6000",
  VISA: "#1a1f71",
  MASTERCARD: "#eb001b",
  AMEX: "#006fcf",
};

export const formatMaskedPan = (pan) => {
  if (!pan) return "**** **** **** ****";
  const first4 = pan.slice(0, 4);
  const next2 = pan.slice(4, 6);
  const last4 = pan.slice(6, 10);
  return `${first4} ${next2}** **** ${last4}`;
};

const IposCardItem = ({
  item,
  onClick,
  isSetting = false,
  isSelected = false,
  variant = "gradient",
}) => {
  const label = item.label || "CARD";
  const color = CARD_BRAND_COLORS[label.toUpperCase()] || "#252b42";
  const expYear = item.expDate ? item.expDate.slice(2) : "XX";
  const expMonth = item.expDate ? item.expDate.slice(0, 2) : "XX";

  if (variant === "flat") {
    return (
      <div
        onClick={onClick}
        style={{
          borderRadius: "10px",
          padding: "0.85rem 1rem",
          cursor: "pointer",
          border: isSelected
            ? "2px solid var(--primary-color)"
            : "2px solid var(--border-color)",
          background: isSelected ? "var(--highlight-bg)" : "#fff",
          transition: "border 0.15s, background 0.15s",
        }}
      >
        <div className="flex justify-content-between align-items-center mb-1">
          <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>{label}</span>
          <div className="flex gap-2 align-items-center">
            {item.isDefault && (
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  color: "var(--color-success)",
                }}
              >
                Default
              </span>
            )}
            {isSelected && (
              <i
                className="bi bi-check-circle-fill"
                style={{ color: "var(--primary-color)", fontSize: "1rem" }}
              />
            )}
          </div>
        </div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "0.9rem",
            letterSpacing: 1,
            color: "var(--text-color-primary)",
          }}
        >
          {formatMaskedPan(item.maskedPan)}
        </div>
        <div
          className="flex justify-content-between mt-1"
          style={{ fontSize: "0.75rem", color: "var(--text-color-secondary)" }}
        >
          <span>{item.cardType}</span>
          <span>
            {expMonth}/{expYear}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={isSetting ? undefined : onClick}
      style={{
        background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
        borderRadius: "12px",
        padding: "1.25rem",
        color: "#fff",
        minHeight: "160px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: isSelected
          ? `0 0 0 3px #fff, 0 0 0 6px ${color}`
          : "0 4px 12px rgba(0,0,0,0.15)",
        position: "relative",
        cursor: isSetting ? "not-allowed" : "pointer",
        opacity: isSetting ? 0.7 : 1,
        transition: "box-shadow 0.2s, opacity 0.2s",
      }}
    >
      <div className="flex justify-content-between align-items-center">
        <span style={{ fontWeight: 700, fontSize: "0.95rem", letterSpacing: 1 }}>
          {label}
        </span>
        <div className="flex gap-2 align-items-center">
          {isSetting && (
            <i className="pi pi-spin pi-spinner" style={{ fontSize: "1rem" }} />
          )}
          {isSelected && (
            <span
              style={{
                background: "rgba(255,255,255,0.35)",
                borderRadius: "6px",
                padding: "2px 8px",
                fontSize: "0.7rem",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <i className="bi bi-check-lg" style={{ fontSize: "0.75rem" }} />
              Selected
            </span>
          )}
          {item.isDefault && (
            <span
              style={{
                background: "rgba(255,255,255,0.35)",
                borderRadius: "6px",
                padding: "2px 8px",
                fontSize: "0.7rem",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <i className="bi bi-check-lg" style={{ fontSize: "0.75rem" }} />
              Default
            </span>
          )}
          {item.cardOnFile && (
            <span
              style={{
                background: "rgba(255,255,255,0.25)",
                borderRadius: "6px",
                padding: "2px 8px",
                fontSize: "0.7rem",
                fontWeight: 600,
              }}
            >
              Card on File
            </span>
          )}
          <i className="bi bi-credit-card-2-front" style={{ fontSize: "1.4rem" }} />
        </div>
      </div>
      <div style={{ fontFamily: "monospace", fontSize: "1.05rem", letterSpacing: 2 }}>
        {formatMaskedPan(item.maskedPan)}
      </div>
      <div className="flex justify-content-between align-items-end">
        <div>
          <div style={{ fontSize: "0.65rem", opacity: 0.8 }}>CARD TYPE</div>
          <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>
            {item.cardType || "—"}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "0.65rem", opacity: 0.8 }}>EXPIRES</div>
          <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>
            {expMonth}/{expYear}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IposCardItem;
