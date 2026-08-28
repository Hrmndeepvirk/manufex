import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import PrimaryButton from "@shared/buttons/PrimaryButton";
import { Tag } from 'primereact/tag';
import moment from "moment";

import ListPageLayout from "@shared/layout/ListPageLayout";
import { 
  getSalesList, 
  voidSale, 
  returnSale,
  getSaleById 
} from "@store/pointOfSale/pointOfSaleActions";

import VoidDialog from "./VoidDialog";
import CheckoutPopup from "./CheckoutPopup";

export default function Receipts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [voidDialogVisible, setVoidDialogVisible] = useState(false);
  const [checkoutPopupVisible, setCheckoutPopupVisible] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [receiptData, setReceiptData] = useState({});

  const salesList = useSelector((state) => state.pos.salesList);
  const printRef = useRef();

  useEffect(() => {
    dispatch(getSalesList(setLoading));
  }, [dispatch]);

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

    // If register is OPEN → Void
    // If register is CLOSED → Return
    if (sale?.registerStatus === 'OPEN') {
      setVoidDialogVisible(true);
    } else {
      setCheckoutPopupVisible(true);
    }
  };

  // Submit Void
  const onVoidSubmit = (accessCode) => {
    if (!selectedSale?._id) return;

    dispatch(
      voidSale(selectedSale._id, accessCode, setLoading, () => {
        dispatch(getSalesList());
        setVoidDialogVisible(false);
        setSelectedSale(null);
      })
    );
  };

  // Submit Return
  const onReturnCheckout = ({ paymentType, printReceipt }) => {
    setCheckoutPopupVisible(false);
    
    // We need access code for return too
    // You can either:
    // 1. Add another dialog for access code after payment selection
    // 2. Combine them into one dialog
    
    // For now, let's prompt for access code using native prompt (you can improve this)
    const accessCode = window.prompt('Enter Access Code:');
    
    if (!accessCode) {
      setSelectedSale(null);
      return;
    }

    const returnData = {
      accessCode,
      paymentType,
    };

    dispatch(
      returnSale(selectedSale._id, returnData, setLoading, (responseData) => {
        dispatch(getSalesList());
        
        if (printReceipt) {
          setReceiptData(responseData);
        }
        
        setSelectedSale(null);
      })
    );
  };

  const columns = [
    {
      field: "createdAt",
      header: "Time",
      body: (rowData) =>
        rowData.createdAt
          ? moment(rowData.createdAt).format("MM/DD/YYYY hh:mm A")
          : "-",
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
          ? rowData.paymentTypes[0].type
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

  const cartDetails = selectedSale 
    ? { 
        netTotal: selectedSale.amount, 
        total: selectedSale.amount, 
        tax: 0, 
        gradTotal: selectedSale.amount 
      }
    : { netTotal: 0, total: 0, tax: 0, gradTotal: 0 };

  return (
    <>
      <ListPageLayout
        title="Receipts"
        addPadding
        tableData={salesList || []}
        columns={columns}
        loading={loading}
      />

      <VoidDialog
        visible={voidDialogVisible}
        onCancel={() => {
          setVoidDialogVisible(false);
          setSelectedSale(null);
        }}
        onSave={onVoidSubmit}
        loading={loading}
      />

      <CheckoutPopup
        visible={checkoutPopupVisible}
        onCancel={() => {
          setCheckoutPopupVisible(false);
          setSelectedSale(null);
        }}
        onCheckout={onReturnCheckout}
        cartDetails={cartDetails}
        payType={selectedSale?.paymentTypes?.[0]?.type}
      />

      {/* Hidden print receipt */}
      <div className="hidden">
        <div ref={printRef}>
          {/* You can import your PrintReceipt component here */}
          <div>Receipt content for: {receiptData._id}</div>
        </div>
      </div>
    </>
  );
}