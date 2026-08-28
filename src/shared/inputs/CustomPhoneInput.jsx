import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { InputText } from "primereact/inputtext";
import InputLayout from "./InputLayout";
import { capitalizeCamelCase } from "@utils/common";

const COUNTRY_CONFIGS = [
  { code: "1", iso: "US", flag: "\u{1F1FA}\u{1F1F8}", localDigits: 10, format: (d) => formatUS(d) },
  { code: "91", iso: "IN", flag: "\u{1F1EE}\u{1F1F3}", localDigits: 10, format: (d) => formatIN(d) },
  { code: "44", iso: "GB", flag: "\u{1F1EC}\u{1F1E7}", localDigits: 10, format: (d) => formatUK(d) },
  { code: "61", iso: "AU", flag: "\u{1F1E6}\u{1F1FA}", localDigits: 9, format: (d) => formatAU(d) },
  { code: "81", iso: "JP", flag: "\u{1F1EF}\u{1F1F5}", localDigits: 10, format: (d) => formatJP(d) },
  { code: "49", iso: "DE", flag: "\u{1F1E9}\u{1F1EA}", localDigits: 11, format: (d) => formatDE(d) },
  { code: "33", iso: "FR", flag: "\u{1F1EB}\u{1F1F7}", localDigits: 9, format: (d) => formatFR(d) },
  { code: "86", iso: "CN", flag: "\u{1F1E8}\u{1F1F3}", localDigits: 11, format: (d) => formatCN(d) },
];

function formatUS(digits) {
  const d = digits.slice(1);
  if (d.length <= 3) return `+1 (${d}`;
  if (d.length <= 6) return `+1 (${d.slice(0, 3)}) ${d.slice(3)}`;
  return `+1 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
}

function formatIN(digits) {
  const d = digits.slice(2);
  if (d.length <= 5) return `+91 ${d}`;
  return `+91 ${d.slice(0, 5)} ${d.slice(5, 10)}`;
}

function formatUK(digits) {
  const d = digits.slice(2);
  if (d.length <= 4) return `+44 ${d}`;
  return `+44 ${d.slice(0, 4)} ${d.slice(4, 10)}`;
}

function formatAU(digits) {
  const d = digits.slice(2);
  if (d.length <= 3) return `+61 ${d}`;
  if (d.length <= 6) return `+61 ${d.slice(0, 3)} ${d.slice(3)}`;
  return `+61 ${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 9)}`;
}

function formatJP(digits) {
  const d = digits.slice(2);
  if (d.length <= 3) return `+81 ${d}`;
  if (d.length <= 7) return `+81 ${d.slice(0, 3)}-${d.slice(3)}`;
  return `+81 ${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7, 10)}`;
}

function formatDE(digits) {
  const d = digits.slice(2);
  if (d.length <= 4) return `+49 ${d}`;
  return `+49 ${d.slice(0, 4)} ${d.slice(4, 11)}`;
}

function formatFR(digits) {
  const d = digits.slice(2);
  if (d.length <= 1) return `+33 ${d}`;
  if (d.length <= 3) return `+33 ${d.slice(0, 1)} ${d.slice(1)}`;
  if (d.length <= 5) return `+33 ${d.slice(0, 1)} ${d.slice(1, 3)} ${d.slice(3)}`;
  if (d.length <= 7) return `+33 ${d.slice(0, 1)} ${d.slice(1, 3)} ${d.slice(3, 5)} ${d.slice(5)}`;
  return `+33 ${d.slice(0, 1)} ${d.slice(1, 3)} ${d.slice(3, 5)} ${d.slice(5, 7)} ${d.slice(7, 9)}`;
}

function formatCN(digits) {
  const d = digits.slice(2);
  if (d.length <= 3) return `+86 ${d}`;
  if (d.length <= 7) return `+86 ${d.slice(0, 3)} ${d.slice(3)}`;
  return `+86 ${d.slice(0, 3)} ${d.slice(3, 7)} ${d.slice(7, 11)}`;
}

const COUNTRY_NAME_MAP = {
  USA: "US", US: "US", "UNITED STATES": "US",
  INDIA: "IN", IN: "IN", IND: "IN",
  UK: "GB", GB: "GB", "UNITED KINGDOM": "GB", GBR: "GB",
  AUSTRALIA: "AU", AU: "AU", AUS: "AU",
  JAPAN: "JP", JP: "JP", JPN: "JP",
  GERMANY: "DE", DE: "DE", DEU: "DE",
  FRANCE: "FR", FR: "FR", FRA: "FR",
  CHINA: "CN", CN: "CN", CHN: "CN",
};

function getConfigByIso(country) {
  if (!country) return null;
  const iso = COUNTRY_NAME_MAP[country.toUpperCase()];
  if (!iso) return null;
  return COUNTRY_CONFIGS.find((c) => c.iso === iso) || null;
}

function detectCountry(digits) {
  if (!digits) return null;
  if (digits.startsWith("1")) return COUNTRY_CONFIGS.find((c) => c.code === "1");
  for (const config of COUNTRY_CONFIGS) {
    if (config.code !== "1" && digits.startsWith(config.code)) return config;
  }
  return null;
}

function formatPhone(digits, companyConfig) {
  if (!digits) return "";
  const country = detectCountry(digits);
  if (country) return country.format(digits);
  if (companyConfig) {
    const withCode = companyConfig.code + digits;
    return companyConfig.format(withCode);
  }
  return digits;
}

function CustomPhoneInput({
  label,
  name,
  data = {},
  value,
  onChange,
  errorMessage,
  extraClassName = "",
  required = false,
  col = 4,
  disabled = false,
  placeholder,
  maxLength,
  hideLabel = false,
  helpText,
  extraHeaders = null,
  ...props
}) {
  const companyCountry = useSelector(
    (state) => state.company?.details?.country || state.settings?.business?.company?.country
  );
  const companyConfig = useMemo(() => getConfigByIso(companyCountry), [companyCountry]);

  const rawValue = value ?? data?.[name] ?? "";

  const detectedCountry = useMemo(() => detectCountry(rawValue), [rawValue]);
  const activeCountry = detectedCountry || companyConfig;
  const displayValue = useMemo(() => formatPhone(rawValue, companyConfig), [rawValue, companyConfig]);

  const handleChange = (e) => {
    const input = e.target.value;
    let digits = input.replace(/\D/g, "");
    const prevDigits = rawValue.replace(/\D/g, "");
    if (digits.length >= prevDigits.length && digits === prevDigits && input.length < displayValue.length) {
      digits = digits.slice(0, -1);
    }

    const explicitCountry = detectCountry(digits);
    if (explicitCountry) {
      const max = explicitCountry.code.length + explicitCountry.localDigits;
      onChange?.({ ...e, name: e.target.name, value: digits.slice(0, max) });
    } else if (companyConfig) {
      const max = companyConfig.localDigits;
      onChange?.({ ...e, name: e.target.name, value: digits.slice(0, max) });
    } else {
      onChange?.({ ...e, name: e.target.name, value: digits.slice(0, 15) });
    }
  };

  return (
    <InputLayout
      col={col}
      label={label}
      name={name}
      required={required}
      extraClassName={extraClassName}
      data={data}
      errorMessage={errorMessage}
      maxLength={maxLength}
      hideLabel={hideLabel}
      helpText={helpText}
      extraHeaders={extraHeaders}
    >
      <div className="p-inputgroup">
        <span
          className="p-inputgroup-addon"
          style={{ minWidth: "3rem", justifyContent: "center" }}
        >
          {activeCountry ? activeCountry.flag : "\u{1F310}"}
        </span>
        <InputText
          id={name}
          name={name}
          value={displayValue}
          onChange={handleChange}
          className={`w-full ${errorMessage ? "p-invalid" : ""}`}
          placeholder={
            placeholder || `Enter ${label || capitalizeCamelCase(name)}`
          }
          disabled={disabled}
          {...props}
        />
      </div>
    </InputLayout>
  );
}

export default React.memo(CustomPhoneInput);
