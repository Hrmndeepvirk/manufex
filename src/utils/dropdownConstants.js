const ReasonCodeTypes = [
  { title: "Waive Tax", _id: "WAIVE_TAX" },
  { title: "Void", _id: "VOID" },
  { title: "No Sale", _id: "NO_SALE" },

  { title: "Agreement Hold", _id: "AGREEMENT_HOLD" },
  { title: "Freeze Agreement", _id: "FREEZE_AGREEMENT" },
  { title: "Cancel Agreement", _id: "CANCEL_AGREEMENT" },
  { title: "Cancel Price", _id: "CANCEL_PRICE" },
  {
    title: "Cancel Pending POS Transaction",
    _id: "CANCEL_PENDING_POS_TRANSACTION",
  },
  { title: "Event Status", _id: "EVENT_STATUS" },
  { title: "Commission Override", _id: "COMMISSION_OVERRIDE" },
  { title: "Drawer Adjustment", _id: "DRAWER_ADJUSTMENT" },
];
const TimeZones = [
  { title: "America/New_York (Eastern Time)", _id: "America/New_York" },
  { title: "America/Chicago (Central Time)", _id: "America/Chicago" },
  { title: "America/Denver (Mountain Time)", _id: "America/Denver" },
  { title: "America/Los_Angeles (Pacific Time)", _id: "America/Los_Angeles" },
  { title: "America/Anchorage (Alaska Time)", _id: "America/Anchorage" },
  { title: "Pacific/Honolulu (Hawaii Time)", _id: "Pacific/Honolulu" },
];
const TaxRateTypeDropdown = [
  { title: "State", _id: "STATE" },
  { title: "District", _id: "DISTRICT" },
  { title: "City", _id: "CITY" },

  { title: "Country", _id: "COUNTRY" },
  { title: "Federal", _id: "FEDERAL" },
  { title: "Other", _id: "OTHER" },
];
const BlockedReasonOptions = [
  { _id: "BREAK", title: "Break" },
  { _id: "LUNCH", title: "Lunch" },
  { _id: "PERSONAL", title: "Personal" },
  { _id: "WORKOUT", title: "Workout" },
  { _id: "MEETING", title: "Meeting" },
  { _id: "OTHER", title: "Other" },
];
const LevelTypes = [
  { title: "Class", _id: "CLASS" },
  { title: "Appointment", _id: "APPOINTMENT" },
];

const LeadPriorityTypes = [
  { title: "High", _id: "HIGH" },
  { title: "Medium", _id: "MEDIUM" },
  { title: "Low", _id: "LOW" },
  { title: "Urgent", _id: "URGENT" },
];

const AccessedFeeTypes = [
  { title: "Annual Fee", _id: "ANNUAL_FEE" },
  { title: "Late Fee", _id: "LATE_FEE" },
  { title: "Decline Fee", _id: "DECLINE_FEE" },
  { title: "No Show Fee", _id: "NO_SHOW_FEE" },
  { title: "Freeze Fee", _id: "FREEZE_FEE" },
  { title: "Cancellation Fee", _id: "CANCELLATION_FEE" },
];

const payTypes = [
  { title: "Incremental Pay", _id: "INCREMENTAL_PAY" },
  { title: "Pay Per Class", _id: "PAY_PER_CLASS" },
  { title: "Pay Per Client", _id: "PAY_PER_CLIENT" },
  { title: "% Rate", _id: "PERCENTAGE_RATE" },
];

const substitutionOptionsPriority = [
  { title: "Suggested", _id: "SUGGESTED" },
  { title: "High", _id: "HIGH" },
  { title: "Medium", _id: "MEDIUM" },
  { title: "Low", _id: "LOW" },
];

const DeclineDaysOptions = [
  {
    title: "Immediately",
    _id: 0,
  },
];
const ColorPresets = [
  {
    _id: "default",
    title: "Default",
    colors: {
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
    },
  },
  {
    _id: "royal_cyan",
    title: "Royal Cyan",
    colors: {
      colorPrimaryBase: "#1ca0b9",
      colorPrimaryText: "#ffffff",
      colorTextPrimary: "#1f2937",
      colorTextSecondary: "#4b5563",
      colorHighlightBg: "#f9fafb",
      colorHighlightText: "#1d6d7f",
      colorBgDefault: "#ffffff",
      colorBgMuted: "#f9fafb",
      colorBgCard: "#f9fafb",
      colorBgTopbar: "#ffffff",
      colorBorderDefault: "#e5e7eb",
    },
  },
  {
    _id: "modern_blue",
    title: "Modern Blue",
    colors: {
      colorPrimaryBase: "#1e3a8a",
      colorPrimaryText: "#ffffff",
      colorTextPrimary: "#1f2937",
      colorTextSecondary: "#4b5563",
      colorHighlightBg: "#eaf4fc",
      colorHighlightText: "#1e3a8a",
      colorBgDefault: "#ffffff",
      colorBgMuted: "#f3f4f6",
      colorBgCard: "#eaf4fc",
      colorBgTopbar: "#f9fafb",
      colorBorderDefault: "#d1d5db",
    },
  },
  {
    _id: "elegant_gray",
    title: "Elegant Gray",
    colors: {
      colorPrimaryBase: "#374151",
      colorPrimaryText: "#ffffff",
      colorTextPrimary: "#111827",
      colorTextSecondary: "#6b7280",
      colorHighlightBg: "#f3f4f6",
      colorHighlightText: "#374151",
      colorBgDefault: "#ffffff",
      colorBgMuted: "#f9fafb",
      colorBgCard: "#e5e7eb",
      colorBgTopbar: "#f3f4f6",
      colorBorderDefault: "#d1d5db",
    },
  },
  {
    _id: "vibrant_teal",
    title: "Vibrant Teal",
    colors: {
      colorPrimaryBase: "#0d9488",
      colorPrimaryText: "#ffffff",
      colorTextPrimary: "#1f2937",
      colorTextSecondary: "#4b5563",
      colorHighlightBg: "#ccfbf1",
      colorHighlightText: "#0f766e",
      colorBgDefault: "#ffffff",
      colorBgMuted: "#f0fdfa",
      colorBgCard: "#ecfeff",
      colorBgTopbar: "#f9fafb",
      colorBorderDefault: "#d1d5db",
    },
  },
  {
    _id: "royal_purple",
    title: "Royal Purple",
    colors: {
      colorPrimaryBase: "#6d28d9",
      colorPrimaryText: "#ffffff",
      colorTextPrimary: "#1f2937",
      colorTextSecondary: "#4b5563",
      colorHighlightBg: "#ede9fe",
      colorHighlightText: "#5b21b6",
      colorBgDefault: "#ffffff",
      colorBgMuted: "#f8fafc",
      colorBgCard: "#f3e8ff",
      colorBgTopbar: "#f9fafb",
      colorBorderDefault: "#e2e8f0",
    },
  },
  {
    _id: "modern_mustard",
    title: "Modern Mustard",
    colors: {
      colorPrimaryBase: "#d97706", // Mustard gold base
      colorPrimaryText: "#ffffff", // Text on mustard background
      colorTextPrimary: "#1f2937", // Main text color (dark gray)
      colorTextSecondary: "#4b5563", // Subtle text color
      colorHighlightBg: "#fef3c7", // Soft yellow highlight background
      colorHighlightText: "#92400e", // Brownish text for contrast
      colorBgDefault: "#ffffff", // Default white background
      colorBgMuted: "#f9fafb", // Light gray section background
      colorBgCard: "#fff7ed", // Light cream card color
      colorBgTopbar: "#ffffff", // Pale yellow topbar
      colorBorderDefault: "#e2e8f0", // Subtle gray border
    },
  },
  {
    _id: "crimson_edge",
    title: "Crimson Edge",
    colors: {
      colorPrimaryBase: "#b91c1c", // Deep modern crimson red
      colorPrimaryText: "#ffffff", // White text for contrast
      colorTextPrimary: "#1f2937", // Dark gray for main text
      colorTextSecondary: "#4b5563", // Subtle muted text
      colorHighlightBg: "#fcf6f6", // Soft rose background for highlights
      colorHighlightText: "#7f1d1d", // Dark red highlight text
      colorBgDefault: "#ffffff", // Clean white background
      colorBgMuted: "#f9fafb", // Light gray section background
      colorBgCard: "#fcf6f6", // Gentle rose-tinted card background
      colorBgTopbar: "#ffffff", // Light rose topbar
      colorBorderDefault: "#e5e7eb", // Neutral gray border
    },
  },
  {
    _id: "dark_mode",
    title: "Dark Mode",
    colors: {
      colorPrimaryBase: "#222831", // Deep charcoal — brand base
      colorPrimaryText: "#DFD0B8", // Soft beige text on primary
      colorTextPrimary: "#DFD0B8", // Light beige for primary text
      colorTextSecondary: "#948979", // Muted warm gray for secondary text
      colorHighlightBg: "#393E46", // Subtle darker highlight (cards, hover)
      colorHighlightText: "#DFD0B8", // Warm beige text for highlighted areas
      colorBgDefault: "#222831", // Base background (dark)
      colorBgMuted: "#2f343a", // Slightly lighter muted section
      colorBgCard: "#393E46", // Card background
      colorBgTopbar: "#2b3036", // Topbar background
      colorBorderDefault: "#555b63", // Subtle, low-contrast border
    },
  },
  {
    _id: "valence_theme",
    title: "Valence Theme",
    colors: {
      colorPrimaryBase: "#00F5D4",
      colorPrimaryText: "#2B2D42",

      colorTextPrimary: "#2B2D42",
      colorTextSecondary: "#4A4A4A",

      colorHighlightBg: "#E0E0E0",
      colorHighlightText: "#2B2D42",

      colorBgDefault: "#FFFFFF",
      colorBgMuted: "#F8F9FA",
      colorBgCard: "#FFFFFF",

      colorBgTopbar: "#00F5D4",

      colorBorderDefault: "#E0E0E0",
    },
  }
];
const SupportedFonts = [
  { title: "Manrope (Default)", _id: '"Manrope", sans-serif' },
  { title: "Inter", _id: '"Inter", sans-serif' },
  { title: "Roboto", _id: '"Roboto", sans-serif' },
  { title: "Montserrat", _id: '"Montserrat", sans-serif' },
  { title: "Open Sans", _id: '"Open Sans", sans-serif' },
  { title: "Lato", _id: '"Lato", sans-serif' },
  { title: "Poppins", _id: '"Poppins", sans-serif' },
  { title: "Nunito", _id: '"Nunito", sans-serif' },
  { title: "Source Sans Pro", _id: '"Source Sans Pro", sans-serif' },
  { title: "Work Sans", _id: '"Work Sans", sans-serif' },
  { title: "DM Sans", _id: '"DM Sans", sans-serif' },
  { title: "Raleway", _id: '"Raleway", sans-serif' },
];

const preferedDueDay = [
  { title: "Specific Date", _id: "SPECIFIC_DATE" },
  { title: "Number of Days from Begin Date", _id: "DAYS_FROM_BEGIN_DATE" },
];

const AmountUnits = [
  { title: "$", _id: "FIXED" },
  { title: "%", _id: "PERCENT" },
];
const DiscountUsedIn = [
  { title: "POS Only", _id: "POS" },
  { title: "Agreement Only", _id: "AGREEMENT" },
  { title: "Both POS and Agreement", _id: "POS_AGREEMENTS" },
];

const billingTypeOptions = [
  { title: "One Time Service", _id: false },
  { title: "Recurring", _id: true },
];
const WeekDays = [
  { title: "Sunday", _id: "SUNDAY" },
  { title: "Monday", _id: "MONDAY" },
  { title: "Tuesday", _id: "TUESDAY" },
  { title: "Wednesday", _id: "WEDNESDAY" },
  { title: "Thursday", _id: "THURSDAY" },
  { title: "Friday", _id: "FRIDAY" },
  { title: "Saturday", _id: "SATURDAY" },
];
const CatalogItemTypes = [
  { title: "Product", _id: "PRODUCT" },
  { title: "Service", _id: "SERVICE" },
  { title: "Pre Pay", _id: "PRE_PAY" },
];
const CatalogItemSoldTypes = [
  { title: "POS Only", _id: "POS" },
  { title: "Agreement Only", _id: "AGREEMENTS" },
  { title: "POS & Agreement", _id: "POS_AGREEMENTS" },
  { title: "Non-Sale Item", _id: "NON_SALE_ITEM" },
];
const TimeIntervalTypes = [
  { title: "Days", _id: "DAYS" },
  { title: "Weeks", _id: "WEEKS" },
  { title: "Months", _id: "MONTHS" },
  { title: "Years", _id: "YEARS" },
];
const IntervalPerUnitTypes = [
  { title: "Day", _id: "DAY" },
  { title: "Week", _id: "WEEK" },
  { title: "Month", _id: "MONTH" },
  { title: "Year", _id: "YEAR" },
];

const AgreementTypeIntervals = [
  { title: "Day", _id: "DAY" },
  { title: "Weeks", _id: "WEEK" },
  { title: "Months", _id: "MONTH" },
  { title: "Years", _id: "YEAR" },
];

const ClassMeetTypes = [
  { title: "One Time", _id: "ONE_TIME" },
  { title: "Weekly", _id: "WEEKLY" },
  { title: "Biweekly", _id: "BIWEEKLY" },
  { title: "Monthly", _id: "MONTHLY" },
  { title: "Custom", _id: "CUSTOM" },
];

const CatalogProductTypes = [
  { title: "General", _id: "GENERAL" },
  { title: "Donation", _id: "DONATION" },
];
const CatalogItemStartsTypes = [
  { title: "Upon Purchase", _id: "UPON_PURCHASE" },
  { title: "Upon Next Visit", _id: "UPON_NEXT_VISIT" },
  { title: "Upon First Use", _id: "UPON_FIRST_USE" },
];

const WhenWillClientsBeCharged = [
  { title: "On the Sale Date", _id: "ON_SALE_DATE" },
  { title: "1st of the month", _id: "1ST_OF_MONTH" },
  { title: "15th of the month", _id: "15TH_OF_MONTH" },
  { title: "1st of 15th of the month", _id: "1ST_OR_15TH_OF_MONTH" },
  { title: "Last day of the month", _id: "LAST_OF_MONTH" },
  { title: "Specific Date", _id: "SPECIFIC_DATE" },
];

const SpecialRestrictionTypes = [
  { title: "By Age", _id: "BY_AGE" },
  { title: "By Location", _id: "BY_LOCATION" },
  { title: "By Days", _id: "BY_DAYS" },
];

const MaximumDaysAllowedPerTypes = [
  { title: "Week", _id: "BY_AGE" },
  { title: "Month", _id: "MONTH" },
];

const AutoPayOptionsTypes = [
  { title: "On a set schedule", _id: "ON_SET_SCHEDULE" },
  {
    title: "When the pricing options runs out",
    _id: "ON_PRICING_OPTIONS_RUN_OUT",
  },
];

const EventOccurancesTypes = [
  { title: "Days", _id: "DAYS" },
  { title: "Weeks", _id: "WEEKS" },
  { title: "Hours", _id: "HOURS" },
  { title: "Minutes", _id: "MINUTES" },
];

const howOftenClientsWillBeChargedOptions = [
  { title: "Recurring Until Cancelled", _id: "UNTIL_CANCEL" },
  {
    title: "Set number of autopays",
    _id: "NO_OF_AUTOPAYS",
  },
];

const whatHappensAfterAutopayPaymentsTypes = [
  { title: "Contract Expires", _id: "CONTRACT_EXPIRES" },
  {
    title: "Contract automatically renews after autopay completed",
    _id: "CONTRACT_RENEWS",
  },
];
const PromotionTypes = [
  { title: "Percentage(%) off Payment", _id: "PERCENTAGE_OFF_PAYMENT" },
  { title: "Fixed($) off Payment", _id: "FIXED_OFF_PAYMENT" },
  { title: "Free Months", _id: "FREE_MONTHS" },
  { title: "Double Refferal", _id: "DOUBLE_REFFERAL" },
];

const UnitPricingTypes = [];
for (let i = 1; i <= 100; i++) {
  const option = {
    title: i,
    _id: i,
  };
  UnitPricingTypes.push(option);
}

const eventTypes = [
  { title: "Class", _id: "CLASS" },
  {
    title: "Appointment",
    _id: "APPOINTMENT",
  },
];

const daysOptions = [];
for (let i = 1; i <= 90; i++) {
  const option = {
    title: `${i} days`,
    _id: i,
  };
  daysOptions.push(option);
}
const monthDaysOptions = [];
for (let i = 1; i <= 31; i++) {
  const option = {
    title: `${i}`,
    _id: i,
  };
  monthDaysOptions.push(option);
}
const maximumWaitListTypes = [];
for (let i = 1; i <= 50; i++) {
  const option = {
    title: `${i}`,
    _id: i,
  };
  maximumWaitListTypes.push(option);
}
const availabilityDurationsOptions = [
  { title: "15 minutes", _id: 15 },
  { title: "30 minutes", _id: 30 },
  { title: "60 minutes", _id: 60 },
];
const calendarEventStatusOptions = [
  { title: "Pending", _id: "PENDING" },
  { title: "Cancel No Charge", _id: "CANCEL_NO_CHARGE" },
  { title: "Cancel Charge", _id: "CANCEL_CHARGE" },
  { title: "Completed", _id: "COMPLETED" },
];

const durationOptions = [];
for (let i = 15; i <= 180; i += 5) {
  const option = {
    title: `${i} minutes`,
    _id: i,
  };
  durationOptions.push(option);
}
const eventCommissionTypes = [
  { title: "Per Event", _id: "PER_EVENT" },
  {
    title: "Per Person",
    _id: "PER_PERSON",
  },
  { title: "None", _id: "NONE" },
];
const waitListExpirationTimeTypes = [
  { title: "Hours", _id: "HOURS" },
  { title: "Minutes", _id: "MINUTES" },
];
const waitListExpirationTypes = [
  {
    title: "Event Start",
    _id: "EVENT_START",
  },
  { title: "Event End", _id: "EVENT_END" },
  {
    title: "None",
    _id: "NONE",
  },
];

const calendarDisplayTypes = [
  { title: "Duration", _id: "DURATION" },
  { title: "Level", _id: "LEVEL" },
  { title: "Location", _id: "LOCATION" },
  { title: "Member Name", _id: "MEMBER_NAME" },
  { title: "Event", _id: "EVENT" },
  { title: "Employee Name", _id: "EMPLOYEE_NAME" },
  { title: "Enrolled Max Attendance", _id: "ENROLLED_MAX_ATTENDANCE" },
  { title: "None", _id: "NONE" },
];

const popupDisplayTypes = [
  { title: "Duration", _id: "DURATION" },
  { title: "Status", _id: "STATUS" },
  { title: "Level", _id: "LEVEL" },
  { title: "Location", _id: "LOCATION" },
  { title: "Member Name", _id: "MEMBER_NAME" },
  { title: "Event", _id: "EVENT" },
  { title: "Employee Name", _id: "EMPLOYEE_NAME" },
  { title: "Enrolled Max Attendance", _id: "ENROLLED_MAX_ATTENDANCE" },
  { title: "None", _id: "NONE" },
];

const PointsEarningTypes = [
  { title: "Birthday", _id: "BIRTHDAY" },
  { title: "Referral", _id: "REFERRAL" },
  { title: "Membership Renew", _id: "MEMBERSHIP_RENEW" },
  { title: "Membership Signup", _id: "MEMBERSHIP_SIGNUP" },
  { title: "POS Purchase", _id: "POS_PURCHASE" },
  { title: "Event", _id: "EVENT" },
];

const Currencies = [
  { _id: "USD", code: "USD", title: "USD ($)", symbol: "$", locale: "en-US" },
  // { _id: "AUD", code: "AUD", title: "AUD (A$)", symbol: "A$", locale: "en-US" },
  // { _id: "CAD", code: "CAD", title: "CAD (C$)", symbol: "C$", locale: "en-US" },
  // { _id: "EUR", code: "EUR", title: "EUR (€)", symbol: "€", locale: "de-DE" },
  // { _id: "GBP", code: "GBP", title: "GBP (£)", symbol: "£", locale: "en-US" },
  // { _id: "JPY", code: "JPY", title: "JPY (¥)", symbol: "¥", locale: "jp-JP" },
  // { _id: "INR", code: "INR", title: "INR (₹)", symbol: "₹", locale: "en-IN" },
];

const PosEarningFilterTypes = [
  { title: "Profit Centers", _id: "PROFIT_CENTERS" },
  { title: "Catalog Items", _id: "CATALOG_ITEMS" },
];

const PointsTriggerOnTypes = [
  { title: "1st Instance", _id: "1ST_INSTANCE" },
  { title: "Every Instance", _id: "EVERY_INSTANCE" },
  { title: "Specific Instance", _id: "SPECIFIC_INSTANCE" },
  { title: "After Consecutive Instances", _id: "AFTER_CONSECUTIVE_INSTANCES" },
];
const FreezeReasonOptions = [
  { _id: "ILLNESS", title: "Illness" },
  { _id: "INJURY", title: "Injury" },
  { _id: "OUT_OF_AREA", title: "Out of Area" },
  { _id: "PREGNANCY", title: "Pregnancy" },
  { _id: "SCHOOL", title: "School" },
];

const FreezeTypeOptions = [
  { _id: "BILLING", title: "Billing" },
  { _id: "TIME", title: "Time" },
  { _id: "PRORATE", title: "Prorate" },
];

const FreezeDurationOptions = [
  { _id: "FIXED", title: "Fixed" },
  { _id: "INDEFINITE", title: "Indefinite" },
];

const CancelReasonOptions = [
  { _id: "RELOCATION", title: "Relocation" },
  { _id: "FINANCIAL", title: "Financial" },
  { _id: "DISSATISFIED", title: "Dissatisfied" },
  { _id: "MEDICAL", title: "Medical" },
  { _id: "OTHER", title: "Other" },
];

const NumberPaymentsOptions = Array.from({ length: 12 }, (_, i) => ({
  _id: i + 1,
  title: `${i + 1}`,
}));

const GroupPlanDiscountTypes = [
  { title: "Flat Discount", _id: "FLAT" },
  { title: "Percentage Discount", _id: "PERCENTAGE" },
  { title: "Tiered Discount", _id: "TIERED" },
];

const GroupPlanTierTypes = [
  { title: "Flat", _id: "FLAT" },
  { title: "Percentage", _id: "PERCENTAGE" },
];

const RewardItemCanBeRedeemedTypes = [
  { title: "One Time", _id: "ONE_TIME" },
  { title: "Multiple Times", _id: "MULTIPLE_TIMES" },
  { title: "Unlimited", _id: "UNLIMITED" },
];

const AllowPastBookingsOptions = [
  { title: "Disabled", _id: "DISABLED" },
  { title: "Fully Enabled", _id: "FULLY_ENABLED" },
  { title: "Enabled with warning", _id: "ENABLED_WITH_WARNING" },
];

const AllowOffHoursBookingsOptions = [
  { title: "Hide and Disable", _id: "HIDE_AND_DISABLE" },
  { title: "Disabled", _id: "DISABLED" },
  { title: "Fully Enabled", _id: "FULLY_ENABLED" },
  { title: "Enabled with warning", _id: "ENABLED_WITH_WARNING" },
];

const GenderTypes = [
  { title: "Male", _id: "MALE" },
  { title: "Female", _id: "FEMALE" },
  { title: "Other", _id: "OTHER" },
];

const RequiredToCreateOptions = [
  { title: "Employee", _id: "employee" },
  { title: "Location", _id: "location" },
  { title: "Member", _id: "member" },
];

const RequiredToCompleteOptions = [
  { title: "Employee", _id: "employee" },
  { title: "Location", _id: "location" },
  { title: "Member", _id: "member" },
  { title: "Member Verification", _id: "memberVerification" },
  { title: "Employee Verification", _id: "employeeVerification" },
];

function timeOptionsPerHalfHourInterval() {
  const options = [];
  for (let h = 0; h < 24; h += 1) {
    const hour12 = h % 12 || 12;
    const suffix = h < 12 ? "AM" : "PM";
    const value = `${String(h).padStart(2, "0")}:00`;
    options.push({ value, label: `${hour12}:00 ${suffix}` });
    const half = `${String(h).padStart(2, "0")}:30`;
    options.push({ value: half, label: `${hour12}:30 ${suffix}` });
  }
  return options;
}

const InventoryCategoryIcons = [


  { title: "Default", _id: "bi bi-grid" },
  { title: "Gym Duffle Bag", _id: "bi bi-bag" },
  { title: "Gift Items", _id: "bi bi-gift" },
  { title: "Apparel & Clothing", _id: "bi bi-bag-check" },
  { title: "Accessories", _id: "bi bi-bag-plus" },

  // Food & Drinks
  { title: "Food & Meals", _id: "bi bi-egg-fried" },
  { title: "Food 2", _id: "bi bi-fork-knife" }, // custom
  { title: "Beverages", _id: "bi bi-cup-straw" },
  { title: "Coffee & Hot Drinks", _id: "bi bi-cup-hot" },
  { title: "Snacks & Bars", _id: "bi bi-basket2" },

  // Fitness Services
  { title: "Personal Training", _id: "bi bi-person-badge" },
  { title: "Trainer Sessions", _id: "bi bi-person-workspace" },
  { title: "Online Coaching", _id: "bi bi-person-video" },
  { title: "Group Classes", _id: "bi bi-people" },
  { title: "Class Schedule", _id: "bi bi-calendar-event" },

  // Health / Wellness
  { title: "Wellness & Spa", _id: "bi bi-flower1" },
  { title: "Heart & Fitness", _id: "bi bi-heart-pulse" },
  { title: "Supplements", _id: "bi bi-capsule" },
  { title: "Protein & Nutrition", _id: "bi bi-capsule-pill" },

  // Equipment / Gear
  { title: "Gym Equipment", _id: "bi bi-box-seam" },
  { title: "Tools & Accessories", _id: "bi bi-tools" },
  { title: "Stopwatch / Time", _id: "bi bi-stopwatch" },
  { title: "Time History", _id: "bi bi-clock-history" },

  // Payments / Billing
  { title: "Credit Card Payments", _id: "bi bi-credit-card-2-front" },
  { title: "Wallet / Credits", _id: "bi bi-wallet2" },
  { title: "Cash Payments", _id: "bi bi-cash-stack" },
  { title: "Offers & Tags", _id: "bi bi-tags" },
  { title: "Receipts", _id: "bi bi-receipt-cutoff" },

  // Membership / Management
  { title: "Membership Plans", _id: "bi bi-card-checklist" },
  { title: "Bookings", _id: "bi bi-calendar-check" },
  { title: "Notifications", _id: "bi bi-bell" },
];

const QuickViewIcons = [
  { title: "Default", _id: "bi bi-grid" },
  { title: "Calendar", _id: "pi pi-calendar" },

  // Bags / Gifts / Apparel

  { title: "Gift Items", _id: "bi bi-gift" },

  // Food & Drinks
  { title: "Food & Meals", _id: "bi bi-egg-fried" },

  // Fitness Services
  { title: "Personal Training", _id: "bi bi-person-badge" },
  { title: "Trainer Sessions", _id: "bi bi-person-workspace" },
  { title: "Online Coaching", _id: "bi bi-person-video" },
  { title: "Group Classes", _id: "bi bi-people" },
  { title: "Class Schedule", _id: "bi bi-calendar-event" },

  // Health / Wellness
  { title: "Wellness & Spa", _id: "bi bi-flower1" },
  { title: "Heart & Fitness", _id: "bi bi-heart-pulse" },
  { title: "Supplements", _id: "bi bi-capsule" },
  { title: "Protein & Nutrition", _id: "bi bi-capsule-pill" },

  // Equipment / Gear
  { title: "Gym Equipment", _id: "bi bi-box-seam" },
  { title: "Tools & Accessories", _id: "bi bi-tools" },
  { title: "Stopwatch / Time", _id: "bi bi-stopwatch" },
  { title: "Time History", _id: "bi bi-clock-history" },

  // Payments / Billing
  { title: "Credit Card Payments", _id: "bi bi-credit-card-2-front" },
  { title: "Wallet / Credits", _id: "bi bi-wallet2" },
  { title: "Cash Payments", _id: "bi bi-cash-stack" },
  { title: "Offers & Tags", _id: "bi bi-tags" },
  { title: "Receipts", _id: "bi bi-receipt-cutoff" },

  // Membership / Management
  { title: "Membership Plans", _id: "bi bi-card-checklist" },
  { title: "Bookings", _id: "bi bi-calendar-check" },
  { title: "Notifications", _id: "bi bi-bell" },
];

const TaskTypes = [
  { title: "General", _id: "GENERAL" },
  { title: "Call", _id: "CALL" },
  { title: "Email", _id: "EMAIL" },
  { title: "Follow-up", _id: "FOLLOW_UP" },
  { title: "Urgent", _id: "URGENT" },
];
const ColorTypes = [
  { title: "Red", _id: "#E60606" },
  { title: "Blue", _id: "#06CBE6" },
  { title: "Green", _id: "#20B03C" },
  { title: "Yellow", _id: "#FFC348" },
  { title: "Orange", _id: "#FE7135" },
  { title: "Purple", _id: "#6C45BE" },
];

const ProductTypes = [
  { title: "GENERAL", _id: "GENERAL" },
  { title: "DONATION", _id: "DONATION" },
];

const appointmentPayPriorityTypes = [
  { title: "Per Event", _id: "PER_EVENT" },
  { title: "Person", _id: "PERSON" },
];

const employeeBonusTypes = [
  { title: "Single Client", _id: "SINGLE_CLIENT" },
  { title: "Service Value", _id: "SERVICE_VALUE" },
];

const employeeAppointmentBonusTimeFrameTypes = [
  { title: "Days", _id: "DAYS" },
  { title: "Weeks", _id: "WEEKS" },
  { title: "Months", _id: "MONTHS" },
  { title: "Years", _id: "YEARS" },
];

const salesCommissionOptions = [
  { title: "Per Item", _id: "PER_ITEM" },
  { title: "Per Sale", _id: "PER_SALE" },
];

const ResourceAccessibilityOptions = [
  { _id: "SHOW_IN_CHECKIN", title: "Check-In Only" },
  { _id: "EVENT_BOOKING", title: "Event Booking Only" },
  { _id: "CHECKIN_EVENT_BOTH", title: "Both (Check-In & Events)" },
];

export {
  AllowPastBookingsOptions,
  salesCommissionOptions,
  employeeBonusTypes,
  employeeAppointmentBonusTimeFrameTypes,
  appointmentPayPriorityTypes,
  AllowOffHoursBookingsOptions,
  calendarDisplayTypes,
  monthDaysOptions,
  popupDisplayTypes,
  payTypes,
  ReasonCodeTypes,
  TaxRateTypeDropdown,
  waitListExpirationTimeTypes,
  LevelTypes,
  eventCommissionTypes,
  TimeZones,
  waitListExpirationTypes,
  ClassMeetTypes,
  ColorPresets,
  SupportedFonts,
  DeclineDaysOptions,
  LeadPriorityTypes,
  PromotionTypes,
  whatHappensAfterAutopayPaymentsTypes,
  daysOptions,
  maximumWaitListTypes,
  durationOptions,
  AmountUnits,
  AutoPayOptionsTypes,
  howOftenClientsWillBeChargedOptions,
  CatalogItemTypes,
  AccessedFeeTypes,
  WhenWillClientsBeCharged,
  DiscountUsedIn,
  availabilityDurationsOptions,
  WeekDays,
  eventTypes,
  preferedDueDay,
  substitutionOptionsPriority,
  SpecialRestrictionTypes,
  CatalogItemSoldTypes,
  MaximumDaysAllowedPerTypes,
  TimeIntervalTypes,
  IntervalPerUnitTypes,
  EventOccurancesTypes,
  AgreementTypeIntervals,
  billingTypeOptions,
  CatalogProductTypes,
  CatalogItemStartsTypes,
  UnitPricingTypes,
  PointsEarningTypes,
  Currencies,
  PointsTriggerOnTypes,
  PosEarningFilterTypes,
  GroupPlanDiscountTypes,
  GroupPlanTierTypes,
  RewardItemCanBeRedeemedTypes,
  GenderTypes,
  RequiredToCreateOptions,
  RequiredToCompleteOptions,
  InventoryCategoryIcons,
  TaskTypes,
  ColorTypes,
  ProductTypes,
  timeOptionsPerHalfHourInterval,
  QuickViewIcons,
  calendarEventStatusOptions,
  BlockedReasonOptions,
  FreezeReasonOptions,
  FreezeTypeOptions,
  FreezeDurationOptions,
  CancelReasonOptions,
  NumberPaymentsOptions,
  ResourceAccessibilityOptions,
};

export default {
  AllowPastBookingsOptions,
  employeeAppointmentBonusTimeFrameTypes,
  AllowOffHoursBookingsOptions,
  ReasonCodeTypes,
  monthDaysOptions,
  calendarDisplayTypes,
  employeeBonusTypes,
  payTypes,
  EventOccurancesTypes,
  eventTypes,
  maximumWaitListTypes,
  waitListExpirationTimeTypes,
  TaxRateTypeDropdown,
  ClassMeetTypes,
  availabilityDurationsOptions,
  LevelTypes,
  billingTypeOptions,
  popupDisplayTypes,
  eventCommissionTypes,
  salesCommissionOptions,
  appointmentPayPriorityTypes,
  TimeZones,
  whatHappensAfterAutopayPaymentsTypes,
  ColorPresets,
  LeadPriorityTypes,
  durationOptions,
  WhenWillClientsBeCharged,
  SupportedFonts,
  substitutionOptionsPriority,
  DeclineDaysOptions,
  waitListExpirationTypes,
  AccessedFeeTypes,
  AgreementTypeIntervals,
  howOftenClientsWillBeChargedOptions,
  preferedDueDay,
  PromotionTypes,
  AmountUnits,
  DiscountUsedIn,
  CatalogItemTypes,
  SpecialRestrictionTypes,
  AutoPayOptionsTypes,
  MaximumDaysAllowedPerTypes,
  WeekDays,
  daysOptions,
  CatalogItemSoldTypes,
  TimeIntervalTypes,
  BlockedReasonOptions,
  IntervalPerUnitTypes,
  CatalogProductTypes,
  CatalogItemStartsTypes,
  UnitPricingTypes,
  PointsEarningTypes,
  Currencies,
  PointsTriggerOnTypes,
  PosEarningFilterTypes,
  GroupPlanDiscountTypes,
  GroupPlanTierTypes,
  RewardItemCanBeRedeemedTypes,
  GenderTypes,
  RequiredToCreateOptions,
  RequiredToCompleteOptions,
  InventoryCategoryIcons,
  TaskTypes,
  ColorTypes,
  ProductTypes,
  QuickViewIcons,
  calendarEventStatusOptions,
  timeOptionsPerHalfHourInterval,
  FreezeReasonOptions,
  FreezeTypeOptions,
  FreezeDurationOptions,
  CancelReasonOptions,
  NumberPaymentsOptions,
  ResourceAccessibilityOptions,
};
