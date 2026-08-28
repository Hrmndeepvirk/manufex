import React, { useEffect, useState } from "react";
import { useAcceptJs } from "react-acceptjs";
import cardValidator from "card-validator";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

import CustomInput from "@inputs/CustomInput";
import CustomInputMask from "../shared/inputs/CustomInputMask";

const authData = {
  clientKey: import.meta.env.VITE_AUTHORIZE_CLIENT_KEY,
  apiLoginID: import.meta.env.VITE_AUTHORIZE_API_LOGIN_ID,
};

export default function useCreditCard() {
  const { dispatchData } = useAcceptJs({
    authData,
    environment: import.meta.env.VITE_AUTHORIZE_ENVIRONMENT,
  });
  const [data, setData] = useState({
    cardNumber: "",
    cvc: "",
    expiryDate: "",
    cardHolderName: "",
    focused: "",
  });
  const [validations, setValidations] = useState({
    cardNumberLength: 16,
    cvvLength: 3,
    validCardLengths: [],
  });

  const handleCreditChange = ({ name, value }) => {
    setData((prev) => ({
      ...prev,
      [name]: value,
      focused: name,
      formErrors: { ...prev.formErrors, [name]: "" },
    }));
  };

  useEffect(() => {
    if (data.cardNumber) {
      let _validation = cardValidator.number(data.cardNumber);
      if (_validation?.card) {
        let _card = _validation?.card;
        let _cvvLength = _card?.code?.size;
        let _validCardLengths = _card?.lengths;
        let _cardNumberLength = _validCardLengths[_validCardLengths.length - 1];

        setValidations((prev) => ({
          ...prev,
          cardNumberLength: _cardNumberLength,
          cvvLength: _cvvLength,
          validCardLengths: _validCardLengths,
        }));
      }
    }
  }, [data.cardNumber]);

  const handleCreditCardSubmit = async () => {
    try {
      const { validCardLengths, cvvLength } = validations;
      const { cardNumber, expiryDate, cvc, cardHolderName } = data;

      if (!validCardLengths.includes(cardNumber.length)) {
        setData((prev) => ({
          ...prev,
          formErrors: {
            ...prev.formErrors,
            cardNumber: "Please provide valid credit card number.",
          },
        }));
        throw "Please provide valid credit card number.";
        return false;
      }
      if (cvvLength !== cvc.length) {
        setData((prev) => ({
          ...prev,
          formErrors: { ...prev.formErrors, cvc: "Please provide valid code." },
        }));
        return false;
      }
      if (!cardHolderName.trim()) {
        setData((prev) => ({
          ...prev,
          formErrors: {
            ...prev.formErrors,
            cardHolderName: "Please provide card holder name.",
          },
        }));
        return false;
      }
      const cardData = {
        cardNumber,
        month: expiryDate.split("/")[0],
        year: expiryDate.split("/")[1],
        cardCode: cvc,
      };
      const response = await dispatchData({ cardData });
      console.log("CreditCard response:", response);
      return response?.opaqueData;
    } catch (error) {
      console.log("CreditCard error:", error);
      let errorString = "";
      if (error?.messages) {
        let _errors = error?.messages.message;
        let formErrors = {};
        _errors.forEach((er) => {
          if (er.text.includes("card")) {
            formErrors.cardNumber = er.text;
          } else if (er.text.toLowerCase().includes("expiration")) {
            formErrors.expiryDate = er.text;
          } else {
            errorString = er.text;
          }
        });
        setData((prev) => ({ ...prev, formErrors }));
      }

      throw errorString;
    }
  };

  const CardInput = ({
    handleCreditChange: handleChange,
    validations,
    data,
  }) => {
    return (
      <div className="c-col-12 c-grid">
        <div className="c-col-8 c-grid my-auto">
          <CustomInput
            name="cardNumber"
            data={data}
            onChange={handleChange}
            keyfilter="pnum"
            maxLength={validations.cardNumberLength}
            col={6}
          />
          <CustomInputMask
            name="expiryDate"
            mask="99/99"
            data={data}
            onChange={handleChange}
            col={6}
            placeholder="mm/yy"
          />
          <CustomInput
            label="CVV"
            name="cvc"
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
            number={data.cardNumber.replace(/\D/g, "")}
            expiry={data.expiryDate}
            cvc={data.cvc}
            name={data.cardHolderName}
            focused={data.focused}
          />
        </div>
      </div>
    );
  };

  return {
    data,
    handleCreditChange,
    validations,
    CardInput,
    handleCreditCardSubmit,
  };
}
