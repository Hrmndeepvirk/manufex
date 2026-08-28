import React, { useState } from "react";
import CustomAnimatedCard from "../../../shared/animations/CustomAnimatedCard";
import { useCurrencyFormatter } from "../../../hooks/useCurrencyFormatter";
import { PrimaryButtonSmall } from "../../../shared/buttons/PrimaryButton";
import { customConfirmDialog } from "@shared/overlays/CustomConfirmDialog";
import { usePos } from "../PosContext";
import WaiveTaxDialog from "./WaiveTaxDialog";

function CartItem(props) {
  const { formatCurrency } = useCurrencyFormatter();
  const {
    onCartItemQtyChange,
    onDeleteCartItem,
    onWaiveTax,
    onOverrideDiscount,
    onAddSpecialDiscount,
    onRemoveSpecialDiscount,
    onRedeemItem,
    selectedMember,
  } = usePos();
  const { item, index } = props;
  const { _id, itemCaption, title, dynamicPricing } = item;
  const { taxWaived, unitPrice, finalUnitPrice, finalTotal } = item;
  const {
    allowDiscount,
    defaultDiscount,
    availableDiscount,
    overrideDiscount,
    specialDiscount,
    promoDiscount,
    bogoDiscount,
    rewardCatalog,
    isRedeemedByPoints,
  } = item;

  const { minimumQuantity, maximumQuantity, quantity, allowUnlimited, requiredQuantity } = item;
  const [waiveTaxDialog, setWaiveTaxDialog] = useState(false);

  const onInc = () => {
    let _qty = quantity + 1;
    const hasRequiredQty = typeof requiredQuantity === "number";
    if (_qty <= maximumQuantity || allowUnlimited || hasRequiredQty) {
      onCartItemQtyChange(index, _qty);
    }
  };
  const onDec = () => {
    let _qty = quantity - 1;
    if (_qty >= minimumQuantity) {
      onCartItemQtyChange(index, _qty);
    }
  };

  const onDelete = (event) => {
    customConfirmDialog({
      message: "Are you sure you want to delete this item?",
      accept: () => onDeleteCartItem(index),
      reject: () => {},
    });
  };
  function discountTemplate(obj, icon, onRemove) {
    return (
      <>
        {allowDiscount && obj && (
          <div className="bg-green-100 text-green-900 border-round-sm px-1 mx-1 my-auto">
            {icon && <i className={`pi ${icon} text-sm mr-1`}></i>}
            {obj?.amountType === "PERCENTAGE" && `${obj?.amount}% OFF`}
            {obj?.amountType === "FIXED" && `$${obj?.amount} OFF`}
            {onRemove && (
              <i
                className="pi pi-times ml-2 cursor-pointer"
                onClick={onRemove}
              ></i>
            )}
          </div>
        )}
      </>
    );
  }

  const waiveTax = () => {
    setWaiveTaxDialog(true);
  };
  const applyTax = () => {
    customConfirmDialog({
      message: "Are you sure you want to apply tax for this item?",
      accept: () => onWaiveTax(index, false),
      reject: () => {},
    });
  };
  return (
    <CustomAnimatedCard index={index}>
      <div>
        {dynamicPricing && (
          <div className="text-green-700">
            <i className="pi pi-tags my-auto mr-1"></i>
            {dynamicPricing}
          </div>
        )}
        <div className="flex justify-content-between text-xl font-medium">
          <div>{title}</div>
          <div>{formatCurrency(finalTotal)}</div>
        </div>
        <div className="ellipsis-text w-9">{itemCaption}</div>

        <div className="flex justify-content-between">
          <div className="flex">
            {finalUnitPrice !== unitPrice && (
              <div className="mr-2 text-lg font-medium line-through text-dark-gray my-auto">
                {formatCurrency(unitPrice)}
              </div>
            )}
            <div className="mr-2 text-lg font-medium my-auto">
              {formatCurrency(finalUnitPrice)}
            </div>
            {isRedeemedByPoints ? (
              <div className="bg-purple-100 text-purple-900 border-round-sm px-1 mx-1 my-auto font-semibold">
                <i className="pi pi-star text-sm mr-1"></i>
                REDEEMED ({rewardCatalog?.points} pts)
              </div>
            ) : bogoDiscount ? (
              <div className="bg-green-100 text-green-900 border-round-sm px-1 mx-1 my-auto font-semibold">
                <i className="pi pi-tag text-sm mr-1"></i>
                {bogoDiscount.freeCount === quantity
                  ? "FREE"
                  : `BOGO: ${bogoDiscount.freeCount} of ${quantity} FREE`}
              </div>
            ) : (
              <>
                {discountTemplate(defaultDiscount, null)}
                {discountTemplate(specialDiscount, null, () => onRemoveSpecialDiscount(index))}
                {discountTemplate(promoDiscount, "pi-bookmark", null)}
              </>
            )}
          </div>

          <div className="flex gap-2 align-items-center text-xl">
            <i
              className="pi pi-minus-circle text-red-600"
              onClick={onDec}
              style={isRedeemedByPoints ? { opacity: 0.3, pointerEvents: "none" } : {}}
            />
            <div
              className="font-medium text-center"
              style={{ minWidth: "20px" }}
            >
              {quantity}
            </div>
            <i
              className="pi pi-plus-circle text-green-600"
              onClick={onInc}
              style={isRedeemedByPoints ? { opacity: 0.3, pointerEvents: "none" } : {}}
            />
          </div>
        </div>
        <div className="flex justify-content-between my-3 ">
          <div className="flex ellipsis-text gap-2">
            <PrimaryButtonSmall
              label={taxWaived ? `Tax Waived` : "% Waive Tax"}
              onClick={taxWaived ? applyTax : waiveTax}
              outlined={!taxWaived}
              disabled={isRedeemedByPoints}
            />
            {allowDiscount && (
              <PrimaryButtonSmall
                label={
                  defaultDiscount?.discountCode
                    ? `${defaultDiscount.discountCode} Applied`
                    : availableDiscount?.discountCode
                      ? `Apply ${availableDiscount.discountCode}`
                      : "Apply Discount"
                }
                onClick={() => onOverrideDiscount(index, defaultDiscount)}
                outlined={!defaultDiscount}
                severity={defaultDiscount ? "success" : undefined}
                disabled={(defaultDiscount && !overrideDiscount) || isRedeemedByPoints}
              />
            )}
            {allowDiscount && !isRedeemedByPoints && (
              <div
                className="py-1 px-2 bg-blue-100 border-round-md cursor-pointer flex align-items-center"
                onClick={() => onAddSpecialDiscount(index, specialDiscount)}
              >
                <i className="pi pi-gift text-xl text-blue-600"></i>
              </div>
            )}
            {rewardCatalog && selectedMember && (
              <PrimaryButtonSmall
                label={
                  isRedeemedByPoints
                    ? `Redeemed (${rewardCatalog.points} pts)`
                    : `Redeem (${rewardCatalog.points} pts)`
                }
                onClick={() => onRedeemItem(index)}
                outlined={!isRedeemedByPoints}
                severity={isRedeemedByPoints ? "success" : undefined}
              />
            )}
          </div>

          <div
            className="py-1 px-2 bg-red-100 border-round-md cursor-pointer"
            onClick={onDelete}
          >
            <i className="pi pi-trash text-xl text-red-600"></i>
          </div>
        </div>
        <hr />
      </div>
      <WaiveTaxDialog
        visible={waiveTaxDialog}
        onConfirm={(reasonCode) => {
          onWaiveTax(index, true, reasonCode);
          setWaiveTaxDialog(false);
        }}
        onCancel={() => setWaiveTaxDialog(false)}
      />
    </CustomAnimatedCard>
  );
}
export default React.memo(CartItem);
