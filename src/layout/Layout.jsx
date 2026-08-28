import { useEffect, useState } from "react";
import Topbar from "./Topbar/Topbar";
import { userProfileAction } from "@store/user/userActions";
import { useDispatch, useSelector } from "react-redux";
import RecentCheckin from "./RecentCheckIn/RecentCheckin";
import { getAllDropdownDataAction } from "../store/dropdown/dropdownActions";
import { applyThemeToRoot } from "../utils/theme";
import { getCompanyDetails } from "@store/company/companyActions";

export default function Layout({ children }) {
  const dispatch = useDispatch();
  const [, setLoading] = useState(false);
  const clubVersion = useSelector((state) => state.common.clubVersion);
  useEffect(() => {
    dispatch(userProfileAction(setLoading));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllDropdownDataAction(setLoading));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCompanyDetails(setLoading));
  }, [dispatch]);

  useEffect(() => {
    if (clubVersion > 0) {
      dispatch(userProfileAction(setLoading));
      dispatch(getAllDropdownDataAction(setLoading));
    }
  }, [clubVersion, dispatch]);

  const company = useSelector((state) => state.company.details);

  useEffect(() => {
    const savedTheme = JSON.parse(localStorage.getItem("themeColors"));
    if (savedTheme) {
      applyThemeToRoot(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (company) {
      let brand = company?.brandAssets;

      if (brand) {
        let theme = {
          colorPrimaryBase: brand.theme?.colors?.primary?.base || "#252b42",
          colorPrimaryText:
            brand.theme?.colors?.primary?.textOnPrimary || "#ffffff",
          colorTextPrimary: brand.theme?.colors?.text?.primary || "#525252",
          colorTextSecondary: brand.theme?.colors?.text?.secondary || "#777777",
          colorHighlightBg:
            brand.theme?.colors?.highlight?.background || "#f2f5fe",
          colorHighlightText: brand.theme?.colors?.highlight?.text || "#252b42",
          colorBgDefault: brand.theme?.colors?.background?.default || "#ffffff",
          colorBgMuted: brand.theme?.colors?.background?.muted || "#f9f9f9",
          colorBgCard: brand.theme?.colors?.background?.card || "#f2f5fe",
          colorBgTopbar: brand.theme?.colors?.background?.topbar || "#f9f9f9",
          colorBorderDefault: brand.theme?.colors?.border?.default || "#e0e0e0",
        };
        if (theme) {
          localStorage.setItem("themeColors", JSON.stringify(theme));
          applyThemeToRoot(theme);
        }
      }
    }
  }, [company]);

  return (
    <>
      <Topbar />
      <main className="main-content" key={clubVersion}>
        {children}
      </main>
      <RecentCheckin />
    </>
  );
}
