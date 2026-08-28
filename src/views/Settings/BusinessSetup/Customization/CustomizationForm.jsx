import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";

import formValidation, { showFormErrors } from "@formValidations";

import { updateCompany } from "@store/settings/business/companyActions";
import { useResourceRequest } from "../../../../hooks/useResourceRequest";
import CustomDropdown from "@shared/inputs/CustomDropdown";
import CustomColorPicker from "../../../../shared/inputs/CustomColorPicker";
import {
  ColorPresets,
  SupportedFonts,
} from "../../../../utils/dropdownConstants";
import { applyThemeToRoot } from "../../../../utils/theme";
import ImageCropperInput from "../../../../shared/inputs/ImageCropperInput";
import CustomImageInput from "../../../../shared/inputs/CustomImageInput";
import { uploadFile } from "../../../../store/common/commonActions";

function CustomizationForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const company = useSelector((state) => state.settings.business.company);

  const [loading, setLoading] = useState(false);

  const [colorPreset, setColorPreset] = useState("default");

  const [data, setData] = useState({
    logoPrimary: null,
    logoSquare: null,
    logoHorizontal: null,
    logoVector: null,
    logoPlaceholder: null,

    // Theme Colors
    colorPrimaryBase: "#252b42",
    colorPrimaryText: "#ffffff",
    colorTextPrimary: "#525252",
    colorTextSecondary: "#777777",
    colorHighlightBg: "#f2f5fe",
    colorHighlightText: "#252b42",
    colorBgDefault: "#ffffff",
    colorBgMuted: "#f9f9f9",
    colorBgCard: "#f2f5fe",
    colorBgTopbar: "#f9f9f9",
    colorBorderDefault: "#e0e0e0",

    // Typography
    fontFamily: '"Manrope", sans-serif',
  });

  let brand = company?.brandAssets;

  useEffect(() => {
    if (brand) {
      setData({
        logoPrimary: brand.logo?.primary || null,
        logoSquare: brand.logo?.square || null,
        logoHorizontal: brand.logo?.horizontal || null,
        logoVector: brand.logo?.vector || null,
        logoPlaceholder: brand.logo?.placeholder || null,

        // Theme Colors
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

        // Typography
        fontFamily:
          brand.theme?.typography?.fontFamily || '"Manrope", sans-serif',
      });
    }
  }, [brand]);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      let dataPayload = await createPayload(data);
      dispatch(
        updateCompany(
          { brandAssets: dataPayload },
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

  const onChangeColorPreset = ({ value }) => {
    let preset = ColorPresets.find((preset) => preset._id === value);
    if (preset) {
      setData((prev) => ({
        ...prev,
        ...preset.colors,
      }));
    }
    setColorPreset(value);
  };

  const { buttons: requestButtons } = useResourceRequest({
    permission: "REQUEST-BRANDING-COLORS-LOGOS",
    targetCollection: "COMPANY",
    id: company?._id,
    data,
    setData,
  });

  return (
    <FormPageLayout
      backText="Company Details"
      onSubmit={handleSubmit}
      submitLoading={loading}
      submitLabel="Save & Apply"
      buttons={[{ label: "Preview", onClick: () => applyThemeToRoot(data) }, ...requestButtons]}
    >
      <CustomCard title="Customization" size={12}>
        <CustomImageInput
          name="logoPrimary"
          label="Primary Logo"
          data={data}
          onChange={handleChange}
          col={6}
        />
        <ImageCropperInput
          name="logoSquare"
          label="Square Logo"
          data={data}
          onChange={handleChange}
          col={6}
        />
        <ImageCropperInput
          name="logoHorizontal"
          label="Horizontal Logo"
          data={data}
          onChange={handleChange}
          width={300}
          height={100}
          col={6}
        />
        <ImageCropperInput
          name="placeholderLogo"
          label="Placeholder"
          data={data}
          onChange={handleChange}
          col={6}
        />
        <CustomDropdown
          name="colorPreset"
          value={colorPreset}
          options={ColorPresets}
          onChange={onChangeColorPreset}
        />
        <CustomDropdown
          name="fontFamily"
          data={data}
          onChange={handleChange}
          options={SupportedFonts}
        />
      </CustomCard>
      <CustomCard title="Custom Colors">
        <Section title="Primary Colors">
          <CustomColorPicker
            data={data}
            onChange={handleChange}
            name="colorPrimaryBase"
            label="Base"
          />
          <CustomColorPicker
            data={data}
            onChange={handleChange}
            name="colorPrimaryText"
            label="Text on Primary"
          />
        </Section>

        {/* Text Colors */}
        <Section title="Text Colors">
          <CustomColorPicker
            data={data}
            onChange={handleChange}
            name="colorTextPrimary"
            label="Primary Text"
          />
          <CustomColorPicker
            data={data}
            onChange={handleChange}
            name="colorTextSecondary"
            label="Secondary Text"
          />
        </Section>

        {/* Highlight Colors */}
        <Section title="Highlight Colors">
          <CustomColorPicker
            data={data}
            onChange={handleChange}
            name="colorHighlightBg"
            label="Highlight BG"
          />
          <CustomColorPicker
            data={data}
            onChange={handleChange}
            name="colorHighlightText"
            label="Highlight Text"
          />
        </Section>

        {/* Background Colors */}
        <Section title="Background Colors">
          <CustomColorPicker
            data={data}
            onChange={handleChange}
            name="colorBgDefault"
            label="Default"
          />
          <CustomColorPicker
            data={data}
            onChange={handleChange}
            name="colorBgMuted"
            label="Muted"
          />
          <CustomColorPicker
            data={data}
            onChange={handleChange}
            name="colorBgCard"
            label="Card"
          />
          <CustomColorPicker
            data={data}
            onChange={handleChange}
            name="colorBgTopbar"
            label="Topbar"
          />
        </Section>

        {/* Border Color */}
        <Section title="Border Color">
          <CustomColorPicker
            data={data}
            onChange={handleChange}
            name="colorBorderDefault"
            label="Default"
          />
        </Section>
      </CustomCard>
    </FormPageLayout>
  );
}
export default React.memo(CustomizationForm);
const Section = ({ title, children }) => (
  <div className="c-col-12">
    <div className="text-color-primary mb-2">{title}</div>
    <div className="c-grid">{children}</div>
  </div>
);
const createPayload = async (data) => {
  let logoPrimary = await uploadFile(data.logoPrimary);
  let logoSquare = await uploadFile(data.logoSquare);

  return {
    logo: {
      primary: logoPrimary,
      square: logoSquare,
      horizontal: data.logoHorizontal || null,
      vector: data.logoVector || null,
      placeholder: data.logoPlaceholder || null,
    },
    theme: {
      colors: {
        primary: {
          base: data.colorPrimaryBase || "#252b42",
          textOnPrimary: data.colorPrimaryText || "#ffffff",
        },
        text: {
          primary: data.colorTextPrimary || "#525252",
          secondary: data.colorTextSecondary || "#777777",
        },
        highlight: {
          background: data.colorHighlightBg || "#f2f5fe",
          text: data.colorHighlightText || "#252b42",
        },
        background: {
          default: data.colorBgDefault || "#ffffff",
          muted: data.colorBgMuted || "#f9f9f9",
          card: data.colorBgCard || "#f2f5fe",
          topbar: data.colorBgTopbar || "#f9f9f9",
        },
        border: {
          default: data.colorBorderDefault || "#e0e0e0",
        },
      },
      typography: {
        fontFamily: data.fontFamily || '"Manrope", sans-serif',
      },
    },
  };
};
