import React, { createContext, useContext, useEffect, useState } from "react";
import cardValidator from "card-validator";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import CustomInput from "@inputs/CustomInput";
import CustomInputMask from "@inputs/CustomInputMask";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const IposPaysContext = createContext(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function IposPaysProvider({ children }) {
  const [sdkReady, setSdkReady] = useState(false);

  console.log("sdkReady:", sdkReady);

  const [data, setData] = useState({
    ccnumber: "", // id="ccnumber" — required by Freedom to Design SDK
    ccexpiry: "", // id="ccexpiry" — required by Freedom to Design SDK
    cccvv: "", // id="cccvv"    — required by Freedom to Design SDK
    cardHolderName: "",
    focused: "",
    formErrors: {},
  });

  const [validations, setValidations] = useState({
    cardNumberLength: 16,
    cvvLength: 3,
    validCardLengths: [],
  });

  // Load Freedom to Design SDK once on mount.
  // The security_key is the ecommerce security token from the iPOSpays
  // merchant portal — different from VITE_IPOSPAYS_API_KEY.
  useEffect(() => {
    if (document.getElementById("ftd-sdk")) {
      setSdkReady(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "ftd-sdk";
    script.src = import.meta.env.PROD
      ? "https://payment.ipospays.com/ftd/v1/freedomtodesign.js"
      : "https://payment.ipospays.tech/ftd/v1/freedomtodesign.js";
    script.setAttribute(
      "security_key",
      import.meta.env.VITE_IPOSPAYS_SECURITY_TOKEN || "",
    );
    script.defer = true;
    script.onload = () => setSdkReady(true);
    script.onerror = () =>
      console.error("IposPays: Failed to load Freedom to Design SDK");

    document.head.appendChild(script);
  }, []);

  // Update card length / CVV length constraints when card number changes.
  useEffect(() => {
    if (!data.ccnumber) return;
    const result = cardValidator.number(data.ccnumber);
    if (result?.card) {
      const { code, lengths } = result.card;
      setValidations({
        cardNumberLength: lengths[lengths.length - 1],
        cvvLength: code.size,
        validCardLengths: lengths,
      });
    }
  }, [data.ccnumber]);

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------

  const handleChange = ({ name, value }) => {
    setData((prev) => ({
      ...prev,
      [name]: value,
      focused: name,
      formErrors: { ...prev.formErrors, [name]: "" },
    }));
  };

  const resetCard = () => {
    setData({
      ccnumber: "",
      ccexpiry: "",
      cccvv: "",
      cardHolderName: "",
      focused: "",
      formErrors: {},
    });
  };

  // -------------------------------------------------------------------------
  // Tokenize — validate form, then call FTD SDK's postData()
  // Returns the single-use paymentTokenId to send to your backend.
  // Backend exchanges it for a reusable chdToken via ipospaysService.tokenizeCard()
  // -------------------------------------------------------------------------

  const getPaymentTokenId = async () => {
    const { validCardLengths, cvvLength } = validations;
    const { ccnumber, ccexpiry, cccvv, cardHolderName } = data;

    if (!validCardLengths.includes(ccnumber.length)) {
      setData((prev) => ({
        ...prev,
        formErrors: {
          ...prev.formErrors,
          ccnumber: "Please provide a valid card number.",
        },
      }));
      throw new Error("Please provide a valid card number.");
    }

    if (cccvv.length !== cvvLength) {
      setData((prev) => ({
        ...prev,
        formErrors: {
          ...prev.formErrors,
          cccvv: "Please provide a valid CVV.",
        },
      }));
      throw new Error("Please provide a valid CVV.");
    }

    if (!cardHolderName.trim()) {
      setData((prev) => ({
        ...prev,
        formErrors: {
          ...prev.formErrors,
          cardHolderName: "Please provide cardholder name.",
        },
      }));
      throw new Error("Please provide cardholder name.");
    }

    if (!sdkReady || typeof window.postData !== "function") {
      throw new Error("Payment SDK is not ready. Please try again.");
    }

    // postData() is injected globally by freedomtodesign.js.
    // It reads values from inputs with id="ccnumber", id="ccexpiry", id="cccvv".
    const result = await window.postData();
    console.log("iPOSpays FTD response==>", result);

    if (!result?.payment_token_id) {
      throw new Error(
        "Failed to tokenize card. Please check your card details.",
      );
    }

    return result.payment_token_id;
  };

  // -------------------------------------------------------------------------
  // CardInput — same shape as useCreditCard's CardInput
  // Field names map directly to required FTD SDK input IDs
  // -------------------------------------------------------------------------

  const CardInput = () => (
    <div className="c-col-12 c-grid">
      <div className="c-col-8 c-grid my-auto">
        {/* name="ccnumber" sets id="ccnumber" on the underlying <input> */}
        <CustomInput
          name="ccnumber"
          label="Card Number"
          data={data}
          onChange={handleChange}
          keyfilter="pnum"
          maxLength={validations.cardNumberLength}
          col={6}
        />
        {/* name="ccexpiry" sets id="ccexpiry" on the underlying <input> */}
        <CustomInputMask
          name="ccexpiry"
          label="Expiry Date"
          mask="99/99"
          data={data}
          onChange={handleChange}
          col={6}
          placeholder="mm/yy"
        />
        {/* name="cccvv" sets id="cccvv" on the underlying <input> */}
        <CustomInput
          name="cccvv"
          label="CVV"
          data={data}
          onChange={handleChange}
          keyfilter="pnum"
          maxLength={validations.cvvLength}
          col={6}
        />
        <CustomInput
          name="cardHolderName"
          data={data}
          onChange={handleChange}
          col={6}
        />
      </div>
      <div className="c-col-4">
        <Cards
          number={data.ccnumber.replace(/\D/g, "")}
          expiry={data.ccexpiry}
          cvc={data.cccvv}
          name={data.cardHolderName}
          focused={data.focused}
        />
      </div>
    </div>
  );

  // -------------------------------------------------------------------------

  return (
    <IposPaysContext.Provider
      value={{
        sdkReady,
        data,
        handleChange,
        validations,
        CardInput,
        getPaymentTokenId,
        resetCard,
      }}
    >
      {children}
    </IposPaysContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useIposPays() {
  const ctx = useContext(IposPaysContext);
  if (!ctx) {
    throw new Error("useIposPays must be used inside <IposPaysProvider>");
  }
  return ctx;
}
