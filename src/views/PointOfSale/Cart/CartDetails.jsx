import React, { useState } from "react";
import PrimaryButton from "../../../shared/buttons/PrimaryButton";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { usePos } from "../PosContext";
import { useCurrencyFormatter } from "../../../hooks/useCurrencyFormatter";
import { useDispatch, useSelector } from "react-redux";
import { validatePromoOrSalesCode } from "../../../store/pointOfSale/pointOfSaleActions";
import { showToastAction } from "../../../store/common/commonActions";

export default function CartDetails() {
  
  const { formatCurrency } = useCurrencyFormatter();
  const dispatch = useDispatch();
  const {
    cartDetails,
    openCheckout,
    openSaveCart,
    appliedPromo,
    setAppliedPromo,
    onApplyPromoDiscount,
    appliedSalesCode,
    onApplySalesCode,
    onRemoveSalesCode,
    selectedMember,
    additionalPrePay,
    setAdditionalPrePay,
  } = usePos();
  const membersList = useSelector((state) => state.pos.membersList);
  const companyCurrency =
    useSelector((state) => state.company.details?.currency) || {
      code: "USD",
      symbol: "$",
      locale: "en-US",
    };
  const memberDetail = membersList?.find((m) => m._id === selectedMember);

  let {
    tax,
    discount,
    specialDiscount,
    promoDiscount,
    salesCodeDiscount,
    bogoDiscount,
    waivedTaxAmount,
    redemptionSavings,
    gradTotal,
    unitTotal,
  } = cartDetails;

  const [promoCode, setPromoCode] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [showPrepayInput, setShowPrepayInput] = useState(false);

  const onApplyCode = () => {
    if (!promoCode.trim()) return;
    dispatch(
      validatePromoOrSalesCode(
        promoCode.trim(),
        setPromoLoading,
        (discountData) => {
          onApplyPromoDiscount(discountData);
          setPromoCode("");
        },
        (salesCodeData) => {
          onApplySalesCode(salesCodeData);
          setPromoCode("");
        }
      )
    );
  };

  const onRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
  };

  // gradTotal already includes additionalPrePay, so base total is gradTotal minus it
  const baseTotal = gradTotal - (additionalPrePay || 0);

  const handleAddPrepay = () => {
    if (!selectedMember) {
      dispatch(showToastAction({ description: "Please select a member to add prepay.", type: "warning" }));
      return;
    }
    const roundedUp = Math.ceil(baseTotal / 10) * 10;
    const prepayDiff = Math.round((roundedUp - baseTotal) * 100) / 100;
    setShowPrepayInput(true);
    if (prepayDiff > 0) {
      setAdditionalPrePay(prepayDiff);
    }
  };


  const handleRemovePrepay = () => {
    setAdditionalPrePay(null);
    setShowPrepayInput(false);
  };

  const handlePrepayChange = (value) => {
    if (value === null || value === undefined || value === "") {
      setAdditionalPrePay(null);
      return;
    }

    const parsedValue = Math.round(Number(value) * 100) / 100;
    setAdditionalPrePay(parsedValue >= 0 ? parsedValue : null);
  };

  return (
    <div>
      <div className="flex justify-content-between align-items-center">
        <div className="text-xl font-medium">Pricing Detail</div>
        <div className="flex align-items-center gap-2">
          {/* {memberDetail && (
            <span className="text-sm text-600">
              Balance: {formatCurrency(memberDetail?.prepayBalance || 0)}
            </span>
          )} */}
          {showPrepayInput || additionalPrePay > 0 ? (
            <div
              className="flex align-items-center"
              style={{ position: "relative" }}
            >
              <InputNumber
                value={additionalPrePay}
                onValueChange={(e) => handlePrepayChange(e.value)}
                mode="currency"
                currency={companyCurrency.code}
                locale={companyCurrency.locale}
                min={0}
                max={10000000000}
                minFractionDigits={2}
                maxFractionDigits={2}
                autoFocus
                className="prepay-inline-input"
                inputClassName="text-right"
                style={{ width: "110px" }}
                inputStyle={{
                  width: "110px",
                  padding: "2px 22px 2px 6px",
                  fontSize: "0.8rem",
                  height: "22px",
                }}
              />
              <i
                className="pi pi-times-circle text-red-400 cursor-pointer"
                onClick={handleRemovePrepay}
                title="Remove Prepay"
                style={{
                  position: "absolute",
                  right: "6px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "0.75rem",
                  zIndex: 1,
                }}
              />
            </div>
          ) : (
            <span
              className="text-sm font-semibold underline text-blue-500 cursor-pointer"
              onClick={handleAddPrepay}
            >
              Add Prepay
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-content-between">
        <div className="text-dark-gray">Unit Total:</div>
        <div className="font-medium ">{formatCurrency(unitTotal)}</div>
      </div>
      <div className="flex justify-content-between">
        <div className="text-dark-gray">Tax:</div>
        <div className="font-medium text-red-600">+{formatCurrency(tax)}</div>
      </div>
      {discount > 0 && (
        <div className="flex justify-content-between">
          <div className="text-dark-gray">Discounts:</div>
          <div className="font-medium text-green-600">
            -{formatCurrency(discount)}
          </div>
        </div>
      )}
      {specialDiscount > 0 && (
        <div className="flex justify-content-between">
          <div className="text-dark-gray">Special Discount:</div>
          <div className="font-medium text-green-600">
            -{formatCurrency(specialDiscount)}
          </div>
        </div>
      )}
      {bogoDiscount > 0 && (
        <div className="flex justify-content-between">
          <div className="text-dark-gray">BOGO Savings:</div>
          <div className="font-medium text-green-600">
            -{formatCurrency(bogoDiscount)}
          </div>
        </div>
      )}
      {promoDiscount > 0 && (
        <div className="flex justify-content-between">
          <div className="text-dark-gray">Promo Discount:</div>
          <div className="font-medium text-green-600">
            -{formatCurrency(promoDiscount)}
          </div>
        </div>
      )}
      {salesCodeDiscount > 0 && (
        <div className="flex justify-content-between">
          <div className="text-dark-gray">Sales Code Discount:</div>
          <div className="font-medium text-green-600">
            -{formatCurrency(salesCodeDiscount)}
          </div>
        </div>
      )}
      {redemptionSavings > 0 && (
        <div className="flex justify-content-between">
          <div className="text-dark-gray">Points Redeemed:</div>
          <div className="font-medium text-purple-600">
            -{formatCurrency(redemptionSavings)}
          </div>
        </div>
      )}
      {waivedTaxAmount > 0 && (
        <div className="flex justify-content-between">
          <div className="text-dark-gray">Waived Tax:</div>
          <div className="font-medium text-green-600">
            -{formatCurrency(waivedTaxAmount)}
          </div>
        </div>
      )}
      {additionalPrePay > 0 && (
        <div className="flex justify-content-between">
          <div className="text-dark-gray">Additional Prepay:</div>
          <div className="font-medium text-red-600">
            +{formatCurrency(additionalPrePay)}
          </div>
        </div>
      )}

      <div className="flex justify-content-between">
        <div className="text-dark-gray">Final Total:</div>
        <div className="font-medium ">{formatCurrency(gradTotal)}</div>
      </div>

      {appliedPromo ? (
        <div className="flex align-items-center justify-content-between mt-2 p-2 border-round surface-100">
          <span className="text-green-600 font-medium">
            Promo "{appliedPromo.discountCode}" Applied
          </span>
          <PrimaryButton
            label="Remove"
            severity="danger"
            text
            onClick={onRemovePromo}
          />
        </div>
      ) : appliedSalesCode ? (
        <div className="flex align-items-center justify-content-between mt-2 p-2 border-round surface-100">
          <span className="text-green-600 font-medium">
            Sales Code "{appliedSalesCode.salesCode}" Applied ({appliedSalesCode.employeeName})
          </span>
          <PrimaryButton
            label="Remove"
            severity="danger"
            text
            onClick={onRemoveSalesCode}
          />
        </div>
      ) : (
        <div className="flex gap-2 mt-2">
          <InputText
            className="w-full"
            placeholder="Enter Promo / Sales Code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onApplyCode()}
          />
          <PrimaryButton
            label="Apply"
            onClick={onApplyCode}
            loading={promoLoading}
            disabled={!promoCode.trim()}
          />
        </div>
      )}

      <div className="flex justify-content-center gap-2 mt-1">
        <PrimaryButton
          className="w-full"
          label="Checkout"
          onClick={openCheckout}
          disabled={cartDetails?.hasInvalidDiscount}
        />
        <PrimaryButton className="w-full" label="Save" outlined onClick={openSaveCart} />
      </div>

    </div>
  );

}
