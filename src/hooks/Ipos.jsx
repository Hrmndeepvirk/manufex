import React, { useEffect, useState } from "react";

const Ipos = () => {
  const [sdkReady, setSdkReady] = useState(false);
  const title = "iPosPays Payment Form";

  useEffect(() => {
    if (document.getElementById("ftd-sdk")) {
      setSdkReady(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "ftd-sdk";
    script.src = "https://payment.ipospays.tech/ftd/v1/freedomtodesign.js";
    script.setAttribute(
      "security_key",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cG4iOiI3Mzk5MjY3NDc5ODQiLCJlbWFpbCI6Im1pa2VAaW1wYWN0em9uZW5qLmNvbSIsIm1lcmNoYW50SWQiOiJmMTQxMjY5Mi03NDMwLTRmNGUtYmM3YS0wNzYxZjIyMzcwNWMiLCJ2ZXJzaW9uIjoidjIiLCJpYXQiOjE3Njk1NTAwNTl9.sLTBgTSZ2a0xl83IkhmWzNmn_Fbj9E_SrSufw4nRIbI",
    );
    script.defer = true;
    script.onload = () => setSdkReady(true);
    script.onerror = () =>
      console.error("IposPays: Failed to load Freedom to Design SDK");

    document.head.appendChild(script);
  }, []);

  const submitCardFunc = async (event) => {
    event.preventDefault();

    if (!sdkReady || typeof window.postData !== "function") {
      console.error("Payment SDK is not ready. Please try again.");
      return;
    }

    try {
      const response = await window.postData();
      console.log("Payment Token:", response.payment_token_id);
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  return (
    <div>
      <h1>
        {title}{" "}
        eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cG4iOiI3Mzk5MjY3NDc5ODQiLCJlbWFpbCI6Im1pa2VAaW1wYWN0em9uZW5qLmNvbSIsIm1lcmNoYW50SWQiOiJmMTQxMjY5Mi03NDMwLTRmNGUtYmM3YS0wNzYxZjIyMzcwNWMiLCJ2ZXJzaW9uIjoidjIiLCJpYXQiOjE3Njk1NTAwNTl9.sLTBgTSZ2a0xl83IkhmWzNmn_Fbj9E_SrSufw4nRIbI
      </h1>
      <form onSubmit={submitCardFunc}>
        <input id="ccnumber" placeholder="Card Number" />
        <input id="ccexpiry" placeholder="Expiry Date" />
        <input id="cccvv" placeholder="CVV" />
        <input type="submit" id="payButton" value="Pay" disabled={!sdkReady} />
      </form>
    </div>
  );
};

export default Ipos;
