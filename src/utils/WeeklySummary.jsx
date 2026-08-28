import React, { useMemo, useState } from "react";
import CustomCard from "@shared/cards/CustomCard";
import moment from "moment";

function getShiftMinutes(shift) {
  if (Number.isFinite(shift?.minutes)) return shift.minutes;
  if (shift?.startTime && shift?.endTime) {
    const start = moment(shift.startTime, "HH:mm");
    const end = moment(shift.endTime, "HH:mm");
    const diff = end.diff(start, "minutes");
    return diff > 0 ? diff : 0;
  }
  return 0;
}

function getShiftTimeRange(shift) {
  const start = moment(shift.startTime, "HH:mm");
  const end = moment(shift.endTime, "HH:mm");
  const startMinutes = start.isValid()
    ? start.hours() * 60 + start.minutes()
    : 0;
  const endMinutes = end.isValid() ? end.hours() * 60 + end.minutes() : 0;
  return { startMinutes, endMinutes };
}

function shiftsOverlap(shiftA, shiftB) {
  const a = getShiftTimeRange(shiftA);
  const b = getShiftTimeRange(shiftB);
  return a.startMinutes < b.endMinutes && b.startMinutes < a.endMinutes;
}

function getAssignedIds(shift) {
  return (shift.assignedEmployees || [])
    .map((emp) => String(emp?._id || emp))
    .filter(Boolean);
}

function getAvailableCandidates(shift, excludeIds, employeeHours) {
  return (shift.availableEmployees || [])
    .filter((emp) => emp.availability !== "not_available")
    .map((emp) => {
      const id = String(emp.employee || emp._id || "");
      const name =
        emp?.title ||
        `${emp?.firstName || ""} ${emp?.lastName || ""}`.trim() ||
        "Unknown";
      const hours = (employeeHours.get(id)?.minutes || 0) / 60;
      return { id, name, hours, availability: emp.availability };
    })
    .filter((emp) => emp.id && !excludeIds.has(emp.id))
    .sort((a, b) => a.hours - b.hours);
}

function getAvailabilityColor(availability) {
  if (availability === "preferred_and_available") return "#588157";
  if (availability === "available") return "#22c55e";
  if (availability === "not_available") return "#ef4444";
  return "#ffb703";
}

function WeeklySummary({ shifts, viewRange, onApplySuggestion, onApplySwap }) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const weekShifts = useMemo(() => {
    if (!viewRange?.start || !viewRange?.end) return shifts;
    const start = moment(viewRange.start).startOf("day");
    const end = moment(viewRange.end).startOf("day");
    return shifts.filter((shift) => {
      const shiftDate = moment(shift.date);
      return shiftDate.isSameOrAfter(start) && shiftDate.isBefore(end);
    });
  }, [shifts, viewRange]);

  const summary = useMemo(() => {
    const totalMinutes = weekShifts.reduce(
      (sum, shift) => sum + getShiftMinutes(shift),
      0,
    );
    const totalShifts = weekShifts.length;

    let totalMinutesUnfilled = 0;
    let totalShiftsUnfilled = 0;
    const employeeHours = new Map();
    const overbookedShifts = [];
    const suggestions = [];

    const shiftsByDate = new Map();
    weekShifts.forEach((shift) => {
      const dateKey = shift.date;
      if (!shiftsByDate.has(dateKey)) shiftsByDate.set(dateKey, []);
      shiftsByDate.get(dateKey).push(shift);
    });

    weekShifts.forEach((shift) => {
      const assigned = shift.assignedEmployees || [];
      const staffRequired = Number(shift.staffRequired) || 0;
      const minutes = getShiftMinutes(shift);
      const assignedCount = assigned.length;

      if (assignedCount < staffRequired) {
        totalShiftsUnfilled += 1;
        totalMinutesUnfilled += minutes * (staffRequired - assignedCount);
      }

      if (assignedCount > staffRequired) {
        overbookedShifts.push(shift);
      }

      assigned.forEach((emp) => {
        const id = emp?._id || emp;
        if (!id) return;
        const name =
          emp?.title ||
          `${emp?.firstName || ""} ${emp?.lastName || ""}`.trim() ||
          "Unknown";
        const current = employeeHours.get(id) || { name, minutes: 0 };
        employeeHours.set(id, {
          name: current.name || name,
          minutes: current.minutes + minutes,
        });
      });

      if (assignedCount < staffRequired) {
        const needed = staffRequired - assignedCount;
        const dayShifts = shiftsByDate.get(shift.date) || [];
        const assignedSameDayIds = new Set(
          dayShifts.flatMap((dayShift) => getAssignedIds(dayShift)),
        );
        const candidates = getAvailableCandidates(
          shift,
          assignedSameDayIds,
          employeeHours,
        ).slice(0, needed);

        const swapSuggestions = [];
        dayShifts.forEach((otherShift) => {
          if (otherShift._id === shift._id) return;
          if (!shiftsOverlap(shift, otherShift)) return;
          const otherAssigned = otherShift.assignedEmployees || [];
          if (!otherAssigned.length) return;

          otherAssigned.forEach((swapOut) => {
            const swapOutId = String(swapOut?._id || swapOut);
            if (!swapOutId) return;
            if (assignedSameDayIds.has(swapOutId)) {
              const excludeIds = new Set(assignedSameDayIds);
              excludeIds.delete(swapOutId);
              const replacements = getAvailableCandidates(
                otherShift,
                excludeIds,
                employeeHours,
              );
              if (!replacements.length) return;
              const replacement = replacements[0];
              swapSuggestions.push({
                swapOut,
                swapOutId,
                replacement,
                otherShift,
              });
            }
          });
        });

        suggestions.push({
          shift,
          needed,
          candidates,
          swaps: swapSuggestions,
        });
      }
    });

    const overtimeEmployees = Array.from(employeeHours.values()).filter(
      (entry) => entry.minutes / 60 > 40,
    );

    return {
      totalHours: (totalMinutes / 60).toFixed(2),
      totalShifts,
      totalHoursUnfilled: (totalMinutesUnfilled / 60).toFixed(2),
      totalShiftsUnfilled,
      employeeHours: Array.from(employeeHours.values())
        .map((entry) => ({
          name: entry.name,
          hours: (entry.minutes / 60).toFixed(2),
        }))
        .sort((a, b) => b.hours - a.hours),
      overtimeEmployees,
      overbookedCount: overbookedShifts.length,
      suggestions,
    };
  }, [weekShifts]);

  return (
    <div>
      <CustomCard title="Weekly Summary">
        <div className="c-col-12">
          <div className="flex flex-wrap gap-3">
            <div className="border-1 border-round-md p-2 surface-50 px-3 border-gray-300">
              <div className="text-sm text-600">Total Hours</div>
              <div className="font-semibold">{summary.totalHours}</div>
            </div>
            <div className="border-1 border-round-md p-2 surface-50 px-3 border-gray-300">
              <div className="text-sm text-600">Total Shifts</div>
              <div className="font-semibold">{summary.totalShifts}</div>
            </div>
            <div className="border-1 border-round-md p-2 surface-50 px-3 border-gray-300">
              <div className="text-sm text-600">Total Hours Not Filled</div>
              <div className="font-semibold">{summary.totalHoursUnfilled}</div>
            </div>
            <div className="border-1 border-round-md p-2 surface-50 px-3 border-gray-300">
              <div className="text-sm text-600">Total Shifts Unfilled</div>
              <div className="font-semibold">{summary.totalShiftsUnfilled}</div>
            </div>
          </div>
        </div>
        <div className="c-col-12">
          <div className="font-medium mb-2">Hours by Employee</div>
          {summary.employeeHours.length === 0 ? (
            <div className="text-600 text-sm">No assigned shifts.</div>
          ) : (
            <div className="flex flex-column gap-1">
              {summary.employeeHours.map((entry) => (
                <div key={entry.name} className="text-sm">
                  {entry.name}: {entry.hours} hrs
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="c-col-12">
          <div className="font-medium mb-2">Warnings</div>
          {summary.overtimeEmployees.length === 0 &&
          summary.overbookedCount === 0 ? (
            <div className="text-600 text-sm">No warnings.</div>
          ) : (
            <div className="flex flex-column gap-1 text-sm">
              {summary.overtimeEmployees.map((entry) => (
                <div key={entry.name}>
                  Overtime: {entry.name} ({entry.hours} hrs)
                </div>
              ))}
              {summary.overbookedCount > 0 && (
                <div>Overbooking: {summary.overbookedCount} shifts</div>
              )}
            </div>
          )}
        </div>
        <div className="c-col-12">
          <div className="flex align-items-center justify-content-between mb-2">
            <div className="font-medium">Suggestions</div>
            <button
              type="button"
              className="border-1 border-round-md px-2 py-1 text-sm"
              onClick={() => setShowSuggestions((prev) => !prev)}
            >
              {showSuggestions ? "Hide Suggestions" : "Show Suggestions"}
            </button>
          </div>
          {!showSuggestions ? (
            <div className="text-600 text-sm">
              Enable to see suggested employees for unfilled shifts.
            </div>
          ) : summary.suggestions.length === 0 ? (
            <div className="text-600 text-sm">No unfilled shifts.</div>
          ) : (
            <div className="flex flex-column gap-2 text-sm">
              {summary.suggestions.map((item, index) => {
                const shift = item.shift;
                return (
                  <div
                    key={`${shift._id || index}`}
                    className="border-1 border-round-md border-gray-300 p-2 surface-50"
                  >
                    <div className="font-medium">
                      {shift.title || "Shift"} • {shift.date} •{" "}
                      {shift.startTime}-{shift.endTime}
                    </div>
                    {item.candidates.length === 0 &&
                    (!item.swaps || item.swaps.length === 0) ? (
                      <div className="text-600">
                        No available employees to suggest.
                      </div>
                    ) : (
                      <div className="flex flex-column gap-2">
                        {item.candidates.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {item.candidates.map((emp) => (
                              <button
                                key={emp.id}
                                type="button"
                                className="border-1 border-round-md px-2 py-1 text-sm cursor-pointer"
                                style={{
                                  borderColor: getAvailabilityColor(
                                    emp.availability,
                                  ),
                                  backgroundColor: getAvailabilityColor(
                                    emp.availability,
                                  ),
                                  color: "#000",
                                }}
                                onClick={() => onApplySuggestion?.(shift, emp)}
                              >
                                {emp.name} ({emp.hours.toFixed(2)} hrs)
                              </button>
                            ))}
                          </div>
                        )}
                        {item.swaps?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {item.swaps.map((swap, swapIndex) => (
                              <button
                                key={`${swap.swapOutId}-${swapIndex}`}
                                type="button"
                                className="border-1 border-round-md px-2 py-1 text-sm cursor-pointer"
                                style={{
                                  borderColor: "#475569",
                                  backgroundColor: "#e2e8f0",
                                  color: "#000",
                                }}
                                onClick={() => onApplySwap?.(shift, swap)}
                              >
                                Swap {swap.swapOut.firstName}{" "}
                                {swap.swapOut.lastName} ↔{" "}
                                {swap.replacement.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CustomCard>
    </div>
  );
}

export default React.memo(WeeklySummary);
