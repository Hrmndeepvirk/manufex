import { useState } from "react";
import { useDispatch } from "react-redux";
import CustomCard from "../../../../shared/cards/CustomCard";
import CustomSimpleTable from "../../../../shared/table/CustomSimpleTable";
import CustomTable from "@shared/table/CustomTable";
import { formatEnum } from "@utils/common";
import PrimaryButton from "../../../../shared/buttons/PrimaryButton";
import { PrimaryButtonSmall } from "@shared/buttons/PrimaryButton";
import { redeemReward } from "../../../../store/member/redeemableActions";
import { adjustMemberReward } from "../../../../store/member/rewardActions";
import { showToastAction } from "../../../../store/common/commonActions";
import { Skeleton } from "primereact/skeleton";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomDropdown from "@inputs/CustomDropdown";
import CustomInput from "@inputs/CustomInput";
import CustomTextArea from "@inputs/CustomTextArea";
import { FilterBar } from "@filters";

const PointsBadge = ({ points }) => (
  <div
    className="flex align-items-center gap-2 border-round-lg px-3 py-2"
    style={{
      background: "linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)",
      border: "1px solid #FFD54F",
    }}
  >
    <i className="bi bi-star-fill" style={{ color: "#F9A825", fontSize: "1.1rem" }} />
    <span className="font-bold" style={{ color: "#F57F17", fontSize: "1.1rem" }}>
      {points} pts
    </span>
  </div>
);

const StatusBadge = ({ label, type }) => {
  const styles = {
    earned: { background: "#E8F5E9", color: "#2E7D32", border: "#A5D6A7" },
    redeemed: { background: "#F3E5F5", color: "#7B1FA2", border: "#CE93D8" },
    expired: { background: "#FBE9E7", color: "#BF360C", border: "#FFAB91" },
    reversed: { background: "#FFF3E0", color: "#E65100", border: "#FFCC80" },
    active: { background: "#E3F2FD", color: "#1565C0", border: "#90CAF9" },
  };
  const s = styles[type] || styles.active;
  return (
    <span
      className="px-2 py-1 border-round-md font-medium"
      style={{
        fontSize: "0.8rem",
        background: s.background,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}
    >
      {label}
    </span>
  );
};

function getStatusType(status) {
  if (!status) return "active";
  const s = status.toUpperCase();
  if (s === "ACTIVE" || s === "EARNED") return "earned";
  if (s === "REDEEMED") return "redeemed";
  if (s === "EXPIRED") return "expired";
  if (s === "REVERSED") return "reversed";
  return "active";
}

const adjustmentTypeOptions = [
  { _id: "Add Points", title: "Add Points" },
  { _id: "Subtract Points", title: "Subtract Points" },
];

const Rewards = ({
  data = [],
  rewardPoints = 0,
  loading = false,
  redeemables = [],
  redeemablesLoading = false,
  memberId,
  onRedeemSuccess,
}) => {
  const dispatch = useDispatch();
  const [redeemingId, setRedeemingId] = useState(null);
  const [adjustVisible, setAdjustVisible] = useState(false);
  const [filteredHistory, setFilteredHistory] = useState([]);

  const historyQuickFilters = [
    { column: "title", header: "Title", type: "text", col: 3 },
    {
      column: "earningType",
      header: "Type",
      type: "dropdown",
      options: [
        { _id: "EVENT", title: "Event" },
        { _id: "POS_PURCHASE", title: "Pos Purchase" },
        { _id: "MEMBERSHIP_SIGNUP", title: "Membership Signup" },
        { _id: "MEMBERSHIP_RENEW", title: "Membership Renew" },
        { _id: "REFERRAL", title: "Referral" },
        { _id: "BIRTHDAY", title: "Birthday" },
        { _id: "REDEMPTION", title: "Redemption" },
        { _id: "POS_POINTS_PAYMENT", title: "Pos Points Payment" },
        { _id: "MANUAL_ADJUSTMENT", title: "Manual Adjustment" },
      ],
      col: 3,
    },
    {
      column: "status",
      header: "Status",
      type: "dropdown",
      options: [
        { _id: "ACTIVE", title: "Active" },
        { _id: "EXPIRED", title: "Expired" },
        { _id: "REDEEMED", title: "Redeemed" },
        { _id: "REVERSED", title: "Reversed" },
      ],
      col: 3,
    },
    { column: "createdAt", header: "Created At", type: "date", col: 3 },
  ];
  const [adjustLoading, setAdjustLoading] = useState(false);
  const [adjustData, setAdjustData] = useState({
    adjustmentType: "Add Points",
    points: "",
    reason: "",
  });

  const handleAdjustChange = ({ name, value }) => {
    setAdjustData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdjustSave = () => {
    if (!adjustData.points || Number(adjustData.points) <= 0) {
      dispatch(
        showToastAction({
          description: "Please enter a valid points value.",
          type: "error",
        }),
      );
      return;
    }
    dispatch(
      adjustMemberReward(
        memberId,
        {
          adjustmentType: adjustData.adjustmentType,
          points: Number(adjustData.points),
          reason: adjustData.reason,
        },
        setAdjustLoading,
        (success, message) => {
          if (success) {
            dispatch(
              showToastAction({
                description: "Reward points adjusted successfully!",
                type: "success",
              }),
            );
            setAdjustVisible(false);
            setAdjustData({
              adjustmentType: "Add Points",
              points: "",
              reason: "",
            });
            if (onRedeemSuccess) onRedeemSuccess();
          } else {
            dispatch(
              showToastAction({
                description: message || "Failed to adjust reward points.",
                type: "error",
              }),
            );
          }
        },
      ),
    );
  };

  const handleRedeem = (row) => {
    setRedeemingId(row._id);
    dispatch(
      redeemReward(
        row._id,
        { memberId },
        null,
        (success, formErrors, message) => {
          setRedeemingId(null);
          if (success) {
            dispatch(
              showToastAction({
                description: message || "Reward redeemed successfully!",
                type: "success",
              })
            );
            if (onRedeemSuccess) onRedeemSuccess();
          } else {
            dispatch(
              showToastAction({
                description: message || "Failed to redeem reward.",
                type: "error",
              })
            );
          }
        }
      )
    );
  };

  const redeemableColumns = [
    { header: "Title", field: "title" },
    { header: "Description", field: "description" },
    {
      header: "Points Cost",
      field: "points",
      body: (row) => (
        <span className="flex align-items-center justify-content-center gap-1 font-semibold">
          <i className="bi bi-star-fill" style={{ color: "#F9A825", fontSize: "0.85rem" }} />
          {row.points}
        </span>
      ),
    },
    {
      header: "Status",
      field: "isRedeemed",
      body: (row) => {
        if (row.isRedeemed && row.canBeRedeemed === "ONE_TIME") {
          return <StatusBadge label="Redeemed" type="redeemed" />;
        }
        return <StatusBadge label="Available" type="earned" />;
      },
    },
    {
      header: "Action",
      field: "action",
      body: (row) => {
        const alreadyRedeemed = row.isRedeemed && row.canBeRedeemed === "ONE_TIME";
        const notEnoughPoints = rewardPoints < row.points;
        const isDisabled = alreadyRedeemed || notEnoughPoints;

        return (
          <PrimaryButton
            label={alreadyRedeemed ? "Redeemed" : "Redeem"}
            size="small"
            severity={alreadyRedeemed ? "secondary" : "primary"}
            disabled={isDisabled}
            loading={redeemingId === row._id}
            onClick={() => handleRedeem(row)}
          />
        );
      },
    },
  ];

  const historyColumns = [
    { header: "Title", field: "title" },
    {
      header: "Points",
      field: "points",
      body: (row) => (
        <span
          className="font-semibold"
          style={{ color: row.points > 0 ? "var(--color-success)" : "var(--color-danger)" }}
        >
          {row.points > 0 ? `+${row.points}` : row.points}
        </span>
      ),
    },
    {
      header: "Type",
      field: "earningType",
      body: (row) => formatEnum(row.earningType),
    },
    {
      header: "Event",
      field: "calendarEvent",
      body: (row) =>
        row.calendarEvent?.eventSetup?.title
          ? row.calendarEvent.eventSetup.title
          : "-",
    },
    {
      header: "Status",
      field: "status",
      body: (row) => (
        <StatusBadge label={formatEnum(row.status)} type={getStatusType(row.status)} />
      ),
    },
    { header: "Expires At", field: "expiresAt", isDate: true },
    { header: "Created At", field: "createdAt", isDate: true },
  ];

  return (
    <>
      {/* Points Balance Banner */}
      <CustomCard hideHeader>
        <div className="c-col-12">
          <div
            className="flex align-items-center justify-content-between p-3 border-round-lg"
            style={{
              background: "linear-gradient(135deg, #F5F5F5 0%, #FAFAFA 100%)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div className="flex align-items-center gap-3">
              <div
                className="flex align-items-center justify-content-center border-round-xl"
                style={{
                  width: "48px",
                  height: "48px",
                  background: "linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)",
                  border: "1px solid #FFD54F",
                }}
              >
                <i className="bi bi-star-fill" style={{ color: "#F9A825", fontSize: "1.5rem" }} />
              </div>
              <div>
                <div className="text-color-secondary" style={{ fontSize: "0.85rem" }}>
                  Available Points
                </div>
                <div className="font-bold" style={{ fontSize: "1.5rem", color: "var(--primary-color)" }}>
                  {loading ? <Skeleton width="60px" height="28px" /> : rewardPoints}
                </div>
              </div>
            </div>
            <div className="flex align-items-center gap-2">
              <PointsBadge points={rewardPoints} />
              <PrimaryButton
                label="✦ Adjust Rewards"
                onClick={() => setAdjustVisible(true)}
              />
            </div>
          </div>
        </div>
      </CustomCard>

      {/* Redeemable Rewards */}
      {/* <CustomCard title="Redeemable Rewards">
        <div className="c-col-12">
          {redeemablesLoading ? (
            <div className="flex flex-column gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} width="100%" height="45px" borderRadius="8px" />
              ))}
            </div>
          ) : redeemables.length === 0 ? (
            <div className="text-center py-4">
              <i
                className="bi bi-gift"
                style={{ fontSize: "2rem", color: "var(--text-color-secondary)" }}
              />
              <p className="text-color-secondary mt-2 mb-0">No redeemable rewards available.</p>
            </div>
          ) : (
            <CustomSimpleTable data={redeemables} columns={redeemableColumns} />
          )}
        </div>
      </CustomCard> */}

      {/* Rewards History */}
      <CustomCard title="Rewards History">
        <div className="c-col-12">
          <FilterBar
            quickFilters={historyQuickFilters}
            data={data}
            onFilter={setFilteredHistory}
          />
        </div>
        <div className="c-col-12">
          {loading ? (
            <div className="flex flex-column gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} width="100%" height="45px" borderRadius="8px" />
              ))}
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center py-4">
              <i
                className="bi bi-clock-history"
                style={{ fontSize: "2rem", color: "var(--text-color-secondary)" }}
              />
              <p className="text-color-secondary mt-2 mb-0">No reward history yet.</p>
            </div>
          ) : (
            <CustomTable data={filteredHistory} columns={historyColumns} />
          )}
        </div>
      </CustomCard> 

      {/* Adjust Rewards Dialog */}
      <CustomDialog
        title="Adjust Rewards"
        visible={adjustVisible}
        onHide={() => {
          setAdjustVisible(false);
          setAdjustData({
            adjustmentType: "Add Points",
            points: "",
            reason: "",
          });
        }}
      >
        <div className="c-grid">
          <CustomDropdown
            data={adjustData}
            onChange={handleAdjustChange}
            name="adjustmentType"
            label="Adjustment Type"
            options={adjustmentTypeOptions}
            col={12}
          />
          <CustomInput
            data={adjustData}
            onChange={handleAdjustChange}
            name="points"
            label="Points*"
            placeholder="Enter Points"
            type="number"
            col={12}
          />
          <CustomTextArea
            data={adjustData}
            onChange={handleAdjustChange}
            name="reason"
            label="Reason"
            placeholder="Enter Reason..."
            col={12}
          />
          <div className="c-col-12 flex justify-content-end gap-2 mt-2">
            <PrimaryButtonSmall
              label="Save"
              loading={adjustLoading}
              onClick={handleAdjustSave}
            />
            <PrimaryButtonSmall
              secondary
              label="Cancel"
              onClick={() => {
                setAdjustVisible(false);
                setAdjustData({
                  adjustmentType: "Add Points",
                  points: "",
                  reason: "",
                });
              }}
            />
          </div>
        </div>
      </CustomDialog>
    </>
  );
};

export default Rewards;
