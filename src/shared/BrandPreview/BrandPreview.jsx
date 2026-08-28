import React from "react";

const ColorBox = ({ label, color }) => (
  <div className="flex flex-column align-items-center justify-content-center border-round-md border-1 surface-border p-3 w-10rem">
    <div
      className="border-circle border-1 surface-border"
      style={{ backgroundColor: color, width: "2.5rem", height: "2.5rem" }}
    ></div>
    <span className="mt-2 text-sm text-color-primary">{label}</span>
    <small className="text-xs mt-1 text-secondary">{color}</small>
  </div>
);

const Section = ({ title, children }) => (
  <div className="">
    <div className="text-sm font-semibold text-color-primary mb-2">{title}</div>
    {children}
  </div>
);
const LogoBox = ({ label, src }) => (
  <div className="flex flex-column align-items-center justify-content-center border-round-md border-1 surface-border p-3 w-12rem h-10rem">
    {src ? (
      <img
        src={src}
        alt={label}
        className="max-w-full max-h-6rem"
        style={{ objectFit: "contain" }}
      />
    ) : (
      <div className="flex align-items-center justify-content-center w-full h-6rem border-2 border-dashed surface-border text-500 text-sm">
        No Logo
      </div>
    )}
    <span className="mt-2 text-sm text-color-primary">{label}</span>
  </div>
);

const BrandPreview = ({ data }) => {
  const { logo, theme } = data || {};
  const { colors, typography } = theme || {};

  return (
    <div className="bg-white flex border-round-lg shadow-1 c-col-12 p-4 flex-wrap gap-4">
      <div className="w-full">
        <Section title="Logos">
          <div className="flex flex-wrap gap-3">
            <LogoBox label="Primary Logo" src={logo?.primary} />
            <LogoBox label="Square Logo" src={logo?.square} />
            <LogoBox label="Horizontal Logo" src={logo?.horizontal} />
            <LogoBox label="Vector Logo" src={logo?.vector} />
            <LogoBox label="Placeholder" src={logo?.placeholder} />
          </div>
        </Section>
      </div>

      {/* Primary */}
      <Section title="Primary Colors">
        <div className="grid">
          <div className="col-fixed">
            <ColorBox label="Base" color={colors?.primary?.base} />
          </div>
          <div className="col-fixed">
            <ColorBox
              label="Text on Primary"
              color={colors?.primary?.textOnPrimary}
            />
          </div>
        </div>
      </Section>

      {/* Text */}
      <Section title="Text Colors">
        <div className="grid">
          <div className="col-fixed">
            <ColorBox label="Primary Text" color={colors?.text?.primary} />
          </div>
          <div className="col-fixed">
            <ColorBox label="Secondary Text" color={colors?.text?.secondary} />
          </div>
        </div>
      </Section>

      {/* Highlight */}
      <Section title="Highlight Colors">
        <div className="grid">
          <div className="col-fixed">
            <ColorBox
              label="Highlight BG"
              color={colors?.highlight?.background}
            />
          </div>
          <div className="col-fixed">
            <ColorBox label="Highlight Text" color={colors?.highlight?.text} />
          </div>
        </div>
      </Section>

      {/* Background */}
      <Section title="Background Colors">
        <div className="grid">
          <div className="col-fixed">
            <ColorBox label="Default" color={colors?.background?.default} />
          </div>
          <div className="col-fixed">
            <ColorBox label="Muted" color={colors?.background?.muted} />
          </div>
          <div className="col-fixed">
            <ColorBox label="Card" color={colors?.background?.card} />
          </div>
          <div className="col-fixed">
            <ColorBox label="Topbar" color={colors?.background?.topbar} />
          </div>
        </div>
      </Section>

      {/* Border */}
      <Section title="Border Color">
        <div className="grid">
          <div className="col-fixed">
            <ColorBox label="Default" color={colors?.border?.default} />
          </div>
        </div>
      </Section>

      {/* Typography */}
      <Section title="Typography">
        <div
          className="border-round-md border-1 surface-border surface-ground p-3"
          style={{ fontFamily: typography?.fontFamily }}
        >
          <div className="text-lg font-semibold mb-3">
            Font Family:{" "}
            <span className="font-normal">{typography?.fontFamily}</span>
          </div>
          <div className="text-base mt-1">
            The quick brown fox jumps over the lazy dog.
          </div>
        </div>
      </Section>
    </div>
  );
};

export default BrandPreview;
