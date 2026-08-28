import { Skeleton } from "primereact/skeleton";

const CARD_BRANDS = {
  Visa: {
    icon: "bi bi-credit-card-2-front",
    color: "#1a1f71",
    gradient: "linear-gradient(135deg, #1a1f71 0%, #2e3a8e 50%, #1a1f71 100%)",
  },
  MasterCard: {
    icon: "bi bi-credit-card-2-front",
    color: "#eb001b",
    gradient: "linear-gradient(135deg, #eb001b 0%, #f45c43 50%, #eb001b 100%)",
  },
  AmericanExpress: {
    icon: "bi bi-credit-card-2-front",
    color: "#006fcf",
    gradient: "linear-gradient(135deg, #006fcf 0%, #0090e6 50%, #006fcf 100%)",
  },
  Discover: {
    icon: "bi bi-credit-card-2-front",
    color: "#ff6000",
    gradient: "linear-gradient(135deg, #ff6000 0%, #ff8533 50%, #ff6000 100%)",
  },
  JCB: {
    icon: "bi bi-credit-card-2-front",
    color: "#0e4c96",
    gradient: "linear-gradient(135deg, #0e4c96 0%, #1a6abf 50%, #0e4c96 100%)",
  },
};

const PaymentCard = ({ data, loading, name, value, onChange }) => {
  const isSelectable = !!onChange;
  const paymentProfileId = data?.customerPaymentProfileId;
  const isSelected = isSelectable && value === paymentProfileId;

  const handleClick = () => {
    if (isSelectable) {
      if (value === paymentProfileId) {
        onChange({ name, value: null });
      } else {
        onChange({ name, value: paymentProfileId });
      }
    }
  };
  if (loading) {
    return (
      <div className="payment-card">
        <Skeleton width="100%" height="180px" borderRadius="12px" />
      </div>
    );
  }

  const cardType = data?.payment?.creditCard?.cardType || "Card";
  const cardNumber = data?.payment?.creditCard?.cardNumber || "XXXX";
  const expirationDate = data?.payment?.creditCard?.expirationDate || "XXXX";
  const firstName = data?.billTo?.firstName || "";
  const lastName = data?.billTo?.lastName || "";
  const brand = CARD_BRANDS[cardType] || CARD_BRANDS.Visa;

  const isDefault = data?.isDefault;

  return (
    <div
      className={`payment-card${isSelectable ? " payment-card--selectable" : ""}${isSelected ? " payment-card--selected" : ""}${isDefault ? " payment-card--default" : ""}`}
      style={{ "--card-accent": brand.color, "--card-bg": brand.gradient }}
      onClick={handleClick}
    >
      <div className="payment-card__header">
        <span className="payment-card__type">{cardType}</span>
        <div className="flex align-items-center gap-2">
          {isSelected && (
            <span className="payment-card__selected-badge">Selected</span>
          )}
          {isDefault && (
            <span className="payment-card__default-badge">
              Card on File
            </span>
          )}
          <i className={`${brand.icon} payment-card__brand-icon`} />
        </div>
      </div>
      <div className="payment-card__number">{cardNumber}</div>
      <div className="payment-card__footer">
        <div className="payment-card__holder">
          <span className="payment-card__label">Card Holder</span>
          <span className="payment-card__value">
            {firstName} {lastName}
          </span>
        </div>
        <div className="payment-card__expiry">
          <span className="payment-card__label">Expires</span>
          <span className="payment-card__value">{expirationDate}</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;
