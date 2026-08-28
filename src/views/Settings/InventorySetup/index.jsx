import CustomTabView from "@shared/tabView/CustomTabView";
import Catalog from "./Catalog";
import CommissionGroup from "./CommissionGroup";
import ProfitCenter from "./ProfitCenter";
import ReferralGroup from "./ReferralGroup";
import Vendor from "./Vendor";
import CatalogCategory from "./CatalogCategory";
import FilterSets from "./FilterSets";
import Tags from "./Tags";

export default function InventorySetup() {
  const tabs = [
    { title: "Catalog", content: <Catalog /> },
    { title: "Profit Center", content: <ProfitCenter /> },
    { title: "Categories", content: <CatalogCategory /> },
    { title: "Filter Sets", content: <FilterSets /> },
    { title: "Tags", content: <Tags /> },
    { title: "Vendors", content: <Vendor /> },
    { title: "Commission Group", content: <CommissionGroup /> },
    { title: "Referral Group", content: <ReferralGroup /> },
  ];
  return <CustomTabView tabs={tabs} />;
}
