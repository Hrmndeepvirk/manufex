import React, { useEffect, useState } from "react";
import CustomTabView from "@shared/tabView/CustomTabView";
import PlanForm from "./PlanForm";
import PersonalForm from "./PersonalForm";
import AgreementForm from "./AgreementForm";
import PaymentAmount from "./PaymentAmounts";
import BillingInfo from "./BillingInfo";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getPlan, getMemberInformation } from "@store/plan/planActions";
import { useDispatch } from "react-redux";
import { getDueDate } from "@utils/planHelpers";
import { customConfirmDialog } from "@shared/overlays/CustomConfirmDialog";
import { addDraftPlan, getDraftPlan } from "@store/plan/draftPlansActions";
import { updateDraftPlan } from "../../../../store/plan/draftPlansActions";
import { postPlan } from "../../../../store/plan/planActions";

function SellPlan() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [enabledTabs, setEnabledTabs] = useState([0]);
  const [loading, setLoading] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [skipMemberFetchOnce, setSkipMemberFetchOnce] = useState(false);
  const [draftId, setDraftId] = useState(null);

  useEffect(() => {
    if (location?.state?.draftId) {
      setDraftId(location.state.draftId);
    }
  }, [location?.state?.draftId]);

  const _planDataInitialState = {
    title: "",
    whenWillClientsBeCharged: "",
    MemberShipTypeName: "",
    MemberShipSpecialRestrictions: [],
    services: [],
    assessedFee: [],
  };

  const _memberDataInitialState = {
    image: "",
    barCode: "",
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    email: "",
    primaryPhone: "",
    address: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    createdAt: new Date(),
  };

  const [memberData, setMemberData] = useState(_memberDataInitialState);

  const handleChangeForMemberSelection = (e) => {
    const value = e.target.value;
    setSelectedMember(value);
  };

  const _agreementInitialState = {
    salesPerson: null,
    referredBy: null,
    campaign: null,
    memberSince: memberData?.createdAt,
    signDate: new Date(),
    beginDate: new Date(),
    club: null,
  };

  const [planData, setPlanData] = useState(_planDataInitialState);
  const [agreementInfo, setAgreementInfo] = useState(_agreementInitialState);
  const [selectedMember, setSelectedMember] = useState(null);

  const goNext = (currentIndex) => {
    const nextIndex = currentIndex + 1;
    setEnabledTabs((prev) =>
      prev.includes(nextIndex) ? prev : [...prev, nextIndex],
    );
    navigate(`?tab=${tabs[nextIndex].title.toLowerCase().replace(/ /g, "-")}`);
  };

  const onSaveToDraft = () => {
    let currentTab = searchParams.get("tab");
    const draftPayload = {
      plan: id,
      selectedMember,
      activeTab: currentTab,
      enabledTabs: enabledTabs,
      memberDetails: memberData,
      agreementInfo: agreementInfo,
    };

    if (draftId) {
      dispatch(
        updateDraftPlan(draftId, draftPayload, setDraftLoading, () => {
          navigate("/plans?tab=membership-plans");
        }),
      );
    } else {
      dispatch(
        addDraftPlan(draftPayload, setDraftLoading, () => {
          navigate("/plans?tab=membership-plans");
        }),
      );
    }
  };

  const handleSaveToDraft = () => {
    customConfirmDialog({
      message: "Do you want to save this record to drafts?",
      accept: () => {
        onSaveToDraft();
      },
      reject: () => {},
    });
  };

  useEffect(() => {
    dispatch(
      getPlan(id, setLoading, (res) => {
        setPlanData(res);
        setAgreementInfo((prev) => {
          const beginDate = prev.beginDate;
          const calculated = {
            ...res,
            assessedFee: res.assessedFee.map((item) => ({
              ...item,
              dueDate: getDueDate({
                paymentOption: item.dueDateDeterminedBy,
                specificDate: item.preferredDate,
                daysFromBeginDate: item.noOfDays,
                beginDate,
              }),
              apply: true,
            })),
            services: res.services.map((item) => ({
              ...item,
              firstDueDate: beginDate,
              unitPrice: item.unitPrice,
            })),
          };
          return { ...prev, ...calculated };
        });
      }),
    );
  }, []);

  useEffect(() => {
    if (!draftId) return;

    dispatch(
      getDraftPlan(draftId, setDraftLoading, (draft) => {
        setSkipMemberFetchOnce(true);
        setSelectedMember(draft.selectedMember);
        setMemberData(draft.memberDetails);
        setAgreementInfo(draft.agreementInfo);
        setEnabledTabs(draft.enabledTabs);

        if (draft.activeTab) {
          navigate(`?tab=${draft.activeTab}`, { replace: true });
        }
      }),
    );
  }, [draftId]);

  // automatic populating member created date in member since
  useEffect(() => {
    if (memberData?.createdAt) {
      setAgreementInfo((prev) => ({
        ...prev,
        memberSince: memberData.createdAt,
      }));
    }
  }, [memberData.createdAt]);

  useEffect(() => {
    if (!selectedMember) return;
    if (skipMemberFetchOnce) {
      setSkipMemberFetchOnce(false);
      return;
    }

    dispatch(
      getMemberInformation(selectedMember, setLoading, (res) => {
        setMemberData((prev) => ({
          ...prev,
          image: res?.image ?? prev.image,
          barCode: res?.barCode ?? prev.barCode,
          firstName: res?.firstName ?? prev.firstName,
          lastName: res?.lastName ?? prev.lastName,
          gender: res?.gender ?? prev.gender,

          dob: prev.dob ? prev.dob : res?.dob,

          email: prev.email ? prev.email : res?.email,
          primaryPhone: prev.primaryPhone
            ? prev.primaryPhone
            : res?.primaryPhone,
          address: res.address,
          emergencyContactName: prev.emergencyContactName
            ? prev.emergencyContactName
            : res?.emergencyContactName,
          emergencyContactNumber: prev.emergencyContactNumber
            ? prev.emergencyContactNumber
            : res?.emergencyContactNumber,
          createdAt: res?.createdAt ?? prev.createdAt,
        }));
      }),
    );
  }, [selectedMember, dispatch, skipMemberFetchOnce]);

  const onSale = (payment) => {
    let payload = {
      payment,
      member: memberData,
      selectedMember,
      planId: id,
      plan: agreementInfo,
    };
    dispatch(
      postPlan(payload, setLoading, (res) => {
        console.log(res);
        navigate(`/plans/agreement/${res._id}`);
      }),
    );
  };

  const tabs = [
    {
      title: "Plan",
      content: (
        <PlanForm
          planData={planData}
          pageLoading={loading}
          selectedMember={selectedMember}
          saveToDraft={handleSaveToDraft}
          handleChange={handleChangeForMemberSelection}
          onNext={() => goNext(0)}
        />
      ),
    },
    {
      title: "Personal",
      content: (
        <PersonalForm
          planData={planData}
          memberData={memberData}
          setMemberData={setMemberData}
          saveToDraft={handleSaveToDraft}
          onNext={() => goNext(1)}
        />
      ),
    },
    {
      title: "Agreement",
      content: (
        <AgreementForm
          agreementInfo={agreementInfo}
          saveToDraft={handleSaveToDraft}
          setAgreementInfo={setAgreementInfo}
          onNext={() => goNext(2)}
        />
      ),
    },
    {
      title: "Payment Amount",
      content: (
        <PaymentAmount
          saveToDraft={handleSaveToDraft}
          agreementInfo={agreementInfo}
          onNext={() => goNext(3)}
        />
      ),
    },
    {
      title: "Billing Info",
      content: (
        <BillingInfo
          onSale={onSale}
          loading={loading}
          setLoading={setLoading}
        />
      ),
    },
  ];

  const disabledTabIndices = tabs
    .map((_, index) => index)
    .filter((index) => !enabledTabs.includes(index));

  return <CustomTabView tabs={tabs} disabledTabIndices={disabledTabIndices} />;
}
export default React.memo(SellPlan);
