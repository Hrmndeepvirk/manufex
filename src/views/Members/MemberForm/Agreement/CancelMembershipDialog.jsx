import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useServerTime } from "../../../../hooks/useServerTime";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomCalendarInput from "@inputs/CustomCalendarInput";
import CustomDropdown from "@inputs/CustomDropdown";
import CustomTextArea from "@inputs/CustomTextArea";
import { PrimaryButtonSmall } from "@shared/buttons/PrimaryButton";
import CustomSimpleTable from "@shared/table/CustomSimpleTable";
import { cancelSubscription } from "@store/plan/planActions";
import { CancelReasonOptions } from "@utils/dropdownConstants";
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
    <span
      style={{
        ...style,
        padding: "3px 8px",
        borderRadius: "4px",
        fontSize: "11px",
        fontWeight: 600,
      }}
    >
      {status ? formatEnum(status) : "-"}
    </span>
  );
};

const CancelMembershipDialog = ({
  visible,
  onHide,
  agreement,
  detailData,
  onSuccess,
}) => {
  const { getServerDate } = useServerTime();
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    cancellationDate: getServerDate(),
    cancellationReason: "",
    cancelNow: false,
    comments: "",
  });

  // Schedule selection (cascade: selecting row N selects all scheduled from first to N)
  const [selectedScheduleIds, setSelectedScheduleIds] = useState([]);
  // Expanded rows: Set of schedule IDs
  const [expandedIds, setExpandedIds] = useState(new Set());
  // Per-schedule selected services: { [scheduleId]: serviceId[] }
  const [selectedServicesBySchedule, setSelectedServicesBySchedule] = useState({});
  // Cancellation fee
  const [includeCancellationFee, setIncludeCancellationFee] = useState(true);

  const schedules = detailData?.schedules || [];
  const services = detailData?.services || [];
  const assessedFees = detailData?.assessedFees || [];

  const sortedSchedules = [...schedules].sort(
    (a, b) => (a.paymentNumber || 0) - (b.paymentNumber || 0),
  );
  const chargedPayments = sortedSchedules.filter((s) => s.status === "CHARGED");
  const scheduledRows = sortedSchedules.filter((s) => s.status === "SCHEDULED");

  const autoRenewServices = services.filter((s) => s.autoRenew);

  const cancellationFee = assessedFees.find(
    (f) => f.type === "CANCELLATION_FEE" || f.title?.toLowerCase().includes("cancel"),
  );

  const tomorrow = getServerDate();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  useEffect(() => {
    if (visible) {
      setData({
        cancellationDate: null,
        cancellationReason: "",
        cancelNow: false,
        comments: "",
      });
      setSelectedScheduleIds([]);
      setExpandedIds(new Set());
      setSelectedServicesBySchedule({});
      setIncludeCancellationFee(true);
    }
  }, [visible]);

  // Auto-select schedules when cancellation date changes
  useEffect(() => {
    if (!data.cancellationDate) {
      setSelectedScheduleIds([]);
      setSelectedServicesBySchedule({});
      return;
    }

    const cancelDate = new Date(data.cancellationDate);
    cancelDate.setHours(23, 59, 59, 999);

    const inRange = scheduledRows.filter((s) => {
      if (!s.dueDate) return false;
      return new Date(s.dueDate) <= cancelDate;
    });

    const inRangeIds = inRange.map((s) => s._id);
    setSelectedScheduleIds(inRangeIds);

    setSelectedServicesBySchedule((prev) => {
      const updated = { ...prev };
      inRangeIds.forEach((id) => {
        if (!updated[id]) {
          updated[id] = autoRenewServices.map((s) => s._id);
        }
      });
      // Remove schedules no longer in range
      Object.keys(updated).forEach((id) => {
        if (!inRangeIds.includes(id)) delete updated[id];
      });
      return updated;
    });
  }, [data.cancellationDate]);

  const handleChange = ({ name, value }) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Cascade schedule selection (same as AgreementViewDialog)
  const handleScheduleToggle = (row) => {
    const payNum = row.paymentNumber;
    const isSelected = selectedScheduleIds.includes(row._id);

    let newSelectedIds;
    if (isSelected) {
      // Deselect this and all after it
      const deselectedIds = new Set(
        scheduledRows
          .filter((s) => s.paymentNumber >= payNum)
          .map((s) => s._id),
      );
      newSelectedIds = selectedScheduleIds.filter((id) => !deselectedIds.has(id));
      // Clear services for deselected schedules
      setSelectedServicesBySchedule((prev) => {
        const updated = { ...prev };
        deselectedIds.forEach((id) => delete updated[id]);
        return updated;
      });
    } else {
      // Select all from first up to and including this one
      const toSelect = scheduledRows
        .filter((s) => s.paymentNumber <= payNum)
        .map((s) => s._id);
      newSelectedIds = toSelect;
      // Auto-select all services for newly selected schedules
      setSelectedServicesBySchedule((prev) => {
        const updated = { ...prev };
        toSelect.forEach((id) => {
          if (!updated[id]) {
            updated[id] = autoRenewServices.map((s) => s._id);
          }
        });
        return updated;
      });
    }
    setSelectedScheduleIds(newSelectedIds);
  };

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleServiceToggle = (scheduleId, serviceId) => {
    setSelectedServicesBySchedule((prev) => {
      const current = prev[scheduleId] || [];
      const has = current.includes(serviceId);
      return {
        ...prev,
        [scheduleId]: has
          ? current.filter((id) => id !== serviceId)
          : [...current, serviceId],
      };
    });
  };

  // Annual fees in cancellation date range
  const [includedAnnualFeeIds, setIncludedAnnualFeeIds] = useState([]);

  const annualFeesInRange = (() => {
    if (!data.cancellationDate) return [];
    const cancelDate = new Date(data.cancellationDate);
    cancelDate.setHours(23, 59, 59, 999);
    const today = getServerDate();
    today.setHours(0, 0, 0, 0);
    return assessedFees.filter((f) => {
      const isAnnual =
        f.type?.toUpperCase().includes("ANNUAL") ||
        f.title?.toLowerCase().includes("annual");
      if (!isAnnual) return false;
      const due = f.firstDueDate || f.dueDate;
      if (!due) return false;
      const dueDate = new Date(due);
      return dueDate >= today && dueDate <= cancelDate;
    });
  })();

  // Sync includedAnnualFeeIds when range fees change
  useEffect(() => {
    setIncludedAnnualFeeIds(annualFeesInRange.map((f) => f._id));
  }, [data.cancellationDate]);

  const toggleAnnualFee = (id) => {
    setIncludedAnnualFeeIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  // Total calculation
  const selectedServicesTotal = selectedScheduleIds.reduce((total, schedId) => {
    const serviceIds = selectedServicesBySchedule[schedId] || [];
    const scheduleServiceTotal = autoRenewServices
      .filter((s) => serviceIds.includes(s._id))
      .reduce((sum, s) => sum + (s.totalPrice || 0), 0);
    return total + scheduleServiceTotal;
  }, 0);

  const cancellationFeeAmount = includeCancellationFee ? (cancellationFee?.amount || 0) : 0;
  const annualFeesTotal = annualFeesInRange
    .filter((f) => includedAnnualFeeIds.includes(f._id))
    .reduce((sum, f) => sum + (f.amount || 0), 0);
  // Scheduled payments are charged on due date, not immediately
  const chargedImmediatelyTotal = cancellationFeeAmount;
  const grandTotal = selectedServicesTotal + cancellationFeeAmount + annualFeesTotal;

  const handleCancel = () => {
    if (!agreement?._id) return;
    const payload = {
      cancellationDate: data.cancellationDate,
      cancellationReason: data.cancellationReason,
      cancelNow: data.cancelNow,
      comments: data.comments,
      scheduleServices: selectedScheduleIds.map((schedId) => ({
        scheduleId: schedId,
        serviceIds: selectedServicesBySchedule[schedId] || [],
      })),
      includeCancellationFee,
      annualFeeIds: includedAnnualFeeIds,
    };
    dispatch(
      cancelSubscription(agreement._id, payload, setSaving, () => {
        onSuccess();
        onHide();
      }),
    );
  };

  const chargedColumns = [
    { field: "paymentNumber", header: "Payment #" },
    { field: "dueDate", header: "Due Date", isDate: true },
    { field: "baseAmount", header: "Base Amount", isCurrency: true },
    { field: "taxAmount", header: "Tax", isCurrency: true },
    { field: "totalAmount", header: "Total", isCurrency: true },
    {
      field: "status",
      header: "Status",
      body: (r) => <StatusBadge status={r?.status} />,
    },
  ];

  const serviceColumns = [
    { field: "name", header: "Service Name" },
    { field: "basePrice", header: "Price", isCurrency: true },
    { field: "totalPrice", header: "Total Price", isCurrency: true },
    {
      field: "quantity",
      header: "Qty",
      body: (r) => (r?.allowUnlimited ? "Unlimited" : r?.quantity || 0),
    },
    {
      field: "autoRenew",
      header: "Auto Renew",
      body: (r) => (r?.autoRenew ? "Yes" : "No"),
    },
  ];

  return (
    <CustomDialog
      visible={visible}
      onHide={onHide}
      title="Cancel Membership"
      size="large"
    >
      <div className="flex flex-column gap-3">

        {/* Effective */}
        <div>
          <h4 className="mt-0 mb-2 text-color-primary">Effective</h4>
          <div className="c-grid">
            <CustomCalendarInput
              data={data}
              onChange={handleChange}
              name="cancellationDate"
              label="Cancellation Date"
              col={6}
              minDate={tomorrow}
            />
            <CustomDropdown
              data={data}
              onChange={handleChange}
              name="cancellationReason"
              label="Cancellation Reason"
              options={CancelReasonOptions}
              col={6}
            />
          </div>
          <div className="flex align-items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={data.cancelNow}
              onChange={(e) =>
                handleChange({ name: "cancelNow", value: e.target.checked })
              }
            />
            <span className="text-color-primary font-semibold">Cancel Now</span>
          </div>
          <div className="mt-3">
            <CustomTextArea
              data={data}
              onChange={handleChange}
              name="comments"
              label="Comments"
              col={12}
            />
          </div>
        </div>

        {/* Charged Payments */}
        {chargedPayments.length > 0 && (
          <div>
            <h4 className="mt-0 mb-2 text-color-primary">Charged Payments</h4>
            <CustomSimpleTable data={chargedPayments} columns={chargedColumns} />
          </div>
        )}

        {/* All Services */}
        {services.length > 0 && (
          <div>
            <h4 className="mt-0 mb-2 text-color-primary">Services</h4>
            <CustomSimpleTable data={services} columns={serviceColumns} />
          </div>
        )}

        {/* Scheduled Payments — expandable with per-service selection */}
        {scheduledRows.length > 0 && (
          <div>
            <h4 className="mt-0 mb-1 text-color-primary">Scheduled Payments</h4>
            <p className="text-sm text-color-secondary mt-0 mb-2">
              Select the last payment to charge. Expand a row to choose specific services for that date.
            </p>
            <div className="custom-simple-table-wrapper">
              <table className="custom-simple-table">
                <thead>
                  <tr>
                    <th style={{ width: "40px" }}></th>
                    <th style={{ width: "36px" }}></th>
                    <th>Payment #</th>
                    <th>Due Date</th>
                    <th>Period Start</th>
                    <th>Period End</th>
                    <th>Base Amount</th>
                    <th>Tax</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduledRows.map((row) => {
                    const isSelected = selectedScheduleIds.includes(row._id);
                    const isExpanded = expandedIds.has(row._id);
                    const selectedServIds = selectedServicesBySchedule[row._id] || [];

                    return (
                      <React.Fragment key={row._id}>
                        <tr style={isSelected ? { background: "#f0f7ff" } : {}}>
                          <td>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleScheduleToggle(row)}
                              style={{ cursor: "pointer" }}
                            />
                          </td>
                          <td>
                            <i
                              className={`pi ${isExpanded ? "pi-chevron-down" : "pi-chevron-right"} cursor-pointer`}
                              style={{ fontSize: "12px" }}
                              onClick={() => toggleExpand(row._id)}
                            />
                          </td>
                          <td>{row.paymentNumber}</td>
                          <td>{row.dueDate ? getDate(row.dueDate) : "-"}</td>
                          <td>{row.periodStart ? getDate(row.periodStart) : "-"}</td>
                          <td>{row.periodEnd ? getDate(row.periodEnd) : "-"}</td>
                          <td>{row.baseAmount != null ? `$${row.baseAmount.toFixed(2)}` : "-"}</td>
                          <td>{row.taxAmount != null ? `$${row.taxAmount.toFixed(2)}` : "-"}</td>
                          <td>{row.totalAmount != null ? `$${row.totalAmount.toFixed(2)}` : "-"}</td>
                          <td><StatusBadge status={row.status} /></td>
                        </tr>

                        {/* Expanded service sub-rows */}
                        {isExpanded && (
                          <tr>
                            <td colSpan={10} style={{ padding: "0 0 8px 56px", background: "#fafafa" }}>
                              {autoRenewServices.length === 0 ? (
                                <p className="text-sm text-color-secondary m-2">No auto-renew services found.</p>
                              ) : (
                                <table className="custom-simple-table" style={{ margin: "8px 0" }}>
                                  <thead>
                                    <tr>
                                      <th style={{ width: "40px" }}></th>
                                      <th>Service</th>
                                      <th>Unit Price</th>
                                      <th>Total Price</th>
                                      <th>Qty</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {autoRenewServices.map((svc) => (
                                      <tr key={svc._id}>
                                        <td>
                                          <input
                                            type="checkbox"
                                            checked={selectedServIds.includes(svc._id)}
                                            onChange={() => handleServiceToggle(row._id, svc._id)}
                                            style={{ cursor: "pointer" }}
                                          />
                                        </td>
                                        <td>{svc.name || "-"}</td>
                                        <td>{svc.basePrice != null ? `$${svc.basePrice.toFixed(2)}` : "-"}</td>
                                        <td>{svc.totalPrice != null ? `$${svc.totalPrice.toFixed(2)}` : "-"}</td>
                                        <td>{svc.allowUnlimited ? "Unlimited" : svc.quantity || 0}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Annual Fees in Range */}
        {annualFeesInRange.length > 0 && (
          <div>
            <h4 className="mt-0 mb-1 text-color-primary">Annual Fees in Range</h4>
            <p className="text-sm text-color-secondary mt-0 mb-2">
              These annual fees fall within the cancellation date range. Select the ones to include.
            </p>
            <div className="flex flex-column gap-2">
              {annualFeesInRange.map((fee) => (
                <div
                  key={fee._id}
                  className="flex align-items-center gap-3 p-3"
                  style={{ background: "#f3e5f5", borderRadius: "6px", border: "1px solid #ce93d8" }}
                >
                  <input
                    type="checkbox"
                    checked={includedAnnualFeeIds.includes(fee._id)}
                    onChange={() => toggleAnnualFee(fee._id)}
                    style={{ cursor: "pointer" }}
                  />
                  <span className="text-color-primary font-semibold flex-1">{fee.title || formatEnum(fee.type)}</span>
                  <span className="text-color-secondary text-sm">
                    Due: {fee.firstDueDate || fee.dueDate ? getDate(fee.firstDueDate || fee.dueDate) : "-"}
                  </span>
                  <span className="text-color-primary font-semibold">${(fee.amount || 0).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cancellation Fee */}
        {cancellationFee && (
          <div className="flex align-items-center gap-3 p-3" style={{ background: "#fff8e1", borderRadius: "6px", border: "1px solid #ffe082" }}>
            <input
              type="checkbox"
              checked={includeCancellationFee}
              onChange={(e) => setIncludeCancellationFee(e.target.checked)}
              style={{ cursor: "pointer" }}
            />
            <span className="text-color-primary font-semibold">
              Include Cancellation Fee:&nbsp;
              <strong>${(cancellationFee.amount || 0).toFixed(2)}</strong>
              {cancellationFee.title && (
                <span className="text-color-secondary font-normal ml-2">({cancellationFee.title})</span>
              )}
            </span>
          </div>
        )}

        {/* Charge Summary */}
        {(selectedScheduleIds.length > 0 || (includeCancellationFee && cancellationFee) || includedAnnualFeeIds.length > 0) && (
          <div
            className="flex flex-column gap-3 p-3"
            style={{ background: "#f0f7ff", borderRadius: "6px", border: "1px solid #90caf9" }}
          >
            <h4 className="mt-0 mb-0 text-color-primary">Charge Summary</h4>

            {/* Scheduled payments — charged on their due dates */}
            {(selectedScheduleIds.length > 0 || includedAnnualFeeIds.length > 0) && (
              <div className="flex flex-column gap-1">
                <span className="text-sm font-semibold text-color-secondary" style={{ textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Charged on Due Date
                </span>
                {selectedScheduleIds.map((schedId) => {
                  const sched = scheduledRows.find((s) => s._id === schedId);
                  const serviceIds = selectedServicesBySchedule[schedId] || [];
                  const schedTotal = autoRenewServices
                    .filter((s) => serviceIds.includes(s._id))
                    .reduce((sum, s) => sum + (s.totalPrice || 0), 0);
                  return (
                    <div key={schedId} className="flex justify-content-between text-sm">
                      <span className="text-color-secondary">
                        Payment #{sched?.paymentNumber} — Due {sched?.dueDate ? getDate(sched.dueDate) : "-"} ({serviceIds.length} service{serviceIds.length !== 1 ? "s" : ""})
                      </span>
                      <span className="text-color-primary font-semibold">${schedTotal.toFixed(2)}</span>
                    </div>
                  );
                })}
                {annualFeesInRange
                  .filter((f) => includedAnnualFeeIds.includes(f._id))
                  .map((f) => (
                    <div key={f._id} className="flex justify-content-between text-sm">
                      <span className="text-color-secondary">
                        {f.title || formatEnum(f.type)} — Due {f.firstDueDate || f.dueDate ? getDate(f.firstDueDate || f.dueDate) : "-"}
                      </span>
                      <span className="text-color-primary font-semibold">${(f.amount || 0).toFixed(2)}</span>
                    </div>
                  ))}
                <div className="flex justify-content-between text-sm pt-1" style={{ borderTop: "1px dashed #90caf9" }}>
                  <span className="text-color-secondary font-semibold">Subtotal</span>
                  <span className="text-color-primary font-semibold">${(selectedServicesTotal + annualFeesTotal).toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Cancellation fee — charged immediately */}
            {includeCancellationFee && cancellationFee && (
              <div className="flex flex-column gap-1">
                <span className="text-sm font-semibold text-color-secondary" style={{ textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Charged Immediately
                </span>
                <div className="flex justify-content-between text-sm">
                  <span className="text-color-secondary">Cancellation Fee</span>
                  <span className="text-color-primary font-semibold">${chargedImmediatelyTotal.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div
              className="flex justify-content-between pt-2"
              style={{ borderTop: "1px solid #90caf9" }}
            >
              <span className="text-color-primary font-semibold">Grand Total</span>
              <span className="text-color-primary font-semibold" style={{ fontSize: "16px" }}>
                ${grandTotal.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-content-end gap-2 mt-2">
          <PrimaryButtonSmall
            label="Cancel Agreement"
            loading={saving}
            onClick={handleCancel}
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

export default CancelMembershipDialog;
