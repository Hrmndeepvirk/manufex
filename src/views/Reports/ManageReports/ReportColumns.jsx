import React, { useRef, useState, useCallback } from "react";
import { Dropdown } from "primereact/dropdown";
import { capitalizeSnakeCase } from "@utils/common";

const SORT_OPTIONS = [
  { label: "None", value: "NONE" },
  { label: "Ascending", value: "ASC" },
  { label: "Descending", value: "DESC" },
];

const BREAK_TYPE_OPTIONS = [
  { label: "None", value: "NONE" },
  { label: "Line Break", value: "LINE_BREAK" },
  { label: "Page Break", value: "PAGE_BREAK" },
];

const NUMERIC_OPERATION_OPTIONS = [
  { label: "None", value: "NONE" },
  { label: "Sum", value: "SUM" },
  { label: "Average", value: "AVERAGE" },
];

function ReportColumns({ columns, onChange, hideDelete }) {
  const dragIndex = useRef(null);
  const [overIndex, setOverIndex] = useState(null);

  const handleFieldChange = (index, field, value) => {
    const updated = [...columns];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleDelete = (index) => {
    onChange(columns.filter((_, i) => i !== index));
  };

  const handleDragStart = useCallback((e, index) => {
    dragIndex.current = index;
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragOver = useCallback((e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverIndex(index);
  }, []);

  const handleDrop = useCallback(
    (e, dropIdx) => {
      e.preventDefault();
      const fromIdx = dragIndex.current;
      if (fromIdx !== null && fromIdx !== dropIdx) {
        const reordered = [...columns];
        const [moved] = reordered.splice(fromIdx, 1);
        reordered.splice(dropIdx, 0, moved);
        onChange(reordered);
      }
      dragIndex.current = null;
      setOverIndex(null);
    },
    [columns, onChange],
  );

  const handleDragEnd = useCallback(() => {
    dragIndex.current = null;
    setOverIndex(null);
  }, []);

  if (!columns?.length) {
    return (
      <div className="c-col-12 text-center text-secondary py-3">
        No data points selected. Add data points in rule configuration.
      </div>
    );
  }

  return (
    <div className="c-col-12">
      <div className="report-columns">
        <div className="report-columns__header">
          <span className="report-columns__cell report-columns__cell--handle" />
          <span className="report-columns__cell report-columns__cell--index">
            #
          </span>
          <span className="report-columns__cell report-columns__cell--rule">
            Rule
          </span>
          <span className="report-columns__cell report-columns__cell--title">
            Data Point
          </span>
          <span className="report-columns__cell report-columns__cell--dropdown">
            Sort
          </span>
          <span className="report-columns__cell report-columns__cell--dropdown">
            Break Type
          </span>
          <span className="report-columns__cell report-columns__cell--dropdown">
            Operation
          </span>
          {!hideDelete && (
            <span className="report-columns__cell report-columns__cell--actions">
              Actions
            </span>
          )}
        </div>
        {columns.map((col, index) => (
          <div
            key={`${col.ruleNumber}-${col.dataPointId}-${index}`}
            className={`report-columns__row${overIndex === index ? " report-columns__row--over" : ""}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
          >
            <span className="report-columns__cell report-columns__cell--handle">
              <i className="pi pi-bars" />
            </span>
            <span className="report-columns__cell report-columns__cell--index">
              {index + 1}
            </span>
            <span className="report-columns__cell report-columns__cell--rule">
              <span className="report-columns__rule-number">
                Rule #{col.ruleNumber}
              </span>
              <span className="report-columns__rule-meta">
                {capitalizeSnakeCase(col.userType)} —{" "}
                {capitalizeSnakeCase(col.ruleType)}
              </span>
            </span>
            <span className="report-columns__cell report-columns__cell--title">
              {col.title}
            </span>
            <span className="report-columns__cell report-columns__cell--dropdown">
              <Dropdown
                value={col.sort || ""}
                options={SORT_OPTIONS}
                onChange={(e) => handleFieldChange(index, "sort", e.value)}
                className="report-columns__dropdown"
              />
            </span>
            <span className="report-columns__cell report-columns__cell--dropdown">
              <Dropdown
                value={col.breakType || ""}
                options={BREAK_TYPE_OPTIONS}
                onChange={(e) => handleFieldChange(index, "breakType", e.value)}
                className="report-columns__dropdown"
              />
            </span>
            <span className="report-columns__cell report-columns__cell--dropdown">
              {col.isNumber ? (
                <Dropdown
                  value={col.numericOperation || ""}
                  options={NUMERIC_OPERATION_OPTIONS}
                  onChange={(e) =>
                    handleFieldChange(index, "numericOperation", e.value)
                  }
                  className="report-columns__dropdown"
                />
              ) : (
                <span className="text-secondary text-xs">—</span>
              )}
            </span>
            {!hideDelete && (
              <span className="report-columns__cell report-columns__cell--actions">
                <i
                  className="pi pi-trash report-columns__delete"
                  title="Delete"
                  onClick={() => handleDelete(index)}
                />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(ReportColumns);
