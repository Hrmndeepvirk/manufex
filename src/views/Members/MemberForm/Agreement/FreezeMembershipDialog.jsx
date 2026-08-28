import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomCalendarInput from "@inputs/CustomCalendarInput";
import CustomDropdown from "@inputs/CustomDropdown";
import { PrimaryButtonSmall } from "@shared/buttons/PrimaryButton";
import { freezeSubscription } from "@store/plan/planActions";
import { formatEnum } from "@utils/common";
import { getDate } from "@utils/dateTime";
import {
  FreezeReasonOptions,
  FreezeTypeOptions,
  NumberPaymentsOptions,
} from "@utils/dropdownConstants";

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

// Build options for BILLING start date — only dates matching scheduled billing dates
const buildBillingStartOptions = (scheduledRows) =>
  scheduledRows.map((s) => ({
    _id: s._id,
    title: s.dueDate ? getDate(s.dueDate) : `Payment #${s.paymentNumber}`,
    dueDate: s.dueDate,
  }));

// One year from a given date
const addOneYear = (date) => {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + 1);
  return d;
};

const FreezeMembershipDialog = ({
  visible,
  onHide,
  agreement,
  detailData,
  memberData,
  onSuccess,
}) => {
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    type: "PRORATE",
    reason: "",
    // TIME / PRORATE fields
    startDate: null,
    endDate: null,
    // BILLING fields
    billingStartScheduleId: null,
    numberOfPayments: 1,
    // Freeze fee
    freezeFeeRecurring: false,
  });

  const schedules = detailData?.schedules || [];
  const sortedSchedules = [...schedules].sort(
    (a, b) => (a.paymentNumber || 0) - (b.paymentNumber || 0),
  );
  const scheduledRows = sortedSchedules.filter((s) =>
    ["SCHEDULED", "HOLD"].includes(s.status),
  );

  const freezingTerm = detailData?.freezingTerm;
  const freezingTermPer = detailData?.freezingTermPer;
  const freezeFee = (detailData?.assessedFees || []).find(
    (f) => f.type === "FREEZE_FEE",
  );

  const [includeFreezeFee, setIncludeFreezeFee] = useState(true);

  useEffect(() => {
    if (visible) {
      setData({
        type: "PRORATE",
        reason: "",
        startDate: null,
        endDate: null,
        billingStartScheduleId: null,
        numberOfPayments: 1,
        freezeFeeRecurring: false,
      });
      setIncludeFreezeFee(true);
    }
  }, [visible]);

  const handleChange = ({ name, value }) => {
    setData((prev) => {
      const next = { ...prev, [name]: value };
      // Reset type-specific fields when type changes
      if (name === "type") {
        next.startDate = null;
        next.endDate = null;
        next.billingStartScheduleId = null;
        next.numberOfPayments = 1;
        next.freezeFeeRecurring = false;
      }
      // When startDate changes, clear endDate if it would exceed 1 year
      if (name === "startDate" && prev.endDate && value) {
        const maxEnd = addOneYear(value);
        if (new Date(prev.endDate) > maxEnd) {
          next.endDate = null;
        }
      }
      return next;
    });
  };

  // Billing start date options (only scheduled payment dates)
  const billingStartOptions = useMemo(
    () => buildBillingStartOptions(scheduledRows),
    [scheduledRows],
  );

  // The scheduled row corresponding to the selected billing start
  const billingStartRow = scheduledRows.find(
    (s) => s._id === data.billingStartScheduleId,
  );
  const billingStartIndex = billingStartRow
    ? scheduledRows.indexOf(billingStartRow)
    : -1;

  // Schedules that will be frozen — derived per type
  const schedulesInRange = useMemo(() => {
    if (data.type === "TIME") {
      // Agreement charges normally — no payments are frozen
      return [];
    }
    if (data.type === "BILLING") {
      if (billingStartIndex < 0 || !data.numberOfPayments) return [];
      return scheduledRows.slice(
        billingStartIndex,
        billingStartIndex + data.numberOfPayments,
      );
    }
    if (data.type === "PRORATE") {
      if (!data.startDate || !data.endDate) return [];
      const start = new Date(data.startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(data.endDate);
      end.setHours(23, 59, 59, 999);
      return scheduledRows.filter((s) => {
        if (!s.dueDate) return false;
        const due = new Date(s.dueDate);
        return due >= start && due <= end;
      });
    }
    return [];
  }, [data.type, data.startDate, data.endDate, data.billingStartScheduleId, data.numberOfPayments, billingStartIndex, scheduledRows]);

  const memberName = memberData
    ? `${memberData.firstName || ""} ${memberData.lastName || ""}`.trim()
    : "";
  const memberPhone = memberData?.primaryPhone || "";

  // Max end date = 1 year from start
  const maxEndDate = data.startDate ? addOneYear(data.startDate) : undefined;

  // Freeze fee total
  const freezeFeeTotal = (() => {
    if (!freezeFee || !includeFreezeFee) return 0;
    const amt = freezeFee.amount || 0;
    if (data.type === "BILLING") {
      return data.freezeFeeRecurring
        ? amt * schedulesInRange.length
        : amt;
    }
    return amt;
  })();

  const handleFreeze = () => {
    if (!agreement?._id) return;

    const payload = {
      type: data.type,
      reason: data.reason,
      includeFreezeFee,
    };

    if (data.type === "TIME") {
      payload.startDate = data.startDate;
      payload.endDate = data.endDate;
    } else if (data.type === "BILLING") {
      payload.startDate = billingStartRow?.dueDate || null;
      payload.numberOfPayments = data.numberOfPayments;
      payload.freezeScheduleIds = schedulesInRange.map((s) => s._id);
      payload.freezeFeeRecurring = data.freezeFeeRecurring;
    } else if (data.type === "PRORATE") {
      payload.startDate = data.startDate;
      payload.endDate = data.endDate;
      payload.freezeScheduleIds = schedulesInRange.map((s) => s._id);
    }

    dispatch(
      freezeSubscription(agreement._id, payload, setSaving, () => {
        onSuccess();
        onHide();
      }),
    );
  };

  const typeDescriptions = {
    TIME: "Agreement continues to charge normally. Time is added to the end of the contract at no cost. A freeze fee may apply.",
    BILLING: "Stops billing for the selected number of payments. Agreement cannot be used during this period. Payments are added to the end of the term.",
    PRORATE: "Charges are prorated based on when the freeze starts and recalculated when the member returns. Additional billing fees may apply.",
  };

  return (
    <CustomDialog visible={visible} onHide={onHide} title="Freeze Membership" size="large">
      <div className="flex flex-column gap-3">

        {/* Member info */}
        {memberName && (
          <div className="text-center text-color-primary font-semibold">
            {memberName}{memberPhone && ` — ${memberPhone}`}
          </div>
        )}

        {/* Freeze term warning */}
        {freezingTerm?.value && (
          <div
            className="flex align-items-start gap-2 p-3"
            style={{ background: "#fff8e1", borderRadius: "6px", border: "1px solid #ffe082" }}
          >
            <i className="pi pi-info-circle mt-1" style={{ color: "#856404" }} />
            <div>
              <span className="font-semibold text-color-primary">Freeze Term on this Agreement: </span>
              <span className="text-color-secondary">
                {freezingTerm.value} {formatEnum(freezingTerm.unit)}
                {freezingTermPer?.value
                  ? ` per ${freezingTermPer.value} ${formatEnum(freezingTermPer.unit)}`
                  : ""}
              </span>
              <p className="mt-1 mb-0 text-sm text-color-secondary">
                You may adjust the freeze period, but please stay within this term limit.
              </p>
            </div>
          </div>
        )}

        {/* Action */}
        <div>
          <h4 className="mt-0 mb-2 text-color-primary">Action</h4>
          <div className="c-grid">
            <CustomDropdown
              data={data}
              onChange={handleChange}
              name="type"
              label="Freeze Type"
              options={FreezeTypeOptions}
              col={6}
            />
            <CustomDropdown
              data={data}
              onChange={handleChange}
              name="reason"
              label="Reason"
              options={FreezeReasonOptions}
              col={6}
            />
          </div>

          {/* Type description */}
          {data.type && (
            <div
              className="flex align-items-start gap-2 p-2 mt-1"
              style={{ background: "#f2f5fe", borderRadius: "6px", border: "1px solid #c5d0f0" }}
            >
              <i className="pi pi-info-circle mt-1" style={{ color: "#004085", fontSize: "13px" }} />
              <span className="text-sm text-color-secondary">{typeDescriptions[data.type]}</span>
            </div>
          )}

          {/* TIME: date range (max 1 year) */}
          {data.type === "TIME" && (
            <div className="c-grid mt-2">
              <CustomCalendarInput
                data={data}
                onChange={handleChange}
                name="startDate"
                label="Start Date"
                col={6}
              />
              <CustomCalendarInput
                data={data}
                onChange={handleChange}
                name="endDate"
                label="End Date"
                col={6}
                minDate={data.startDate ? new Date(data.startDate) : undefined}
                maxDate={maxEndDate}
              />
            </div>
          )}

          {/* BILLING: start date constrained to scheduled dates + number of payments */}
          {data.type === "BILLING" && (
            <div className="c-grid mt-2">
              <CustomDropdown
                data={data}
                onChange={handleChange}
                name="billingStartScheduleId"
                label="Start Date (Billing Date)"
                options={billingStartOptions}
                col={6}
                placeholder="Select a scheduled billing date"
              />
              <CustomDropdown
                data={data}
                onChange={handleChange}
                name="numberOfPayments"
                label="Number of Payments to Freeze"
                options={NumberPaymentsOptions}
                col={6}
              />
            </div>
          )}

          {/* PRORATE: date range (max 1 year) */}
          {data.type === "PRORATE" && (
            <div className="c-grid mt-2">
              <CustomCalendarInput
                data={data}
                onChange={handleChange}
                name="startDate"
                label="Start Date"
                col={6}
              />
              <CustomCalendarInput
                data={data}
                onChange={handleChange}
                name="endDate"
                label="End Date"
                col={6}
                minDate={data.startDate ? new Date(data.startDate) : undefined}
                maxDate={maxEndDate}
              />
            </div>
          )}
        </div>

        {/* Scheduled Payments preview — BILLING and PRORATE only */}
        {(data.type === "BILLING" || data.type === "PRORATE") && scheduledRows.length > 0 && (
          <div>
            <h4 className="mt-0 mb-1 text-color-primary">Scheduled Payments</h4>
            {schedulesInRange.length > 0 && (
              <p className="text-sm text-color-secondary mt-0 mb-2">
                {data.type === "BILLING"
                  ? `${schedulesInRange.length} payment${schedulesInRange.length !== 1 ? "s" : ""} will be frozen — agreement cannot be used during this period. These payments will be added to the end of the term.`
                  : `${schedulesInRange.length} payment${schedulesInRange.length !== 1 ? "s" : ""} fall within the freeze period — charges will be prorated. Amounts will be recalculated when the member returns.`}
              </p>
            )}
            <div className="custom-simple-table-wrapper">
              <table className="custom-simple-table">
                <thead>
                  <tr>
                    <th>Payment #</th>
                    <th>Due Date</th>
                    <th>Period Start</th>
                    <th>Period End</th>
                    <th>Base Amount</th>
                    <th>Tax</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduledRows.map((row) => {
                    const isFrozen = schedulesInRange.some((s) => s._id === row._id);
                    return (
                      <tr key={row._id} style={isFrozen ? { background: "#e3f2fd" } : {}}>
                        <td>{row.paymentNumber}</td>
                        <td>{row.dueDate ? getDate(row.dueDate) : "-"}</td>
                        <td>{row.periodStart ? getDate(row.periodStart) : "-"}</td>
                        <td>{row.periodEnd ? getDate(row.periodEnd) : "-"}</td>
                        <td>{row.baseAmount != null ? `$${row.baseAmount.toFixed(2)}` : "-"}</td>
                        <td>{row.taxAmount != null ? `$${row.taxAmount.toFixed(2)}` : "-"}</td>
                        <td>{row.totalAmount != null ? `$${row.totalAmount.toFixed(2)}` : "-"}</td>
                        <td><StatusBadge status={row.status} /></td>
                        <td>
                          {isFrozen && (
                            <span style={{ background: "#cce5ff", color: "#004085", padding: "3px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 600 }}>
                              {data.type === "BILLING" ? "Frozen" : "Prorated"}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TIME type — informational note about no payment impact */}
        {data.type === "TIME" && data.startDate && data.endDate && (
          <div
            className="flex align-items-start gap-2 p-3"
            style={{ background: "#e8f5e9", borderRadius: "6px", border: "1px solid #a5d6a7" }}
          >
            <i className="pi pi-check-circle mt-1" style={{ color: "#2e7d32" }} />
            <div>
              <span className="font-semibold text-color-primary">No billing interruption. </span>
              <span className="text-sm text-color-secondary">
                All scheduled payments will continue to charge normally. Time will be added to the end of the agreement at no cost.
              </span>
            </div>
          </div>
        )}

        {/* Freeze Fee */}
        {freezeFee && (
          <div
            className="flex flex-column gap-2 p-3"
            style={{ background: "#fff8e1", borderRadius: "6px", border: "1px solid #ffe082" }}
          >
            <div className="flex align-items-center gap-3">
              <input
                type="checkbox"
                id="includeFreezeFee"
                checked={includeFreezeFee}
                onChange={(e) => setIncludeFreezeFee(e.target.checked)}
                style={{ cursor: "pointer" }}
              />
              <label htmlFor="includeFreezeFee" className="text-color-primary font-semibold" style={{ cursor: "pointer" }}>
                Include Freeze Fee:&nbsp;
                <strong>${(freezeFee.amount || 0).toFixed(2)}</strong>
                {freezeFee.title && (
                  <span className="text-color-secondary font-normal ml-2">({freezeFee.title})</span>
                )}
              </label>
            </div>

            {/* BILLING: recurring vs 1x freeze fee option */}
            {data.type === "BILLING" && includeFreezeFee && schedulesInRange.length > 1 && (
              <div className="flex align-items-center gap-3 ml-4">
                <label className="flex align-items-center gap-2 text-sm text-color-secondary" style={{ cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="freezeFeeMode"
                    checked={!data.freezeFeeRecurring}
                    onChange={() => handleChange({ name: "freezeFeeRecurring", value: false })}
                    style={{ cursor: "pointer" }}
                  />
                  One-time: <strong className="ml-1">${(freezeFee.amount || 0).toFixed(2)}</strong>
                </label>
                <label className="flex align-items-center gap-2 text-sm text-color-secondary" style={{ cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="freezeFeeMode"
                    checked={data.freezeFeeRecurring}
                    onChange={() => handleChange({ name: "freezeFeeRecurring", value: true })}
                    style={{ cursor: "pointer" }}
                  />
                  Recurring: <strong className="ml-1">${(freezeFee.amount || 0).toFixed(2)} × {schedulesInRange.length} = ${((freezeFee.amount || 0) * schedulesInRange.length).toFixed(2)}</strong>
                </label>
              </div>
            )}

            {includeFreezeFee && (
              <div className="ml-4 text-sm text-color-secondary">
                Total freeze fee: <strong>${freezeFeeTotal.toFixed(2)}</strong>
              </div>
            )}
          </div>
        )}

        {/* Footer actions */}
        <div className="flex justify-content-end gap-2 mt-2">
          <PrimaryButtonSmall
            label="Freeze Membership"
            loading={saving}
            onClick={handleFreeze}
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

export default FreezeMembershipDialog;
