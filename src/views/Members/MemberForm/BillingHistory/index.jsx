import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import CustomSimpleTable from "../../../../shared/table/CustomSimpleTable";
import CustomCard from "../../../../shared/cards/CustomCard";
import CustomPaginator from "@shared/pagination/CustomPaginator";
import PrimaryButton from "@shared/buttons/PrimaryButton";
import {
  getBillingHistory,
  getPosHistory,
} from "../../../../store/member/memberActions";
import { formatEnum } from "@utils/common";
import { getDate } from "@utils/dateTime";

const statusColors = {
  SCHEDULED: "var(--color-warning)",
  CHARGED: "var(--color-success)",
  PAYMENT_ERROR: "var(--color-danger)",
  HOLD: "var(--color-info)",
  CANCELLED: "var(--color-danger)",
};

const posStatusColors = {
  SALE: "var(--color-success)",
  VOID: "var(--color-danger)",
  RETURN: "var(--color-warning)",
};

const printTableStyles = `
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; padding: 20px; }
    h2 { text-align: center; margin-bottom: 16px; color: #252b42; }
    table { width: 100%; border-collapse: collapse; border: 1px solid #d1d5db; border-radius: 8px; overflow: hidden; }
    thead { background: #252b42; }
    th { text-align: center; font-weight: 600; color: #fff; padding: 10px 8px; font-size: 13px; border-bottom: 1px solid #d1d5db; }
    tbody tr:nth-child(even) { background-color: #f9fafb; }
    td { text-align: center; padding: 8px 10px; font-size: 13px; color: #525252; border-bottom: 1px solid #e9ecef; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
`;

const tabs = [
  { id: "agreements", label: "Agreements" },
  { id: "posHistory", label: "POS History" },
];

const PAGE_SIZE = 10;

const BillingHistory = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("agreements");
  const [billingData, setBillingData] = useState([]);
  const [posData, setPosData] = useState([]);
  const [billingMeta, setBillingMeta] = useState(null);
  const [posMeta, setPosMeta] = useState(null);
  const [billingPage, setBillingPage] = useState(1);
  const [posPage, setPosPage] = useState(1);
  const [billingLoading, setBillingLoading] = useState(false);
  const [posLoading, setPosLoading] = useState(false);
  const printRef = useRef(null);

  useEffect(() => {
    setBillingPage(1);
    setPosPage(1);
  }, [id]);

  useEffect(() => {
    if (id) {
      dispatch(
        getBillingHistory(
          id,
          setBillingLoading,
          (data, meta) => {
            if (data) setBillingData(data);
            setBillingMeta(meta || null);
          },
          { page: billingPage, limit: PAGE_SIZE },
        ),
      );
    }
  }, [id, billingPage, dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(
        getPosHistory(
          id,
          setPosLoading,
          (data, meta) => {
            if (data) setPosData(data);
            setPosMeta(meta || null);
          },
          { page: posPage, limit: PAGE_SIZE },
        ),
      );
    }
  }, [id, posPage, dispatch]);

  const billingColumns = [
    {
      field: "dueDate",
      header: "Date",
      sortable: true,
      body: (row) => (row?.dueDate ? getDate(row.dueDate) : "-"),
    },
    { field: "agreementName", header: "Agreement Name" },
    {
      field: "paymentType",
      header: "Payment Type",
      body: (row) => row?.paymentType || "-",
    },
    {
      field: "transactionId",
      header: "Transaction Id",
      body: (row) => row?.transactionId || "-",
    },
    {
      field: "invoiceAmount",
      header: "Invoice Amount",
      isCurrency: true,
    },
    {
      field: "balance",
      header: "Balance",
      isCurrency: true,
    },
    {
      field: "status",
      header: "Status",
      sortable: true,
      body: (row) => (
        <span style={{ color: statusColors[row?.status] || "inherit" }}>
          {row?.status ? formatEnum(row.status) : "-"}
        </span>
      ),
    },
  ];

  const posColumns = [
    {
      field: "date",
      header: "Date",
      sortable: true,
      body: (row) => (row?.date ? getDate(row.date) : "-"),
    },
    {
      field: "items",
      header: "Items",
      body: (row) => {
        const items = row?.cartItems;
        if (!items || !Array.isArray(items)) return "-";
        return items.map((item) => item?.name || item?.title || "").filter(Boolean).join(", ") || "-";
      },
    },
    {
      field: "paymentTypes",
      header: "Payment Type",
      body: (row) => {
        const types = row?.paymentTypes;
        if (!types || !Array.isArray(types)) return "-";
        return types.map((p) => formatEnum(p?.type || "")).filter(Boolean).join(", ") || "-";
      },
    },
    {
      field: "amount",
      header: "Amount",
      isCurrency: true,
    },
    {
      field: "status",
      header: "Status",
      sortable: true,
      body: (row) => (
        <span style={{ color: posStatusColors[row?.status] || "inherit" }}>
          {row?.status ? formatEnum(row.status) : "-"}
        </span>
      ),
    },
  ];

  const handlePrint = () => {
    const tableEl = printRef.current?.querySelector(".custom-simple-table-wrapper");
    if (!tableEl) return;

    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) return;

    const titleMap = {
      agreements: "Agreements",
      posHistory: "POS History",
    };
    const title = titleMap[activeTab];

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title} - Print</title>
          ${printTableStyles}
        </head>
        <body>
          <h2>${title}</h2>
          ${tableEl.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  const getTabStyle = (tabId) => ({
    backgroundColor:
      activeTab === tabId ? "var(--primary-color)" : "var(--highlight-bg)",
    color:
      activeTab === tabId ? "#fff" : "var(--text-color-primary)",
  });

  return (
    <div className="c-col-12">
      <div className="flex mb-3">
        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            className={`px-4 py-2 cursor-pointer font-semibold ${index === 0 ? "border-round-left" : ""} ${index === tabs.length - 1 ? "border-round-right" : ""}`}
            style={getTabStyle(tab.id)}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {activeTab === "agreements" && (
        <CustomCard title="Agreements" loading={billingLoading}>
          <div ref={printRef} className="c-col-12 flex flex-column gap-3">
            <CustomSimpleTable data={billingData} columns={billingColumns} />
            <CustomPaginator
              page={billingPage}
              rows={PAGE_SIZE}
              totalRecords={billingMeta?.total || 0}
              onPageChange={(event) => setBillingPage(event.page + 1)}
            />
            <div className="flex justify-content-end gap-2">
              <PrimaryButton
                label="Email"
                icon="pi pi-envelope"
                onClick={() => {}}
              />
              <PrimaryButton
                label="Print"
                icon="pi pi-print"
                severity="secondary"
                onClick={handlePrint}
              />
            </div>
          </div>
        </CustomCard>
      )}

      {activeTab === "posHistory" && (
        <CustomCard title="POS History" loading={posLoading}>
          <div ref={printRef} className="c-col-12 flex flex-column gap-3">
            <CustomSimpleTable data={posData} columns={posColumns} />
            <CustomPaginator
              page={posPage}
              rows={PAGE_SIZE}
              totalRecords={posMeta?.total || 0}
              onPageChange={(event) => setPosPage(event.page + 1)}
            />
            <div className="flex justify-content-end gap-2">
              <PrimaryButton
                label="Email"
                icon="pi pi-envelope"
                onClick={() => {}}
              />
              <PrimaryButton
                label="Print"
                icon="pi pi-print"
                severity="secondary"
                onClick={handlePrint}
              />
            </div>
          </div>
        </CustomCard>
      )}
    </div>
  );
};

export default BillingHistory;
