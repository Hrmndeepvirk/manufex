import { useRef } from "react";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { getDate } from "@utils/dateTime";
import { useCurrencyFormatter } from "../../../../hooks/useCurrencyFormatter";

const ScheduleInvoice = ({ schedule, member, subscriptionName }) => {
  const printRef = useRef(null);
  const company = useSelector((state) => state.company.details);
  const { formatCurrency } = useCurrencyFormatter();

  const handleDownload = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Invoice-${schedule?.paymentNumber || ""}`,
    pageStyle: `
      @page {
        size: auto;
        margin: 20mm;
      }
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
        @page {
          margin-top: 0;
          margin-bottom: 0;
        }
      }
    `,
  });

  const chargedItems = schedule?.chargedItems || [];

  const address = company
    ? [
        company.addressLine1,
        company.addressLine2,
        `${company.city}, ${company.state} ${company.zipCode}`,
        company.country,
      ]
        .filter(Boolean)
        .map((line, idx) => <div key={idx}>{line}</div>)
    : null;

  const memberName = member
    ? `${member.firstName || ""} ${member.lastName || ""}`.trim()
    : "-";

  const subtotal = chargedItems.reduce(
    (sum, item) => sum + (item.basePrice || 0),
    0,
  );

  const taxTotal = chargedItems.reduce(
    (sum, item) => sum + (item.taxTotal || 0),
    0,
  );

  const grandTotal = chargedItems.reduce(
    (sum, item) => sum + (item.totalPrice || 0),
    0,
  );

  return (
    <>
      <i
        className="pi pi-download cursor-pointer"
        title="Download Invoice"
        onClick={handleDownload}
      />
      <div style={{ position: "fixed", left: "-9999px", top: 0 }}>
        <div ref={printRef}>
          <div
            className="surface-card border-1 border-300 p-4"
            style={{ width: "600px" }}
          >
            <div className="text-center font-bold text-2xl mb-2">
              {company?.name || company?.legalName || "—"}
            </div>

            <div className="text-center text-sm text-600 mb-3">
              {address}
              {company?.workNumber && <div>{company.workNumber}</div>}
            </div>

            <div className="border-top-1 border-300 my-3" />

            {subscriptionName && (
              <div className="text-center text-sm font-bold mb-3">
                {subscriptionName}
              </div>
            )}

            <div className="flex justify-content-between text-sm mb-2">
              <span>
                <strong>Payment #:</strong> {schedule?.paymentNumber}
              </span>
              <span>
                <strong>Member:</strong> {memberName}
              </span>
            </div>

            <div className="flex justify-content-between text-sm mb-2">
              <span>
                <strong>Due Date:</strong>{" "}
                {schedule?.dueDate ? getDate(schedule.dueDate) : "-"}
              </span>
              <span>
                <strong>Status:</strong> {schedule?.status || "-"}
              </span>
            </div>

            {member?.email && (
              <div className="text-sm mb-3">
                <strong>Email:</strong> {member.email}
              </div>
            )}

            <div className="border-top-1 border-300 my-3" />

            <div className="grid text-sm font-bold mb-2 border-bottom-1 border-300 pb-2">
              <div className="col-4">Item</div>
              <div className="col-2 text-right">Price</div>
              <div className="col-3 text-right">Tax</div>
              <div className="col-3 text-right">Total</div>
            </div>

            {chargedItems.map((item, index) => (
              <div key={index} className="grid text-sm mb-2">
                <div className="col-4">{item.name || "-"}</div>
                <div className="col-2 text-right">
                  {formatCurrency(item.basePrice || 0)}
                </div>
                <div className="col-3 text-right">
                  {formatCurrency(item.taxTotal || 0)}
                </div>
                <div className="col-3 text-right">
                  {formatCurrency(item.totalPrice || 0)}
                </div>
              </div>
            ))}

            <div className="border-top-1 border-300 my-3" />

            <div className="grid text-sm">
              <div className="col-9 text-right">Subtotal :</div>
              <div className="col-3 text-right">{formatCurrency(subtotal)}</div>
            </div>

            <div className="grid text-sm">
              <div className="col-9 text-right">Tax :</div>
              <div className="col-3 text-right">
                {formatCurrency(taxTotal)}
              </div>
            </div>

            <div className="grid text-sm font-bold">
              <div className="col-9 text-right">Total :</div>
              <div className="col-3 text-right">
                {formatCurrency(grandTotal)}
              </div>
            </div>

            <div className="border-top-1 border-300 my-3" />

            <div className="text-center text-sm font-bold my-3">
              THIS IS YOUR OFFICIAL INVOICE
            </div>

            <div className="text-center text-primary text-sm font-bold mt-3">
              Thank You!
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScheduleInvoice;
