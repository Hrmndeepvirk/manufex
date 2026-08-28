import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomInput from "@inputs/CustomInput";
import CustomPhoneInput from "@inputs/CustomPhoneInput";
import CustomNumberInput from "@inputs/CustomNumberInput";
import CustomTextArea from "@inputs/CustomTextArea";
import CustomCalendarInput from "@inputs/CustomCalendarInput";
import CustomDropdown from "@inputs/CustomDropdown";
import { getFastAddFields, verifyBarcode, verifyEmail } from "@store/member/memberActions";
import { LeadPriorityTypes } from "@utils/dropdownConstants";
import { addMember } from "../../store/member/memberActions";
import { debounce } from "@utils/common";
import {
  requiredFieldsValidation,
  showFormErrors,
} from "../../utils/formValidations";
import CustomImageInput from "../../shared/inputs/CustomImageInput";
import CustomAddress from "../../shared/inputs/CustomAddress";

export default function FastAddMember() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [requiredFields, setRequiredFields] = useState([]);
  const [data, setData] = useState({
    createType: "PROSPECT",
    email: "",
    barCode: "",
    note: "",
    firstName: "",
    lastName: "",
    MI: "",
    gender: "MALE",
    dob: "",
    image: "",
    govtId: "",
    primaryPhone: "",
    mobilePhone: "",
    workNumber: "",
    workExt: "",
    address: {},
    latitude: 30.72,
    longitude: 76.64,
    leadPriority: "",
    salesPerson: "",
    campaign: "",
    issuedOn: "",
    tourOn: "",
    startOn: "",
    beginOn: "",
    uniqueBarCode: false,
  });

  useEffect(() => {
    dispatch(
      getFastAddFields((res) => {
        let _requiredFields = res.fastAddRequiredFields || [];
        setRequiredFields(_requiredFields);
      })
    );
  }, [dispatch]);

  const debouncedVerifyBarcode = useRef(
    debounce((barCode) => {
      if (barCode) {
        dispatch(
          verifyBarcode(barCode, (formErrors) => {
            if (formErrors) {
              setData((prev) => ({ ...prev, formErrors: { ...prev.formErrors, ...formErrors } }));
            }
          })
        );
      }
    })
  ).current;

  const debouncedVerifyEmail = useRef(
    debounce((email) => {
      if (email) {
        dispatch(
          verifyEmail(email, (formErrors) => {
            if (formErrors) {
              setData((prev) => ({ ...prev, formErrors: { ...prev.formErrors, ...formErrors } }));
            }
          })
        );
      }
    })
  ).current;

  const handleChange = ({ name, value }) => {
    let formErrors = requiredFieldsValidation(
      name,
      value,
      data,
      requiredFields
    );
    setData((prev) => ({ ...prev, [name]: value, formErrors }));

    if (name === "barCode") {
      debouncedVerifyBarcode(value);
    }
    if (name === "email") {
      debouncedVerifyEmail(value);
    }
  };

  const handleSubmit = (e) => {
    if (showFormErrors(data, setData, [], requiredFields)) {
      dispatch(
        addMember(data, setLoading, (success, formErrors) => {
          if (success) {
            navigate("/members");
          } else {
            setData((prev) => ({ ...prev, formErrors }));
          }
        })
      );
    }
  };

  const isRequired = (name) => requiredFields.includes(name);

  return (
    <>
      <FormPageLayout onSubmit={handleSubmit} submitLoading={loading}>
        <CustomCard title="Membership">
          <CustomImageInput
            name="image"
            data={data}
            onChange={handleChange}
            required={isRequired("image")}
          />
          <CustomInput
            data={data}
            onChange={handleChange}
            name="barCode"
            required={isRequired("barCode")}
            useGrouping={false}
          />

          <CustomTextArea
            data={data}
            onChange={handleChange}
            name="note"
            required={isRequired("note")}
          />
        </CustomCard>
        <CustomCard title="Personal">
          <CustomInput
            data={data}
            onChange={handleChange}
            name="firstName"
            required={isRequired("firstName")}
          />
          <CustomInput
            data={data}
            onChange={handleChange}
            name="MI"
            required={isRequired("MI")}
          />
          <CustomInput
            data={data}
            onChange={handleChange}
            name="lastName"
            required={isRequired("lastName")}
          />
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="gender"
            required={isRequired("gender")}
            optionsType={"GenderTypes"}
          />
          <CustomCalendarInput
            data={data}
            onChange={handleChange}
            name="dob"
            dateString
            required={isRequired("dob")}
          />

          <CustomInput
            data={data}
            onChange={handleChange}
            name="govtId"
            required={isRequired("govtId")}
          />
          <CustomInput
            data={data}
            onChange={handleChange}
            name="email"
            required={isRequired("email")}
          />
          <CustomPhoneInput
            data={data}
            onChange={handleChange}
            name="primaryPhone"
            required={isRequired("primaryPhone")}
          />
          <CustomPhoneInput
            data={data}
            onChange={handleChange}
            name="mobilePhone"
            required={isRequired("mobilePhone")}
          />
          <CustomPhoneInput
            data={data}
            onChange={handleChange}
            name="workNumber"
            required={isRequired("workNumber")}
          />
          <CustomInput
            data={data}
            onChange={handleChange}
            name="workExt"
            required={isRequired("workExt")}
          />
        </CustomCard>
        <CustomCard title="Address">
          <CustomAddress
            data={data}
            onChange={handleChange}
            name="address"
            required={isRequired("address")}
            col={12}
          />
        </CustomCard>
        <CustomCard title="Sale">
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="leadPriority"
            required={isRequired("leadPriority")}
            options={LeadPriorityTypes}
          />

          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="salesPerson"
            required={isRequired("salesPerson")}
            optionsType="employees"
          />
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="campaign"
            optionsType="campaigns"
            required={isRequired("campaign")}
          />
        </CustomCard>
        <CustomCard title="Date">
          <CustomCalendarInput
            data={data}
            onChange={handleChange}
            name="issuedOn"
            dateString
            required={isRequired("issuedOn")}
          />
          <CustomCalendarInput
            data={data}
            onChange={handleChange}
            name="tourOn"
            dateString
            required={isRequired("tourOn")}
          />
          <CustomCalendarInput
            data={data}
            onChange={handleChange}
            name="firstVisit"
            dateString
            required={isRequired("firstVisit")}
          />
          <CustomCalendarInput
            data={data}
            onChange={handleChange}
            name="beginOn"
            dateString
            required={isRequired("beginOn")}
          />
        </CustomCard>
      </FormPageLayout>
    </>
  );
}
