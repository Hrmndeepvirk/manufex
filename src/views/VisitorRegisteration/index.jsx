import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import formValidation from "@utils/formValidations";
import { showToastAction } from "@store/common/commonActions";
import {
  getCompanyDetails,
  getMemberByPhone,
  getMemberByEmail,
  registerMember,
} from "@store/visitorRegisteration/visitorRegisterationActions";

import ActivationCodeStep from "./ActivationCodeStep";
import SignInStep from "./SignInStep";
import VisitorTypeStep from "./VisitorTypeStep";
import PhoneStep from "./PhoneStep";
import PersonMatchStep from "./PersonMatchStep";
import EmailStep from "./EmailStep";
import FirstNameStep from "./FirstNameStep";
import LastNameStep from "./LastNameStep";
import BirthdayStep from "./BirthdayStep";
import GenderStep from "./GenderStep";
import AddressStep from "./AddressStep";
import SuccessStep from "./SuccessStep";

const STEPS = {
  ACTIVATION: 0,
  SIGNIN: 1,
  VISITOR_TYPE: 2,
  PHONE: 3,
  PERSON_MATCH: 4,
  EMAIL: 5,
  FIRST_NAME: 6,
  LAST_NAME: 7,
  BIRTHDAY: 8,
  GENDER: 9,
  ADDRESS: 10,
  SUCCESS: 11,
};

const initialData = {
  activationCode: "",
  mobilePhone: "",
  marketingConsent: true,
  email: "",
  emailConsent: true,
  firstName: "",
  lastName: "",
  dob: "",
  gender: "",
  address: null,
  street: "",
  city: "",
  state: "",
  zipCode: "",
  formErrors: {},
};

// Steps that show the next (right) arrow in top bar
const NEXT_ARROW_STEPS = [STEPS.PHONE, STEPS.EMAIL, STEPS.FIRST_NAME, STEPS.LAST_NAME, STEPS.BIRTHDAY, STEPS.ADDRESS];

export default function VisitorRegisteration() {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(STEPS.ACTIVATION);
  const [data, setData] = useState({ ...initialData });
  const [company, setCompany] = useState(null);
  const [visitorType, setVisitorType] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [matchedMember, setMatchedMember] = useState(null);
  const [matchSource, setMatchSource] = useState("");
  const [slideDirection, setSlideDirection] = useState("forward");

  // On mount, check if a company was previously activated
  useEffect(() => {
    const savedCompanyId = localStorage.getItem("visitorCompanyId");
    if (savedCompanyId) {
      dispatch(
        getCompanyDetails(savedCompanyId, setLoading, (companyData) => {
          if (companyData) {
            setCompany(companyData);
            setCurrentStep(STEPS.SIGNIN);
          }
          setInitializing(false);
        })
      );
    } else {
      setInitializing(false);
    }
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e;
    setData((prev) => ({
      ...prev,
      [name]: value,
      formErrors: formValidation(name, value, prev),
    }));
  }, []);

  const goTo = (step) => {
    setSlideDirection("forward");
    setCurrentStep(step);
  };

  const goBack = () => {
    setSlideDirection("backward");
    switch (currentStep) {
      case STEPS.VISITOR_TYPE:
        setCurrentStep(STEPS.SIGNIN);
        break;
      case STEPS.PERSON_MATCH:
        setCurrentStep(matchSource === "email" ? STEPS.EMAIL : STEPS.PHONE);
        break;
      case STEPS.EMAIL:
        setCurrentStep(STEPS.PHONE);
        break;
      default:
        if (currentStep > STEPS.VISITOR_TYPE) {
          setCurrentStep((prev) => prev - 1);
        }
        break;
    }
  };

  // ─── Step handlers ────────────────────────────────────────
  const handleActivationNext = () => {
    if (!data.activationCode) {
      dispatch(showToastAction({ description: "Please enter an activation code.", type: "error" }));
      return;
    }
    dispatch(
      getCompanyDetails(data.activationCode, setLoading, (companyData, err) => {
        if (companyData) {
          setCompany(companyData);
          localStorage.setItem("visitorCompanyId", companyData._id);
          goTo(STEPS.SIGNIN);
        } else {
          dispatch(showToastAction({ description: err || "Invalid activation code.", type: "error" }));
        }
      })
    );
  };

  const handleVisitorTypeSelect = (type) => {
    setVisitorType(type);
    goTo(STEPS.PHONE);
  };

  const handlePhoneNext = () => {
    if (!data.mobilePhone) {
      dispatch(showToastAction({ description: "Please enter your phone number.", type: "error" }));
      return;
    }
    dispatch(
      getMemberByPhone(data.mobilePhone, setLoading, (member) => {
        if (member) {
          setMatchedMember(member);
          setMatchSource("phone");
          goTo(STEPS.PERSON_MATCH);
        } else {
          goTo(STEPS.EMAIL);
        }
      })
    );
  };

  const handleEmailNext = () => {
    if (!data.email) {
      dispatch(showToastAction({ description: "Please enter your email.", type: "error" }));
      return;
    }
    const errors = formValidation("email", data.email, data);
    if (errors.email) {
      setData((prev) => ({ ...prev, formErrors: errors }));
      return;
    }
    dispatch(
      getMemberByEmail(data.email, setLoading, (member) => {
        if (member) {
          setMatchedMember(member);
          setMatchSource("email");
          goTo(STEPS.PERSON_MATCH);
        } else {
          goTo(STEPS.FIRST_NAME);
        }
      })
    );
  };

  const handlePersonMatchConfirm = () => {
    setData((prev) => ({
      ...prev,
      firstName: matchedMember?.firstName || prev.firstName,
    }));
    goTo(STEPS.SUCCESS);
  };

  const handlePersonMatchNotMe = () => {
    setMatchedMember(null);
    if (matchSource === "phone") {
      goTo(STEPS.EMAIL);
    } else {
      goTo(STEPS.FIRST_NAME);
    }
  };

  const handleFirstNameNext = () => {
    if (!data.firstName) {
      dispatch(showToastAction({ description: "Please enter your first name.", type: "error" }));
      return;
    }
    goTo(STEPS.LAST_NAME);
  };

  const handleLastNameNext = () => {
    if (!data.lastName) {
      dispatch(showToastAction({ description: "Please enter your last name.", type: "error" }));
      return;
    }
    goTo(STEPS.BIRTHDAY);
  };

  const handleBirthdayNext = () => {
    if (!data.dob) {
      dispatch(showToastAction({ description: "Please enter your date of birth.", type: "error" }));
      return;
    }
    goTo(STEPS.GENDER);
  };

  const handleGenderSelect = () => {
    goTo(STEPS.ADDRESS);
  };

  const handleSubmit = () => {
    const addressObj = data.address
      ? {
          addressLine1: data.address.addressLine1 || "",
          city: data.address.city || "",
          state: data.address.state || "",
          zipCode: data.address.zipCode || "",
          country: data.address.country || "",
          location: data.address.location || null,
        }
      : {
          addressLine1: data.street || "",
          city: data.city || "",
          state: data.state || "",
          zipCode: data.zipCode || "",
          country: "US",
          location: null,
        };

    const payload = {
      company: company?._id,
      createType: visitorType,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      dob: data.dob,
      email: data.email,
      mobilePhone: data.mobilePhone,
      address: addressObj,
      preferences: {
        text: { promotional: data.marketingConsent },
        promotional: { membership: data.emailConsent },
      },
    };

    dispatch(
      registerMember(payload, setLoading, (member, err) => {
        if (member) {
          goTo(STEPS.SUCCESS);
        } else {
          dispatch(showToastAction({ description: err || "Registration failed.", type: "error" }));
        }
      })
    );
  };

  const handleSuccessComplete = useCallback(() => {
    setData({ ...initialData });
    setVisitorType("");
    setMatchedMember(null);
    setMatchSource("");
    goTo(STEPS.SIGNIN);
  }, []);

  // ─── Top-bar next arrow handler ───────────────────────────
  const handleNextArrow = () => {
    switch (currentStep) {
      case STEPS.PHONE:
        handlePhoneNext();
        break;
      case STEPS.EMAIL:
        handleEmailNext();
        break;
      case STEPS.FIRST_NAME:
        handleFirstNameNext();
        break;
      case STEPS.LAST_NAME:
        handleLastNameNext();
        break;
      case STEPS.BIRTHDAY:
        handleBirthdayNext();
        break;
      case STEPS.ADDRESS:
        handleSubmit();
        break;
      default:
        break;
    }
  };

  // ─── Enter key triggers next arrow action ──────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && NEXT_ARROW_STEPS.includes(currentStep) && !loading) {
        handleNextArrow();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, loading, data, visitorType]);

  // ─── Brand colors from company ──────────────────────────
  const primaryColors = company?.brandAssets?.theme?.colors?.primary;
  const brandStyle = {
    "--vr-primary": primaryColors?.base || "#e53935",
    "--vr-text": primaryColors?.textOnPrimary || "#ffffff",
  };

  const showBack = currentStep >= STEPS.VISITOR_TYPE && currentStep !== STEPS.SUCCESS;
  const showNext = NEXT_ARROW_STEPS.includes(currentStep);

  // ─── Loading while checking localStorage ──────────────────
  if (initializing) return null;

  // ─── Activation code screen (white) ───────────────────────
  if (currentStep === STEPS.ACTIVATION) {
    return (
      <ActivationCodeStep
        data={data}
        handleChange={handleChange}
        onNext={handleActivationNext}
        loading={loading}
      />
    );
  }

  // ─── Sign-in screen (white) ───────────────────────────────
  if (currentStep === STEPS.SIGNIN) {
    return (
      <SignInStep
        company={company}
        brandStyle={brandStyle}
        onNext={() => goTo(STEPS.VISITOR_TYPE)}
        onChangeAccount={() => {
          setCompany(null);
          setData({ ...initialData });
          localStorage.removeItem("visitorCompanyId");
          goTo(STEPS.ACTIVATION);
        }}
      />
    );
  }

  // ─── Red step screens ─────────────────────────────────────
  return (
    <div className="visitor-registration" style={brandStyle}>
      {/* Top navigation bar */}
      <div className="vr-topbar">
        {showBack ? (
          <button className="vr-nav-btn" onClick={goBack}>
            <i className="pi pi-arrow-left" />
          </button>
        ) : (
          <div className="vr-nav-placeholder" />
        )}
        {showNext ? (
          <button className="vr-nav-btn" onClick={handleNextArrow} disabled={loading}>
            <i className="pi pi-arrow-right" />
          </button>
        ) : (
          <div className="vr-nav-placeholder" />
        )}
      </div>

      {/* Step content */}
      <div className={`vr-content vr-slide-${slideDirection}`} key={currentStep}>
        {currentStep === STEPS.VISITOR_TYPE && (
          <VisitorTypeStep onSelect={handleVisitorTypeSelect} />
        )}

        {currentStep === STEPS.PHONE && (
          <PhoneStep data={data} handleChange={handleChange} />
        )}

        {currentStep === STEPS.PERSON_MATCH && (
          <PersonMatchStep
            member={matchedMember}
            matchSource={matchSource}
            onConfirm={handlePersonMatchConfirm}
            onNotMe={handlePersonMatchNotMe}
          />
        )}

        {currentStep === STEPS.EMAIL && (
          <EmailStep data={data} handleChange={handleChange} />
        )}

        {currentStep === STEPS.FIRST_NAME && (
          <FirstNameStep data={data} handleChange={handleChange} />
        )}

        {currentStep === STEPS.LAST_NAME && (
          <LastNameStep data={data} handleChange={handleChange} />
        )}

        {currentStep === STEPS.BIRTHDAY && (
          <BirthdayStep data={data} handleChange={handleChange} />
        )}

        {currentStep === STEPS.GENDER && (
          <GenderStep
            data={data}
            handleChange={handleChange}
            onSelect={handleGenderSelect}
          />
        )}

        {currentStep === STEPS.ADDRESS && (
          <AddressStep
            data={data}
            handleChange={handleChange}
            onSubmit={handleSubmit}
            loading={loading}
          />
        )}

        {currentStep === STEPS.SUCCESS && (
          <SuccessStep
            firstName={data.firstName}
            onComplete={handleSuccessComplete}
          />
        )}
      </div>
    </div>
  );
}
