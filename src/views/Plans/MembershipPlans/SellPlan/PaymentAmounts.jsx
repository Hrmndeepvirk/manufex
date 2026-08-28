import React, { useEffect, useMemo, useState } from "react";
import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomListItem from "@shared/cards/CustomListItem";
import { formatDate } from "@fullcalendar/core";
import { useSellPlan } from "./SellPlanContext";
import { calculateServiceAmount } from "../../../../utils/taxHelpers";
import { useCurrencyFormatter } from "../../../../hooks/useCurrencyFormatter";

function PaymentAmount() {
  const { agreementData, onCancel, goNext } = useSellPlan();
  const { formatCurrency } = useCurrencyFormatter();

  const [services, setServices] = useState([]);

  useEffect(() => {
    if (!agreementData?.services) return;

    const _services = agreementData.services.map((service) => ({
      ...service,
      pricing: calculateServiceAmount(service),
    }));
    setServices(_services);
  }, [agreementData]);

  const { serviceTaxTotal, grandTotal } = useMemo(() => {
    const serviceSubtotal = services.reduce(
      (sum, s) => sum + (s.pricing?.netAmount || 0),
      0,
    );

    const serviceTaxTotal = services.reduce(
      (sum, s) => sum + (s.pricing?.taxAmount || 0),
      0,
    );

    const serviceFinalTotal = services.reduce(
      (sum, s) => sum + (s.pricing?.finalAmount || 0),
      0,
    );

    return {
      serviceSubtotal,
      serviceTaxTotal,
      serviceFinalTotal,
      grandTotal: serviceFinalTotal,
    };
  }, [services]);

  const handleNext = () => {
    goNext(3, "billing-info");
  };

  return (
    <FormPageLayout
      noPadding
      backText="Plans"
      submitLabel="Next"
      onSubmit={handleNext}
      onCancel={onCancel}
    >
      <CustomCard title="Payment Amount" size={12}>
        {services.length > 0 && (
          <>
            <div className="c-col-12 font-semibold text-highlight text-lg">
              Services
            </div>
            {services.map((item, index) => {
              const { pricing, includesTax } = item;

              return (
                <CustomListItem
                  key={item._id || index}
                  label={
                    <>
                      {item.title}

                      {`(Due On ${formatDate(item.firstDueDate)})`}
                    </>
                  }
                  value={`${formatCurrency(pricing.netAmount)}${includesTax ? "" : "*"}`}
                />
              );
            })}
          </>
        )}

        {serviceTaxTotal > 0 && (
          <CustomListItem label="Tax" value={formatCurrency(serviceTaxTotal)} />
        )}
        <div className="c-col-12 flex justify-content-between">
          <div className="font-semibold text-highlight text-lg">Total</div>
          <div className="font-semibold text-highlight text-lg">
            {formatCurrency(grandTotal)}
          </div>
        </div>
      </CustomCard>
    </FormPageLayout>
  );
}

export default React.memo(PaymentAmount);
