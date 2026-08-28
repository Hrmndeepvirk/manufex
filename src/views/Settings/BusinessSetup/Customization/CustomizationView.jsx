import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DetailsPageLayout from "@shared/layout/DetailsPageLayout";
import { getCompany } from "@store/settings/business/companyActions";
import CustomCard from "../../../../shared/cards/CustomCard";
import CustomListItem from "../../../../shared/cards/CustomListItem";
import BrandPreview from "../../../../shared/BrandPreview/BrandPreview";

function CustomizationView() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const company = useSelector((state) => state.settings.business.company);

  useEffect(() => {
    dispatch(getCompany());
  }, [dispatch]);

  let brandAssets = company?.brandAssets;

  const brandData = {
    theme: {
      colors: {
        primary: { base: "#252b42", textOnPrimary: "#ffffff" },
        text: { primary: "#525252", secondary: "#777777" },
        highlight: { background: "#f2f5fe", text: "#252b42" },
        background: {
          default: "#ffffff",
          muted: "#f9f9f9",
          card: "#f2f5fe",
          topbar: "#f9f9f9",
        },
        border: { default: "#e0e0e0" },
      },
      typography: { fontFamily: '"Manrope", sans-serif' },
    },
  };

  return (
    <DetailsPageLayout
      buttonLabel="Edit Customizations"
      linkTo={"customization"}
    >
      <CustomCard title="Customization">
        <BrandPreview data={brandAssets} />
      </CustomCard>
    </DetailsPageLayout>
  );
}

export default React.memo(CustomizationView);
