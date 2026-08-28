import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useServerTime } from "../../../../hooks/useServerTime";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomCalendarInput from "@inputs/CustomCalendarInput";
import { PrimaryButtonSmall } from "@shared/buttons/PrimaryButton";
import { unfreezeSubscription } from "@store/plan/planActions";
import { formatEnum } from "@utils/common";
import { getDate } from "@utils/dateTime";

const scheduleBadgeStyles = {
  SCHEDULED: { background: "#fff3cd", color: "#856404" },
  CHARGED: { background: "#e6f4ea", color: "#1e7e34" },
  PAYMENT_ERROR: { background: "#f8d7da", color: "#721c24" },
  HOLD: { background: "#cce5ff", color: "#004085" },
  CANCELLED: { background: "#e2e3e5", color: "#383d41" },
};

const StatusBadge = ({ status }) => {
  const style = scheduleBadgeStyles[status] || {};
  return (
    <span style={{ ...style, padding: "3px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 600 }}>
      {status ? formatEnum(status) : "-"}
    </span>
  );
};

// Returns the actual period end date using calendar math so that:
// MONTH adds real calendar months (28/29/30/31 days depending on the month),
// YEAR adds a real calendar year (365 or 366 for leap years),
// WEEK adds exact weeks (7 * timePeriod days),
// DAY adds exact days.
const getServicePeriodEnd = (dueDate, interval, timePeriod) => {
  if (!dueDate) return null;
  const end = new Date(dueDate);
  const count = timePeriod || 1;
  switch (interval?.toUpperCase()) {
    case "DAY":
      end.setDate(end.getDate() + count);
      break;
    case "WEEK":
      end.setDate(end.getDate() + count * 7);
      break;
    case "YEAR":
      end.setFullYear(end.getFullYear() + count);
      break;
    case "MONTH":
    default:
      end.setMonth(end.getMonth() + count);
      break;
  }
  return end;
};

// Derives total days from the actual period start→end so MONTH uses the real
// number of days in that month (28/29/30/31), YEAR uses 365 or 366, etc.
const getServicePeriodDays = (dueDate, interval, timePeriod) => {
  if (!dueDate) return 30;
  const start = new Date(dueDate);
  const end = getServicePeriodEnd(dueDate, interval, timePeriod);
  if (!end) return 30;
  return Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
};

// remaining = (periodEnd - unfreezeDate) / totalPeriodDays * originalAmount
const calcProrated = (dueDate, interval, timePeriod, unfreezeDate, originalAmount) => {
  if (!dueDate || !unfreezeDate || !originalAmount) return originalAmount || 0;

  const totalDays = getServicePeriodDays(dueDate, interval, timePeriod);
  const periodEnd = getServicePeriodEnd(dueDate, interval, timePeriod);
  const unfreeze = new Date(unfreezeDate);

  if (unfreeze >= periodEnd) return 0;

  const remainingDays = Math.max(0, Math.round((periodEnd - unfreeze) / (1000 * 60 * 60 * 24)));
  return parseFloat(((remainingDays / totalDays) * originalAmount).toFixed(2));
};

const UnfreezeMembershipDialog = ({
  visible,
  onHide,
  agreement,
  detailData,
  onSuccess,
}) => {
  const { getServerDate } = useServerTime();
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(false);
  const [unfreezeDate, setUnfreezeDate] = useState(getServerDate());

  // Editable prorate amounts: { [scheduleId]: { [serviceId]: amount } }
  const [proratedAmounts, setProratedAmounts] = useState({});

  const schedules = detailData?.schedules || [];
  const services = detailData?.services || [];
  const autoRenewServices = services.filter((s) => s.autoRenew);

  // interval/timePeriod are plan-level fields, not per-service
  const planInterval = detailData?.interval || "MONTH";
  const planTimePeriod = detailData?.timePeriod || 1;

  const frozenSchedules = [...schedules]
    .filter((s) => s.status === "HOLD")
    .sort((a, b) => (a.paymentNumber || 0) - (b.paymentNumber || 0));

  const chargedSchedules = [...schedules]
    .filter((s) => s.status === "CHARGED")
    .sort((a, b) => (a.paymentNumber || 0) - (b.paymentNumber || 0));

  // Schedules whose dueDate has already passed (unfreezeDate >= dueDate) → need proration
  const overdueSchedules = frozenSchedules.filter((s) => {
    if (!s.dueDate) return false;
    return new Date(unfreezeDate) >= new Date(s.dueDate);
  });

  const needsProration = overdueSchedules.length > 0;

  // Recalculate prorated amounts only for overdue schedules
  useEffect(() => {
    if (!overdueSchedules.length) {
      setProratedAmounts({});
      return;
    }

    const updated = {};
    overdueSchedules.forEach((sched) => {
      updated[sched._id] = {};
      autoRenewServices.forEach((svc) => {
        updated[sched._id][svc._id] = calcProrated(
          sched.dueDate,
          planInterval,
          planTimePeriod,
          unfreezeDate,
          svc.totalPrice,
        );
      });
    });
    setProratedAmounts(updated);
  }, [unfreezeDate, detailData]);

  useEffect(() => {
    if (visible) {
      setUnfreezeDate(getServerDate());
    }
  }, [visible]);

  const handleAmountChange = (schedId, svcId, value) => {
    const num = parseFloat(value);
    setProratedAmounts((prev) => ({
      ...prev,
      [schedId]: {
        ...prev[schedId],
        [svcId]: isNaN(num) ? 0 : num,
      },
    }));
  };

  const getScheduleTotal = (schedId) => {
    const map = proratedAmounts[schedId] || {};
    return Object.values(map).reduce((sum, v) => sum + (v || 0), 0);
  };

  const grandTotal = overdueSchedules.reduce(
    (sum, s) => sum + getScheduleTotal(s._id),
    0,
  );

  const handleUnfreeze = () => {
    if (!agreement?._id) return;

    const scheduleAdjustments = overdueSchedules.map((sched) => ({
      scheduleId: sched._id,
      services: autoRenewServices.map((svc) => ({
        serviceId: svc._id,
        proratedAmount: proratedAmounts[sched._id]?.[svc._id] ?? svc.totalPrice,
      })),
    }));

    const payload = {
      unfreezeDate,
      scheduleAdjustments,
    };

    dispatch(
      unfreezeSubscription(agreement._id, payload, setSaving, () => {
        onSuccess();
        onHide();
      }),
    );
  };

  return (
    <CustomDialog visible={visible} onHide={onHide} title="Unfreeze Membership" size="large">
      <div className="flex flex-column gap-3">

        {/* Unfreeze date */}
        <div className="c-grid">
          <CustomCalendarInput
            value={unfreezeDate}
            onChange={({ value }) => setUnfreezeDate(value)}
            name="unfreezeDate"
            label="Unfreeze Date"
            col={4}
          />
        </div>

        {/* Info banner */}
        {needsProration ? (
          <div
            className="flex align-items-center gap-2 p-3"
            style={{ background: "#fff8e1", borderRadius: "6px", border: "1px solid #ffe082" }}
          >
            <i className="pi pi-info-circle" style={{ color: "#856404" }} />
            <span className="text-sm text-color-secondary">
              {overdueSchedules.length} payment{overdueSchedules.length !== 1 ? "s have" : " has"} passed their due date. Service amounts have been prorated — adjust if needed before confirming.
            </span>
          </div>
        ) : (
          <div
            className="flex align-items-center gap-2 p-3"
            style={{ background: "#e8f5e9", borderRadius: "6px", border: "1px solid #a5d6a7" }}
          >
            <i className="pi pi-check-circle" style={{ color: "#2e7d32" }} />
            <span className="text-sm text-color-secondary">
              No proration needed — all frozen payments are still in the future and will charge on their original due dates.
            </span>
          </div>
        )}

        {/* Charged payments — for reference */}
        {chargedSchedules.length > 0 && (
          <div>
            <h4 className="mt-0 mb-2 text-color-primary">Previously Charged Payments</h4>
            <div className="custom-simple-table-wrapper">
              <table className="custom-simple-table">
                <thead>
                  <tr>
                    <th>Payment #</th>
                    <th>Due Date</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {chargedSchedules.map((row) => (
                    <tr key={row._id}>
                      <td>{row.paymentNumber}</td>
                      <td>{row.dueDate ? getDate(row.dueDate) : "-"}</td>
                      <td>{row.totalAmount != null ? `$${row.totalAmount.toFixed(2)}` : "-"}</td>
                      <td><StatusBadge status={row.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* All frozen schedules */}
        {frozenSchedules.length > 0 && (
          <div>
            <h4 className="mt-0 mb-2 text-color-primary">Frozen Payments</h4>
            <div className="flex flex-column gap-3">
              {frozenSchedules.map((sched) => {
                const isOverdue = overdueSchedules.some((s) => s._id === sched._id);
                const schedTotal = isOverdue ? getScheduleTotal(sched._id) : (sched.totalAmount || 0);

                return (
                  <div
                    key={sched._id}
                    style={{ border: `1px solid ${isOverdue ? "#90caf9" : "#d1d5db"}`, borderRadius: "6px", overflow: "hidden" }}
                  >
                    {/* Schedule header */}
                    <div
                      className="flex align-items-center justify-content-between px-3 py-2"
                      style={{ background: isOverdue ? "#e3f2fd" : "#f8f9fa" }}
                    >
                      <div className="flex align-items-center gap-3">
                        <span className="font-semibold text-color-primary">Payment #{sched.paymentNumber}</span>
                        <span className="text-sm text-color-secondary">
                          Due: {sched.dueDate ? getDate(sched.dueDate) : "-"}
                        </span>
                        {isOverdue && (
                          <span style={{ background: "#fff3cd", color: "#856404", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 600 }}>
                            Prorated
                          </span>
                        )}
                      </div>
                      <span className="font-semibold" style={{ color: isOverdue ? "#004085" : "inherit" }}>
                        Total: ${schedTotal.toFixed(2)}
                      </span>
                    </div>

                    {/* Services — editable only if overdue, read-only otherwise */}
                    {autoRenewServices.length > 0 && (
                      <table className="custom-simple-table" style={{ borderTop: `2px solid ${isOverdue ? "#90caf9" : "#d1d5db"}`, width: "100%" }}>
                        <thead>
                          <tr>
                            <th>Service</th>
                            <th>Interval</th>
                            <th>Service Period</th>
                            {isOverdue && <th>Days Remaining</th>}
                            <th>Original</th>
                            {isOverdue && <th>Prorated Amount</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {autoRenewServices.map((svc) => {
                            const original = svc.totalPrice || 0;
                            const prorated = proratedAmounts[sched._id]?.[svc._id] ?? original;
                            const isReduced = isOverdue && prorated < original;
                            const totalDays = getServicePeriodDays(sched.dueDate, planInterval, planTimePeriod);
                            const periodEnd = getServicePeriodEnd(sched.dueDate, planInterval, planTimePeriod);
                            const remainingDays = isOverdue && periodEnd && unfreezeDate
                              ? Math.max(0, Math.round((periodEnd - new Date(unfreezeDate)) / (1000 * 60 * 60 * 24)))
                              : null;

                            return (
                              <tr key={svc._id} style={{ borderBottom: `1px solid ${isOverdue ? "#c5d8f0" : "#e9ecef"}` }}>
                                <td>{svc.name || "-"}</td>
                                <td className="text-sm text-color-secondary">
                                  {`Every ${planTimePeriod} ${formatEnum(planInterval)}`}
                                </td>
                                <td className="text-sm text-color-secondary">
                                  {sched.dueDate && periodEnd ? `${getDate(sched.dueDate)} — ${getDate(periodEnd)}` : "-"}
                                </td>
                                {isOverdue && (
                                  <td className="text-sm font-semibold" style={{ color: "#004085" }}>
                                    {remainingDays !== null ? `${remainingDays} / ${totalDays} days` : "-"}
                                  </td>
                                )}
                                <td>
                                  <span style={{ textDecoration: isReduced ? "line-through" : "none", color: isReduced ? "#999" : "inherit" }}>
                                    ${original.toFixed(2)}
                                  </span>
                                </td>
                                {isOverdue && (
                                  <td>
                                    <div className="flex align-items-center gap-1">
                                      <span>$</span>
                                      <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={prorated}
                                        onChange={(e) => handleAmountChange(sched._id, svc._id, e.target.value)}
                                        style={{
                                          width: "90px",
                                          padding: "4px 6px",
                                          border: "1px solid var(--border-color)",
                                          borderRadius: "4px",
                                          fontSize: "13px",
                                          fontFamily: "inherit",
                                          color: isReduced ? "#1e7e34" : "inherit",
                                          fontWeight: isReduced ? 600 : "normal",
                                        }}
                                      />
                                    </div>
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Grand total — only when proration applies */}
            {needsProration && (
              <div
                className="flex justify-content-between align-items-center p-3 mt-2"
                style={{ background: "#f0f7ff", borderRadius: "6px", border: "1px solid #90caf9" }}
              >
                <span className="text-color-primary font-semibold">Total Prorated Charge</span>
                <span className="font-semibold" style={{ fontSize: "16px", color: "#004085" }}>
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-content-end gap-2 mt-2">
          <PrimaryButtonSmall
            label="Unfreeze Membership"
            loading={saving}
            onClick={handleUnfreeze}
          />
          <PrimaryButtonSmall
            secondary
            label="Close"
            onClick={onHide}
          />
        </div>
      </div>
    </CustomDialog>
  );
};

export default UnfreezeMembershipDialog;
