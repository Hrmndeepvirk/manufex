import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getBalanceHistory } from "../../../store/pointOfSale/pointOfSaleActions";
import { useCurrencyFormatter } from "../../../hooks/useCurrencyFormatter";
import moment from "moment";
import api from "@api";
import endPoints from "@endPoints";
import ServicesDueDialog from "./ServicesDueDialog";

export default function BalanceHistory({ memberId }) {
  const dispatch = useDispatch();
  const { formatCurrency } = useCurrencyFormatter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [pastDues, setPastDues] = useState([]);
  const [pastDueDialog, setPastDueDialog] = useState(false);

  useEffect(() => {
    if (memberId) {
      dispatch(getBalanceHistory(memberId, setLoading, (res) => setData(res)));
      api("get", endPoints.MEMBER.MEMBER_PAST_DUE + memberId).then((res) => {
        if (res?.success) setPastDues(res.data);
      });
    } else {
      setData(null);
      setPastDues([]);
    }
  }, [memberId]);

  const pendingPastDues = pastDues.filter((p) => p.status === "PENDING");

  if (!memberId) return null;

  const rows = [
    {
      label: "Past Due",
      value: data?.pastDue,
      render: (v) => formatCurrency(v || 0),
      color: (v) => (v > 0 ? "text-red-600" : ""),
    },
    {
      label: "Services Due",
      value: pendingPastDues.length,
      render: (v) =>
        v > 0 ? (
          <span
            className="cursor-pointer"
            style={{ color: "var(--color-info)", fontWeight: 600 }}
            onClick={() => setPastDueDialog(true)}
          >
            {v} {v === 1 ? "item" : "items"}
          </span>
        ) : (
          "0 items"
        ),
      color: () => "",
    },
    {
      label: "Prepay Balance",
      value: data?.prepayBalance,
      render: (v) => formatCurrency(v || 0),
    },
    {
      label: "Membership Type",
      value: data?.membershipType,
      render: (v) => v || "N/A",
    },
    {
      label: "Next Due Date",
      value: data?.nextDueDate,
      render: (v) => (v ? moment(v).format("MM/DD/YYYY") : "N/A"),
    },
    {
      label: "Next Due Amount",
      value: data?.nextDueAmount,
      render: (v) => formatCurrency(v || 0),
    },
  ];

  return (
    <>
      <div
        className="border-1 border-round p-2"
        style={{ borderColor: "var(--border-color)" }}
      >
        {loading ? (
          <div className="text-sm text-center text-color-secondary py-2">
            Loading...
          </div>
        ) : (
          <div className="flex flex-column gap-1">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex justify-content-between align-items-center text-sm"
              >
                <span className="text-color-secondary">{row.label}</span>
                <span
                  className={`font-semibold ${row.color ? row.color(row.value) : ""}`}
                >
                  {row.render(row.value)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <ServicesDueDialog
        visible={pastDueDialog}
        onHide={() => setPastDueDialog(false)}
        pendingPastDues={pendingPastDues}
        memberId={memberId}
      />
    </>
  );
}
