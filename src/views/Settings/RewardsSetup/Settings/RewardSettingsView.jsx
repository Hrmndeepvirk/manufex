import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DetailsPageLayout from "@shared/layout/DetailsPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomListItem from "../../../../shared/cards/CustomListItem";
import { getRewardsSettings } from "../../../../store/settings/rewards/settingsActions";
import { useCurrencyFormatter } from "../../../../hooks/useCurrencyFormatter";

function RewardSettingsView() {
  const dispatch = useDispatch();
  const { formatCurrency } = useCurrencyFormatter();
  const [loading, setLoading] = useState(false);

  const data = useSelector((state) => state.settings.rewards.settings);

  useEffect(() => {
    dispatch(getRewardsSettings(!data && setLoading));
  }, [dispatch]);

  return (
    <DetailsPageLayout
      buttonLabel="Update Settings"
      linkTo={"settings"}
      pageLoading={loading}
    >
      <CustomCard title="Points Earning Rules" size={6}>
        <CustomListItem
          data={data}
          name="pointsPerCurrencySpent"
          label="Points Per Currency Spent"
          value={`${formatCurrency(data?.pointsPerCurrencySpent?.currency)} = ${
            data?.pointsPerCurrencySpent?.points
          }points`}
        />
        <CustomListItem data={data} name="notifyOnEarn" />
      </CustomCard>
      <CustomCard title="Points Spending Rules" size={6}>
        <CustomListItem
          data={data}
          name="currencyPerPoint"
          label="Currency Per Point"
          value={`${data?.currencyPerPoint?.points}points = ${formatCurrency(
            data?.currencyPerPoint?.currency
          )}`}
        />
        <CustomListItem data={data} name="notifyOnSpend" />
      </CustomCard>
    </DetailsPageLayout>
  );
}

export default React.memo(RewardSettingsView);
