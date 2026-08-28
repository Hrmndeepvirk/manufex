// Checkout.jsx
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomCheckbox from "@shared/inputs/CustomCheckbox";
import PrimaryButton from "@shared/buttons/PrimaryButton";
import IposCardItem from "@shared/cards/IposCardItem";
import { getPosIposCards } from "@store/pointOfSale/pointOfSaleActions";
import useCreditCard from "../../../hooks/useCreditCard";

export default function CheckoutPopup({
  visible,
  onCancel,
  cartDetails = {},
  onCheckout,
  memberDetail,
}) {
  const { tax = 0, gradTotal = 0, hasInvalidDiscount = false } = cartDetails;

  const finalTotal = Number(gradTotal.toFixed(2));

  const dispatch = useDispatch();
  const [methods, setMethods] = useState([]);
  const [printReceipt, setPrintReceipt] = useState(true);
  const [loading, setLoading] = useState(false);
  const [savedCards, setSavedCards] = useState([]);
  const [savedCardsLoading, setSavedCardsLoading] = useState(false);
  const [selectedSavedCard, setSelectedSavedCard] = useState(null);

  const {
    data: cardData,
    handleCreditChange,
    validations,
    CardInput,
    handleCreditCardSubmit,
  } = useCreditCard();

  const hasCardMethod = methods.some((m) => m.type === "CARD");

  useEffect(() => {
    if (hasCardMethod && memberDetail?._id) {
      setSelectedSavedCard(null);
      dispatch(
        getPosIposCards(memberDetail._id, setSavedCardsLoading, (cards) => {
          setSavedCards(cards);
          const defaultCard = cards.find((c) => c.isDefault) || cards[0];
          if (defaultCard) setSelectedSavedCard(defaultCard._id);
        }),
      );
    }
  }, [hasCardMethod, memberDetail?._id]);

  let paymentMethods = ["CASH", "CHEQUE", "CLUB", "COUPON", "CARD"];
  if (memberDetail?.prepayBalance) {
    paymentMethods.splice(2, 0, "PRE_PAY");
  }
  if (memberDetail?.rewardPoints) {
    paymentMethods.push("POINTS");
  }

  const maxPointsCurrency = memberDetail?.maxPointsCurrency || 0;

  const pointsMethod = methods.find((m) => m.type === "POINTS");
  const pointsExceeded =
    pointsMethod && pointsMethod.amount > maxPointsCurrency;

  const paidTotal = methods.reduce((s, m) => s + (Number(m.amount) || 0), 0);
  const isUnderpaid =
    methods.length > 0 && Number(paidTotal.toFixed(2)) < finalTotal;

  useEffect(() => {
    if (!visible) return;

    setLoading(false);
    setMethods([]);
    setSavedCards([]);
    setSelectedSavedCard(null);
  }, [visible, finalTotal]);

  const toggleLock = (type) => {
    setMethods((prev) =>
      prev.map((m) => (m.type === type ? { ...m, locked: !m.locked } : m)),
    );
  };

  const toggleMethod = (type) => {
    setMethods((prev) => {
      const exists = prev.find((m) => m.type === type);

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

      if (prev.length === 0) {
        return [{ type, amount: finalTotal, locked: false }];
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
          m.type === updatedType ? { ...m, amount: entered } : m,
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
    [finalTotal],
  );

  const onSubmit = async () => {
    if (pointsExceeded) return;
    if (isUnderpaid) return;

    let finalMethods = [...methods];
    const cardMethod = finalMethods.find((m) => m.type === "CARD");
    if (cardMethod) {
      if (selectedSavedCard) {
        cardMethod.type = "CARD_FILE";
        cardMethod.iposCardTokenId = selectedSavedCard;
      } else {
        try {
          const opaqueData = await handleCreditCardSubmit();
          if (!opaqueData) return;
          cardMethod.opaqueData = opaqueData;
          cardMethod.cardHolderName = cardData.cardHolderName;
        } catch {
          return;
        }
      }
    }

    onCheckout?.({
      paymentMethods: finalMethods,
      printReceipt,
      setLoading,
    });
  };

  return (
    <CustomDialog
      title="Complete Sale"
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

        <div className="col">
          {methods.length > 0 && (
            <div className="border-round-md border-1 p-4">
              {methods.map((m) => (
                <div key={m.type} className="mb-3">
                  <div className="flex align-items-center justify-content-between">
                    <div className="flex align-items-center gap-2">
                      <strong>{m.type}</strong>
                      <i
                        className={`bi bi-lock-fill cursor-pointer ${
                          m.locked ? "text-danger" : "text-muted"
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
                    />
                  </div>
                  {m.type === "POINTS" && (
                    <div
                      className="text-xs mt-1"
                      style={{
                        color:
                          m.amount > maxPointsCurrency
                            ? "var(--color-danger)"
                            : "var(--text-secondary)",
                      }}
                    >
                      {m.amount > maxPointsCurrency
                        ? `Exceeds limit — max $${maxPointsCurrency.toFixed(2)} with your ${memberDetail?.rewardPoints || 0} points`
                        : `You can use up to $${maxPointsCurrency.toFixed(2)} (${memberDetail?.rewardPoints || 0} pts available)`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {hasCardMethod && (
        <div className="grid mt-2">
          <div className="col-2" />
          <div className="col-10">
            {savedCardsLoading ? (
              <div className="text-sm text-color-secondary py-2">
                Loading saved cards...
              </div>
            ) : (
              savedCards.length > 0 && (
                <div className="mb-3">
                  <div className="font-semibold mb-2">Saved Cards</div>
                  <div className="flex gap-3 flex-wrap">
                    {savedCards.map((card) => {
                      const isSelected = selectedSavedCard === card._id;
                      return (
                        <div
                          key={card._id}
                          style={{
                            minWidth: "200px",
                            flex: "1 1 45%",
                            maxWidth: "50%",
                          }}
                        >
                          <IposCardItem
                            item={card}
                            isSelected={isSelected}
                            onClick={() =>
                              setSelectedSavedCard(isSelected ? null : card._id)
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      <div className="grid mt-3 align-items-center">
        <div className="col-2">
          <CustomCheckbox
            label="Print Receipt"
            value={printReceipt}
            onChange={({ value }) => setPrintReceipt(value)}
          />
        </div>

        <div className="col-10">
          <div className="border-round-md border-1 p-4">
            <div className="flex justify-content-between">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-content-between font-semibold">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
            {isUnderpaid && (
              <div
                className="text-xs mt-2"
                style={{ color: "var(--color-danger)" }}
              >
                Amount paid (${paidTotal.toFixed(2)}) is less than total.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-content-end gap-2 mt-4">
        <PrimaryButton
          label="Cancel"
          outlined
          onClick={onCancel}
          disabled={loading}
        />
        <PrimaryButton
          label="Finish"
          onClick={onSubmit}
          loading={loading}
          disabled={
            finalTotal <= 0 ||
            pointsExceeded ||
            methods.length === 0 ||
            hasInvalidDiscount ||
            isUnderpaid
          }
        />
      </div>
    </CustomDialog>
  );
}
