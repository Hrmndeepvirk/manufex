import React, { useRef, useState, useCallback, useMemo } from "react";
import RuleBox from "./RuleBox";

function RuleConnector({ value, onChange, onGroup, showGroup }) {
  return (
    <div className="rule-connector">
      <div className="rule-connector__operator">
        <span
          className={`rule-connector__option ${value === "AND" ? "rule-connector__option--active" : ""}`}
          onClick={() => onChange("AND")}
        >
          AND
        </span>
        <span
          className={`rule-connector__option ${value === "OR" ? "rule-connector__option--active" : ""}`}
          onClick={() => onChange("OR")}
        >
          OR
        </span>
      </div>
      {showGroup && (
        <button
          type="button"
          className="rule-connector__group-btn"
          onClick={onGroup}
          title="Group with next rule"
        >
          <i className="pi pi-objects-column" /> Group
        </button>
      )}
    </div>
  );
}

function GroupConnector({ value, onChange }) {
  return (
    <div className="rule-connector rule-connector--inside-group">
      <div className="rule-connector__operator">
        <span
          className={`rule-connector__option ${value === "AND" ? "rule-connector__option--active" : ""}`}
          onClick={() => onChange("AND")}
        >
          AND
        </span>
        <span
          className={`rule-connector__option ${value === "OR" ? "rule-connector__option--active" : ""}`}
          onClick={() => onChange("OR")}
        >
          OR
        </span>
      </div>
    </div>
  );
}

/**
 * Builds rendering segments from a flat rules array.
 * Consecutive rules with the same groupId are collected into a single group segment.
 */
function buildSegments(rules) {
  const segments = [];
  let i = 0;
  while (i < rules.length) {
    if (rules[i].groupId) {
      const gid = rules[i].groupId;
      const groupRules = [];
      const startIndex = i;
      while (i < rules.length && rules[i].groupId === gid) {
        groupRules.push({ rule: rules[i], originalIndex: i });
        i++;
      }
      segments.push({
        type: "group",
        groupId: gid,
        operator: groupRules[0].rule.conditionWithPrevious || "AND",
        rules: groupRules,
        startIndex,
        endIndex: i - 1,
      });
    } else {
      segments.push({ type: "rule", rule: rules[i], originalIndex: i });
      i++;
    }
  }
  return segments;
}

/**
 * Flattens segments back into a flat rules array, reassigning sortOrder.
 */
function flattenSegments(segments) {
  const flat = [];
  segments.forEach((seg) => {
    if (seg.type === "group") {
      seg.rules.forEach((item) => flat.push(item.rule));
    } else {
      flat.push(seg.rule);
    }
  });
  return flat.map((r, i) => ({ ...r, sortOrder: i + 2 }));
}

function AdditionalRulesContainer({
  rules,
  onEdit,
  onDelete,
  onReorder,
  onConditionChange,
  onGroup,
  onUngroup,
}) {
  const dragSegIdx = useRef(null);
  const [overSegIdx, setOverSegIdx] = useState(null);

  const segments = useMemo(() => buildSegments(rules), [rules]);

  const handleDragStart = useCallback((e, segIdx) => {
    dragSegIdx.current = segIdx;
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragOver = useCallback((e, segIdx) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverSegIdx(segIdx);
  }, []);

  const handleDrop = useCallback(
    (e, dropSegIdx) => {
      e.preventDefault();
      const fromSegIdx = dragSegIdx.current;
      if (fromSegIdx !== null && fromSegIdx !== dropSegIdx) {
        const reordered = [...segments];
        const [moved] = reordered.splice(fromSegIdx, 1);
        reordered.splice(dropSegIdx, 0, moved);
        onReorder(flattenSegments(reordered));
      }
      dragSegIdx.current = null;
      setOverSegIdx(null);
    },
    [segments, onReorder],
  );

  const handleDragEnd = useCallback(() => {
    dragSegIdx.current = null;
    setOverSegIdx(null);
  }, []);

  if (rules.length === 0) {
    return (
      <div className="c-col-12 text-center text-secondary py-3">
        No additional rules added. Click + to add a rule.
      </div>
    );
  }

  return (
    <div className="c-col-12 flex flex-column">
      {segments.map((segment, segIdx) => (
        <React.Fragment key={segment.type === "group" ? segment.groupId : segment.originalIndex}>
          {/* Connector between segments */}
          {segIdx > 0 && (() => {
            const prevSegment = segments[segIdx - 1];
            const connectorIndex =
              segment.type === "group" ? segment.startIndex : segment.originalIndex;
            const prevEndIndex =
              prevSegment.type === "group" ? prevSegment.endIndex : prevSegment.originalIndex;

            return (
              <RuleConnector
                value={rules[connectorIndex]?.conditionWithPrevious || "AND"}
                onChange={(val) => onConditionChange(connectorIndex, val)}
                onGroup={() => onGroup(prevEndIndex)}
                showGroup
              />
            );
          })()}

          {segment.type === "group" ? (
            <div
              className={`rule-group${overSegIdx === segIdx ? " rule-group--over" : ""}`}
              draggable
              onDragStart={(e) => handleDragStart(e, segIdx)}
              onDragOver={(e) => handleDragOver(e, segIdx)}
              onDrop={(e) => handleDrop(e, segIdx)}
              onDragEnd={handleDragEnd}
            >
              <div className="rule-group__header">
                <div className="rule-group__header-left">
                  <span className="rule-group__drag-handle" title="Drag to reorder group">
                    <i className="pi pi-bars" />
                  </span>
                  <span
                    className={`rule-group__label rule-group__label--${segment.operator.toLowerCase()}`}
                  >
                    {segment.operator} Group
                  </span>
                </div>
                <button
                  type="button"
                  className="rule-group__ungroup"
                  onClick={() => onUngroup(segment.groupId)}
                  title="Ungroup rules"
                >
                  <i className="pi pi-minus" /> Ungroup
                </button>
              </div>
              <div className="rule-group__body">
                {segment.rules.map((item, rIdx) => (
                  <React.Fragment key={item.originalIndex}>
                    {rIdx > 0 && (
                      <GroupConnector
                        value={item.rule.conditionWithPrevious || "AND"}
                        onChange={(val) => onConditionChange(item.originalIndex, val)}
                      />
                    )}
                    <RuleBox
                      rule={item.rule}
                      index={item.originalIndex}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      showDragHandle={false}
                    />
                  </React.Fragment>
                ))}
              </div>
            </div>
          ) : (
            <div
              className={`rule-box-wrapper${overSegIdx === segIdx ? " rule-box-wrapper--over" : ""}`}
              draggable
              onDragStart={(e) => handleDragStart(e, segIdx)}
              onDragOver={(e) => handleDragOver(e, segIdx)}
              onDrop={(e) => handleDrop(e, segIdx)}
              onDragEnd={handleDragEnd}
            >
              <RuleBox
                rule={segment.rule}
                index={segment.originalIndex}
                onEdit={onEdit}
                onDelete={onDelete}
                showDragHandle
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default React.memo(AdditionalRulesContainer);
