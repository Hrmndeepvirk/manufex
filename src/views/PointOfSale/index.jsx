import React, { useRef, useState, useEffect } from "react";
import { PosProvider, usePos } from "./PosContext";
import Sidebar from "./Sidebar";
import Cart from "./Cart";
import CatalogItems from "./CatalogItems";
import { Splitter, SplitterPanel } from "primereact/splitter";
import Checkout from "./Checkout/Checkout";
import { useSelector, useDispatch } from "react-redux";
import { useReactToPrint } from "react-to-print";
import VariationDialog from "./CatalogItems/VariationDialog";
import { PrintReceipt } from "./receipts/Receipt";
import { getSaleById } from "@store/pointOfSale/pointOfSaleActions";

function PointOfSaleContent() {
  const dispatch = useDispatch();
  const { showCheckout, closeCheckout, cartDetails, selectedMember, onPostSale, saleLoading } = usePos();
  const membersList = useSelector((state) => state.pos.membersList);
  const memberDetail = membersList?.find((m) => m._id === selectedMember) || null;
  const company = useSelector((state) => state.company.details);

  const printRef = useRef(null);
  const [receiptData, setReceiptData] = useState(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Receipt",
    pageStyle: `
      @page { size: auto; margin: 20mm; }
      @media print {
        body {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          margin: 0;
          padding: 20px;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        @page { margin-top: 0; margin-bottom: 0; }
      }
    `,
  });

  useEffect(() => {
    if (receiptData?._id) {
      handlePrint();
    }
    // eslint-disable-next-line
  }, [receiptData]);

  const handleCheckout = ({ paymentMethods, printReceipt, setLoading }) => {
    onPostSale(paymentMethods, setLoading, (saleData) => {
      if (printReceipt && saleData?._id) {
        dispatch(
          getSaleById(saleData._id, null, (fullSale) => {
            setReceiptData(fullSale);
          })
        );
      }
    });
  };

  return (
    <div className="px-2 pt-2 h-full">
      <VariationDialog />
      <Checkout
        visible={showCheckout}
        onCancel={closeCheckout}
        cartDetails={cartDetails}
        memberDetail={memberDetail}
        onCheckout={handleCheckout}
      />

      <Splitter style={{ height: "100%", border: "none" }} stateKey="pos-main">
        <SplitterPanel size={20} minSize={10}>
          <Sidebar />
        </SplitterPanel>

        <SplitterPanel size={75}>
          <Splitter style={{ height: "100%", border: "none" }} stateKey="pos">
            <SplitterPanel size={65} minSize={50}>
              <CatalogItems />
            </SplitterPanel>

            <SplitterPanel size={35} minSize={15}>
              <Cart />
            </SplitterPanel>
          </Splitter>
        </SplitterPanel>
      </Splitter>

      {/* Hidden receipt for printing */}
      <div style={{ display: "none" }}>
        <div ref={printRef}>
          <PrintReceipt data={receiptData || {}} loading={false} company={company} />
        </div>
      </div>
    </div>
  );
}

export default function PointOfSale() {
  return (
    <PosProvider>
      <PointOfSaleContent />
    </PosProvider>
  );
}
