import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomDialog from "@shared/overlays/CustomDialog";
import PrimaryButton from "@shared/buttons/PrimaryButton";
import CustomInput from "@inputs/CustomInput";
import { createShiftCoverRequest } from "@store/settings/employeeSetup/shiftCoverRequestActions";

const formatTime = (t) => {
  // "08:00" -> "8:00 AM"
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
  // YYYY-MM-DD
  try {
    const date = new Date(`${d}T00:00:00`);
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return d;
  }
};

const today = () => new Date().toISOString().slice(0, 10);

function ShiftDetailsDialog({ visible, shift, onHide }) {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.user?.profile);

  const [notes, setNotes] = useState({ value: "", formErrors: {} });
  const [submitting, setSubmitting] = useState(false);

  const isMine = useMemo(() => {
    if (!profile?._id || !shift?.assignedEmployees) return false;
    return shift.assignedEmployees
      .map((e) => String(e?._id || e))
      .includes(String(profile._id));
  }, [profile, shift]);

  const isFutureOrToday = useMemo(() => {
    if (!shift?.date) return false;
    return shift.date >= today();
  }, [shift]);

  const canRequest = isMine && isFutureOrToday;

  const close = () => {
    setNotes({ value: "", formErrors: {} });
    onHide?.();
  };

  const onRequestCover = () => {
    if (!shift?._id) return;
    dispatch(
      createShiftCoverRequest(
        { shiftId: shift._id, notes: notes.value?.trim() || null },
        setSubmitting,
        (data) => {
          if (data) close();
        },
      ),
    );
  };

  if (!shift) return null;

  return (
    <CustomDialog title="Shift Details" visible={visible} onHide={close} size="medium">
      <div className="c-grid">
        <div className="c-col-12 mb-2">
          <h3 className="m-0" style={{ color: "var(--primary-color)" }}>
            {shift.title || "Shift"}
          </h3>
          {shift.departmentTitle && (
            <div className="text-color-secondary text-sm mt-1">
              {shift.departmentTitle}
            </div>
          )}
        </div>

        <DetailRow label="Date" value={formatDate(shift.date)} />
        <DetailRow
          label="Time"
          value={`${formatTime(shift.startTime)} – ${formatTime(shift.endTime)}`}
        />
        <DetailRow
          label="Required Staff"
          value={String(shift.staffRequired ?? "—")}
        />
        <DetailRow
          label="Assigned"
          value={`${(shift.assignedEmployees || []).length} / ${shift.staffRequired ?? "—"}`}
        />

        {canRequest && (
          <>
            <div className="c-col-12 mt-3">
              <CustomInput
                name="value"
                label="Notes (optional)"
                data={notes}
                onChange={({ name, value }) =>
                  setNotes((prev) => ({ ...prev, [name]: value }))
                }
                placeholder="Reason or anything teammates should know"
                col={12}
              />
            </div>
            <div className="c-col-12 flex justify-content-end mt-2">
              <PrimaryButton
                label="Request Shift Cover"
                icon="pi pi-user-plus"
                loading={submitting}
                onClick={onRequestCover}
              />
            </div>
          </>
        )}

        {!canRequest && isMine && !isFutureOrToday && (
          <div className="c-col-12 text-color-secondary text-sm mt-2">
            This shift has already passed.
          </div>
        )}
      </div>
    </CustomDialog>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="c-col-12 md:c-col-6 flex flex-column gap-1">
      <span className="text-xs text-color-secondary">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

export default React.memo(ShiftDetailsDialog);
