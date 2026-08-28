/**
 * Central configuration for Report Rule options.
 *
 * Structure:  RULE_CONFIG[userType][ruleType] → { filters, metric, timePeriod }
 *
 * Each filter entry:
 *   { name, label, optionsType?, options?, type? }
 *     - optionsType  → Redux dropdown key  (used with CustomMultiSelect optionsType)
 *     - options      → static option array  (used with CustomMultiSelect options)
 *     - type         → "dropdown" for single select (default is multi-select)
 *     - booleanOptions → true for Yes/No dropdown
 *
 * metric:
 *   { fields: [...], operators: [...] }
 *     - fields    → available metric field options
 *     - operators → available comparison operators
 *   If metric is null the rule type does not support metric conditions.
 *
 * timePeriod:
 *   true  → rule supports time period selection
 *   false → rule does not support time period
 */

// ─── Shared option sets ────────────────────────────────────────────────

const PURCHASE_TYPE_OPTIONS = [
  { title: "Value", _id: "AMOUNT" },
  { title: "Quantity", _id: "QUANTITY" },
];

const CONDITION_OPERATORS = [
  { title: "Greater Than", _id: "GREATER_THAN" },
  { title: "Greater Than or Equal", _id: "GREATER_THAN_EQUAL" },
  { title: "Less Than", _id: "LESS_THAN" },
  { title: "Less Than or Equal", _id: "LESS_THAN_EQUAL" },
  { title: "Equal", _id: "EQUAL" },
  { title: "Between", _id: "BETWEEN" },
];

const AGREEMENT_STATUS_OPTIONS = [
  { title: "Abandoned Cart", _id: "ABANDONED" },
  { title: "Pending", _id: "PENDING" },
  { title: "Active", _id: "ACTIVE" },
  { title: "Expired", _id: "EXPIRED" },
  { title: "Canceled", _id: "CANCELED" },
];

const BILLING_STATUS_OPTIONS = [
  { title: "Good Standing", _id: "GOOD" },
  { title: "Declined", _id: "DECLINED" },
  { title: "Past Due", _id: "PAST_DUE" },
  { title: "Collection", _id: "COLLECTION" },
];

const EVENT_STATUS_OPTIONS = [
  { title: "Booked", _id: "Booked" },
  { title: "Completed", _id: "Completed" },
  { title: "Attended", _id: "Attended" },
  { title: "Cancelled Charge", _id: "Cancelled Charge" },
  { title: "Cancelled No Charge", _id: "Cancelled No Charge" },
];

const COMPLETED_NUMBER_OPTIONS = [
  { title: "1", _id: 1 },
  { title: "5", _id: 5 },
  { title: "10", _id: 10 },
];

const REWARD_EARNING_QTY_OPTIONS = [
  { title: "Total Earning Times", _id: "REWARD_TIMES" },
  { title: "Total Earning Amount", _id: "REWARD_AMOUNT" },
];

const REWARD_COMPARE_OPTIONS = [
  { title: "More Than", _id: "MORE" },
  { title: "Less Than", _id: "LESS" },
  { title: "Equal to", _id: "EQUAL" },
  { title: "Between", _id: "BETWEEN" },
];

const REWARD_REDEMPTION_TYPE_OPTIONS = [
  { title: "Reward Catalog", _id: "REWARD_CATALOG" },
  { title: "POS Cash Redemption", _id: "POS_CASH_REDEMPTION" },
  { title: "Both", _id: "BOTH" },
];

const REWARD_REDEEM_QTY_OPTIONS = [
  { title: "Redeem Times", _id: "REWARD_TIMES" },
  { title: "Total Redeem Amount", _id: "REWARD_AMOUNT" },
];

const REWARD_MODE_OPTIONS = [
  { title: "Rewards Earned", _id: "EARNED" },
  { title: "Rewards Redeemed", _id: "REDEEMED" },
];

const TASK_TYPE_OPTIONS = [
  { title: "Follow Up", _id: "FOLLOW_UP" },
  { title: "Automated", _id: "AUTOMATED" },
];

const TASK_ASSIGNED_TO_OPTIONS = [
  { title: "Department", _id: "DEPARTMENT" },
  { title: "Individual", _id: "INDIVIDUAL" },
];

const ASSIGN_MODE_OPTIONS = [
  { title: "Individually", _id: "INDIVIDUAL" },
  { title: "Group", _id: "GROUP" },
  { title: "Both", _id: "BOTH" },
];

const TASK_STATUS_OPTIONS = [
  { title: "Completed", _id: "Completed" },
  { title: "Pending", _id: "Pending" },
  { title: "Past Due", _id: "Past Due" },
];

const TASK_DATE_MODE_OPTIONS = [
  { title: "Date Range", _id: "RANGE" },
  { title: "Specific Date", _id: "SPECIFIC" },
];

const RESOURCE_STATE_OPTIONS = [
  { title: "Returned On Time", _id: "RETURNED_ON_TIME" },
  { title: "Returned Past Due", _id: "RETURNED_PAST_DUE" },
  { title: "Still Past Due", _id: "STILL_PAST_DUE" },
];

const RESOURCE_DATE_MODE_OPTIONS = [
  { title: "Date Range", _id: "RANGE" },
  { title: "Specific Date", _id: "SPECIFIC" },
];

const GENDER_OPTIONS = [
  { title: "Male", _id: "MALE" },
  { title: "Female", _id: "FEMALE" },
  { title: "Unknown", _id: "UNKNOWN" },
];

const MONTH_OPTIONS = [
  { title: "January", _id: 1 },
  { title: "February", _id: 2 },
  { title: "March", _id: 3 },
  { title: "April", _id: 4 },
  { title: "May", _id: 5 },
  { title: "June", _id: 6 },
  { title: "July", _id: 7 },
  { title: "August", _id: 8 },
  { title: "September", _id: 9 },
  { title: "October", _id: 10 },
  { title: "November", _id: 11 },
  { title: "December", _id: 12 },
];

const PROFILE_DATE_OPTIONS = [
  { title: "Before Date", _id: "BEFORE" },
  { title: "After Date", _id: "AFTER" },
  { title: "Between Dates", _id: "BETWEEN" },
  { title: "Exact Date", _id: "EXACT" },
];

const RELATIONSHIP_OPTIONS = [
  { title: "Has Referrals", _id: "HAS_REFERRALS" },
  { title: "Referred By", _id: "REFERRED_BY" },
  { title: "Shares Pricing With", _id: "SHARES_PRICING" },
  { title: "Family", _id: "FAMILY" },
  { title: "Corporation", _id: "CORPORATION" },
];

const SALES_METRIC_OPTIONS = [
  { title: "Value", _id: "AMOUNT" },
  { title: "Amount", _id: "SALES" },
];

const EMPLOYEE_TASK_TYPE_OPTIONS = [
  { title: "Follow Up", _id: "FOLLOW_UP" },
  { title: "Automated", _id: "AUTOMATED" },
  { title: "To-Do", _id: "TODO" },
];

const TODO_TYPE_OPTIONS = [
  { title: "Checklists", _id: "CHECKLISTS" },
  { title: "Reminder", _id: "REMINDER" },
  { title: "Run Report", _id: "RUN_REPORT" },
  { title: "Account Review", _id: "ACCOUNT_REVIEW" },
  { title: "Maintenance", _id: "MAINTENANCE" },
];

const FOLLOW_UP_TARGET_OPTIONS = [
  { title: "Member", _id: "MEMBER" },
  { title: "Non-Member", _id: "NON_MEMBER" },
  { title: "Both", _id: "BOTH" },
];

const EMPLOYEE_EVENT_STATUS_OPTIONS = [
  { title: "Completed", _id: "COMPLETED" },
  { title: "Pending", _id: "PENDING" },
  { title: "Attended", _id: "ATTENDED" },
  { title: "Unattended", _id: "UNATTENDED" },
];

const RESERVATION_COMPARE_OPTIONS = [
  { title: "Greater Than", _id: "GREATER" },
  { title: "Equal to", _id: "EQUAL" },
  { title: "Less Than", _id: "LESS" },
];

const EMPLOYEE_RESOURCE_DATE_MODE_OPTIONS = [
  { title: "Date Range", _id: "RANGE" },
  { title: "Specific Date", _id: "SPECIFIC" },
  { title: "All Time", _id: "ALL_TIME" },
];

const DISCOUNT_CODE_OPTIONS = [
  { title: "NEW10", _id: "NEW10" },
  { title: "SPRING20", _id: "SPRING20" },
  { title: "VIP25", _id: "VIP25" },
];

const SERVICE_QTY_FIELD_OPTIONS = [
  { title: "Total Quantity", _id: "TOTAL_QTY" },
  { title: "Used Quantity", _id: "USED_QTY" },
  { title: "Remaining Quantity", _id: "REMAINING_QTY" },
  { title: "Expires In (Days)", _id: "EXPIRES_IN_DAYS" },
];

const SERVICE_STATUS_OPTIONS = [
  { title: "Active", _id: "ACTIVE" },
  { title: "Expired", _id: "EXPIRED" },
  { title: "Fully Used", _id: "FULLY_USED" },
];

// ─── Configuration map ─────────────────────────────────────────────────

const RULE_CONFIG = {
  MEMBER: {
    PURCHASED_SERVICE: {
      filters: [
        { name: "clubs", label: "Clubs", optionsType: "clubs" },
        {
          name: "profitCenters",
          label: "Profit Centers",
          optionsType: "profitCenters",
        },
        {
          name: "services",
          label: "Services",
          optionsType: "catalogItems",
          filterField: "type",
          filterValue: "SERVICE",
        },
      ],
      metric: {
        fields: PURCHASE_TYPE_OPTIONS,
        operators: CONDITION_OPERATORS,
      },
      timePeriod: true,
    },

    PURCHASED_PRODUCT: {
      filters: [
        { name: "clubs", label: "Clubs", optionsType: "clubs" },
        {
          name: "profitCenters",
          label: "Profit Centers",
          optionsType: "profitCenters",
        },
        {
          name: "products",
          label: "Products",
          optionsType: "catalogItems",
          filterField: "type",
          filterValue: "PRODUCT",
        },
      ],
      metric: {
        fields: PURCHASE_TYPE_OPTIONS,
        operators: CONDITION_OPERATORS,
      },
      timePeriod: true,
    },

    AGREEMENT: {
      filters: [
        {
          name: "agreementCategories",
          label: "Agreement Categories",
          optionsType: "agreementCategories",
        },
        {
          name: "agreementSubCategories",
          label: "Agreement Subcategories",
          optionsType: "agreementPlans",
        },
        {
          name: "agreements",
          label: "Agreements",
          optionsType: "agreementPlans",
        },
        {
          name: "clubs",
          label: "Clubs",
          type: "dropdown",
          optionsType: "clubs",
        },
        {
          name: "status",
          label: "Status",
          type: "optionSelectMulti",
          options: AGREEMENT_STATUS_OPTIONS,
        },
        {
          name: "billingStatus",
          label: "Billing Status",
          type: "optionSelectMulti",
          options: BILLING_STATUS_OPTIONS,
        },
      ],
      metric: null,
      timePeriod: true,
    },

    EVENT: {
      filters: [
        {
          name: "eventTypes",
          label: "Event Types",
          optionsType: "eventTypes",
        },
        {
          name: "events",
          label: "Events",
          optionsType: "eventSetups",
          filterField: "eventType",
          filterByFilterKey: "eventTypes",
        },
        {
          name: "clubs",
          label: "Clubs",
          type: "dropdown",
          optionsType: "clubs",
        },
        {
          name: "uniqueInstructor",
          label: "Unique Instructor",
          type: "dropdown",
          booleanOptions: true,
        },
        { name: "instructors", label: "Instructors", optionsType: "employees" },
        {
          name: "status",
          label: "Event Status",
          type: "optionSelectMulti",
          options: EVENT_STATUS_OPTIONS,
        },
        {
          name: "completedCondition",
          label: "Completed Condition",
          type: "dropdown",
          options: CONDITION_OPERATORS,
        },
        {
          name: "completedNumber",
          label: "Completed Number",
          type: "dropdown",
          options: COMPLETED_NUMBER_OPTIONS,
        },
      ],
      metric: null,
      timePeriod: true,
    },

    REWARD: {
      filters: [
        {
          name: "rewardMode",
          label: "Reward Mode",
          type: "optionSelect",
          options: REWARD_MODE_OPTIONS,
        },
        {
          name: "earningReward",
          label: "Earning Rewards",
          optionsType: "pointsEarningRules",
          showWhen: { rewardMode: "EARNED" },
        },
        {
          name: "earningQtyType",
          label: "Quantity Type",
          type: "optionSelect",
          options: REWARD_EARNING_QTY_OPTIONS,
          showWhen: { rewardMode: "EARNED" },
        },
        {
          name: "redemptionType",
          label: "Redemption Type",
          type: "optionSelect",
          options: REWARD_REDEMPTION_TYPE_OPTIONS,
          showWhen: { rewardMode: "REDEEMED" },
        },
        {
          name: "rewardCatalogSelections",
          label: "Catalog Rewards",
          optionsType: "rewardCatalogs",
          showWhen: { rewardMode: "REDEEMED" },
        },
        {
          name: "redeemQtyType",
          label: "Quantity Type",
          type: "optionSelect",
          options: REWARD_REDEEM_QTY_OPTIONS,
          showWhen: { rewardMode: "REDEEMED" },
        },
      ],
      metric: {
        fields: null,
        operators: REWARD_COMPARE_OPTIONS,
      },
      timePeriod: false,
    },

    TASK: {
      filters: [
        {
          name: "taskType",
          label: "Task Type",
          type: "optionSelectMulti",
          options: TASK_TYPE_OPTIONS,
        },
        {
          name: "assignedToScope",
          label: "Assigned To",
          type: "optionSelectMulti",
          options: TASK_ASSIGNED_TO_OPTIONS,
        },
        {
          name: "assignedToDepartments",
          label: "Department",
          optionsType: "departments",
          showWhen: { assignedToScope: "DEPARTMENT" },
        },
        {
          name: "assignedToEmployees",
          label: "Staff",
          optionsType: "employees",
          showWhen: { assignedToScope: "INDIVIDUAL" },
        },
        {
          name: "assignMode",
          label: "Assign Mode",
          type: "optionSelect",
          options: ASSIGN_MODE_OPTIONS,
        },
        { name: "assignedBy", label: "Assigned By", optionsType: "employees" },
        {
          name: "taskStatus",
          label: "Task Status",
          type: "optionSelectMulti",
          options: TASK_STATUS_OPTIONS,
        },
        {
          name: "taskStatusDateMode",
          label: "Status Date Mode",
          type: "optionSelect",
          options: TASK_DATE_MODE_OPTIONS,
        },
        {
          name: "taskStatusStartDate",
          label: "Start Date",
          type: "calendar",
          showWhen: { taskStatusDateMode: "RANGE" },
        },
        {
          name: "taskStatusEndDate",
          label: "End Date",
          type: "calendar",
          showWhen: { taskStatusDateMode: "RANGE" },
        },
        {
          name: "taskStatusExactDate",
          label: "Exact Date",
          type: "calendar",
          showWhen: { taskStatusDateMode: "SPECIFIC" },
        },
      ],
      metric: null,
      timePeriod: false,
    },

    RESOURCE: {
      filters: [
        {
          name: "resourceTypes",
          label: "Resource Type",
          optionsType: "resourceTypes",
        },
        { name: "resources", label: "Resources", optionsType: "resources" },
        {
          name: "usedInService",
          label: "Resource Used in Service",
          type: "optionSelect",
          options: [
            { title: "Yes", _id: "YES" },
            { title: "No", _id: "NO" },
          ],
        },
        {
          name: "resourceState",
          label: "Resource Status",
          type: "optionSelectMulti",
          options: RESOURCE_STATE_OPTIONS,
        },
        {
          name: "resourceReservedDateMode",
          label: "Reserved Date Mode",
          type: "optionSelect",
          options: RESOURCE_DATE_MODE_OPTIONS,
        },
        {
          name: "resourceReservedStartDate",
          label: "Start Date",
          type: "calendar",
          showWhen: { resourceReservedDateMode: "RANGE" },
        },
        {
          name: "resourceReservedEndDate",
          label: "End Date",
          type: "calendar",
          showWhen: { resourceReservedDateMode: "RANGE" },
        },
        {
          name: "resourceReservedExactDate",
          label: "Specific Date",
          type: "calendar",
          showWhen: { resourceReservedDateMode: "SPECIFIC" },
        },
      ],
      metric: null,
      timePeriod: false,
    },

    SERVICE: {
      filters: [
        { name: "clubs", label: "Clubs", optionsType: "clubs" },
        {
          name: "profitCenters",
          label: "Profit Centers",
          optionsType: "profitCenters",
        },
        {
          name: "services",
          label: "Services",
          optionsType: "catalogItems",
          filterField: "type",
          filterValue: "SERVICE",
        },
        {
          name: "serviceStatus",
          label: "Service Status",
          type: "optionSelectMulti",
          options: SERVICE_STATUS_OPTIONS,
        },
      ],
      metric: {
        fields: SERVICE_QTY_FIELD_OPTIONS,
        operators: CONDITION_OPERATORS,
      },
      timePeriod: true,
    },

    USER_INDEX: {
      filters: [
        { name: "ageMin", label: "Age Range Min", type: "number" },
        { name: "ageMax", label: "Age Range Max", type: "number" },
        {
          name: "gender",
          label: "Gender",
          options: GENDER_OPTIONS,
        },
        {
          name: "dobMonth",
          label: "DOB Month",
          options: MONTH_OPTIONS,
        },
        {
          name: "zipCode",
          label: "Zip Codes",
          optionsType: "zipCodes",
        },
        {
          name: "campaign",
          label: "Campaign",
          optionsType: "campaigns",
        },
        {
          name: "profileDateOption",
          label: "Profile Date Option",
          type: "dropdown",
          options: PROFILE_DATE_OPTIONS,
        },
        {
          name: "profileDateStart",
          label: "Start Date",
          type: "calendar",
          showWhen: { profileDateOption: "BEFORE" },
        },
        {
          name: "profileDateAfter",
          label: "After Date",
          type: "calendar",
          showWhen: { profileDateOption: "AFTER" },
        },
        {
          name: "profileDateBetweenStart",
          label: "Start Date",
          type: "calendar",
          showWhen: { profileDateOption: "BETWEEN" },
        },
        {
          name: "profileDateBetweenEnd",
          label: "End Date",
          type: "calendar",
          showWhen: { profileDateOption: "BETWEEN" },
        },
        {
          name: "profileDateExact",
          label: "Exact Date",
          type: "calendar",
          showWhen: { profileDateOption: "EXACT" },
        },
        {
          name: "relationships",
          label: "Relationships",
          options: RELATIONSHIP_OPTIONS,
        },
      ],
      metric: null,
      timePeriod: false,
      timePeriodLabel: "Profile Created",
    },
  },

  EMPLOYEE: {
    TIMESHEET: {
      filters: [
        {
          name: "departments",
          label: "Department",
          optionsType: "departments",
        },
        { name: "employees", label: "Employee", optionsType: "employees" },
        {
          name: "sheetEdited",
          label: "Edited",
          type: "dropdown",
          booleanOptions: true,
        },
        {
          name: "includeEmployeePay",
          label: "Include Employee Pay",
          type: "dropdown",
          booleanOptions: true,
        },
      ],
      metric: {
        fields: PURCHASE_TYPE_OPTIONS,
        operators: CONDITION_OPERATORS,
      },
      timePeriod: true,
    },

    EVENT: {
      filters: [
        {
          name: "departments",
          label: "Department",
          optionsType: "departments",
        },
        { name: "employees", label: "Employee", optionsType: "employees" },
        {
          name: "uniqueMember",
          label: "Unique Member",
          type: "dropdown",
          booleanOptions: true,
        },
        {
          name: "eventTypes",
          label: "Event Type",
          optionsType: "eventTypes",
        },
        {
          name: "events",
          label: "Events",
          optionsType: "eventSetups",
          filterField: "eventType",
          filterByFilterKey: "eventTypes",
        },
        {
          name: "status",
          label: "Event Status",
          type: "optionSelectMulti",
          options: EMPLOYEE_EVENT_STATUS_OPTIONS,
        },
      ],
      metric: {
        fields: PURCHASE_TYPE_OPTIONS,
        operators: CONDITION_OPERATORS,
      },
      timePeriod: true,
    },

    COMMISSION: {
      filters: [
        {
          name: "departments",
          label: "Department",
          optionsType: "departments",
        },
        { name: "employees", label: "Employee", optionsType: "employees" },
        {
          name: "commissionGroups",
          label: "Commission Group",
          optionsType: "commissionGroups",
        },
        {
          name: "discountCodes",
          label: "Discount/Sales Code",
          type: "dropdown",
          options: DISCOUNT_CODE_OPTIONS,
        },
      ],
      metric: {
        fields: SALES_METRIC_OPTIONS,
        operators: CONDITION_OPERATORS,
      },
      timePeriod: true,
    },

    TASK: {
      filters: [
        {
          name: "taskType",
          label: "Task Type",
          type: "optionSelectMulti",
          options: EMPLOYEE_TASK_TYPE_OPTIONS,
        },
        {
          name: "todoTypes",
          label: "To-Do Type",
          options: TODO_TYPE_OPTIONS,
          showWhen: { taskType: "TODO" },
        },
        {
          name: "followUpTargets",
          label: "Follow Up Target",
          type: "optionSelectMulti",
          options: FOLLOW_UP_TARGET_OPTIONS,
          showWhen: { taskType: "FOLLOW_UP" },
        },
        {
          name: "assignedToScope",
          label: "Assigned To",
          type: "optionSelectMulti",
          options: TASK_ASSIGNED_TO_OPTIONS,
        },
        {
          name: "assignedToDepartments",
          label: "Department",
          optionsType: "departments",
          showWhen: { assignedToScope: "DEPARTMENT" },
        },
        {
          name: "assignedToEmployees",
          label: "Staff",
          optionsType: "employees",
          showWhen: { assignedToScope: "INDIVIDUAL" },
        },
        {
          name: "assignMode",
          label: "Assign Mode",
          type: "optionSelect",
          options: ASSIGN_MODE_OPTIONS,
        },
        { name: "assignedBy", label: "Assigned By", optionsType: "employees" },
        {
          name: "taskStatus",
          label: "Task Status",
          type: "optionSelectMulti",
          options: TASK_STATUS_OPTIONS,
        },
        {
          name: "taskStatusDateMode",
          label: "Status Date Mode",
          type: "optionSelect",
          options: TASK_DATE_MODE_OPTIONS,
        },
        {
          name: "taskStatusStartDate",
          label: "Start Date",
          type: "calendar",
          showWhen: { taskStatusDateMode: "RANGE" },
        },
        {
          name: "taskStatusEndDate",
          label: "End Date",
          type: "calendar",
          showWhen: { taskStatusDateMode: "RANGE" },
        },
        {
          name: "taskStatusExactDate",
          label: "Exact Date",
          type: "calendar",
          showWhen: { taskStatusDateMode: "SPECIFIC" },
        },
      ],
      metric: null,
      timePeriod: false,
    },

    RESOURCE: {
      filters: [
        {
          name: "resourceTypes",
          label: "Resource Type",
          optionsType: "resourceTypes",
        },
        { name: "resources", label: "Resources", optionsType: "resources" },
        {
          name: "usedInService",
          label: "Resource Used in Service",
          type: "optionSelect",
          options: [
            { title: "Yes", _id: "YES" },
            { title: "No", _id: "NO" },
          ],
        },
        {
          name: "reservationCompare",
          label: "Reservation Compare",
          type: "optionSelect",
          options: RESERVATION_COMPARE_OPTIONS,
        },
        {
          name: "reservationCount",
          label: "Reservation Count",
          type: "number",
        },
        {
          name: "allResourcesReserved",
          label: "All Resources Reserved",
          type: "optionSelect",
          options: [
            { title: "Yes", _id: "YES" },
            { title: "No", _id: "NO" },
          ],
        },
        {
          name: "resourceDateMode",
          label: "Time Period Mode",
          type: "optionSelect",
          options: EMPLOYEE_RESOURCE_DATE_MODE_OPTIONS,
        },
        {
          name: "resourceStartDate",
          label: "Start Date",
          type: "calendar",
          showWhen: { resourceDateMode: "RANGE" },
        },
        {
          name: "resourceEndDate",
          label: "End Date",
          type: "calendar",
          showWhen: { resourceDateMode: "RANGE" },
        },
        {
          name: "resourceExactDate",
          label: "Exact Date",
          type: "calendar",
          showWhen: { resourceDateMode: "SPECIFIC" },
        },
      ],
      metric: null,
      timePeriod: false,
    },
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────

const USER_TYPE_OPTIONS = [
  { title: "Member", _id: "MEMBER" },
  { title: "Employee", _id: "EMPLOYEE" },
];

const CONDITION_OPTIONS = [
  { title: "AND", _id: "AND" },
  { title: "OR", _id: "OR" },
];

const TIME_PERIOD_TYPE_OPTIONS = [
  { title: "All Time", _id: "ALL_TIME" },
  { title: "Date Range", _id: "DATE_RANGE" },
  { title: "Relative (Days)", _id: "RELATIVE" },
];

/**
 * Returns the array of rule-type options available for a given userType.
 */
const getRuleTypeOptions = (userType) => {
  if (!userType || !RULE_CONFIG[userType]) return [];
  return Object.keys(RULE_CONFIG[userType]).map((key) => ({
    title: key
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    _id: key,
  }));
};

/**
 * Returns the config object for a given userType + ruleType, or null.
 */
const getRuleConfig = (userType, ruleType) => {
  return RULE_CONFIG[userType]?.[ruleType] || null;
};

export {
  RULE_CONFIG,
  USER_TYPE_OPTIONS,
  CONDITION_OPTIONS,
  TIME_PERIOD_TYPE_OPTIONS,
  CONDITION_OPERATORS,
  getRuleTypeOptions,
  getRuleConfig,
};
