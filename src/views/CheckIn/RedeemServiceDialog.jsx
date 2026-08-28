import React, { useEffect, useMemo, useState } from "react";
import CustomForm from "@inputs/CustomForm";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomNumberInput from "@inputs/CustomNumberInput";
import CustomPassword from "@inputs/CustomPassword";
import formValidation, { showFormErrors } from "@formValidations";
import { useDispatch } from "react-redux";
import { redeemService } from "../../store/member/memberServiceRedeemActions";
import { getDate } from "../../utils/dateTime";

export default function RedeemServiceDialog({
  visible,
  onHide,
  selectedService,
}) {
  const dispatch = useDispatch();
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [data, setData] = useState({
    quantity: 1,
    accessCode: "",
  });

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);

    if (name === "quantity" && selectedService?.remainingQuantity != null) {
      if (Number(value) > Number(selectedService?.remainingQuantity)) {
        formErrors = {
          ...formErrors,
          quantity: `Quantity should be less than or equal to ${selectedService.remainingQuantity}`,
        };
      } else {
        if (formErrors?.quantity) delete formErrors.quantity;
      }
    }

    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleHide = () => {
    onHide();
    setData({
      quantity: 1,
      accessCode: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      accessCode: data?.accessCode,
      quantity: 1,
      type: "CHECK_IN",
    };

    if (showFormErrors(data, setData, ["quantity"])) {
      dispatch(
        redeemService(
          selectedService?._id,
          payload,
          setRedeemLoading,
          (success, res) => {
            if (success) {
              onHide(selectedService?._id, res?.quantity);
              setData({
                quantity: 1,
                accessCode: "",
              });
            } else {
              setData((prev) => ({
                ...prev,
                formErrors: {
                  ...prev.formErrors,
                  accessCode: res?.accessCode,
                },
              }));
            }
          },
        ),
      );
    }
  };
  return (
    <div>
      <CustomDialog title="Redeem Service" visible={visible} onHide={onHide}>
        {selectedService?.expiryDate && (
          <div className="mb-3 text-sm">
            <span className="font-semibold">Expiry Date: </span>
            <span>{getDate(selectedService.expiryDate)}</span>
          </div>
        )}
        <CustomForm
          onSubmit={handleSubmit}
          submitLabel={"Redeem"}
          submitLoading={redeemLoading}
          onCancel={() => {
            handleHide();
          }}
        >
          <CustomPassword
            data={data}
            onChange={handleChange}
            name="accessCode"
            required
            col={12}
          />
        </CustomForm>
      </CustomDialog>
    </div>
  );
}
