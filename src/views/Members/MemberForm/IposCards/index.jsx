import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { Skeleton } from "primereact/skeleton";
import { setToast } from "@store/common/commonSlice";
import CustomCard from "@shared/cards/CustomCard";
import CustomDialog from "@shared/overlays/CustomDialog";
import PrimaryButton from "@buttons/PrimaryButton";
import IposCardItem from "@shared/cards/IposCardItem";
import { getIposCardTokens, initiateIposCardAuth, setDefaultIposCard } from "@store/member/iposCardActions";

const STATUS_CONFIG = {
  success: {
    icon: "bi bi-check-circle-fill",
    color: "var(--color-success)",
    title: "Card Added Successfully",
    message: "Your card has been saved and is ready to use.",
  },
  failure: {
    icon: "bi bi-x-circle-fill",
    color: "var(--color-danger)",
    title: "Card Addition Failed",
    message: "We were unable to save your card. Please try again.",
  },
  cancel: {
    icon: "bi bi-dash-circle-fill",
    color: "var(--color-warning)",
    title: "Process Cancelled",
    message: "The card addition process was cancelled.",
  },
};

const IposCards = ({ initialStatus, onStatusClear }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [settingDefaultId, setSettingDefaultId] = useState(null);
  const [cardStatus, setCardStatus] = useState(initialStatus || null);

  useEffect(() => {
    fetchCards();
  }, [id]);

  useEffect(() => {
    if (initialStatus) {
      setCardStatus(initialStatus);
      if (initialStatus === "success") fetchCards();
    }
  }, [initialStatus]);

  const fetchCards = () => {
    if (id) {
      dispatch(getIposCardTokens(id, setLoading, (cards) => setData(cards || [])));
    }
  };

  const handleAddCard = () => {
    if (!id) return;
    const baseUrl = `${window.location.origin}${location.pathname}`;
    const payload = {
      returnUrl: `${baseUrl}?ipos_card=success`,
      failureUrl: `${baseUrl}?ipos_card=failure`,
      cancelUrl: `${baseUrl}?ipos_card=cancel`,
    };
    dispatch(
      initiateIposCardAuth(id, payload, setAddLoading, (success, resData, errorMessage) => {
        if (success && resData?.hostedPageUrl) {
          window.location.href = resData.hostedPageUrl;
        } else {
          dispatch(
            setToast({
              title: "Error",
              description: errorMessage || "Failed to initiate card authorization.",
              type: "error",
            }),
          );
        }
      }),
    );
  };

  const handleSetDefault = (tokenId) => {
    if (!id || settingDefaultId) return;
    dispatch(
      setDefaultIposCard(
        id,
        tokenId,
        (isLoading) => setSettingDefaultId(isLoading ? tokenId : null),
        (success) => {
          if (success) {
            fetchCards();
          } else {
            dispatch(
              setToast({
                title: "Error",
                description: "Failed to set default card.",
                type: "error",
              }),
            );
          }
        },
      ),
    );
  };

  const handleStatusClose = () => {
    setCardStatus(null);
    if (onStatusClear) onStatusClear();
  };

  const statusConfig = cardStatus ? STATUS_CONFIG[cardStatus] : null;

  return (
    <>
      <CustomCard
        title="IPOS Cards"
        actions
        onAdd={handleAddCard}
        addTitle="Add Card"
        loading={loading || addLoading}
      >
        {loading
          ? [1, 2].map((i) => (
              <div key={i} className="c-col-12 md:c-col-6 lg:c-col-4">
                <Skeleton width="100%" height="160px" borderRadius="12px" />
              </div>
            ))
          : data.map((item) => (
              <div key={item._id} className="c-col-12 md:c-col-4">
                <IposCardItem
                  item={item}
                  onClick={() => !item.isDefault && handleSetDefault(item._id)}
                  isSetting={settingDefaultId === item._id}
                />
              </div>
            ))}
        {!loading && data.length === 0 && (
          <div className="c-col-12 text-center py-5">
            <p className="text-color-secondary">No IPOS cards found.</p>
          </div>
        )}
      </CustomCard>

      {statusConfig && (
        <CustomDialog
          title={statusConfig.title}
          visible={!!cardStatus}
          onHide={handleStatusClose}
        >
          <div className="flex flex-column align-items-center gap-4 py-4 px-2">
            <i
              className={statusConfig.icon}
              style={{ fontSize: "3.5rem", color: statusConfig.color }}
            />
            <p
              className="text-center m-0"
              style={{
                fontSize: "0.95rem",
                color: "var(--text-color-primary)",
                lineHeight: 1.6,
              }}
            >
              {statusConfig.message}
            </p>
            <div className="flex gap-3">
              {cardStatus === "failure" && (
                <PrimaryButton
                  label="Try Again"
                  onClick={() => {
                    handleStatusClose();
                    handleAddCard();
                  }}
                />
              )}
              <PrimaryButton
                label={cardStatus === "success" ? "Done" : "Close"}
                onClick={handleStatusClose}
              />
            </div>
          </div>
        </CustomDialog>
      )}
    </>
  );
};

export default IposCards;
