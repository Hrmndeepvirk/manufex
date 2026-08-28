import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import CustomDialog from "@shared/overlays/CustomDialog";
import PaymentCard from "@shared/cards/PaymentCard";
import PrimaryButton from "@shared/buttons/PrimaryButton";
import { getPaymentMethods } from "@store/member/paymentMethodAction";
import { Skeleton } from "primereact/skeleton";

export default function CardFileDialog({ visible, onHide, memberId, onConfirm }) {
  const dispatch = useDispatch();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    if (visible && memberId) {
      setSelectedCard(null);
      dispatch(
        getPaymentMethods(memberId, setLoading, (methods) => setCards(methods))
      );
    }
  }, [visible, memberId, dispatch]);

  const handleConfirm = () => {
    if (selectedCard) {
      onConfirm(selectedCard);
    }
  };

  return (
    <CustomDialog title="Select Card" visible={visible} onHide={onHide} size="large">
      <div className="c-col-12">
        {loading ? (
          <div className="flex gap-3 flex-wrap">
            {[1, 2].map((i) => (
              <div key={i} style={{ flex: "1 1 45%", minWidth: "250px" }}>
                <Skeleton width="100%" height="240px" borderRadius="12px" />
              </div>
            ))}
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-color-secondary">No saved cards found.</p>
          </div>
        ) : (
          <div className="flex gap-3 flex-wrap justify-content-center">
            {cards.map((card) => (
              <div
                key={card.customerPaymentProfileId}
                style={{ flex: "1 1 45%", minWidth: "250px", maxWidth: "50%" }}
              >
                <div style={{ maxWidth: "100%" }} className="card-file-card-lg">
                  <PaymentCard
                    data={card}
                    name="selectedCard"
                    value={selectedCard}
                    onChange={(e) => setSelectedCard(e.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="c-col-12 flex justify-content-end mt-3">
        <PrimaryButton
          label="Pay with Card"
          onClick={handleConfirm}
          disabled={!selectedCard}
        />
      </div>
    </CustomDialog>
  );
}
