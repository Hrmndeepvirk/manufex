import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Checkbox } from "primereact/checkbox";
import CustomDialog from "@shared/overlays/CustomDialog";
import PrimaryButton from "@buttons/PrimaryButton";
import useCreditCard from "../../../../hooks/useCreditCard";
import { addPaymentMethod } from "@store/member/paymentMethodAction";
import { getMemberAgreements } from "@store/member/memberActions";
import { setToast } from "@store/common/commonSlice";
import { formatEnum } from "@utils/common";

function AddPaymentMethod({
  visible,
  onHide,
  onSuccess,
  memberId,
  showAgreements = true,
  title = "Add Payment Method",
}) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedSubscriptions, setSelectedSubscriptions] = useState([]);
  const targetMemberId = memberId || id;

  const memberAgreements = useSelector(
    (state) => state.member.memberAgreements,
  );

  const { data, handleCreditChange, validations, CardInput, handleCreditCardSubmit } =
    useCreditCard();

  useEffect(() => {
    if (visible && showAgreements && targetMemberId) {
      dispatch(getMemberAgreements(targetMemberId));
      setSelectedSubscriptions([]);
    }
  }, [visible, showAgreements, targetMemberId, dispatch]);

  const activeAgreements = (memberAgreements || []).filter((a) =>
    ["ACTIVE", "SCHEDULED", "CREATED"].includes(a.status),
  );

  const toggleSubscription = (subId) => {
    setSelectedSubscriptions((prev) =>
      prev.includes(subId)
        ? prev.filter((s) => s !== subId)
        : [...prev, subId],
    );
  };

  const handleSubmit = async () => {
    try {
      const opaqueData = await handleCreditCardSubmit();
      if (!opaqueData) return;

      dispatch(
        addPaymentMethod(
          targetMemberId,
          {
            opaqueData,
            cardHolderName: data.cardHolderName,
            subscriptionIds: selectedSubscriptions,
          },
          setLoading,
          (success, error) => {
            if (success) {
              dispatch(
                setToast({
                  title: "Success",
                  description: "Payment method added successfully!",
                  type: "success",
                }),
              );
              onSuccess();
              onHide();
            } else {
              dispatch(
                setToast({
                  title: "Error",
                  description: error || "Failed to add payment method.",
                  type: "error",
                }),
              );
            }
          },
        ),
      );
    } catch (error) {
      dispatch(
        setToast({
          title: "Error",
          description: error || "Invalid card details.",
          type: "error",
        }),
      );
    }
  };

  return (
    <CustomDialog
      title={title}
      visible={visible}
      onHide={onHide}
      size="large"
    >
      <div className="c-grid">
        {CardInput({ handleCreditChange, data, validations })}

        {showAgreements && activeAgreements.length > 0 && (
          <div className="c-col-12 mt-3">
            <div className="font-semibold mb-2">
              Set as default payment method for agreements
            </div>
            <div className="flex flex-column gap-2">
              {activeAgreements.map((agreement) => (
                <div
                  key={agreement._id}
                  className="flex align-items-center gap-2 p-2 border-round"
                  style={{ backgroundColor: "var(--highlight-bg)" }}
                >
                  <Checkbox
                    checked={selectedSubscriptions.includes(agreement._id)}
                    onChange={() => toggleSubscription(agreement._id)}
                  />
                  <span className="font-medium">
                    {agreement.membershipPlan || "Agreement"}
                  </span>
                  <span className="text-color-secondary text-sm">
                    #{agreement.agreementNo}
                  </span>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "var(--color-success)" }}
                  >
                    {formatEnum(agreement.status)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="c-col-12 flex justify-content-end mt-3">
          <PrimaryButton
            label="Save"
            loading={loading}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </CustomDialog>
  );
}

export default React.memo(AddPaymentMethod);
