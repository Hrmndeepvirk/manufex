import { useEffect, useMemo, useRef, useState } from "react";

const PERSIST_PREFIX = "filterbar:";

function readPersistedValues(key, allowedColumns) {
  if (typeof window === "undefined" || !window.sessionStorage) return null;
  try {
    const raw = window.sessionStorage.getItem(PERSIST_PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const allowed = new Set(allowedColumns);
    const cleaned = {};
    for (const k of Object.keys(parsed)) {
      if (allowed.has(k)) cleaned[k] = parsed[k];
    }
    return cleaned;
  } catch {
    return null;
  }
}

function writePersistedValues(key, values) {
  if (typeof window === "undefined" || !window.sessionStorage) return;
  try {
    window.sessionStorage.setItem(
      PERSIST_PREFIX + key,
      JSON.stringify(values),
    );
  } catch {
    /* ignore quota / serialization errors */
  }
}

const DEFAULT_VALUES = {
  text: "",
  number: null,
  dropdown: "",
  multiselect: [],
  date: null,
  dateFrom: null,
  dateTo: null,
  timeFrom: null,
  timeTo: null,
  checkbox: false,
};

function buildInitialValues(filters) {
  const values = {};
  for (const config of filters) {
    values[config.column] = DEFAULT_VALUES[config.type] ?? null;
  }
  return values;
}

function matchesFilter(type, filterVal, rowVal, config) {
  switch (type) {
    case "text":
      if (!filterVal) return true;
      return rowVal?.toString().toLowerCase().includes(filterVal.toLowerCase());

    case "dropdown":
      if (filterVal === "" || filterVal === null || filterVal === undefined)
        return true;
      return rowVal === filterVal;

    case "multiselect":
      if (!filterVal?.length) return true;
      if (Array.isArray(rowVal)) {
        return rowVal.some((v) => filterVal.includes(v));
      }
      return filterVal.includes(rowVal);

    case "date":
      if (!filterVal) return true;
      if (!rowVal) return false;
      const filterDate = new Date(filterVal);
      const rowDate = new Date(rowVal);
      return (
        filterDate.getFullYear() === rowDate.getFullYear() &&
        filterDate.getMonth() === rowDate.getMonth() &&
        filterDate.getDate() === rowDate.getDate()
      );

    case "dateFrom": {
      if (!filterVal) return true;
      const targetField = config.targetColumn || config.column;
      const rv = rowVal ?? null;
      if (!rv) return false;
      return new Date(rv) >= new Date(filterVal);
    }

    case "dateTo": {
      if (!filterVal) return true;
      const targetField = config.targetColumn || config.column;
      const rv = rowVal ?? null;
      if (!rv) return false;
      const end = new Date(filterVal);
      end.setHours(23, 59, 59, 999);
      return new Date(rv) <= end;
    }

    case "timeFrom": {
      if (!filterVal) return true;
      if (!rowVal) return false;
      const [fH, fM] = filterVal.split(":").map(Number);
      const rd = new Date(rowVal);
      const rowMinutes = rd.getHours() * 60 + rd.getMinutes();
      return rowMinutes >= fH * 60 + fM;
    }

    case "timeTo": {
      if (!filterVal) return true;
      if (!rowVal) return false;
      const [tH, tM] = filterVal.split(":").map(Number);
      const rd = new Date(rowVal);
      const rowMinutes = rd.getHours() * 60 + rd.getMinutes();
      return rowMinutes <= tH * 60 + tM;
    }

    case "number":
      if (filterVal === null || filterVal === undefined) return true;
      return Number(rowVal) === Number(filterVal);

    case "checkbox":
      if (!filterVal) return true;
      return !!rowVal;

    default:
      return true;
  }
}

export default function useFilters({
  quickFilters = [],
  advancedFilters = [],
  data = [],
  initialValues = {},
  persist = false,
  persistKey = null,
}) {
  const allFilters = [...quickFilters, ...advancedFilters];
  const allDefaults = useRef({
    ...buildInitialValues(allFilters),
    ...initialValues,
  });
  const advancedDefaults = useRef(buildInitialValues(advancedFilters));

  const persistEnabled = !!(persist && persistKey);
  const persistKeyRef = useRef(persistKey);

  const [filterValues, setFilterValues] = useState(() => {
    if (persistEnabled) {
      const persisted = readPersistedValues(
        persistKey,
        Object.keys(allDefaults.current),
      );
      if (persisted) {
        return { ...allDefaults.current, ...persisted };
      }
    }
    return allDefaults.current;
  });

  useEffect(() => {
    if (persistEnabled) writePersistedValues(persistKeyRef.current, filterValues);
  }, [filterValues, persistEnabled]);

  const handleChange = ({ name, value }) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilterValues(allDefaults.current);
    if (persistEnabled) writePersistedValues(persistKeyRef.current, allDefaults.current);
  };

  const filteredData = useMemo(() => {
    return data.filter((row) =>
      allFilters.every((config) => {
        const filterVal = filterValues[config.column];
        const targetCol = config.targetColumn || config.column;
        let rowVal = row[targetCol];
        if (config.matchField && rowVal && typeof rowVal === "object") {
          rowVal = rowVal[config.matchField];
        }
        return matchesFilter(config.type, filterVal, rowVal, config);
      }),
    );
  }, [data, filterValues]);

  return { filterValues, handleChange, clearFilters, filteredData };
}
