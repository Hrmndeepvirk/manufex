import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomForm from "@inputs/CustomForm";
import CustomDropdown from "@inputs/CustomDropdown";
import CustomNumberInput from "@inputs/CustomNumberInput";
import CustomCalendarInput from "@inputs/CustomCalendarInput";
import CustomOptionSelect from "@inputs/CustomOptionSelect";
import CustomPickList from "@inputs/CustomPickList";
import { getDataPoints } from "@utils/reportDataPoints";
import { showToastAction } from "@store/common/commonActions";
import FilterField from "./FilterField";
import {
  USER_TYPE_OPTIONS,
  CONDITION_OPTIONS,
  TIME_PERIOD_TYPE_OPTIONS,
  getRuleTypeOptions,
  getRuleConfig,
} from "./ruleConfig";

const EMPTY_FILTERS = {};
const EMPTY_METRIC = {
  field: "",
  operator: "",
  value: null,
  secondValue: null,
};
const EMPTY_TIME_PERIOD = {
  type: "ALL_TIME",
  startDate: "",
  endDate: "",
  relativeDays: null,
};

function buildInitialData(rule) {
  if (!rule) {
    const defaultUserType = USER_TYPE_OPTIONS[0]?._id || "";
    const defaultRuleTypes = getRuleTypeOptions(defaultUserType);
    const defaultType = defaultRuleTypes[0]?._id || "";
    return {
      userType: defaultUserType,
      type: defaultType,
      filters: { ...EMPTY_FILTERS },
      metric: { ...EMPTY_METRIC },
      timePeriod: { ...EMPTY_TIME_PERIOD },
      dataPoints: [],
    };
  }
  return {
    userType: rule.userType || "",
    type: rule.type || "",
    filters: { ...(rule.filters || {}) },
    metric: { ...EMPTY_METRIC, ...(rule.metric || {}) },
    timePeriod: { ...EMPTY_TIME_PERIOD, ...(rule.timePeriod || {}) },
    dataPoints: rule.dataPoints || [],
  };
}

function RuleModal({ visible, onHide, rule, onSave, isMaster, hideDataPoints }) {
  const dispatch = useDispatch();
  const [data, setData] = useState(() => buildInitialData(null));
  const [conditionWithPrevious, setConditionWithPrevious] = useState("AND");

  useEffect(() => {
    if (visible) {
      setData(buildInitialData(rule));
      setConditionWithPrevious(rule?.conditionWithPrevious || "AND");
    }
  }, [visible, rule]);

  const config = useMemo(
    () => getRuleConfig(data.userType, data.type),
    [data.userType, data.type],
  );

  const ruleTypeOptions = useMemo(
    () => getRuleTypeOptions(data.userType),
    [data.userType],
  );

  const dataPointOptions = useMemo(
    () => getDataPoints(data.userType, data.type),
    [data.userType, data.type],
  );

  const handleChange = ({ name, value }) => {
    setData((prev) => {
      const next = { ...prev, [name]: value };
      // Reset dependent fields when parent changes
      if (name === "userType") {
        const newRuleTypes = getRuleTypeOptions(value);
        next.type = newRuleTypes[0]?._id || "";
        next.filters = { ...EMPTY_FILTERS };
        next.metric = { ...EMPTY_METRIC };
        next.timePeriod = { ...EMPTY_TIME_PERIOD };
        next.dataPoints = [];
      }
      if (name === "type") {
        next.filters = { ...EMPTY_FILTERS };
        next.metric = { ...EMPTY_METRIC };
        next.timePeriod = { ...EMPTY_TIME_PERIOD };
        next.dataPoints = [];
      }
      return next;
    });
  };

  const handleFilterChange = ({ name, value }) => {
    setData((prev) => ({
      ...prev,
      filters: { ...prev.filters, [name]: value },
    }));
  };

  const handleMetricChange = ({ name, value }) => {
    setData((prev) => ({
      ...prev,
      metric: { ...prev.metric, [name]: value },
    }));
  };

  const handleTimePeriodChange = ({ name, value }) => {
    setData((prev) => ({
      ...prev,
      timePeriod: { ...prev.timePeriod, [name]: value },
    }));
  };

  const isFilterVisible = (filterDef) => {
    if (!filterDef.showWhen) return true;
    return Object.entries(filterDef.showWhen).every(([key, val]) => {
      const current = data.filters[key];
      if (Array.isArray(current)) {
        return current.includes(val);
      }
      return current === val;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.userType || !data.type) return;

    if (
      data.timePeriod?.type === "DATE_RANGE" &&
      data.timePeriod.startDate &&
      data.timePeriod.endDate &&
      new Date(data.timePeriod.endDate) < new Date(data.timePeriod.startDate)
    ) {
      dispatch(
        showToastAction({
          description: "End date must be after start date.",
          type: "error",
        }),
      );
      return;
    }

    const ruleData = {
      userType: data.userType,
      type: data.type,
    };

    // Clean filters — only send non-empty values
    const cleanedFilters = {};
    Object.entries(data.filters).forEach(([key, val]) => {
      if (Array.isArray(val) && val.length > 0) {
        cleanedFilters[key] = val;
      } else if (
        val !== "" &&
        val !== null &&
        val !== undefined &&
        !Array.isArray(val)
      ) {
        cleanedFilters[key] = val;
      }
    });
    if (Object.keys(cleanedFilters).length > 0) {
      ruleData.filters = cleanedFilters;
    }

    // Metric — handle both normal and derived-field (Reward) cases
    if (config?.metric) {
      if (config.metric.fields && data.metric.field && data.metric.operator) {
        ruleData.metric = {
          field: data.metric.field,
          operator: data.metric.operator,
          value: data.metric.value,
        };
        if (data.metric.operator === "BETWEEN") {
          ruleData.metric.secondValue = data.metric.secondValue;
        }
      } else if (!config.metric.fields && data.metric.operator) {
        // Reward-type: metric field derived from filter selection
        const derivedField =
          data.filters.earningQtyType || data.filters.redeemQtyType;
        if (derivedField) {
          ruleData.metric = {
            field: derivedField,
            operator: data.metric.operator,
            value: data.metric.value,
          };
          if (data.metric.operator === "BETWEEN") {
            ruleData.metric.secondValue = data.metric.secondValue;
          }
        }
      }
    }

    // Time period
    if (config?.timePeriod && data.timePeriod.type !== "ALL_TIME") {
      ruleData.timePeriod = { type: data.timePeriod.type };
      if (data.timePeriod.type === "DATE_RANGE") {
        ruleData.timePeriod.startDate = data.timePeriod.startDate;
        ruleData.timePeriod.endDate = data.timePeriod.endDate;
      } else if (data.timePeriod.type === "RELATIVE") {
        ruleData.timePeriod.relativeDays = data.timePeriod.relativeDays;
      }
    }

    // Data points
    if (data.dataPoints?.length > 0) {
      ruleData.dataPoints = data.dataPoints;
    }

    if (!isMaster) {
      ruleData.conditionWithPrevious = conditionWithPrevious;
    }

    onSave(ruleData);
    onHide();
  };

  return (
    <CustomDialog
      title={isMaster ? "Master Rule" : rule ? "Edit Rule" : "Add Rule"}
      visible={visible}
      onHide={onHide}
      size="large"
    >
      <CustomForm
        onSubmit={handleSubmit}
        submitLabel="Save Rule"
        onCancel={onHide}
      >
        {/* ── Condition (additional rules only) ── */}
        {!isMaster && (
          <CustomDropdown
            name="conditionWithPrevious"
            label="Condition With Previous"
            value={conditionWithPrevious}
            onChange={({ value }) => setConditionWithPrevious(value)}
            options={CONDITION_OPTIONS}
            col={12}
            required
          />
        )}

        {/* ── User Type & Rule Type ── */}
        <CustomOptionSelect
          name="userType"
          label="User Type"
          data={data}
          onChange={handleChange}
          options={USER_TYPE_OPTIONS}
          required
          hideLabel
        />
        <CustomOptionSelect
          name="type"
          label="Rule Type"
          data={data}
          onChange={handleChange}
          options={ruleTypeOptions}
          required
          disabled={!data.userType}
          hideLabel
        />

        {/* ── Dynamic Filters ── */}
        {config?.filters?.length > 0 && (
          <>
            <div className="c-col-12 font-semibold text-color-primary">
              Filters
            </div>
            {config.filters.map(
              (f) =>
                isFilterVisible(f) && (
                  <FilterField
                    key={f.name}
                    def={f}
                    filters={data.filters}
                    onChange={handleFilterChange}
                  />
                ),
            )}
          </>
        )}

        {/* ── Metric ── */}
        {config?.metric && (
          <>
            <div className="c-col-12 font-semibold text-color-primary">
              Metric
            </div>
            {config.metric.fields && (
              <CustomDropdown
                name="field"
                label="Metric Field"
                data={data.metric}
                onChange={handleMetricChange}
                options={config.metric.fields}
                col={4}
              />
            )}
            <CustomDropdown
              name="operator"
              label="Condition"
              data={data.metric}
              onChange={handleMetricChange}
              options={config.metric.operators}
              col={4}
            />
            <CustomNumberInput
              name="value"
              label="Number"
              data={data.metric}
              onChange={handleMetricChange}
              col={4}
            />
            {data.metric.operator === "BETWEEN" && (
              <CustomNumberInput
                name="secondValue"
                label="Second Number"
                data={data.metric}
                onChange={handleMetricChange}
                col={4}
              />
            )}
          </>
        )}

        {/* ── Time Period ── */}
        {config?.timePeriod && (
          <>
            <div className="c-col-12 font-semibold text-color-primary">
              {config.timePeriodLabel || "Time Period"}
            </div>
            <CustomOptionSelect
              name="type"
              label="Period Type"
              data={data.timePeriod}
              onChange={handleTimePeriodChange}
              options={TIME_PERIOD_TYPE_OPTIONS}
              col={12}
            />
            {data.timePeriod.type === "DATE_RANGE" && (
              <>
                <CustomCalendarInput
                  name="startDate"
                  label="Start Date"
                  data={data.timePeriod}
                  onChange={handleTimePeriodChange}
                  dateString
                  col={4}
                />
                <CustomCalendarInput
                  name="endDate"
                  label="End Date"
                  data={data.timePeriod}
                  onChange={handleTimePeriodChange}
                  dateString
                  col={4}
                />
              </>
            )}
            {data.timePeriod.type === "RELATIVE" && (
              <CustomNumberInput
                name="relativeDays"
                label="Relative Days"
                data={data.timePeriod}
                onChange={handleTimePeriodChange}
                col={4}
              />
            )}
          </>
        )}

        {/* ── Data Points ── */}
        {!hideDataPoints && dataPointOptions.length > 0 && (
          <>
            <div className="c-col-12 font-semibold text-color-primary">
              Data Points
            </div>
            <CustomPickList
              name="dataPoints"
              data={data}
              onChange={handleChange}
              options={dataPointOptions}
              sourceHeader="Available"
              targetHeader="Selected"
              showTargetControls
              hideLabel
            />
          </>
        )}
      </CustomForm>
    </CustomDialog>
  );
}

export default React.memo(RuleModal);
