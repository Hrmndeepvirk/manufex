import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getMemberServices, getRecurringPlanServices } from "@store/member/memberActions";
import { useCurrencyFormatter } from "../../../../hooks/useCurrencyFormatter";
import { formatEnum } from "@utils/common";
import { getDateTime } from "@utils/dateTime";
import CustomCard from "@shared/cards/CustomCard";
import CustomSimpleTable, { CustomSimpleSelectionTable } from "@shared/table/CustomSimpleTable";
import CustomDialog from "@shared/overlays/CustomDialog";
import { customConfirmDialog } from "@shared/overlays/CustomConfirmDialog";
import { onRevertMemberService, getMemberRedeemedServices, getMemberResourceUsage, getMemberPastDues } from "@store/member/memberServiceRedeemActions";
import { showToastAction } from "@store/common/commonActions";
import { PrimaryButtonSmall } from "@buttons/PrimaryButton";

const Services = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { formatCurrency } = useCurrencyFormatter();

  const [loading, setLoading] = useState(false);
  const [recurringData, setRecurringData] = useState([]);
  const [recurringLoading, setRecurringLoading] = useState(false);
  const [usageDialogVisible, setUsageDialogVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const memberServices = useSelector((state) => state.member.memberServices);
  const memberServiceRedeems = useSelector(
    (state) => state.member.memberServiceRedeems,
  );
  const memberResourceUsage = useSelector(
    (state) => state.member.memberResourceUsage,
  );
  const memberPastDues = useSelector((state) => state.member.memberPastDues);

  const [activeTab, setActiveTab] = useState("history");
  const [pastDueLoading, setPastDueLoading] = useState(false);
  const [selectedPastDueItems, setSelectedPastDueItems] = useState([]);

  useEffect(() => {
    setSelectedPastDueItems([]);
    dispatch(getMemberServices(id, setLoading, (success, res) => {}));
    dispatch(getMemberRedeemedServices(id, () => {}, () => {}));
    dispatch(getMemberResourceUsage(id));
    dispatch(getMemberPastDues(id, setPastDueLoading));
    dispatch(
      getRecurringPlanServices(id, setRecurringLoading, (data) =>
        setRecurringData(data),
      ),
    );
  }, [id]);

  const onBuyPastDueItems = (serviceId = null) => {
    const countMap = {};
    selectedPastDueItems
      .filter((item) => item.status === "PENDING" && item.service?._id)
      .forEach((item) => {
        const idStr = item.service._id.toString();
        countMap[idStr] = (countMap[idStr] || 0) + 1;
      });
    if (serviceId) {
      const idStr = serviceId.toString();
      if (!countMap[idStr]) countMap[idStr] = 1;
    }
    const _selected = Object.entries(countMap).map(([_id, quantity]) => ({ _id, quantity }));
    if (!_selected.length) return;
    navigate("/point-of-sale", {
      state: { catalogItems: _selected, member: id },
    });
  };

  let columns = [
    {
      field: "Service",
      sortable: true,
      body: (row) => (
        <span
          className="cursor-pointer"
          style={{ color: "var(--color-info)", fontWeight: 600 }}
          onClick={() => {
            setSelectedService(row);
            setUsageDialogVisible(true);
          }}
        >
          {row.service.title}
        </span>
      ),
    },
    { header: "Date", field: "createdAt", isDate: true },
    { field: "Receipt" },

    { field: "Price", body: (row) => `${formatCurrency(row?.price)}` },

    {
      header: (
        <div style={{ textAlign: "center", lineHeight: 1.5 }}>
          <div>Purchased Sessions</div>
          <div style={{ fontWeight: 400, fontSize: "0.85em" }}>Remaining Sessions</div>
        </div>
      ),
      body: (row) => (
        <div style={{ textAlign: "center", lineHeight: 1.6 }}>
          <div style={{ color: "var(--color-info)", fontWeight: 600 }}>
            {row?.allowUnlimited ? "ULT" : (row?.purchasedQuantity || 0)}
          </div>
          <div style={{ color: "var(--color-info)" }}>
            {row?.allowUnlimited ? "ULT" : (row?.remainingQuantity || 0)}
          </div>
        </div>
      ),
    },
    {
      header: (
        <div style={{ textAlign: "center", lineHeight: 1.5 }}>
          <div>Completed</div>
          <div style={{ fontWeight: 400, fontSize: "0.85em" }}>Past Pending</div>
        </div>
      ),
      body: (row) => {
        const completed =
          (row?.purchasedQuantity || 0) -
          (row?.remainingQuantity || 0) -
          (row?.pendingSessions || 0);
        return (
          <div style={{ textAlign: "center", lineHeight: 1.6 }}>
            <div>{completed > 0 ? completed : 0}</div>
            <div>0</div>
          </div>
        );
      },
    },
    {
      header: "Future Scheduled",
      body: (row) => (
        <div style={{ textAlign: "center" }}>{row?.pendingSessions || 0}</div>
      ),
    },
  ];

  let redeemColumns = [
    {
      field: "Service",
      body: (row) => row?.memberService?.itemCaption || row?.memberService?.title || "-",
    },
    {
      header: "Redeemed Through",
      field: "redeemType",
      body: (row) => `${formatEnum(row?.redeemType)}`,
    },
    { field: "createdAt", header: "Redeemed On", isDateTime: true },
    {
      field: "actions",
      header: "actions",
      body: (row) => {
        if (row.redeemType === "CALENDAR") {
          return "-";
        }
        return (
          <i
            className="pi pi-trash cursor-pointer"
            onClick={() => onRevertRedeem(row)}
          ></i>
        );
      },
    },
  ];

  let resourceUsageColumns = [
    {
      field: "resource",
      header: "Resource",
      body: (row) => row?.resource?.title || "-",
    },
    {
      field: "memberService",
      header: "Service Used",
      body: (row) => row?.memberService?.title || "-",
    },
    {
      field: "type",
      header: "Type",
      body: (row) => (row?.memberService?.allowUnlimited ? "Unlimited" : "Paid"),
    },
    {
      field: "reserveAt",
      header: "Reserved On",
      body: (row) => row?.resourceStatus?.reserveAt ? getDateTime(row.resourceStatus.reserveAt) : "-",
    },
    {
      field: "returnAt",
      header: "Returned On",
      body: (row) => row?.resourceStatus?.returnAt ? getDateTime(row.resourceStatus.returnAt) : "-",
    },
  ];

  let recurringColumns = [
    { field: "planName", header: "Plan Name" },
    { field: "service", header: "Service" },
    {
      field: "status",
      header: "Status",
      body: (row) => (
        <span
          style={{
            color: ["ACTIVE", "SCHEDULED"].includes(row?.status)
              ? "var(--color-success)"
              : "var(--text-color-primary)",
            fontWeight: 600,
          }}
        >
          {formatEnum(row?.status)}
        </span>
      ),
    },
    { field: "packageQuantity", header: "Package Quantity" },
    { field: "nextBillingDate", header: "Next Billing Date", isDate: true },
    {
      field: "unitPrice",
      header: "Price",
      body: (row) => formatCurrency(row?.unitPrice),
    },
    {
      field: "totalPrice",
      header: "Total",
      body: (row) => formatCurrency(row?.totalPrice),
    },
    {
      field: "actions",
      header: "View Agreement",
      body: (row) => (
        <span
          className="cursor-pointer"
          style={{ color: "var(--color-info)", fontWeight: 600 }}
          onClick={() => navigate(`/plans/agreement/${row?._id}`)}
        >
          View
        </span>
      ),
    },
  ];

  const pastDueColumns = [
    {
      field: "event",
      header: "Event",
      body: (row) => row?.type === "CALENDAR_EVENT" ? (row?.eventSetup?.title || "-") : "-",
    },
    {
      field: "resource",
      header: "Resource",
      body: (row) => row?.type === "RESOURCE_RESERVE" ? (row?.resource?.title || "-") : "-",
    },
    {
      field: "service",
      header: "Service Owed",
      body: (row) => row?.service?.title || "-",
    },
    {
      field: "type",
      header: "Type",
      body: (row) => formatEnum(row?.type),
    },
    {
      field: "status",
      header: "Resolution Status",
      body: (row) => (
        <span style={{ color: row?.status === "PENDING" ? "var(--color-danger)" : row?.status === "PAID" ? "var(--color-success)" : "var(--color-warning)", fontWeight: 600 }}>
          {formatEnum(row?.status)}
        </span>
      ),
    },
    { field: "createdAt", header: "Due On", isDateTime: true },
    {
      field: "buy",
      header: "",
      body: (row) =>
        row.status === "PENDING" && row.service?._id ? (
          <PrimaryButtonSmall
            label="Buy"
            onClick={() => onBuyPastDueItems(row.service._id.toString())}
          />
        ) : null,
    },
  ];

  const serviceTabs = [
    { id: "history", label: "Service History" },
    { id: "pastdue", label: "Past Due" },
  ];

  const getTabStyle = (tabId) => ({
    backgroundColor: activeTab === tabId ? "var(--primary-color)" : "var(--highlight-bg)",
    color: activeTab === tabId ? "#fff" : "var(--text-color-primary)",
  });

  const onRevertRedeem = (row) => {
    if (row?.redeemType === "CALENDAR") {
      dispatch(
        showToastAction({
          description:
            "Services Redeemed through Calendar events cannot be reverted.",
          type: "error",
        }),
      );
    } else {
      customConfirmDialog({
        message: "Are you sure you want revert this service?",
        accept: () => {
          dispatch(
            onRevertMemberService(
              row?._id,
              id,
              () => {},
              () => {},
            ),
          );
        },
        reject: () => {},
      });
    }
  };

  return (
    <div className="c-col-12">
      <div className="flex mb-3">
        {serviceTabs.map((tab, index) => (
          <div
            key={tab.id}
            className={`px-4 py-2 cursor-pointer font-semibold ${index === 0 ? "border-round-left" : ""} ${index === serviceTabs.length - 1 ? "border-round-right" : ""}`}
            style={getTabStyle(tab.id)}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {activeTab === "pastdue" && (
        <CustomCard title="Past Due">
          <div className="c-col-12">
            <CustomSimpleSelectionTable
              data={memberPastDues}
              columns={pastDueColumns}
              onSelectionChange={setSelectedPastDueItems}
              loading={pastDueLoading}
            />
          </div>
        </CustomCard>
      )}

      {activeTab === "history" && (
        <>
          <CustomCard title={"Purchased Services"} loading={loading}>
            <div className="c-col-12">
              <CustomSimpleTable
                data={memberServices?.filter((s) => s.remainingQuantity >= 0)}
                columns={columns}
                rowsPerPage={10}
              />
            </div>
          </CustomCard>
          <div className="my-2" />
          <CustomCard title={"Redeemed Services"}>
            <div className="c-col-12">
              <CustomSimpleTable
                onDeleteTitle={"Revert Back"}
                data={memberServiceRedeems}
                columns={redeemColumns}
                rowsPerPage={10}
              />
            </div>
          </CustomCard>
          <div className="my-2" />
          <CustomCard title={"Resource Usage"}>
            <div className="c-col-12">
              <CustomSimpleTable
                data={memberResourceUsage}
                columns={resourceUsageColumns}
                rowsPerPage={10}
              />
            </div>
          </CustomCard>
        </>
      )}

      {/* Usage dialog for purchased service history */}
      <CustomDialog
        title={`${selectedService?.service?.title || "Service"} — Usage Dates`}
        visible={usageDialogVisible}
        onHide={() => {
          setUsageDialogVisible(false);
          setSelectedService(null);
        }}
        size="medium"
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--surface-border)" }}>
              <th style={{ padding: "10px 16px", textAlign: "center", fontWeight: 700, color: "var(--text-color-primary)" }}>
                Date Used
              </th>
              <th style={{ padding: "10px 16px", textAlign: "center", fontWeight: 700, color: "var(--text-color-primary)" }}>
                Redeemed Through
              </th>
            </tr>
          </thead>
          <tbody>
            {memberServiceRedeems
              ?.filter((r) => r?.memberService?._id === selectedService?._id)
              .map((r, idx) => (
                <tr key={r._id || idx} style={{ borderBottom: "1px solid var(--surface-border)" }}>
                  <td style={{ padding: "10px 16px", textAlign: "center" }}>{getDateTime(r.createdAt)}</td>
                  <td style={{ padding: "10px 16px", textAlign: "center" }}>{formatEnum(r.redeemType)}</td>
                </tr>
              ))}
            {memberServiceRedeems?.filter((r) => r?.memberService?._id === selectedService?._id).length === 0 && (
              <tr>
                <td colSpan={2} style={{ padding: "20px 16px", textAlign: "center", color: "var(--text-color-secondary)" }}>
                  No usage records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CustomDialog>
    </div>
  );
};

export default Services;
