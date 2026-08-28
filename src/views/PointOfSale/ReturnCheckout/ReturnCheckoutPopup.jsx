import React, { useCallback, useEffect, useState } from "react";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomCheckbox from "@shared/inputs/CustomCheckbox";
import PrimaryButton from "@shared/buttons/PrimaryButton";

export default function ReturnCheckoutPopup({
  visible,
  onCancel,
  cartDetails = {},
  onCheckout,
  memberDetail,
}) {
  const { tax = 0, gradTotal = 0 } = cartDetails;

  const finalTotal = Number(gradTotal.toFixed(2));

  const [methods, setMethods] = useState([]);
  const [printReceipt, setPrintReceipt] = useState(true);
  const [loading, setLoading] = useState(false);

  let paymentMethods = ["CASH", "CHEQUE", "CLUB", "COUPON"];
  if (memberDetail?.prepayBalance) {
    paymentMethods.splice(2, 0, "PRE_PAY");
  }

  useEffect(() => {
    if (!visible) return;

    setMethods([
      {
        type: "CASH",
        amount: finalTotal,
        locked: false,
      },
    ]);
  }, [visible, finalTotal]);

  const toggleLock = (type) => {
    setMethods((prev) =>
      prev.map((m) => (m.type === type ? { ...m, locked: !m.locked } : m))
    );
  };

  const toggleMethod = (type) => {
    setMethods((prev) => {
      const exists = prev.find((m) => m.type === type);

      if (exists && prev.length === 1) return prev;

      if (exists) {
        const remaining = prev.filter((m) => m.type !== type);
        if (remaining.length === 1) {
          return remaining.map((m) => ({
            ...m,
            amount: finalTotal,
          }));
        }
        return remaining;
      }

      return [...prev, { type, amount: 0, locked: false }];
    });
  };

  const adjustAmounts = useCallback(
    (updatedType, value) => {
      setMethods((prev) => {
        const locked = prev.filter((m) => m.locked);
        const unlocked = prev.filter((m) => !m.locked);

        const lockedSum = locked.reduce((s, m) => s + m.amount, 0);
        const available = finalTotal - lockedSum;
        if (available < 0) return prev;

        const entered = Math.min(Math.max(value, 0), available);

        const updated = unlocked.map((m) =>
          m.type === updatedType ? { ...m, amount: entered } : m
        );

        const remaining = available - entered;
        const others = updated.filter((m) => m.type !== updatedType);
        const othersTotal = others.reduce((s, m) => s + m.amount, 0);

        const redistributed = updated.map((m) => {
          if (m.type === updatedType) return m;
          if (!othersTotal) return { ...m, amount: 0 };

          return {
            ...m,
            amount: Number(((m.amount / othersTotal) * remaining).toFixed(2)),
          };
        });

        return [...locked, ...redistributed];
      });
    },
    [finalTotal]
  );

  const onSubmit = () => {
    onCheckout?.({
      paymentMethods: methods,
      printReceipt,
      setLoading,
    });
  };

  return (
    <CustomDialog
      title="Return Sale"
      visible={visible}
      onHide={onCancel}
      size="large"
    >
      <div className="grid">
        <div className="col-2 flex flex-column gap-2">
          {paymentMethods.map((type) => {
            const active = methods.some((m) => m.type === type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleMethod(type)}
                className={`
                  w-full
                  py-3
                  border-round-md
                  text-sm
                  font-medium
                  transition-all
                  cursor-pointer
                  ${
                    active
                      ? "bg-primary text-white border-none"
                      : "bg-transparent border-2 border-300 text-700 hover:bg-gray-100"
                  }
                `}
              >
                {type.replace("_", " ")}
              </button>
            );
          })}
        </div>

        <div className="col-10">
          <div className="border-round-md border-1 border-300 p-4 mb-3">
            <div className="font-semibold mb-3">Payment Method</div>
            {methods.map((m) => (
              <div
                key={m.type}
                className="flex align-items-center justify-content-between mb-3"
              >
                <div className="flex align-items-center gap-2">
                  <strong>{m.type}:</strong>
                  <i
                    className={`pi ${
                      m.locked ? "pi-lock" : "pi-lock-open"
                    } cursor-pointer ${
                      m.locked ? "text-red-500" : "text-400"
                    }`}
                    onClick={() => toggleLock(m.type)}
                  />
                </div>

                <input
                  type="number"
                  value={m.amount}
                  disabled={m.locked}
                  onChange={(e) =>
                    adjustAmounts(m.type, Number(e.target.value))
                  }
                  className="p-inputtext text-right"
                  style={{ width: 140 }}
                  step="0.01"
                />
              </div>
            ))}
          </div>

          <div className="border-round-md border-1 border-300 p-4">
            <div className="flex justify-content-between mb-2">
              <span>Net Total:</span>
              <span>${(finalTotal - tax).toFixed(2)}</span>
            </div>
            <div className="flex justify-content-between mb-2">
              <span>Tax:</span>
              <span className="text-red-500">+${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-content-between font-semibold text-lg border-top-1 border-300 pt-2">
              <span>Final Total:</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-3">
            <CustomCheckbox
              label="Print Receipt"
              value={printReceipt}
              onChange={({ value }) => setPrintReceipt(value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-content-end gap-2 mt-4">
        <PrimaryButton label="Cancel" outlined onClick={onCancel} />
        <PrimaryButton
          label="Finish"
          onClick={onSubmit}
          loading={loading}
        />
      </div>
    </CustomDialog>
  );
}