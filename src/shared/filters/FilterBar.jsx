import React, { useState, useEffect } from "react";
import PrimaryButton from "@shared/buttons/PrimaryButton";
import FilterField from "./FilterField";
import useFilters from "./useFilters";

function FilterBar({
  quickFilters = [],
  advancedFilters = [],
  data = [],
  onFilter,
  onFilterValuesChange,
  onClear,
  initialValues,
  persist = false,
  persistKey = null,
  children,
}) {
  const { filterValues, handleChange, clearFilters, filteredData } = useFilters(
    {
      quickFilters,
      advancedFilters,
      data,
      initialValues,
      persist,
      persistKey,
    },
  );

  const handleClearClick = () => {
    clearFilters();
    onClear?.();
  };
  
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    onFilter?.(filteredData);
  }, [filteredData]);

  useEffect(() => {
    onFilterValuesChange?.(filterValues);
  }, [filterValues]);

  return (
    <div className="w-full py-2">
      <div className="flex align-items-end gap-2 flex-wrap">
        <div className="flex-1">
          <div className="c-grid align-items-end">
            {quickFilters.map((config) => (
              <FilterField
                key={config.column}
                config={config}
                data={filterValues}
                onChange={handleChange}
              />
            ))}
          </div>
        </div>
        <div className="flex align-items-end gap-2 mb-1">
          {advancedFilters.length > 0 && (
            <>
              {showAdvanced && (
                <PrimaryButton
                  label="Clear"
                  icon="pi pi-times"
                  severity="secondary"
                  onClick={handleClearClick}
                />
              )}
              <PrimaryButton
                label={showAdvanced ? "Hide Filters" : "Show Filters"}
                icon={showAdvanced ? "pi pi-filter-slash" : "pi pi-filter"}
                severity="secondary"
                onClick={() => setShowAdvanced((prev) => !prev)}
              />
            </>
          )}
          {children}
        </div>
      </div>

      {showAdvanced && (
        <div className="c-grid mt-2 border-round surface-ground">
          {advancedFilters.map((config) => (
            <FilterField
              key={config.column}
              config={config}
              data={filterValues}
              onChange={handleChange}
            />
          ))}
        </div>
      )}
    </div>
  );

}

export default React.memo(FilterBar);
