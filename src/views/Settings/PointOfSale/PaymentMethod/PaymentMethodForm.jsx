import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomInput from "@inputs/CustomInput";
import CustomTextArea from "@inputs/CustomTextArea";
import CustomCheckbox from "@inputs/CustomCheckbox";
import CustomDropdown from "@shared/inputs/CustomDropdown";

import formValidation, { showFormErrors } from "@formValidations";
import {
  getPaymentMethod,
  addOrUpdatePaymentMethod,
} from "@store/settings/pointOfSale/paymentMethodActions";

function PaymentMethodForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    code: "",
    count: true,
    income: true,
    allowMultiple: true,
    allowChange: true,
    requireMember: true,
    allowNegativeDrawerAmount: true,
    defaultReceiptCopies: 0,
    signatureOnReceipt: true,
    hideInPos: true,
    isActive: true,
  });

  useEffect(() => {
    if (id) {
      dispatch(
        getPaymentMethod(id, setLoading, (res) => {
          setData({
            title: res.title || "",
            description: res.description || "",
            code: res.code || "",
            count: res.count,
            income: res.income,
            allowMultiple: res.allowMultiple,
            allowChange: res.allowChange,
            requireMember: res.requireMember,
            allowNegativeDrawerAmount: res.allowNegativeDrawerAmount,
            defaultReceiptCopies: res.defaultReceiptCopies,
            signatureOnReceipt: res.signatureOnReceipt,
            hideInPos: res.hideInPos,
            isActive: res.isActive,
          });
        })
      );
    }
  }, [id]);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      dispatch(
        addOrUpdatePaymentMethod(
          id,
          data,
          setLoading,
          (success, formErrors) => {
            if (success) {
              navigate(-1);
            } else {
              setData((prev) => ({ ...prev, formErrors }));
            }
          }
        )
      );
    }
  };

  return (
    <FormPageLayout
      backText="Payment Method"
      onSubmit={handleSubmit}
      submitLoading={loading}
    >
      <CustomCard title="Payment Method">
        <CustomInput
          data={data}
          onChange={handleChange}
          name="title"
          required
        />

        <CustomInput data={data} onChange={handleChange} name="code" />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="count"
          booleanOptions
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="income"
          booleanOptions
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="allowMultiple"
          booleanOptions
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="allowChange"
          booleanOptions
        />

        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="requireMember"
          booleanOptions
        />

        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="allowNegativeDrawerAmount"
          booleanOptions
        />
        <CustomInput
          data={data}
          onChange={handleChange}
          name="defaultReceiptCopies"
          keyfilter="int"
          required
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="signatureOnReceipt"
          booleanOptions
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="hideInPos"
          booleanOptions
        />

        <CustomTextArea
          data={data}
          onChange={handleChange}
          name="description"
        />

        <CustomCheckbox
          data={data}
          onChange={handleChange}
          name="isActive"
          label="Active"
          col={12}
        />
      </CustomCard>
    </FormPageLayout>
  );
}
export default React.memo(PaymentMethodForm);
