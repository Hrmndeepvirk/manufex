import { useEffect } from "react";

const ENV_BAR_HEIGHT = 24;

const ENV_CONFIG = {
  production: { bg: "var(--color-danger)", color: "#fff" },
  staging: { bg: "var(--color-warning)", color: "var(--primary-color)" },
  development: { bg: "var(--color-info)", color: "#fff" },
};

export default function Env() {
  return null;
}
