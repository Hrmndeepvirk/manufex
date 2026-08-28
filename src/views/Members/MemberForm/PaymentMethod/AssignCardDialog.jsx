import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Checkbox } from "primereact/checkbox";
import CustomDialog from "@shared/overlays/CustomDialog";
import PrimaryButton from "@buttons/PrimaryButton";
import PaymentCard from "@shared/cards/PaymentCard";
import { assignPaymentMethod, setDefaultPaymentMethod } from "@store/member/paymentMethodAction";
import { getMemberAgreements } from "@store/member/memberActions";
import { setToast } from "@store/common/commonSlice";
import { formatEnum } from "@utils/common";

function AssignCardDialog({ visible, onHide, card, onSuccess }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [defaultLoading, setDefaultLoading] = useState(false);
  const [selectedSubscriptions, setSelectedSubscriptions] = useState([]);

  const memberAgreements = useSelector(
    (state) => state.member.memberAgreements,
  );

  useEffect(() => {
    if (visible && id) {
      dispatch(getMemberAgreements(id));
      setSelectedSubscriptions([]);
    }
  }, [visible, id]);

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

  const handleSetDefault = () => {
    dispatch(
      setDefaultPaymentMethod(
        id,
        { customerPaymentProfileId: card?.customerPaymentProfileId },
        setDefaultLoading,
        (success, error) => {
          if (success) {
            dispatch(
              setToast({
                title: "Success",
                description: "Card on file updated successfully!",
                type: "success",
              }),
            );
            onSuccess();
            onHide();
          } else {
            dispatch(
              setToast({
                title: "Error",
                description: error || "Failed to set card on file.",
                type: "error",
              }),
            );
          }
        },
      ),
    );
  };

  const handleSubmit = () => {
    if (!selectedSubscriptions.length) {
      dispatch(
        setToast({
          title: "Warning",
          description: "Please select at least one agreement.",
          type: "warn",
        }),
      );
      return;
    }

    dispatch(
      assignPaymentMethod(
        id,
        {
          customerPaymentProfileId: card?.customerPaymentProfileId,
          subscriptionIds: selectedSubscriptions,
        },
        setLoading,
        (success, error) => {
          if (success) {
            dispatch(
              setToast({
                title: "Success",
                description: "Card assigned to agreements successfully!",
                type: "success",
              }),
            );
            onSuccess();
            onHide();
          } else {
            dispatch(
              setToast({
                title: "Error",
                description: error || "Failed to assign card.",
                type: "error",
              }),
            );
          }
        },
      ),
    );
  };

  return (
    <CustomDialog
      title="Assign Card to Agreements"
      visible={visible}
      onHide={onHide}
      size="medium"
    >
      <div className="c-grid">
        {card && (
          <div className="c-col-12 md:c-col-6">
            <PaymentCard data={card} />
          </div>
        )}

        <div className="c-col-12 md:c-col-6 flex align-items-center">
          <PrimaryButton
            label={card?.isDefault ? "Already Card on File" : "Make Card on File"}
            loading={defaultLoading}
            disabled={card?.isDefault}
            onClick={handleSetDefault}
          />
        </div>

        {activeAgreements.length > 0 ? (
          <div className="c-col-12 mt-3">
            <div className="font-semibold mb-2">
              Select agreements to assign this card
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
        ) : (
          <div className="c-col-12 mt-3 text-center">
            <p className="text-color-secondary">No active agreements found.</p>
          </div>
        )}

        <div className="c-col-12 flex justify-content-end mt-3">
          <PrimaryButton
            label="Assign"
            loading={loading}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </CustomDialog>
  );
}

export default React.memo(AssignCardDialog);
