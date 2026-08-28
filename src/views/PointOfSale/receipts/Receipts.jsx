
import  { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import PrimaryButton from "@shared/buttons/PrimaryButton";
import CustomTable from "@shared/table/CustomTable";
import { FilterBar } from "@filters";
import { Tag } from 'primereact/tag';

import {
  getSalesList,
  voidSale,
  returnSale,
} from "@store/pointOfSale/pointOfSaleActions";
import { formatEnum } from "@utils/common";
import { getDateTime } from "@utils/dateTime";

import AccessCodeDialog from "../AccessCodeDialog/AccessCodeDialog";
import ReturnConfirmDialog from "../ReturnDialog/ReturnConfirmDialog";

export default function Receipts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  
  // For VOID
  const [voidDialogVisible, setVoidDialogVisible] = useState(false);
  
  // For RETURN (single-step: access code only, payment mirrors original sale)
  const [accessCodeDialogVisible, setAccessCodeDialogVisible] = useState(false);
  
  const [selectedSale, setSelectedSale] = useState(null);
  const [receiptData, setReceiptData] = useState({});

  const salesList = useSelector((state) => state.pos.salesList);
  const printRef = useRef();
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    dispatch(getSalesList(setLoading));
  }, [dispatch]);

  // Flatten nested fields for filtering
  const flattenedSales = useMemo(() => {
    return (salesList || []).map((sale) => ({
      ...sale,
      employeeName: sale.employee
        ? `${sale.employee.firstName} ${sale.employee.lastName}`
        : "",
      customerName: sale.member
        ? `${sale.member.firstName} ${sale.member.lastName}`
        : "Walk-in",
      paymentType: sale.paymentTypes?.[0]?.type || "",
    }));
  }, [salesList]);

  const quickFilters = [
    { column: "customerName", header: "Customer", type: "text", col: 4 },
    { column: "employeeName", header: "Sale By", type: "text", col: 4 },
    { column: "createdAt", header: "Date", type: "date", col: 4 },
  ];

  const advancedFilters = [
    {
      column: "status",
      header: "Status",
      type: "dropdown",
      options: [
        { _id: "SALE", title: "Sale" },
        { _id: "VOID", title: "Void" },
        { _id: "RETURN", title: "Return" },
      ],
      col: 3,
    },
    {
      column: "paymentType",
      header: "Payment Type",
      type: "dropdown",
      options: [
        { _id: "CASH", title: "Cash" },
        { _id: "CHEQUE", title: "Cheque" },
        { _id: "PRE_PAY", title: "Pre Pay" },
        { _id: "CLUB", title: "Club" },
        { _id: "COUPON", title: "Coupon" },
        { _id: "POINTS", title: "Points" },
        { _id: "CARD_FILE", title: "Card File" },
      ],
      col: 3,
    },
  ];

  // Print receipt after return if requested
  useEffect(() => {
    if (receiptData?._id) {
      handlePrint();
    }
    // eslint-disable-next-line
  }, [receiptData]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const onReceipt = (id) => {
    navigate(`/point-of-sale/receipts/${id}`);
  };

  // Handle Void/Return button click
  const handleStatus = (sale) => {
    setSelectedSale(sale);

    // If register is OPEN → Void (single step)
    // If register is CLOSED → Return (two steps)
    if (sale?.registerStatus === 'OPEN') {
      setVoidDialogVisible(true);
    } else {
      setAccessCodeDialogVisible(true);
    }
  };

  // ========== VOID FLOW (Single Step) ==========
const onVoidSubmit = (accessCode) => {
  if (!selectedSale?._id) return;

  dispatch(
    voidSale(
      selectedSale._id, 
      { accessCode }, // ✅ Wrap in object
      setLoading, 
      () => {
        dispatch(getSalesList());
        setVoidDialogVisible(false);
        setSelectedSale(null);
      }
    )
  );
};
  // ========== RETURN FLOW (Single Step - mirrors original payment) ==========

  const onReturnSubmit = (accessCode, refundMethod) => {
    if (!selectedSale?._id) return;

    let paymentType;

    if (refundMethod && refundMethod !== "ORIGINAL") {
      // User selected a different refund method — refund total via that method
      const totalAmount =
        selectedSale.cartDetails?.gradTotal || selectedSale.amount || 0;
      paymentType = [{ type: refundMethod, amount: totalAmount }];
    } else {
      // Default: mirror original sale's payment types
      paymentType = (selectedSale.paymentTypes || []).map((pt) => {
        const entry = { type: pt.type, amount: pt.amount };
        if (pt.customerPaymentProfileId) {
          entry.customerPaymentProfileId = pt.customerPaymentProfileId;
        }
        if (pt.paymentTransactionId) {
          entry.paymentTransactionId = pt.paymentTransactionId;
        }
        return entry;
      });
    }

    const returnData = { accessCode, paymentType };

    dispatch(
      returnSale(selectedSale._id, returnData, setLoading, (responseData) => {
        dispatch(getSalesList());
        setReceiptData(responseData);
        setAccessCodeDialogVisible(false);
        setSelectedSale(null);
      })
    );
  };

  const onCancelReturn = () => {
    setAccessCodeDialogVisible(false);
    setSelectedSale(null);
  };

  const columns = [
    {
      field: "createdAt",
      header: "Time",
      body: (rowData) =>
        rowData.createdAt ? getDateTime(rowData.createdAt) : "-",
      sortable: true,
    },
    {
      field: "employee",
      header: "Sale By",
      body: (rowData) =>
        rowData.employee
          ? `${rowData.employee.firstName} ${rowData.employee.lastName}`
          : "-",
      sortable: true,
    },
    {
      field: "member",
      header: "Customer",
      body: (rowData) =>
        rowData.member
          ? `${rowData.member.firstName} ${rowData.member.lastName}`
          : "Walk-in",
      sortable: true,
    },
    {
      field: "paymentTypes",
      header: "Payment Type",
      body: (rowData) =>
        rowData.paymentTypes?.length > 0
          ? formatEnum(rowData.paymentTypes[0].type)
          : "-",
    },
    {
      field: "amount",
      header: "Amount",
      body: (rowData) =>
        typeof rowData.amount === "number"
          ? `$${rowData.amount.toFixed(2)}`
          : "-",
    },
    {
      field: "status",
      header: "Status",
      body: (rowData) => {
        if (rowData.status === 'SALE') {
          return (
            <PrimaryButton
              label={rowData.registerStatus === 'OPEN' ? 'Void' : 'Return'}
              onClick={() => handleStatus(rowData)}
              size="small"
            />
          );
        }

        return (
          <Tag
            severity={rowData.status === 'VOID' ? 'warning' : 'success'}
            value={rowData.status === 'VOID' ? 'Voided' : 'Returned'}
          />
        );
      },
    },
    {
      header: "Receipt",
      body: (rowData) => (
        <PrimaryButton
          type="button"
          label="Receipt"
          onClick={() => onReceipt(rowData._id)}
          outlined
          size="small"
        />
      ),
    },
  ];

  return (
    <>
      <div className="px-2">
        <FilterBar
          quickFilters={quickFilters}
          advancedFilters={advancedFilters}
          data={flattenedSales}
          onFilter={setFilteredData}
        />
        <CustomTable
          data={filteredData}
          columns={columns}
          loading={loading}
        />
      </div>

      {/* VOID Dialog (Single Step) */}
      <AccessCodeDialog
        visible={voidDialogVisible}
        onCancel={() => {
          setVoidDialogVisible(false);
          setSelectedSale(null);
        }}
        onSave={onVoidSubmit}
        loading={loading}
        title="Void Sale - Enter Access Code"
      />

      {/* RETURN Dialog - shows refund summary + access code */}
      <ReturnConfirmDialog
        visible={accessCodeDialogVisible}
        onCancel={onCancelReturn}
        onSave={onReturnSubmit}
        loading={loading}
        sale={selectedSale}
      />

      {/* Hidden print receipt */}
      <div className="hidden">
        <div ref={printRef}>
          <div>Receipt content for: {receiptData._id}</div>
        </div>
      </div>
    </>
  );
}