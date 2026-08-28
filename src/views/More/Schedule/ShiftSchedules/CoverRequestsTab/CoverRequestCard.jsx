import React from "react";
import PrimaryButton, {
  PrimaryButtonSmall,
} from "@shared/buttons/PrimaryButton";

const STATUS_COLOR = {
  PENDING: "var(--color-info)",
  ACCEPTED: "var(--color-success)",
  REJECTED: "var(--color-danger)",
  CANCELLED: "var(--text-color-secondary)",
  EXPIRED: "var(--text-color-secondary)",
};

const formatTime = (t) => {
  if (!t || typeof t !== "string") return "";
  const [hStr, mStr] = t.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr || "00";
  if (Number.isNaN(h)) return t;
  const suffix = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${h}:${m} ${suffix}`;
};

const formatDate = (d) => {
  if (!d) return "";
  try {
    const date = new Date(`${d}T00:00:00`);
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return d;
  }
};

function getInitials(emp) {
  if (!emp) return "NA";
  const first = (emp.firstName || "").trim();
  const last = (emp.lastName || "").trim();
  return `${first[0] || ""}${last[0] || ""}`.toUpperCase() || "NA";
}

function CoverRequestCard({
  request,
  currentUserId,
  onAccept,
  onCancel,
  onIgnore,
  busy,
}) {
  const status = request.status || "PENDING";
  const statusColor = STATUS_COLOR[status] || "var(--text-color-secondary)";

  const requester = request.requestedBy || {};
  const requesterName =
    `${requester.firstName || ""} ${requester.lastName || ""}`.trim() ||
    "Employee";

  const isMine = String(currentUserId) === String(requester._id);
  const isPending = status === "PENDING";

  return (
    <div
      className="c-col-12 md:c-col-6 lg:c-col-4"
      style={{ marginBottom: "0.75rem" }}
    >
      <div
        style={{
          background: "var(--surface-card, #fff)",
          border: "1px solid var(--border-color)",
          borderRadius: "8px",
          padding: "1rem",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <div className="flex align-items-center justify-content-between">
          <div className="flex align-items-center gap-2">
            <div
              className="border-circle bg-primary text-white flex align-items-center justify-content-center font-semibold"
              style={{ width: "36px", height: "36px", fontSize: "0.8rem" }}
            >
              {getInitials(requester)}
            </div>
            <div className="flex flex-column">
              <span className="font-semibold">{requesterName}</span>
              <span className="text-xs text-color-secondary">
                {request.department?.title || ""}
              </span>
            </div>
          </div>
          <span
            className="text-xs font-semibold"
            style={{
              color: statusColor,
              border: `1px solid ${statusColor}`,
              borderRadius: "999px",
              padding: "2px 8px",
              textTransform: "uppercase",
            }}
          >
            {status}
          </span>
        </div>

        <div className="flex flex-column gap-1 mt-1">
          <div className="text-sm">
            <i className="pi pi-calendar mr-2" />
            {formatDate(request.shiftDate)}
          </div>
          <div className="text-sm">
            <i className="pi pi-clock mr-2" />
            {formatTime(request.startTime)} – {formatTime(request.endTime)}
          </div>
          {request.shift?.title && (
            <div className="text-sm text-color-secondary">
              {request.shift.title}
            </div>
          )}
          {request.notes && (
            <div
              className="text-xs mt-1 p-2"
              style={{
                background: "var(--highlight-bg)",
                borderRadius: "6px",
              }}
            >
              <strong>Note:</strong> {request.notes}
            </div>
          )}
        </div>

        {isPending && (
          <div className="flex justify-content-end gap-2 mt-2">
            {isMine ? (
              <PrimaryButton
                label="Cancel Request"
                severity="danger"
                outlined
                loading={busy === "cancel"}
                onClick={() => onCancel?.(request)}
              />
            ) : (
              <>
                <PrimaryButtonSmall
                  label="Ignore"
                  severity="secondary"
                  outlined
                  onClick={() => onIgnore?.(request)}
                />
                <PrimaryButton
                  label="Accept Cover"
                  icon="pi pi-check"
                  loading={busy === "accept"}
                  onClick={() => onAccept?.(request)}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(CoverRequestCard);
