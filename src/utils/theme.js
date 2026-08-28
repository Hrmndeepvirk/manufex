const applyThemeToRoot = (data) => {
  if (!data) return;

  const root = document.documentElement.style;
  const set = (prop, val) => { if (val) root.setProperty(prop, val); };

  set("--primary-color", data.colorPrimaryBase);
  set("--primary-color-text", data.colorPrimaryText);
  set("--text-color-primary", data.colorTextPrimary);
  set("--text-color-secondary", data.colorTextSecondary);
  set("--highlight-bg", data.colorHighlightBg);
  set("--highlight-text-color", data.colorHighlightText);
  set("--color-bg-default", data.colorBgDefault);
  set("--color-bg-muted", data.colorBgMuted);
  set("--color-bg-card", data.colorBgCard);
  set("--topbar-color", data.colorBgTopbar);
  set("--color-border", data.colorBorderDefault);
  set("--font-family", data.fontFamily);
};

const applyBrandTheme = (brandAssets) => {
  if (!brandAssets?.theme) return;
  const { colors, typography } = brandAssets.theme;
  applyThemeToRoot({
    colorPrimaryBase: colors?.primary?.base,
    colorPrimaryText: colors?.primary?.textOnPrimary,
    colorTextPrimary: colors?.text?.primary,
    colorTextSecondary: colors?.text?.secondary,
    colorHighlightBg: colors?.highlight?.background,
    colorHighlightText: colors?.highlight?.text,
    colorBgDefault: colors?.background?.default,
    colorBgMuted: colors?.background?.muted,
    colorBgCard: colors?.background?.card,
    colorBgTopbar: colors?.background?.topbar,
    colorBorderDefault: colors?.border?.default,
    fontFamily: typography?.fontFamily,
  });
};

export { applyThemeToRoot, applyBrandTheme };
