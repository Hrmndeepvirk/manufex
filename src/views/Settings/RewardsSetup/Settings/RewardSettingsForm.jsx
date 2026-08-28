import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomNumberInput from "../../../../shared/inputs/CustomNumberInput";

import formValidation, { showFormErrors } from "@formValidations";
import { applyThemeToRoot } from "../../../../utils/theme";
import CustomCurrencyInput from "../../../../shared/inputs/CustomCurrencyInput";
import CustomDropdown from "../../../../shared/inputs/CustomDropdown";
import { updateRewardsSettings } from "../../../../store/settings/rewards/settingsActions";

function RewardSettingsForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings.rewards.settings);

  useEffect(() => {
    if (settings) {
      setData({
        currencySpent: settings?.pointsPerCurrencySpent?.currency || 0,
        pointsEarned: settings?.pointsPerCurrencySpent?.points || 0,
        notifyOnEarn: settings?.notifyOnEarn || false,
        pointsSpent: settings?.currencyPerPoint?.points || 0,
        currencyValue: settings?.currencyPerPoint?.currency || 0,
        notifyOnSpend: settings?.notifyOnSpend || false,
      });
    }
  }, [dispatch, settings]);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    currencySpent: 0,
    pointsEarned: 0,
    notifyOnEarn: false,

    pointsSpent: 0,
    currencyValue: 0,
    notifyOnSpend: false,
  });

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      let formattedData = {
        pointsPerCurrencySpent: {
          currency: data.currencySpent,
          points: data.pointsEarned,
        },
        notifyOnEarn: data.notifyOnEarn,
        currencyPerPoint: {
          points: data.pointsSpent,
          currency: data.currencyValue,
        },
        notifyOnSpend: data.notifyOnSpend,
      };
      dispatch(
        updateRewardsSettings(
          formattedData,
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
      backText="Reward Settings"
      onSubmit={handleSubmit}
      submitLoading={loading}
      submitLabel="Update"
    >
      <CustomCard title="Points Earning Rules" size={12}>
        <CustomCurrencyInput
          data={data}
          onChange={handleChange}
          name="currencySpent"
        />
        <CustomNumberInput
          data={data}
          onChange={handleChange}
          name="pointsEarned"
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="notifyOnEarn"
          booleanOptions
        />
      </CustomCard>
      <CustomCard title="Points Spending Rules" size={12}>
        <CustomNumberInput
          data={data}
          onChange={handleChange}
          name="pointsSpent"
        />
        <CustomCurrencyInput
          data={data}
          onChange={handleChange}
          name="currencyValue"
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="notifyOnSpend"
          booleanOptions
        />
      </CustomCard>
    </FormPageLayout>
  );
}
export default React.memo(RewardSettingsForm);
