import React, { useState } from "react";
import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "../../../../shared/cards/CustomCard";
import CustomListItem from "../../../../shared/cards/CustomListItem";
import EditPersonal from "../../Details/EditPersonal";
import EditDemographics from "../../Details/EditDemograpghics";
import { getDate } from "../../../../utils/dateTime";
import EditAccessCode from "../../Details/EditAccessCode";
import EditMembershipDetails from "../../Details/EditMembershipDetails";
import EditOptIns from "../../Details/EditOptIns";
import { Checkbox } from "primereact/checkbox";
import { useCurrencyFormatter } from "../../../../hooks/useCurrencyFormatter";

const Personal = ({ data, setData }) => {
  const { formatCurrency } = useCurrencyFormatter();
  const [personalEdit, setPersonalEdit] = useState(false);
  const [demographicEdit, setDemographicEdit] = useState(false);
  const [accessCodeEdit, setAccessCodeEdit] = useState(false);
  const [membershipEdit, setMembershipEdit] = useState(false);
  const [optInsEdit, setOptInsEdit] = useState(false);

  return (
    <>
      <EditAccessCode
        visible={accessCodeEdit}
        onHide={() => setAccessCodeEdit(false)}
        data={data}
        setData={setData}
      />
      <EditPersonal
        visible={personalEdit}
        onHide={() => setPersonalEdit(false)}
        data={data}
        setData={setData}
      />
      <EditDemographics
        visible={demographicEdit}
        onHide={() => setDemographicEdit(false)}
        data={data}
        setData={setData}
      />
      <EditMembershipDetails
        visible={membershipEdit}
        onHide={() => setMembershipEdit(false)}
        data={data}
        setData={setData}
      />
      <EditOptIns
        visible={optInsEdit}
        onHide={() => setOptInsEdit(false)}
        data={data}
        setData={setData}
      />
      <CustomCard
        title="Personal Details"
        size={6}
        actions
        onEdit={() => setPersonalEdit(true)}
        height={"100%"}
      >
        <CustomListItem data={data} name="firstName" />
        <CustomListItem data={data} name="lastName" />
        <CustomListItem data={data} name="gender" />
        <CustomListItem data={data} name="dob" value={getDate(data?.dob)} />
        <CustomListItem data={data} name="socialSecurity" />
        <CustomListItem data={data} name="occupation" />
        <CustomListItem data={data} name="employer"/>
        <CustomListItem
          data={data}
          name="prepayBalance"
          value={formatCurrency(data?.prepayBalance || 0)}
        />
      </CustomCard>
      <CustomCard
        title="Demographics"
        size={6}
        actions
        onEdit={() => setDemographicEdit(true)}
        height={"100%"}
      >
        <CustomListItem
          data={data}
          name="address"
          value={
            data?.address?.value?.label ||
            [data?.address?.addressLine1, data?.address?.city, data?.address?.state, data?.address?.zipCode].filter(Boolean).join(", ") ||
            "-"
          }
        />
        <CustomListItem data={data} name="primaryPhone" />{" "}
        <CustomListItem data={data} name="email" />
        <CustomListItem data={data} name="mobilePhone" />
        <CustomListItem data={data} name="workPhone" />{" "}
        <CustomListItem data={data} name="govtId" />
      </CustomCard>
      <CustomCard
        title="Membership Details"
        size={6}
        height={"100%"}
        actions
        onEdit={() => setMembershipEdit(true)}
      >
        <CustomListItem data={data} name="barCode" />
        <CustomListItem data={data} name="membershipTypeName" />{" "}
      </CustomCard>
      <CustomCard
        title="Access Code"
        onEdit={() => setAccessCodeEdit(true)}
        actions
        size={6}
        height={"100%"}
      >
        <CustomListItem data={data} name="accessCode" />
        <CustomListItem data={data} name="failedAttempts" />
      </CustomCard>
      <CustomCard
        title="Opt.Ins"
        size={6}
        height={"100%"}
        actions
        onEdit={() => setOptInsEdit(true)}
      >
        <div className="c-col-12">
          <div className="flex mb-3">
            <div style={{ width: "40%" }} />
            <div style={{ width: "30%" }} className="font-semibold">Texts</div>
            <div style={{ width: "30%" }} className="font-semibold">Promotional</div>
          </div>
          {["membership", "services", "booking"].map((field) => (
            <div key={field} className="flex align-items-center mb-3">
              <div style={{ width: "40%" }} className="capitalize">{field}</div>
              <div style={{ width: "30%" }}>
                <Checkbox checked={data?.text?.[field] || false} disabled />
              </div>
              <div style={{ width: "30%" }}>
                <Checkbox
                  checked={data?.promotional?.[field] || false}
                  disabled
                />
              </div>
            </div>
          ))}
        </div>
      </CustomCard>
    </>
  );
};

export default Personal;
