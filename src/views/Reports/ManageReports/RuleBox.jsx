import React from "react";
import { capitalizeCamelCase, capitalizeSnakeCase } from "@utils/common";
import { getDate } from "@utils/dateTime";

function RuleBox({ rule, index, onEdit, onDelete, isMaster, showDragHandle }) {
  const typeLabel = capitalizeSnakeCase(rule.type);

  const metricLabel =
    rule.metric?.field && rule.metric?.operator
      ? `${capitalizeSnakeCase(rule.metric.field)} ${capitalizeSnakeCase(rule.metric.operator)} ${rule.metric.value ?? ""}${rule.metric.operator === "BETWEEN" ? ` - ${rule.metric.secondValue ?? ""}` : ""}`
      : "";

  const timePeriodLabel =
    rule.timePeriod?.type && rule.timePeriod.type !== "ALL_TIME"
      ? rule.timePeriod.type === "DATE_RANGE"
        ? `${getDate(rule.timePeriod.startDate)} to ${getDate(rule.timePeriod.endDate)}`
        : `Last ${rule.timePeriod.relativeDays} days`
      : "";

  const filterKeys = rule.filters
    ? Object.keys(rule.filters)
        .filter((key) => Array.isArray(rule.filters[key]) && rule.filters[key].length > 0)
        .map(capitalizeCamelCase)
    : [];

  return (
    <div className="rule-box" onClick={() => onEdit(index)}>
      <div className="rule-box__header">
        <div className="rule-box__header-left">
          {showDragHandle && (
            <span className="rule-box__drag-handle" onClick={(e) => e.stopPropagation()}>
              <i className="pi pi-bars" />
            </span>
          )}
          <span className="rule-box__title">{isMaster ? "Master Rule" : `Rule #${index + 2}`}</span>
        </div>
        {!isMaster && (
          <div className="rule-box__actions" onClick={(e) => e.stopPropagation()}>
            <i
              className="pi pi-trash rule-box__delete"
              title="Delete"
              onClick={() => onDelete(index)}
            />
          </div>
        )}
      </div>

      <div className="rule-box__summary">
        <span className="rule-box__type">
          {capitalizeSnakeCase(rule.userType)} — {typeLabel}
        </span>
        {metricLabel && (
          <span className="rule-box__detail">Metric: {metricLabel}</span>
        )}
        {timePeriodLabel && (
          <span className="rule-box__detail">Period: {timePeriodLabel}</span>
        )}
        {filterKeys.length > 0 && (
          <span className="rule-box__detail">
            Filters: {filterKeys.join(", ")}
          </span>
        )}
      </div>
    </div>
  );
}

export default React.memo(RuleBox);
