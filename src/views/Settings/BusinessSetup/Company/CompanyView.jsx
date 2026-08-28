import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DetailsPageLayout from "@shared/layout/DetailsPageLayout";

import CustomCard from "../../../../shared/cards/CustomCard";
import CustomListItem from "../../../../shared/cards/CustomListItem";

function CompanyView() {
  const [loading, setLoading] = useState(true);
  const company = useSelector((state) => state.settings.business.company);

  useEffect(() => {
    if (company) {
      setLoading(false);
    }
  }, [company]);

  return (
    <DetailsPageLayout
      buttonLabel="Edit Company"
      linkTo={"company"}
      pageLoading={loading}
    >
      <CustomCard title="General Details" size={6}>
        <CustomListItem data={company} name="id" label="Company ID" />
        <CustomListItem data={company} name="legalName" />
        <CustomListItem data={company} name="name" />
        <CustomListItem data={company} name="shortName" />
        <CustomListItem data={company} name="timeZone" />
        <CustomListItem data={company} name="taxId" />

        <CustomListItem
          data={company}
          name="multiClubInOut"
          label="Allow Multi-Club Clock In/Out"
        />
        <CustomListItem data={company} name="clockInDepartmentRequired" />
        <CustomListItem
          data={company}
          name="currency"
          // value={
          //   company?.currency?.code + "(" + company?.currency?.symbol + ")"
          // }
          value={company?.currency || "-"}
        />
      </CustomCard>
      <CustomCard title="Address Details" size={6} height="100%">
        <CustomListItem data={company} name="addressLine1" />
        <CustomListItem data={company} name="addressLine2" />
        <CustomListItem data={company} name="city" />
        <CustomListItem data={company} name="state" />
        <CustomListItem data={company} name="country" />
        <CustomListItem data={company} name="zipCode" />
      </CustomCard>
      <CustomCard title="Contact Information" size={6} height="100%">
        <CustomListItem data={company} name="primaryEmail" />
        <CustomListItem data={company} name="alternateEmail" />
        <CustomListItem data={company} name="workNumber" />
        <CustomListItem data={company} name="workExtention" />
        <CustomListItem data={company} name="faxNumber" />
        <CustomListItem data={company} name="companyUrl" label="Company URL" />
      </CustomCard>
      {/* <CustomCard title="Booking and Cancellation Info" size={6} height="100%">
        <CustomListItem
          data={company}
          name="bookOutFrom"
          value={`${
            company?.bookOutFrom?.value
          } ${company?.bookOutFrom?.unit.toLowerCase()}`}
        />
        <CustomListItem
          data={company}
          name="bookOutTo"
          value={`${
            company?.bookOutTo?.value
          } ${company?.bookOutTo?.unit.toLowerCase()}`}
        />
        <CustomListItem data={company} name="allowCancelOnline" />
        <CustomListItem
          data={company}
          name="timeBeforeEvent"
          value={`${
            company?.timeBeforeEvent?.value
          } ${company?.timeBeforeEvent?.unit?.toLowerCase()}`}
        />
      </CustomCard>
      <CustomCard title="Remote Check Ins Information" size={6}>
        <CustomListItem
          data={company}
          name="checkInLimit"
          value={company?.checkInLimit?.value?.toString()}
        />
        <CustomListItem
          data={company}
          name="per"
          value={company?.checkInLimit?.unit?.toLowerCase()}
        />
        <CustomListItem
          data={company}
          name="restrictionType"
          value={company?.checkInLimit?.restrictionType?.toLowerCase()}
        />
      </CustomCard> */}
      <CustomCard title="Data Export Information" size={6} height="100%">
        <CustomListItem data={company} name="companyCode" />
        <CustomListItem data={company} name="batchId" />
        <CustomListItem
          data={company}
          name="retryOffsetDays"
          label="Retry Offset Days"
          value={company?.billingSettings?.retryOffsetDays?.toString()}
        />
        <CustomListItem
          data={company}
          name="maxRetries"
          label="Max Retries"
          value={company?.billingSettings?.maxRetries?.toString()}
        />
      </CustomCard>
    </DetailsPageLayout>
  );
}

export default React.memo(CompanyView);
