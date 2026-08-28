import { createContext, useContext, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useServerTime } from "../../../../hooks/useServerTime";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { getPlan, getMemberInformation, checkReavailability } from "@store/plan/planActions";
import { getDistanceBetweenAddresses } from "../../../../utils/common";
import { checkAgeValidity } from "@utils/planHelpers";
import { showFormErrors } from "@formValidations";
import { getDueDate } from "@utils/planHelpers";
import useCreditCard from "../../../../hooks/useCreditCard";
import { postPlan } from "../../../../store/plan/planActions";
import { getAgreementPlanFields } from "@store/settings/business/defaultActions";

const SellPlanContext = createContext(null);
export const useSellPlan = () => useContext(SellPlanContext);

const _planDataInitialState = {
  title: "",
  club: {},
  membershipType: {
    title: "",
    specialRestrictions: [],
    minimumAgeAllowed: 0,
    maximumAgeAllowed: 0,
    maximumDistanceAllowed: {
      value: 0,
      unit: "miles",
    },
    services: [],
  },
  assessedFees: [],
  howOftenWillClientsBeCharged: "",
  timePeriod: 0,
  interval: "",
  whenWillClientsBeCharged: "",
  noOfAutopays: 0,
  whatHappensAfterAutopayPayments: "",
  agreementServices: [],
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
  address: {},
  emergencyContactName: "",
  emergencyContactNumber: "",
  createdAt: new Date(),
  customerPaymentProfiles: [],
};
const _agreementInitialState = {
  salesPerson: null,
  referredBy: null,
  campaign: null,
  memberSince: new Date(),
  signDate: new Date(),
  beginDate: new Date(),
  assessedFees: [],
  services: [],
};

export const SellPlanProvider = ({ children }) => {
  const { getServerDate, isSynced } = useServerTime();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [memberDistance, setMemberDistance] = useState(null);
  const [reavailabilityWarning, setReavailabilityWarning] = useState(null);

  const [enabledTabs, setEnabledTabs] = useState([0]);
  const [, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const [planLoading, setPlanLoading] = useState(false);
  const [planData, setPlanData] = useState(_planDataInitialState);

  const [selectedMember, setSelectedMember] = useState(null);
  const [memberLoading, setMemberLoading] = useState(false);
  const [memberData, setMemberData] = useState(_memberDataInitialState);

  const [agreementData, setAgreementData] = useState(_agreementInitialState);
  const [agreementRequiredFields, setAgreementRequiredFields] = useState([]);

  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    dispatch(
      getAgreementPlanFields((res) => {
        setAgreementRequiredFields(res?.agreementPlanRequiredFields || []);
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (isSynced) {
      setAgreementData((prev) => ({
        ...prev,
        memberSince: getServerDate(),
        signDate: getServerDate(),
        beginDate: getServerDate(),
      }));
    }
  }, [isSynced]);

  useEffect(() => {
    getPlanData();
  }, [id]);
  function getPlanData() {
    if (id) {
      dispatch(
        getPlan(id, setPlanLoading, (res) => {
          setPlanData({ ...res, billingFrequency: buildBillingSummary(res) });
          let _services = [
            ...(res.agreementServices || []),
            ...(res.membershipType?.services || []),
          ];
          setAgreementData((prev) => ({
            ...prev,
            beginDate: getServerDate(),
            services: _services,
            assessedFees: res.assessedFees,
          }));
        }),
      );
    }
  }

  useEffect(() => {
    if (agreementData.beginDate) {
      let _services = agreementData.services;
      let _assessedFees = agreementData.assessedFees;
      setAgreementData((prev) => ({
        ...prev,
        services: _services.map((item) => ({
          ...item,
          firstDueDate: prev.beginDate,
        })),
        assessedFees: _assessedFees.map((item) => ({
          ...item,
          dueDate:
            item?.type === "ANNUAL_FEE"
              ? getDueDate({
                  paymentOption: item.dueDateDeterminedBy,
                  specificDate: item.preferredDate,
                  daysFromBeginDate: item.noOfDays,
                  beginDate: prev.beginDate,
                })
              : null,
        })),
      }));
    }
  }, [agreementData.beginDate]);

  useEffect(() => {
    getMemberData();
  }, [selectedMember]);

  useEffect(() => {
    if (id && selectedMember) {
      dispatch(
        checkReavailability(id, selectedMember, ({ eligible, message }) => {
          setReavailabilityWarning(eligible ? null : message);
        }),
      );
    } else {
      setReavailabilityWarning(null);
    }
  }, [id, selectedMember]);

  useEffect(() => {
    const memberIdFromState = location.state?.memberId;
    if (memberIdFromState) {
      setSelectedMember(memberIdFromState);
    } else {
      let _selectedMember = localStorage.getItem("selectedMember");
      if (_selectedMember) {
        setSelectedMember(_selectedMember);
      }
    }
  }, []);

  function getMemberData() {
    if (selectedMember) {
      localStorage.setItem("selectedMember", selectedMember);
      dispatch(
        getMemberInformation(selectedMember, setMemberLoading, (res) => {
          setMemberData({
            image: res.image,
            barCode: res.barCode,
            firstName: res.firstName,
            lastName: res.lastName,
            gender: res.gender,
            dob: res.dob,
            email: res.email,
            primaryPhone: res.primaryPhone,
            address: res.address,
            emergencyContactName: res.emergencyContactName,
            emergencyContactNumber: res.emergencyContactNumber,
            createdAt: res.createdAt,
            customerPaymentProfiles: res.customerPaymentProfiles || [],
          });
          if (res.defaultPaymentMethodId) {
            setSelectedCard(res.defaultPaymentMethodId);
          }
          setAgreementData((prev) => ({ ...prev, memberSince: res.createdAt }));
        }),
      );
    }
  }

  const goNext = (currentIndex, tabName) => {
    const nextIndex = currentIndex + 1;
    setEnabledTabs((prev) =>
      prev.includes(nextIndex) ? prev : [...prev, nextIndex],
    );
    setSearchParams({ tab: tabName }, { replace: true });
  };
  const onCancel = () => {
    localStorage.removeItem("selectedMember");
    navigate(-1);
  };

  const membershipType = planData?.membershipType || {};
  const restrictions = membershipType?.specialRestrictions || [];
  const hasAgeRestriction = restrictions.includes("BY_AGE");
  const hasLocationRestriction = restrictions.includes("BY_LOCATION");

  useEffect(() => {
    if (memberData?.address?.location && planData?.club?.address?.location) {
      let value = getDistanceBetweenAddresses(
        memberData?.address,
        planData?.club?.address,
        membershipType?.maximumDistanceAllowed?.unit,
      );
      setMemberDistance({
        value: value,
        unit: membershipType?.maximumDistanceAllowed?.unit,
      });
    }
  }, [planData, memberData, membershipType]);

  // Validations
  function isPersonalDetailsValid() {
    if (!showFormErrors(memberData, setMemberData)) return false;
    const { dob } = memberData;
    const { minimumAgeAllowed, maximumAgeAllowed, maximumDistanceAllowed } =
      membershipType;

    if (
      hasAgeRestriction &&
      !checkAgeValidity(dob, minimumAgeAllowed, maximumAgeAllowed)
    ) {
      setMemberData((prev) => ({
        ...prev,
        formErrors: {
          ...prev.formErrors,
          dob: `This plan is available only for members aged between ${minimumAgeAllowed} and ${maximumAgeAllowed} years.`,
        },
      }));
      return false;
    }
    if (
      hasLocationRestriction &&
      memberDistance?.value > maximumDistanceAllowed?.value
    ) {
      setMemberData((prev) => ({
        ...prev,
        formErrors: {
          ...prev.formErrors,
          address: `This plan is available for members within a ${maximumDistanceAllowed.value} ${maximumDistanceAllowed.unit} radius.You're currently ${memberDistance.value} ${memberDistance.unit} away.`,
        },
      }));
      return false;
    }
    return true;
  }

  function isAgreementDetailsValid() {
    if (!showFormErrors(agreementData, setAgreementData, [], agreementRequiredFields)) return false;
    return true;
  }

  //Payment
  const {
    data,
    handleCreditChange,
    CardInput,
    validations,
    handleCreditCardSubmit,
  } = useCreditCard();

  async function onSubmit() {
    if (!selectedMember) {
      setSearchParams({ tab: "plan" }, { replace: true });
      return;
    }

    if (!isPersonalDetailsValid()) {
      setSearchParams({ tab: "personal" }, { replace: true });
      return;
    }
    if (!isAgreementDetailsValid()) {
      setSearchParams({ tab: "agreement" }, { replace: true });
      return;
    }

    setLoading(true);
    try {
      let payment = {
        paymentMethod: {
          customerPaymentProfileId: selectedCard,
        },
      };
      if (!selectedCard) {
        let opaqueDataValidation = await handleCreditCardSubmit();

        console.log(opaqueDataValidation, "rtyui");
        if (!opaqueDataValidation) {
          setLoading(false);
        }

        let opaqueData = await handleCreditCardSubmit();

        payment = {
          paymentMethod: {
            opaqueDataValidation,
            opaqueData,
            cardHolderName: data.cardHolderName,
          },
        };
      }

      let payload = {
        payment,
        member: memberData,
        selectedMember,
        planId: id,
        plan: agreementData,
      };
      dispatch(
        postPlan(payload, setLoading, (res) => {
          navigate(`/plans/agreement/${res._id}`);
        }),
      );
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const value = {
    membershipType,
    hasAgeRestriction,
    hasLocationRestriction,
    reavailabilityWarning,

    enabledTabs,
    loading,
    planLoading,

    planData,
    memberDistance,
    selectedMember,
    setSelectedMember,
    memberLoading,
    memberData,
    setMemberData,

    agreementData,
    setAgreementData,
    agreementRequiredFields,

    onCancel,
    goNext,

    isPersonalDetailsValid,
    isAgreementDetailsValid,
    onSubmit,

    data,
    handleCreditChange,
    CardInput,
    validations,
    handleCreditCardSubmit,

    selectedCard,
    setSelectedCard,
  };
  return (
    <SellPlanContext.Provider value={value}>
      {children}
    </SellPlanContext.Provider>
  );
};
function buildBillingSummary(config) {
  if (!config) return "";

  const {
    autoPay,
    interval,
    timePeriod,
    howOftenWillClientsBeCharged,
    noOfAutopays,
    whatHappensAfterAutopayPayments,
  } = config;

  const intervalMap = {
    DAY: "day",
    WEEK: "week",
    MONTH: "month",
    YEAR: "year",
  };

  const baseInterval = intervalMap[interval] || interval?.toLowerCase();
  const intervalLabel = timePeriod > 1 ? `${baseInterval}s` : baseInterval;

  let frequencySuffix = "";
  if (howOftenWillClientsBeCharged === "UNTIL_CANCEL") {
    frequencySuffix = " until cancelled";
  } else if (howOftenWillClientsBeCharged === "NO_OF_AUTOPAYS") {
    frequencySuffix = ` for ${noOfAutopays} payment${noOfAutopays > 1 ? "s" : ""}`;
    if (whatHappensAfterAutopayPayments === "CONTRACT_EXPIRES") {
      frequencySuffix += " (contract expires)";
    } else if (whatHappensAfterAutopayPayments === "CONTRACT_RENEWS") {
      frequencySuffix += " (contract renews)";
    }
  }

  if (autoPay === "ON_PRICING_OPTIONS_RUN_OUT") {
    return "When pricing options run out";
  }

  return `Every ${timePeriod} ${intervalLabel}${frequencySuffix}`;
}
