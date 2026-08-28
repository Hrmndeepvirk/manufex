import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomCard from "@shared/cards/CustomCard";
import CustomListItem from "@shared/cards/CustomListItem";
import CustomSimpleTable from "@shared/table/CustomSimpleTable";
import CustomPaginator from "@shared/pagination/CustomPaginator";
import { PrimaryButtonSmall } from "@shared/buttons/PrimaryButton";
import { formatEnum } from "@utils/common";
import { getDate } from "@utils/dateTime";
import { chargeSchedules } from "@store/member/memberActions";
import ScheduleInvoice from "./ScheduleInvoice";

const scheduleBadgeStyles = {
  SCHEDULED: { background: "#fff3cd", color: "#856404" },
  CHARGED: { background: "#e6f4ea", color: "#1e7e34" },
  PAYMENT_ERROR: { background: "#f8d7da", color: "#721c24" },
  HOLD: { background: "#cce5ff", color: "#004085" },
  CANCELLED: { background: "#e2e3e5", color: "#383d41" },
};

const AgreementViewDialog = ({ visible, data, onHide, onRefresh }) => {
  const dispatch = useDispatch();
  const [selectedIds, setSelectedIds] = useState([]);
  const [charging, setCharging] = useState(false);
  const [schedulePage, setSchedulePage] = useState(1);
  const PAGE_SIZE = 10;

  const schedules = useMemo(() => data?.schedules || [], [data?.schedules]);

  // Sorted by paymentNumber ascending
  const sortedSchedules = useMemo(
    () =>
      [...schedules].sort(
        (a, b) => (a.paymentNumber || 0) - (b.paymentNumber || 0),
      ),
    [schedules],
  );

  const scheduledRows = sortedSchedules.filter((s) => s.status === "SCHEDULED");
  const pagedSchedules = sortedSchedules.slice(
    (schedulePage - 1) * PAGE_SIZE,
    schedulePage * PAGE_SIZE,
  );

  useEffect(() => {
    setSchedulePage(1);
    setSelectedIds([]);
  }, [data]);

  const handleToggle = (row) => {
    const payNum = row.paymentNumber;
    const isSelected = selectedIds.includes(row._id);

    if (isSelected) {
      // Deselect this row and all scheduled rows after it
      const deselectedIds = new Set(
        scheduledRows
          .filter((s) => s.paymentNumber >= payNum)
          .map((s) => s._id),
      );
      setSelectedIds((prev) => prev.filter((id) => !deselectedIds.has(id)));
    } else {
      // Select all SCHEDULED rows from the first one up to and including this one
      const toSelect = scheduledRows
        .filter((s) => s.paymentNumber <= payNum)
        .map((s) => s._id);
      setSelectedIds(toSelect);
    }
  };

  const services = data?.services || [];
  const recurringTotal = services
    .filter((s) => s.autoRenew)
    .reduce((sum, s) => sum + (s.totalPrice || 0), 0);

  const approxAmount = recurringTotal * selectedIds.length;

  const handleCharge = () => {
    dispatch(
      chargeSchedules(selectedIds, setCharging, (success) => {
        if (success) {
          setSelectedIds([]);
          if (onRefresh && data?._id) onRefresh(data._id);
        }
      }),
    );
  };

  const serviceColumns = [
    { field: "name", header: "Service Name" },
    { field: "basePrice", header: "Price", isCurrency: true },
    { field: "totalPrice", header: "Total Price", isCurrency: true },
    {
      field: "quantity",
      header: "Quantity",
      body: (r) => (r?.allowUnlimited ? "Unlimited" : r?.quantity || 0),
    },
    {
      field: "autoRenew",
      header: "Auto Renew",
      body: (r) => (r?.autoRenew ? "Yes" : "No"),
    },
    { field: "firstDueDate", header: "First Due Date", isDate: true },
  ];

  const assessedFeeColumns = [
    { field: "title", header: "Title" },
    {
      field: "type",
      header: "Type",
      body: (r) => formatEnum(r?.type),
    },
    { field: "amount", header: "Amount", isCurrency: true },
    {
      field: "isRecurring",
      header: "Recurring",
      body: (r) => (r?.isRecurring ? "Yes" : "No"),
    },
    { field: "firstDueDate", header: "First Due Date", isDate: true },
  ];

  const scheduleColumns = [
    {
      header: "",
      style: { width: "40px" },
      body: (r) => {
        if (r.status !== "SCHEDULED") return null;
        return (
          <input
            type="checkbox"
            checked={selectedIds.includes(r._id)}
            onChange={() => handleToggle(r)}
            style={{ cursor: "pointer" }}
          />
        );
      },
    },
    { field: "paymentNumber", header: "Payment #" },
    { field: "dueDate", header: "Due Date", isDateTime: true },
    { field: "periodStart", header: "Period Start", isDateTime: true },
    ...(data?.autoPay !== "ON_PRICING_OPTIONS_RUN_OUT"
      ? [{ field: "periodEnd", header: "Period End", isDateTime: true }]
      : []),
    { field: "baseAmount", header: "Base Amount", isCurrency: true },
    { field: "taxAmount", header: "Tax", isCurrency: true },
    { field: "totalAmount", header: "Total", isCurrency: true },
    {
      field: "status",
      header: "Status",
      body: (r) => {
        const style = scheduleBadgeStyles[r?.status] || {};
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
      header: "",
      style: { width: "40px" },
      body: (r) => {
        if (!r.chargedItems?.length) return null;
        return <ScheduleInvoice schedule={r} member={member} subscriptionName={data?.membershipPlan} />;
      },
    },
  ];

  const member = data?.member;

  return (
    <CustomDialog
      visible={visible}
      onHide={onHide}
      title="Agreement Details"
      size="large"
    >
      <div className="flex flex-column gap-2">
        <CustomCard title="Member Info">
          <CustomListItem
            label="Name"
            value={
              member
                ? `${member.firstName || ""} ${member.lastName || ""}`.trim()
                : "-"
            }
          />
          <CustomListItem label="Email" value={member?.email || "-"} />
          <CustomListItem label="Phone" value={member?.primaryPhone || "-"} />
          <CustomListItem label="Barcode" value={member?.barCode || "-"} />
        </CustomCard>

        <CustomCard title="Agreement Info">
          <CustomListItem
            label="Agreement No"
            value={data?.agreementNo || "-"}
          />
          <CustomListItem
            label="Status"
            value={data?.status ? formatEnum(data.status) : "-"}
          />
          <CustomListItem
            label="Active"
            value={data?.isActive ? "Yes" : "No"}
          />
          <CustomListItem
            label="Created At"
            value={data?.createdAt ? getDate(data.createdAt) : "-"}
          />
          <CustomListItem
            label="Freezing Term"
            value={
              data?.freezingTerm?.value
                ? `${data.freezingTerm.value} ${formatEnum(data.freezingTerm.unit)}`
                : "-"
            }
          />
          <CustomListItem
            label="Freezing Term Per"
            value={
              data?.freezingTermPer?.value
                ? `${data.freezingTermPer.value} ${formatEnum(data.freezingTermPer.unit)}`
                : "-"
            }
          />
          <CustomListItem
            label="Cancelling Term"
            value={
              data?.cancellingTerm?.value
                ? `${data.cancellingTerm.value} ${formatEnum(data.cancellingTerm.unit)}`
                : "-"
            }
          />
        </CustomCard>

        <CustomCard title="Services">
          <div className="c-col-12">
            <CustomSimpleTable
              data={data?.services || []}
              columns={serviceColumns}
            />
          </div>
        </CustomCard>

        <CustomCard title="Assessed Fees">
          <div className="c-col-12">
            <CustomSimpleTable
              data={data?.assessedFees || []}
              columns={assessedFeeColumns}
            />
          </div>
        </CustomCard>

        <CustomCard title="Payment Schedule">
          <div className="c-col-12">
            {selectedIds.length > 0 && (
              <div className="flex align-items-center justify-content-end gap-3 mb-2">
                <span className="text-color-primary font-semibold">
                  Approx. Total: <strong>${approxAmount.toFixed(2)}</strong>
                  {" "}({selectedIds.length} payment{selectedIds.length > 1 ? "s" : ""})
                </span>
                <PrimaryButtonSmall
                  label="Charge Selected"
                  loading={charging}
                  onClick={handleCharge}
                />
              </div>
            )}
            <CustomSimpleTable
              data={pagedSchedules}
              columns={scheduleColumns}
            />
            <CustomPaginator
              page={schedulePage}
              rows={PAGE_SIZE}
              totalRecords={sortedSchedules.length}
              onPageChange={(event) => setSchedulePage(event.page + 1)}
              className="mt-2"
            />
          </div>
        </CustomCard>
      </div>
    </CustomDialog>
  );
};

export default AgreementViewDialog;
