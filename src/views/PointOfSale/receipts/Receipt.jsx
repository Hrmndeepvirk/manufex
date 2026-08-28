import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import PrimaryButton from "../../../shared/buttons/PrimaryButton";
import { useSelector } from "react-redux";
import CustomCard from "../../../shared/cards/CustomCard";
import { getSaleById } from "@store/pointOfSale/pointOfSaleActions";
import { getDateTime } from "../../../utils/dateTime";
import { useCurrencyFormatter } from "../../../hooks/useCurrencyFormatter";

export default function Receipt() {
    const { id } = useParams();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});

    const printRef = useRef(null);
    const company = useSelector((state) => state.company.details);


    useEffect(() => {
        if (!id) return;

        dispatch(
            getSaleById(id, setLoading, (res) => {
                setData(res || {});
            })
        );
    }, [dispatch, id]);


    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: "Receipt",
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
      /* Hide browser's default header/footer */
      @page {
        margin-top: 0;
        margin-bottom: 0;
      }
    }
  `,
    });

    return (
        <CustomCard
            title="Sale Details"
            size={12}
            contentClassName="flex-column align-items-center"
            addPadding
        >
            <div className="c-col-12 flex flex-column align-items-center">
                <div ref={printRef}>
                    <PrintReceipt
                        data={data}
                        loading={loading}
                        company={company}
                    />
                </div>
                <div className="flex justify-content-end mt-3" style={{ width: "600px", maxWidth: "90%" }}>
                    <PrimaryButton
                        label="Print"
                        onClick={handlePrint}
                    />
                </div>
            </div>
        </CustomCard>
    );
}

export const PrintReceipt = ({ data, loading, company }) => {
    const { formatCurrency } = useCurrencyFormatter();

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

    return (
        <div className="surface-card border-1 border-300 p-4" style={{ width: "600px", maxWidth: "90%" }}>
            {loading ? (
                <div className="text-center text-sm text-600">
                    Loading receipt...
                </div>
            ) : (
                <>
                    <div className="text-center font-bold text-2xl mb-2">
                        {company?.name || company?.legalName || "—"}
                    </div>

                    <div className="text-center text-sm text-600 mb-3">
                        {address}
                        {company?.workNumber && <div>{company.workNumber}</div>}
                    </div>

                    <div className="border-top-1 border-300 my-3" />

                    <div className="flex justify-content-between text-sm mb-2">
                        <span>
                            <strong>Invoice No:</strong> {data?._id}
                        </span>
                        <span>
                            <strong>Invoice Name:</strong>{" "}
                            {data?.member
                                ? `${data.member.firstName} ${data.member.lastName}`
                                : "Walk-in"}
                        </span>
                    </div>

                    <div className="flex justify-content-between text-sm mb-3">
                        <span>
                            <strong>Cashier:</strong>{" "}
                            {data?.employee
                                ? `${data.employee.firstName} ${data.employee.lastName}`
                                : "-"}
                        </span>
                        <span>
                            <strong>Date:</strong>{" "}
                            {data?.createdAt ? getDateTime(data.createdAt) : "-"}
                        </span>
                    </div>

                    <div className="border-top-1 border-300 my-3" />

                    <div className="grid text-sm font-bold mb-2 border-bottom-1 border-300 pb-2">
                        <div className="col-6">Item</div>
                        <div className="col-2 text-center">Quantity</div>
                        <div className="col-2 text-center">Discount</div>
                        <div className="col-2 text-right">Total</div>
                    </div>

                    {data?.cartItems?.map((item, index) => (
                        <div key={index} className="grid text-sm mb-2">
                            <div className="col-6">
                                {item.name} {item.itemCaption}
                            </div>
                            <div className="col-2 text-center">{item.quantity}</div>
                            <div className="col-2 text-center">
                                {formatCurrency(
                                    (item.promoDiscount || 0) + (item.specialDiscount || 0)
                                )}
                            </div>
                            <div className="col-2 text-right">
                                {formatCurrency(item.finalTotal)}
                            </div>
                        </div>
                    ))}

                    <div className="border-top-1 border-300 my-3" />

                    <div className="grid text-sm">
                        <div className="col-10 text-right">Net Total :</div>
                        <div className="col-2 text-right">
                            {formatCurrency(data?.cartDetails?.total)}
                        </div>
                    </div>

                    <div className="grid text-sm">
                        <div className="col-10 text-right">Tax :</div>
                        <div className="col-2 text-right">
                            {formatCurrency(data?.cartDetails?.tax)}
                        </div>
                    </div>

                    <div className="grid text-sm font-bold">
                        <div className="col-10 text-right">Grand Total :</div>
                        <div className="col-2 text-right">
                            {formatCurrency(data?.cartDetails?.gradTotal)}
                        </div>
                    </div>

                    <div className="border-top-1 border-300 my-3" />

                    <div className="text-center text-sm font-bold my-3">
                        THIS IS YOUR OFFICIAL RECEIPT
                    </div>

                    <div className="text-center text-primary text-sm font-bold mt-3">
                        Thank You Come Again!
                    </div>
                </>
            )}
        </div>
    );
};