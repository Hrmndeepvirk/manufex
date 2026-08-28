import { useSelector } from "react-redux";

export function useCurrencyFormatter() {
  const currency = useSelector((state) => state?.company?.details?.currency);
  const code = currency?.code || "USD";
  const symbol = currency?.symbol || "$";
  const locale = currency?.locale || "en-US";

  const formatCurrency = (amount) => {
    if (typeof amount !== "number") {
      amount = Number(amount) || 0;
    }

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: code,
      currencyDisplay: "symbol",
    })
      .format(amount)
      .replace(/[^\d.,-]+/, symbol);
  };

  return { formatCurrency };
}
