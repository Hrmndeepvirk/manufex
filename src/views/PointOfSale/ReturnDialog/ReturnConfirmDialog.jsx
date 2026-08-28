import { useState } from "react";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomInput from "@shared/inputs/CustomInput";
import CustomDropdown from "@shared/inputs/CustomDropdown";
import PrimaryButton from "@shared/buttons/PrimaryButton";
import { Tag } from "primereact/tag";

const PAYMENT_LABELS = {
  CASH: "Cash",
  CARD_FILE: "Card on File",
  CHEQUE: "Cheque",
  CLUB: "Club",
  COUPON: "Coupon",
  PRE_PAY: "Prepay Balance",
};

const REFUND_METHOD_OPTIONS = [
  { title: "Original Payment Method", _id: "ORIGINAL" },
  { title: "Cash", _id: "CASH" },
  { title: "Cheque", _id: "CHEQUE" },
  { title: "Club", _id: "CLUB" },
  { title: "Coupon", _id: "COUPON" },
  { title: "Prepay Balance", _id: "PRE_PAY" },
];

export default function ReturnConfirmDialog({
  visible,
  onCancel,
  onSave,
  loading,
  sale,
}) {
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [refundMethod, setRefundMethod] = useState("ORIGINAL");

  const paymentTypes = sale?.paymentTypes || [];
  const cartItems = sale?.cartItems || [];
  const cartDetails = sale?.cartDetails || {};

  const redeemedItems = cartItems.filter((item) => item.isRedeemedByPoints);
  const totalPointsReturned = redeemedItems.reduce(
    (sum, item) => sum + (item.rewardPointsCost || 0),
    0
  );

  const handleSubmit = () => {
    if (!accessCode) {
      setError("Access code is required");
      return;
    }
    onSave(accessCode, refundMethod);
  };

  const handleClose = () => {
    setAccessCode("");
    setError("");
    setRefundMethod("ORIGINAL");
    onCancel();
  };

  return (
    <CustomDialog
      title="Return Sale"
      visible={visible}
      onHide={handleClose}
      size="medium"
    >
      {/* Refund Summary */}
      <div className="border-round-md border-1 border-300 p-3 mb-3">
        <div className="font-semibold mb-3">Refund Summary</div>

        {/* Payment refunds */}
        {paymentTypes.map((pt, idx) => (
          <div
            key={idx}
            className="flex align-items-center justify-content-between mb-2"
          >
            <div className="flex align-items-center gap-2">
              <i className="pi pi-replay text-green-500" />
              <span>{PAYMENT_LABELS[pt.type] || pt.type}</span>
            </div>
            <span className="font-semibold">${pt.amount.toFixed(2)}</span>
          </div>
        ))}

        {/* Points return */}
        {totalPointsReturned > 0 && (
          <div className="flex align-items-center justify-content-between mb-2">
            <div className="flex align-items-center gap-2">
              <i className="pi pi-star-fill text-yellow-500" />
              <span>Reward Points Returned</span>
            </div>
            <Tag severity="warning" value={`${totalPointsReturned} pts`} />
          </div>
        )}

        {/* Redeemed items detail */}
        {redeemedItems.length > 0 && (
          <div className="mt-2 pt-2 border-top-1 border-300">
            <div className="text-sm text-600 mb-2">
              Points will be credited back to member:
            </div>
            {redeemedItems.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-content-between text-sm mb-1"
              >
                <span className="text-600">{item.itemCaption}</span>
                <span className="text-yellow-600">
                  +{item.rewardPointsCost} pts
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Total */}
        <div className="flex justify-content-between font-semibold text-lg border-top-1 border-300 pt-2 mt-2">
          <span>Total Refund:</span>
          <span>${(cartDetails.gradTotal || sale?.amount || 0).toFixed(2)}</span>
        </div>
      </div>

      {/* Refund Payment Method */}
      <CustomDropdown
        label="Refund Via"
        name="refundMethod"
        value={refundMethod}
        onChange={({ value }) => setRefundMethod(value)}
        options={REFUND_METHOD_OPTIONS}
        col={12}
      />

      {/* Access Code */}
      <CustomInput
        label="Access Code"
        name="accessCode"
        value={accessCode}
        onChange={(e) => {
          setAccessCode(e.target.value);
          setError("");
        }}
        type="password"
        autoComplete="off"
        errorMessage={error}
        required
      />

      <div className="flex justify-content-end gap-2 mt-4">
        <PrimaryButton
          label="Cancel"
          outlined
          onClick={handleClose}
          disabled={loading}
        />
        <PrimaryButton
          label="Process Return"
          onClick={handleSubmit}
          loading={loading}
        />
      </div>
    </CustomDialog>
  );
}
