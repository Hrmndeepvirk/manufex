import React, { useState, useEffect, useMemo } from "react";
import { Skeleton } from "primereact/skeleton";
import { toast } from "react-hot-toast";
import CustomCard from "../../shared/cards/CustomCard";
import CustomListItem from "../../shared/cards/CustomListItem";
import CustomTable from "../../shared/table/CustomTable";
import CheckinDetails from "../../shared/userCards/checkinDetails";
import SmallTab from "@shared/tabView/SmallTab";
import ReserveDialog from "./ReserveForm/ReserveDialog";
import QuickEnrollDialog from "./QuickEnroll/QuickEnrollDialog";
import PrimaryButton, {
  PrimaryButtonSmall,
} from "../../shared/buttons/PrimaryButton";
import CustomDropdown from "../../shared/inputs/CustomDropdown";
import { useCurrencyFormatter } from "../../hooks/useCurrencyFormatter";
import placehlolderImage from "@assets/images/placeholder1.png";
import { useDispatch, useSelector } from "react-redux";
import { getMembers } from "@store/member/memberActions";
import { useLocation, useNavigate } from "react-router-dom";
import {
  checkinsAction,
  getMemberBookedResources,
  getMemberEvents,
  getMemberProducts,
  getMemberServices,
  lastCheckinsAction,
} from "../../store/checkin/checkinActions";
import { postReturn } from "../../store/checkin/reserveActions";
import { setLastCheckin, setMemberServices } from "../../store/checkin/checkinSlice";
import { getCatalogItems } from "../../store/pointOfSale/pointOfSaleActions";
import RedeemServiceDialog from "./RedeemServiceDialog";
import { formatEnum } from "@utils/common";
import CustomAutoComplete from "../../shared/inputs/CustomAutoComplete";
import { getDate } from "../../utils/dateTime";
import { useSocket } from "../../sockets/SocketContext";

const CHECKIN_LAST_MEMBER_KEY = "iz:checkin:selectedMember";

function CheckIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const memberDetails = useSelector((state) => state.checkin.lastCheckin);

  const [showReserve, setShowReserve] = useState(false);
  const [reserveRefreshKey, setReserveRefreshKey] = useState(0);
  const [showQuickEnroll, setShowQuickEnroll] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resourceLoading, setResourceLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState(() => {
    try {
      return sessionStorage.getItem(CHECKIN_LAST_MEMBER_KEY) || null;
    } catch {
      return null;
    }
  });
  const [selectedPosItems, setSelectedPosItems] = useState([]);

  const [redeemDialog, setRedeemDialog] = useState(false);
  const [selectedRedeemService, setSelectedRedeemService] = useState({});

  // loading states
  const [memberEventsLoading, setMemberEventsLoading] = useState(false);
  const [memberResourcesLoading, setMemberResourcesLoading] = useState(false);
  const [memberServicesLoading, setMemberServicesLoading] = useState(false);
  const [memberProductsLoading, setMemberProductsLoading] = useState(false);

  // data states
  const memberEvents = useSelector((state) => state.checkin.memberEvents);
  const memberResources = useSelector((state) => state.checkin.memberResources);
  const memberServices = useSelector((state) => state.checkin.memberServices);
  const memberProducts = useSelector((state) => state.checkin.memberProducts);

  const memberSubscriptions = memberDetails?.member?.memberSubscriptions || [];

  const agreementDetails = useMemo(() => {
    return getAgreement(memberSubscriptions, memberDetails?.status);
  }, [memberSubscriptions, memberDetails?.status]);

  const uniqueMemberProducts = useMemo(() => {
    if (!Array.isArray(memberProducts)) return [];
    const seen = new Set();
    return memberProducts.filter((item) => {
      const key = item?._id;
      if (!key) return true;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [memberProducts]);

  useEffect(() => {
    // When a member is persisted from a prior session, the [selectedMember]
    // effect below will fetch their check-in. Skip the generic last-checkin
    // fetch in that case so the remembered member isn't overwritten.
    if (selectedMember) return;
    dispatch(
      checkinsAction({}, setLoading, () => {
        getCheckingsFunc();
      })
    );
  }, []);

  useEffect(() => {
    try {
      if (selectedMember) {
        sessionStorage.setItem(CHECKIN_LAST_MEMBER_KEY, selectedMember);
      } else {
        sessionStorage.removeItem(CHECKIN_LAST_MEMBER_KEY);
      }
    } catch {
      /* ignore storage errors (private mode, quota) */
    }
  }, [selectedMember]);

  function getCheckingsFunc() {
    if (selectedMember) {
      dispatch(checkinsAction({ member: selectedMember }, setLoading));
    } else {
      dispatch(lastCheckinsAction(setLoading));
    }
  }

  function refreshCheckin() {
    if (selectedMember) {
      dispatch(checkinsAction({ member: selectedMember }, setLoading));
    }
  }

  useEffect(() => {
    if (!socket) return;
    const handler = (data) => {
      if (data.memberId === selectedMember) {
        dispatch(checkinsAction({ member: selectedMember }, setLoading));
      }
    };
    socket.on("checkin:refresh", handler);
    return () => socket.off("checkin:refresh", handler);
  }, [socket, selectedMember]);

  useEffect(() => {
    if (selectedMember) {
      if (memberDetails?.member?._id === selectedMember) {
        return;
      }
      dispatch(checkinsAction({ member: selectedMember }, setLoading));
    }
  }, [selectedMember]);

  useEffect(() => {
    if (memberDetails?.member?._id) {
      setSelectedMember(memberDetails.member._id);
    }
  }, [memberDetails]);

  useEffect(() => {
    dispatch(getMembers(null, { showForbiddenPopup: false }));
  }, [dispatch]);

  useEffect(() => {
    if (memberDetails?.member?._id) {
      dispatch(
        getMemberEvents(
          memberDetails?.member?._id,
          setMemberEventsLoading,
          () => {},
        ),
      );
      dispatch(
        getMemberBookedResources(
          memberDetails?.member?._id,
          setMemberResourcesLoading,
          () => {},
        ),
      );
      dispatch(
        getMemberServices(
          memberDetails?.member?._id,
          setMemberServicesLoading,
          () => {},
        ),
      );
      dispatch(
        getMemberProducts(
          memberDetails?.member?._id,
          setMemberProductsLoading,
          () => {},
        ),
      );
    }
  }, [memberDetails?.member?._id]);

  const eventColumns = [
    {
      field: "event",
      header: "Title",
      body: (row) => (
        <span
          className="cursor-pointer"
          onClick={() => navigate(`/calendar/event/${row?.calendarEventId}`)}
        >
          {row?.event?.title}
        </span>
      ),
    },
    {
      field: "eventDate",
      header: "Date / Time",
      body: (row) =>
        `${row?.eventDate ? getDate(row?.eventDate) : ""} ${
          row?.startTime || ""
        }`,
    },
    {
      field: "location",
      header: "Location",
      body: (row) => `${row?.location?.title}`,
    },
  ];

  const resourceTabs = [
    { label: "Resources" },
    {
      label: "Calendar",
      onClick: () => {
        navigate("/calendar", { state: { member: selectedMember } });
      },
    },
    {
      label: "Reserve",
      onClick: () => setShowReserve(true),
    },
  ];
  const eventTabs = [
    { label: "Events" },
    {
      label: "Calendar",
      onClick: () => {
        navigate("/calendar", { state: { member: selectedMember } });
      },
    },
    {
      label: "Quick Enroll",
      onClick: () => setShowQuickEnroll(true),
    },
  ];
  const redeemTabs = [
    { label: "Redeemable" },
    {
      label: "POS",
      onClick: () => {
        navigate("/point-of-sale", { state: { member: selectedMember } });
      },
    },
  ];
  const resourceColumns = [
    {
      field: "resource",
      header: "Title",
      body: (row) => (
        <span style={row?.isPastDue ? { color: "var(--color-danger)", fontWeight: 600 } : {}}>
          {row?.resource?.title}
        </span>
      ),
    },
    { field: "reserveAt", header: "Reserved On", isDateTime: true },
    {
      field: "pastDue",
      header: "Past Due",
      body: (row) =>
        `${row?.resource?.pastDue?.value} ${formatEnum(row?.resource?.pastDue?.type)} `,
    },
    {
      field: "Action",
      body: (row) => {
        return (
          <>
            <PrimaryButtonSmall
              label={"Return"}
              onClick={() => onReturnResource(row)}
            />
          </>
        );
      },
    },
  ];

  const onRedeemService = () => {
    setRedeemDialog(true);
  };

  const redeemColumns = [
    {
      field: "title",
      header: "Title",
      body: (row) => (
        <div
          title="Click to Redeem"
          className="cursor-pointer"
          onClick={() => {
            setSelectedRedeemService(row);
            onRedeemService();
          }}
        >
          {row?.title}
        </div>
      ),
    },
    { field: "itemCaption", header: "Desc." },
    {
      field: "remainingQuantity",
      header: "Qty.",
      body: (row) => (row?.allowUnlimited ? "ULT" : row?.remainingQuantity),
    },
    {
      field: "expiryDate",
      header: "Expiry",
      body: (row) => (row?.expiryDate ? getDate(row.expiryDate) : "-"),
    },
  ];

  const redeemableServices = memberServices;

  const onBuyPosItems = (id) => {
    let _selected = selectedPosItems.map((item) => item._id);
    if (id && !_selected.includes(id)) {
      _selected.push(id);
    }
    navigate("/point-of-sale", {
      state: { catalogItems: _selected, member: selectedMember },
    });
  };


  const onHideRedeemDialog = (id, quantity) => {
    setSelectedRedeemService({});
    setRedeemDialog(false);

    if (id && quantity) {
      // Update memberServices (source for the redeemable table)
      const updatedMemberServices = memberServices
        .map((service) =>
          service._id === id
            ? {
                ...service,
                remainingQuantity: service.remainingQuantity - quantity,
              }
            : service,
        )
        .filter((service) => service.allowUnlimited || service.remainingQuantity > 0);
      dispatch(setMemberServices(updatedMemberServices));
    }
  };

  const onReturnResource = (row) => {
    const currentDate = new Date().toISOString().split("T")[0];
    const currentTime = new Date().toTimeString().split(" ")[0].slice(0, 5);
    const payload = {
      date: currentDate,
      time: currentTime,
    };

    dispatch(
      postReturn(payload, row._id, setResourceLoading, (responseData) => {
        if (responseData) {
          dispatch(getMemberBookedResources(memberDetails?.member?._id, setMemberResourcesLoading, () => {}));
          refreshCheckin();
        }
      }),
    );
  };
  const members = useSelector((state) => state.member.members);
  const memberOptions = useMemo(() => {
    return (members || [])
      .map((member) => ({
        _id: member?._id,
        barCode: member?.barCode,
        mobilePhone: member?.mobilePhone,
        primaryPhone: member?.primaryPhone,
        workPhone: member?.workPhone,
        email: member?.email,
        title:
          `${member?.firstName || ""} ${member?.lastName || ""}`.trim() ||
          "Unknown Member",
      }))
      .filter((member) => member._id && member.title);
  }, [members]);

  return (
    <>
      <RedeemServiceDialog
        visible={redeemDialog}
        onHide={onHideRedeemDialog}
        selectedService={selectedRedeemService}
      />
      <ReserveDialog
        visible={showReserve}
        onHide={() => setShowReserve(false)}
        member={selectedMember}
        refreshKey={reserveRefreshKey}
        onReserveUpdate={(action, resource, responseData, dateTime) => {
          let updatedBookedResources = [
            ...(memberDetails?.member?.bookedResources || []),
          ];
          if (action === "reserve") {
            updatedBookedResources.push({
              _id: responseData._id,
              resource: resource,
              reserveAt: dateTime,
            });

            const graceId = `grace-${responseData._id}`;
            toast.custom(
              (t) => (
                <GraceToast
                  t={t}
                  resourceTitle={resource.title}
                  locationTitle={resource.locations?.title}
                  onUndo={(onDone) => {
                    const d = new Date().toISOString().split("T")[0];
                    const tm = new Date().toTimeString().split(" ")[0].slice(0, 5);
                    dispatch(
                      postReturn({ date: d, time: tm }, responseData._id, () => {}, (returnData) => {
                        if (returnData) {
                          onDone();
                          setReserveRefreshKey((k) => k + 1);
                          dispatch(getMemberBookedResources(memberDetails?.member?._id, setMemberResourcesLoading, () => {}));
                          dispatch(getMemberServices(memberDetails?.member?._id, setMemberServicesLoading, () => {}));
                          refreshCheckin();
                        }
                      }),
                    );
                  }}
                />
              ),
              { id: graceId, duration: Infinity },
            );

            // Re-fetch member services so Redeemable table shows accurate quantity from DB
            dispatch(getMemberServices(responseData.member, setMemberServicesLoading, () => {}));
          } else if (action === "return") {
            updatedBookedResources = updatedBookedResources.filter(
              (r) => r._id !== resource.locations.reserveId,
            );
          }
          const updatedLastCheckin = {
            ...memberDetails,
            member: {
              ...memberDetails.member,
              bookedResources: updatedBookedResources,
            },
          };
          dispatch(setLastCheckin(updatedLastCheckin));
        }}
      />
      <QuickEnrollDialog
        member={selectedMember}
        visible={showQuickEnroll}
        onHide={() => {
          setShowQuickEnroll(false);
          // Refresh check-in status after enrollment
          refreshCheckin();
        }}
      />
      <div className="px-2 pt-2 h-full">
        <div className="c-grid">
          <CustomAutoComplete
            name="member"
            options={memberOptions}
            placeholder="Check-in: Search Name, Barcode or Phone #"
            searchFields={[
              "title",
              "barCode",
              "mobilePhone",
              "primaryPhone",
              "workPhone",
              "email",
            ]}
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.value)}
            dropdown
            hideLabel
            autoClear
            col={12}
          />
          <CheckinDetails
            status={memberDetails?.status}
            member={memberDetails?.member}
            loading={loading}
            agreementStatus={agreementDetails?.status}
            getCheckingsFunc={getCheckingsFunc}
            hasGymAccess={memberDetails?.hasGymAccess}
            hasServices={memberDetails?.hasServices}
            hasOverdueResources={memberDetails?.hasOverdueResources}
            overdueResources={memberDetails?.overdueResources}
            hasPendingServices={memberDetails?.hasPendingServices}
            pendingEventServices={memberDetails?.pendingEventServices}
            // MANVEER SIR DISCUSSION POINTS 
            membershipAccessStatus={memberDetails?.membershipAccessStatus}
            accessScheduleTitle={memberDetails?.accessScheduleTitle}
            membershipTypeTitle={memberDetails?.membershipTypeTitle}
            membershipAccessReason={memberDetails?.membershipAccessReason}
          />

          {loading ? (
            <>
              <div className="c-col-4">
                <Skeleton height="10rem" />
              </div>
              <div className="c-col-4">
                <Skeleton height="10rem" />
              </div>
              <div className="c-col-4">
                <Skeleton height="10rem" />
              </div>
              <div className="c-col-4">
                <Skeleton height="12rem" />
              </div>
              <div className="c-col-8">
                <Skeleton height="12rem" />
              </div>
            </>
          ) : (
            <>
              <div className="c-col-12 md:c-col-4">
                <SmallTab items={eventTabs} />
                <CustomTable
                  minWidth="auto"
                  columns={eventColumns}
                  rowsPerPage={5}
                  data={memberEvents}
                  loading={memberEventsLoading}
                />
              </div>
              <div className="c-col-12 md:c-col-4">
                <SmallTab items={redeemTabs} />
                <CustomTable
                  minWidth="auto"
                  columns={redeemColumns}
                  rowsPerPage={5}
                  loading={memberServicesLoading}
                  data={redeemableServices}
                />
              </div>
              <div className="c-col-12 md:c-col-4">
                <SmallTab items={resourceTabs} />
                <CustomTable
                  minWidth="auto"
                  columns={resourceColumns}
                  rowsPerPage={5}
                  loading={memberResourcesLoading}
                  data={memberResources}
                />
              </div>
              <CustomCard title="Agreements" size={4} height="100%">
                <CustomListItem
                  label="Agreement"
                  value={agreementDetails?.membershipPlan?.title}
                  data={agreementDetails}
                />
                <CustomListItem label="Due Date" value={agreementDetails?.nextDueDate ? getDate(agreementDetails.nextDueDate) : "-"} data={agreementDetails} />
              </CustomCard>
              <CustomCard title="POS" size={8} height="100%">
                {memberProductsLoading ? (
                  <PosLoadingSkeleton />
                ) : uniqueMemberProducts?.length > 0 ? (
                  uniqueMemberProducts.map((item, i) => (
                    <PosProductCard
                      key={`${item._id || "p"}-${i}`}
                      item={item}
                      isSelected={selectedPosItems.includes(item)}
                      onToggle={() => {
                        const updated = selectedPosItems.includes(item)
                          ? selectedPosItems.filter((r) => r !== item)
                          : [...selectedPosItems, item];
                        setSelectedPosItems(updated);
                      }}
                      onBuy={() => onBuyPosItems(item._id)}
                    />
                  ))
                ) : (
                  <div className="c-col-12 flex justify-content-center align-items-center p-4 text-color-secondary">
                    No products available
                  </div>
                )}
              </CustomCard>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default React.memo(CheckIn);

function PosProductCard({ item, isSelected, onToggle, onBuy }) {
  const { formatCurrency } = useCurrencyFormatter();
  return (
    <div className="c-col-6 md:c-col-4 lg:c-col-3">
      <div className="product-card" style={{ position: "relative" }}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          style={{
            position: "absolute",
            top: "8px",
            left: "8px",
            zIndex: 1,
            cursor: "pointer",
            width: "16px",
            height: "16px",
          }}
        />
        <img
          className="product-image"
          src={item?.images?.[0] || placehlolderImage}
          alt={item.title}
          style={{ aspectRatio: "4 / 3" }}
          onError={(e) => {
            e.target.src = placehlolderImage;
          }}
        />
        <div className="product-content" style={{ border: "none", background: "transparent", borderRadius: 0 }}>
          <div className="product-name ellipsis-text" style={{ fontWeight: 700 }}>
            <span title={item.title}>{item.title}</span>
          </div>
          <div className="product-price">{formatCurrency(item.price)}</div>
          <div className="flex justify-content-center mt-2">
            <PrimaryButtonSmall label="Buy" onClick={onBuy} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PosLoadingSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="c-col-6 md:c-col-4 lg:c-col-3">
          <div className="product-card">
            <Skeleton height="10rem" />
            <Skeleton className="mt-2" height="4rem" />
          </div>
        </div>
      ))}
    </>
  );
}

function GraceToast({ t, resourceTitle, locationTitle, onUndo }) {
  const [seconds, setSeconds] = useState(60);
  const [undoing, setUndoing] = useState(false);

  useEffect(() => {
    if (undoing) return;
    if (seconds <= 0) {
      toast.dismiss(t.id);
      toast.success(`${resourceTitle} booked`);
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, undoing]);

  const handleUndo = () => {
    setUndoing(true);
    onUndo(() => {
      toast.dismiss(t.id);
      toast.error("Resource not booked");
    });
  };

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "0.75rem",
      background: "#fff", padding: "10px 14px", borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)", minWidth: "280px",
      opacity: t.visible ? 1 : 0, transition: "opacity 0.3s",
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>
          {resourceTitle} booked{locationTitle ? ` at ${locationTitle}` : ""}
        </div>
      </div>
      <button
        disabled={undoing}
        onClick={handleUndo}
        style={{
          display: "flex", alignItems: "center", gap: "5px",
          background: "none", border: "1px solid #ef4444", color: "#ef4444",
          borderRadius: "4px", padding: "3px 10px", cursor: "pointer",
          fontSize: "0.8rem", whiteSpace: "nowrap", opacity: undoing ? 0.5 : 1,
        }}
      >
        <i className="" style={{ fontSize: "0.75rem" }} />
        {undoing ? "Undoing..." : `Undo (${seconds}s)`}
      </button>
    </div>
  );
}

function getAgreement(subscriptions = [], status) {
  if (!subscriptions.length) return {};

  if (status === "SUCCESS") {
    return subscriptions.find((s) => s.status === "ACTIVE") || {};
  }

  if (status === "WARNING") {
    return (
      subscriptions.find((s) => s.status === "HOLD" || s.status === "FREEZE") ||
      {}
    );
  }

  if (status === "DANGER") {
    return subscriptions[0] || {};
  }

  return {};
}

