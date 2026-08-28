import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useServerTime } from "../../../../hooks/useServerTime";

import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomInput from "@inputs/CustomInput";
import CustomTextArea from "@inputs/CustomTextArea";
import CustomCheckbox from "@inputs/CustomCheckbox";
import CustomDropdown from "@inputs/CustomDropdown";
import CustomCalendarInput from "@inputs/CustomCalendarInput";
import CustomNumberInput from "@inputs/CustomNumberInput";
import formValidation, { showFormErrors } from "@formValidations";
import {
  getAgreementCategory,
  addOrUpdateAgreementCategory,
} from "@store/settings/agreementSetup/agreementCategoryActions";
import { PromotionTypes } from "@utils/dropdownConstants";
import { formatDateForCalendar } from "@utils/common";
import {
  addOrUpdateAgreementPromotion,
  getAgreementPromotion,
} from "@store/settings/agreementSetup/agreementPromotionActions";

function AgreementPromotionForm() {
  const { getServerDate } = useServerTime();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    code: "",
    membershipPlan: null,
    startDate: getServerDate(),
    endDate: getServerDate(),
    usage: 0,
    promotionType: null,
    amount: 0,
    description: "",
    isActive: true,
  });

  useEffect(() => {
    if (id) {
      dispatch(
        getAgreementPromotion(id, setLoading, (res) => {
          setData({
            title: res.title || "",
            description: res.description || "",
            membershipPlan: res.membershipPlan,
            code: res.code || [],
            isActive: res.isActive,
            startDate: res.startDate ? new Date(res.startDate) : getServerDate(),
            endDate: res.endDate ? new Date(res.endDate) : getServerDate(),
            usage: res.usage || [],
            promotionType: res.promotionType,
            amount: res.amount,
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
        addOrUpdateAgreementPromotion(
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
      backText="Agreement Promotion"
      onSubmit={handleSubmit}
      submitLoading={loading}
    >
      <CustomCard title="Agreement Promotion">
        <CustomInput
          data={data}
          onChange={handleChange}
          name="title"
          required
        />

        <CustomInput data={data} onChange={handleChange} name="code" />
        <CustomDropdown
          data={data}
          name="membershipPlan"
          onChange={handleChange}
          optionsType={"membershipTypes"}
        />
        <CustomCalendarInput
          data={{ ...data, startDate: formatDateForCalendar(data.startDate) }}
          onChange={({ value }) =>
            handleChange({ name: "startDate", value: new Date(value) })
          }
          name="startDate"
          dateString
        />

        <CustomCalendarInput
          data={{ ...data, endDate: formatDateForCalendar(data.endDate) }}
          minDate={data.startDate}
          onChange={({ value }) =>
            handleChange({ name: "endDate", value: new Date(value) })
          }
          name="endDate"
          dateString
        />

        <CustomNumberInput name="usage" data={data} onChange={handleChange} />
        <CustomDropdown
          name="promotionType"
          onChange={handleChange}
          options={PromotionTypes}
          data={data}
        />

        <CustomNumberInput name="amount" data={data} onChange={handleChange} />

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
export default React.memo(AgreementPromotionForm);
