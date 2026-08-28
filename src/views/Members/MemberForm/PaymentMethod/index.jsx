import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Skeleton } from "primereact/skeleton";
import PaymentCard from "@shared/cards/PaymentCard";
import { getPaymentMethods } from "@store/member/paymentMethodAction";
import { getMemberAgreements } from "@store/member/memberActions";
import { formatEnum } from "@utils/common";
import CustomCard from "@shared/cards/CustomCard";
import CustomSimpleTable from "@shared/table/CustomSimpleTable";
import AddPaymentMethod from "./AddPaymentMethod";
import AssignCardDialog from "./AssignCardDialog";

const PaymentMethod = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [agreementsLoading, setAgreementsLoading] = useState(false);
  const [assignCard, setAssignCard] = useState(null);

  const memberAgreements = useSelector(
    (state) => state.member.memberAgreements,
  );

  useEffect(() => {
    fetchPaymentMethods();
    fetchAgreements();
  }, [id]);

  const fetchPaymentMethods = () => {
    if (id) {
      dispatch(
        getPaymentMethods(id, setLoading, (methods) => setData(methods)),
      );
    }
  };

  const fetchAgreements = () => {
    if (id) {
      dispatch(getMemberAgreements(id, setAgreementsLoading));
    }
  };

  const getCardLabel = (paymentProfileId) => {
    if (!paymentProfileId) return "-";
    const card = data.find(
      (c) => c.customerPaymentProfileId === paymentProfileId,
    );
    if (!card) return "-";
    const cardType = card?.payment?.creditCard?.cardType || "Card";
    const cardNumber = card?.payment?.creditCard?.cardNumber || "XXXX";
    return `${cardType} ${cardNumber}`;
  };

  const assignedColumns = [
    { field: "membershipPlan", header: "Agreement Name" },
    { field: "agreementNo", header: "Agreement #" },
    {
      field: "status",
      header: "Status",
      body: (row) => (
        <span
          style={{
            color: ["ACTIVE", "SCHEDULED"].includes(row?.status)
              ? "var(--color-success)"
              : "var(--text-color-primary)",
            fontWeight: 600,
          }}
        >
          {formatEnum(row?.status)}
        </span>
      ),
    },
    {
      header: "Card on File",
      body: (row) => {
        const label = getCardLabel(row?.defaultPaymentMethodId);
        if (label === "-") return "-";
        return (
          <span style={{ fontWeight: 600, color: "var(--primary-color)" }}>
            {label}
          </span>
        );
      },
    },
  ];

  return (
    <>
      <CustomCard
        title={"Payment Methods"}
        loading={loading}
        actions
        onAdd={() => setVisible(true)}
        addTitle="Add Payment Method"
      >
        {loading
          ? [1, 2].map((i) => (
              <div key={i} className="c-col-12 md:c-col-6 lg:c-col-4">
                <Skeleton width="100%" height="180px" borderRadius="12px" />
              </div>
            ))
          : data.map((item) => (
              <div
                key={item.customerPaymentProfileId}
                className="c-col-12 md:c-col-4"
                style={{ cursor: "pointer" }}
                onClick={() => setAssignCard(item)}
              >
                <PaymentCard loading={loading} data={item} />
              </div>
            ))}
        {!loading && data.length === 0 && (
          <div className="c-col-12 text-center py-5">
            <p className="text-color-secondary">No payment methods found.</p>
          </div>
        )}
      </CustomCard>
      <div className="my-2"></div>
      <CustomCard title={"Assigned Payment Methods"} loading={agreementsLoading}>
        <div className="c-col-12">
          <CustomSimpleTable
            data={memberAgreements || []}
            columns={assignedColumns}
          />
        </div>
      </CustomCard>
      <AddPaymentMethod
        visible={visible}
        onHide={() => setVisible(false)}
        onSuccess={() => {
          fetchPaymentMethods();
          fetchAgreements();
        }}
      />
      <AssignCardDialog
        visible={!!assignCard}
        onHide={() => setAssignCard(null)}
        card={assignCard}
        onSuccess={() => {
          fetchPaymentMethods();
          fetchAgreements();
        }}
      />
    </>
  );
};

export default PaymentMethod;
