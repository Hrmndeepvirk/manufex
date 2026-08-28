import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Menu } from "primereact/menu";
import CustomCard from "@shared/cards/CustomCard";
import CustomListItem from "@shared/cards/CustomListItem";
import CustomSimpleTable from "@shared/table/CustomSimpleTable";
import {
  getMemberAgreements,
  getMemberAgreementView,
} from "@store/member/memberActions";
import { formatEnum } from "@utils/common";
import PrimaryButton from "@shared/buttons/PrimaryButton";
import CancelMembershipDialog from "./CancelMembershipDialog";
import FreezeMembershipDialog from "./FreezeMembershipDialog";
import UnfreezeMembershipDialog from "./UnfreezeMembershipDialog";
import RelationshipsDialog from "./RelationshipsDialog";
import AgreementViewDialog from "./AgreementViewDialog";
import SellAgreementDialog from "./SellAgreementDialog";

const statusBadgeStyles = {
  CREATED: { background: "#e2e3e5", color: "#383d41" },
  SCHEDULED: { background: "#fff3cd", color: "#856404" },
  ACTIVE: { background: "#e6f4ea", color: "#1e7e34" },
  PAYMENT_ERROR: { background: "#f8d7da", color: "#721c24" },
  HOLD: { background: "#fff3cd", color: "#856404" },
  FREEZE: { background: "#cce5ff", color: "#004085" },
  CANCELLED: { background: "#f8d7da", color: "#721c24" },
  EXPIRED: { background: "#e2e3e5", color: "#383d41" },
  COMPLETED: { background: "#d1ecf1", color: "#0c5460" },
};

const Agreement = ({ data: memberData }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [viewVisible, setViewVisible] = useState(false);
  const [relVisible, setRelVisible] = useState(false);
  const [cancelVisible, setCancelVisible] = useState(false);
  const [freezeVisible, setFreezeVisible] = useState(false);
  const [unfreezeVisible, setUnfreezeVisible] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [agreementDetailData, setAgreementDetailData] = useState(null);

  const [sellVisible, setSellVisible] = useState(false);

  const menuRef = useRef(null);
  const [menuItems, setMenuItems] = useState([]);

  const members = useSelector((state) => state.dropdown.members);

  const memberAgreements = useSelector(
    (state) => state.member.memberAgreements,
  );

  useEffect(() => {
    if (id) {
      dispatch(getMemberAgreements(id, setLoading));
    }
  }, [id]);

  const refreshAgreements = () => {
    if (id) dispatch(getMemberAgreements(id, setLoading));
  };

  const getMemberNames = (ids) => {
    if (!ids?.length) return "-";
    return (
      ids
        .map((mid) => {
          const m = members.find((item) => item._id === (mid?._id || mid));
          return m?.title || "";
        })
        .filter(Boolean)
        .join(", ") || "-"
    );
  };

  const getMemberName = (mid) => {
    if (!mid) return "-";
    const m = members.find((item) => item._id === (mid?._id || mid));
    return m?.title || "-";
  };

  const firstAgreement = memberAgreements?.[0];

  const getRenewalInfo = (timePeriod, interval, type, noOfAutopays, autoPay) => {
    if (autoPay === "ON_PRICING_OPTIONS_RUN_OUT") {
      return {
        frequency: "When pricing options run out",
        renewalType: "-",
        term: "-",
      };
    }
    const unit = interval ? formatEnum(interval) : "Month";
    const frequency = timePeriod ? `Every ${timePeriod} ${unit}` : "-";
    const renewalType = type ? formatEnum(type) : "-";
    const term =
      timePeriod === 1 ? "Until Cancel" : timePeriod * noOfAutopays || "-";
    return { frequency, renewalType, term };
  };

  const { frequency, renewalType, term } = getRenewalInfo(
    firstAgreement?.timePeriod,
    firstAgreement?.interval,
    firstAgreement?.howOftenWillClientsBeCharged,
    firstAgreement?.noOfAutopays,
    firstAgreement?.autoPay,
  );

  const fetchDetailAndOpen = (row, dialogType) => {
    setSelectedAgreement(row);
    dispatch(
      getMemberAgreementView(row._id, (data) => {
        setAgreementDetailData(data);
        if (dialogType === "cancel") setCancelVisible(true);
        else if (dialogType === "freeze") setFreezeVisible(true);
        else if (dialogType === "unfreeze") setUnfreezeVisible(true);
      }),
    );
  };

  const buildMenuItems = (row) => {
    const items = [];
    if (["ACTIVE", "SCHEDULED"].includes(row?.status)) {
      items.push({
        label: "Cancel",
        icon: "pi pi-times-circle",
        command: () => fetchDetailAndOpen(row, "cancel"),
      });
      items.push({
        label: "Freeze",
        icon: "pi pi-pause",
        command: () => fetchDetailAndOpen(row, "freeze"),
      });
    }
    if (row?.status === "FREEZE") {
      items.push({
        label: "Unfreeze",
        icon: "pi pi-play",
        command: () => fetchDetailAndOpen(row, "unfreeze"),
      });
    }
    return items;
  };

  const columns = [
    { field: "agreementNo", header: "Agreement #" },
    { field: "membershipPlan", header: "Agreement Name" },
    { field: "createdAt", header: "Created Date", isDate: true },
    {
      header: "Agreement Term",
      body: (r) => {
        const info = getRenewalInfo(
          r?.timePeriod,
          r?.interval,
          r?.howOftenWillClientsBeCharged,
          r?.noOfAutopays,
          r?.autoPay,
        );
        return info.term;
      },
    },
    {
      header: "Renewal Frequency",
      body: (r) => {
        const info = getRenewalInfo(
          r?.timePeriod,
          r?.interval,
          r?.howOftenWillClientsBeCharged,
          r?.noOfAutopays,
          r?.autoPay,
        );
        return info.frequency;
      },
    },
    { field: "salesPerson", header: "Salesperson" },
    {
      field: "status",
      header: "Status",
      body: (r) => {
        const style = statusBadgeStyles[r?.status] || {};
        return (
          <span
            style={{
              ...style,
              padding: "4px 10px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            {r?.status ? formatEnum(r.status) : "-"}
          </span>
        );
      },
    },
    {
      field: "actions",
      header: "Actions",
      body: (r) => {
        const hasMenuItems = ["ACTIVE", "SCHEDULED", "FREEZE"].includes(
          r?.status,
        );
        return (
          <div className="flex gap-2 justify-content-center align-items-center">
            <i
              className="pi pi-eye cursor-pointer"
              title="View Details"
              onClick={() => onView(r)}
            />
            <i
              className="pi pi-file cursor-pointer"
              title="View Agreement Document"
              onClick={() => navigate(`/plans/agreement/${r?._id}`)}
            />
            {hasMenuItems && (
              <i
                className="pi pi-ellipsis-v cursor-pointer"
                title="More Actions"
                onClick={(e) => {
                  setMenuItems(buildMenuItems(r));
                  menuRef.current.toggle(e);
                }}
              />
            )}
          </div>
        );
      },
    },
  ];

  const onView = (row) => {
    dispatch(
      getMemberAgreementView(row._id, (data) => {
        setViewData(data);
        setViewVisible(true);
      }),
    );
  };

  return (
    <div className="c-col-12">
      <Menu model={menuItems} popup ref={menuRef} popupAlignment="right" />
      <div className="c-grid">
        <CustomCard title="Misc" size={6}>
          <CustomListItem
            label="Campaign"
            value={firstAgreement?.campaign || "-"}
          />
          <CustomListItem
            label="Referred By"
            value={firstAgreement?.referredBy || "-"}
          />
        </CustomCard>
        <CustomCard title="Associations" size={6}>
          <CustomListItem label="Family" value="-" />
          <CustomListItem label="Corporate" value="-" />
        </CustomCard>
        <CustomCard title="Renewal" size={6}>
          <CustomListItem label="Frequency" value={frequency} />
          <CustomListItem label="Type" value={renewalType} />
          <CustomListItem label="Term" value={term} />
        </CustomCard>
        <CustomCard
          title="Relationships"
          size={6}
          actions
          onEdit={() => setRelVisible(true)}
        >
          <CustomListItem
            label="Pays For"
            value={getMemberNames(memberData?.paysFor)}
          />
          <CustomListItem
            label="Paid By"
            value={getMemberName(memberData?.paidBy)}
          />
          <CustomListItem
            label="Shares w/"
            value={getMemberNames(memberData?.sharesWith)}
          />
          <CustomListItem
            label="Referrals"
            value={getMemberNames(memberData?.referrals)}
          />
          <CustomListItem
            label="Referred By"
            value={getMemberName(memberData?.referredBy)}
          />
        </CustomCard>
      </div>
      <div className="mt-2">
        <CustomCard title="Agreements" loading={loading}>
          <div className="c-col-12 mb-3 flex justify-content-end">
            <PrimaryButton
              label="Sell Agreement"
              onClick={() => setSellVisible(true)}
            />
          </div>
          <div className="c-col-12">
            <CustomSimpleTable data={memberAgreements} columns={columns} />
          </div>
        </CustomCard>
      </div>
      <RelationshipsDialog
        visible={relVisible}
        onHide={() => setRelVisible(false)}
        memberData={memberData}
        memberId={id}
      />
      <AgreementViewDialog
        visible={viewVisible}
        data={viewData}
        onHide={() => {
          setViewVisible(false);
          setViewData(null);
        }}
        onRefresh={(agreementId) => {
          dispatch(
            getMemberAgreementView(agreementId, (freshData) => {
              setViewData(freshData);
            }),
          );
        }}
      />
      <CancelMembershipDialog
        visible={cancelVisible}
        onHide={() => {
          setCancelVisible(false);
          setSelectedAgreement(null);
          setAgreementDetailData(null);
        }}
        agreement={selectedAgreement}
        detailData={agreementDetailData}
        onSuccess={refreshAgreements}
      />
      <FreezeMembershipDialog
        visible={freezeVisible}
        onHide={() => {
          setFreezeVisible(false);
          setSelectedAgreement(null);
          setAgreementDetailData(null);
        }}
        agreement={selectedAgreement}
        detailData={agreementDetailData}
        memberData={memberData}
        onSuccess={refreshAgreements}
      />
      <UnfreezeMembershipDialog
        visible={unfreezeVisible}
        onHide={() => {
          setUnfreezeVisible(false);
          setSelectedAgreement(null);
          setAgreementDetailData(null);
        }}
        agreement={selectedAgreement}
        detailData={agreementDetailData}
        onSuccess={refreshAgreements}
      />
      <SellAgreementDialog
        visible={sellVisible}
        onHide={() => setSellVisible(false)}
        memberId={id}
        memberAgreements={memberAgreements}
        navigate={navigate}
      />
    </div>
  );
};

export default Agreement;
