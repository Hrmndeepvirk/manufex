import { useEffect, useState } from "react";
import cardValidator from "card-validator";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

import CustomInput from "@inputs/CustomInput";
import CustomInputMask from "@inputs/CustomInputMask";

export default function useIPosPays() {
  const [sdkReady, setSdkReady] = useState(false);

  const [data, setData] = useState({
    ccnumber: "",
    ccexpiry: "",
    cccvv: "",
    cardHolderName: "",
    focused: "",
    formErrors: {},
  });

  const [validations, setValidations] = useState({
    cardNumberLength: 16,
    cvvLength: 3,
    validCardLengths: [],
  });

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
      import.meta.env.VITE_IPOSPAYS_SECURITY_TOKEN || ""
    );
    script.defer = true;
    script.onload = () => setSdkReady(true);
    script.onerror = () =>
      console.error("IposPays: Failed to load Freedom to Design SDK");
    document.head.appendChild(script);
  }, []);

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

  const getPaymentTokenId = async () => {
    const { validCardLengths, cvvLength } = validations;
    const { ccnumber, cccvv, cardHolderName } = data;

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
        formErrors: { ...prev.formErrors, cccvv: "Please provide a valid CVV." },
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

    const result = await window.postData();
    console.log("iPOSpays FTD response==>", result);

    if (!result?.payment_token_id) {
      throw new Error("Failed to tokenize card. Please check your card details.");
    }

    return result.payment_token_id;
  };

  const CardInput = () => (
    <div className="c-col-12 c-grid">
      <div className="c-col-8 c-grid my-auto">
        <CustomInput
          name="ccnumber"
          label="Card Number"
          data={data}
          onChange={handleChange}
          keyfilter="pnum"
          maxLength={validations.cardNumberLength}
          col={6}
        />
        <CustomInputMask
          name="ccexpiry"
          label="Expiry Date"
          mask="99/99"
          data={data}
          onChange={handleChange}
          col={6}
          placeholder="mm/yy"
        />
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

  return {
    sdkReady,
    data,
    handleChange,
    validations,
    CardInput,
    getPaymentTokenId,
    resetCard,
  };
}
