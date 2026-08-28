import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useResourceRequest } from "../../../../hooks/useResourceRequest";

import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomInput from "@inputs/CustomInput";
import CustomPhoneInput from "@inputs/CustomPhoneInput";
import CustomTextArea from "@inputs/CustomTextArea";
import CustomCheckbox from "@inputs/CustomCheckbox";
import formValidation, { showFormErrors } from "@formValidations";
import {
  addOrUpdateVendor,
  getVendor,
} from "../../../../store/settings/inventory/vendorsActions";

function VendorForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    alternateVendors: null,
    isActive: true,
    paymentTerms: "",
    deliveryTerms: "",
    repName: "",
    repCellPhone: "",
    notes: "",
    alternateEmail: "",

    website: "",
    loginInfo: "",
  });

  useEffect(() => {
    if (id) {
      dispatch(
        getVendor(id, setLoading, (res) => {
          setData({
            name: res.name,
            email: res.email,
            phone: res.phone,
            ext: res.ext,
            address1: res.address1,
            address2: res.address2,
            city: res.city,
            state: res.state,
            zipCode: res.zipCode,
            alternateVendors: res.alternateVendors,
            isActive: res.isActive,
            paymentTerms: res.paymentTerms,
            deliveryTerms: res.deliveryTerms,
            repName: res.repName,
            repCellPhone: res.repCellPhone,
            notes: res.notes,
            alternateEmail: res.alternateEmail,
            website: res.website,
            loginInfo: res.loginInfo,
          });
        })
      );
    }
  }, [id]);

  const ignore = ["email", "notes"];

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data, ignore);             
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData, ignore)) {
      dispatch(
        addOrUpdateVendor(id, data, setLoading, (success, formErrors) => {
          if (success) {
            navigate(-1);
          } else {
            setData((prev) => ({ ...prev, formErrors }));
          }
        })
      );
    }
  };


  const { buttons } = useResourceRequest({
    permission: "INVENTORY-TRACKING-REQUEST-EDIT-VENDORS",
    targetCollection: "VENDOR",
    id,
    data,
    setData,
  });

  return (
    <FormPageLayout
      buttons={buttons}
      backText="Vendor"
      onSubmit={handleSubmit}
      submitLoading={loading}
    >
      <CustomCard title="Vendor Details">
        <CustomInput name="name" data={data} onChange={handleChange} required />
        <CustomInput name="address1" data={data} onChange={handleChange} />
        <CustomInput name="address2" data={data} onChange={handleChange} />
        <CustomInput name="state" data={data} onChange={handleChange} />
        <CustomInput name="city" data={data} onChange={handleChange} />{" "}
        <CustomInput name="zipCode" data={data} onChange={handleChange} />
        <CustomPhoneInput name="phone" data={data} onChange={handleChange} />
        <CustomInput name="ext" data={data} onChange={handleChange} />
        <CustomInput name="email" data={data} onChange={handleChange} />
        <CustomInput
          name="alternateEmail"
          data={data}
          onChange={handleChange}
        />
        <CustomInput
          name="alternateVendors"
          data={data}
          onChange={handleChange}
        />
        <CustomInput name="paymentTerms" data={data} onChange={handleChange} />
        <CustomInput name="deliveryTerms" data={data} onChange={handleChange} />
        <CustomInput name="repName" data={data} onChange={handleChange} />
        <CustomPhoneInput name="repCellPhone" data={data} onChange={handleChange} />
        <CustomInput name="website" data={data} onChange={handleChange} />
        <CustomTextArea data={data} onChange={handleChange} name="loginInfo" />
        <CustomTextArea data={data} onChange={handleChange} name="notes" />
        <CustomCheckbox
          data={data}
          onChange={handleChange}
          name="isActive"
          label="Active"
        />
      </CustomCard>
    </FormPageLayout>
  );
}
export default React.memo(VendorForm);
