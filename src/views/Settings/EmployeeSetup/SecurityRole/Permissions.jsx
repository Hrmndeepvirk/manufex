import React, { useMemo, useRef, useEffect } from "react";
import { allPermissions } from "@utils/permissions";
import CustomCard from "@shared/cards/CustomCard";
import CustomTree from "@shared/tree/CustomTree";
import PrimaryButton from "../../../../shared/buttons/PrimaryButton";

const all = {
  Company: {
    checked: true,
    partialChecked: false,
  },
  "ADD-COMPANY-GENERAL": {
    checked: true,
    partialChecked: false,
  },
  "ADD-COMPANY-ONLINE": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-COMPANY-GENERAL": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-COMPANY-ONLINE": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-COMPANY-GENERAL": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-COMPANY-ONLINE": {
    checked: true,
    partialChecked: false,
  },
  "Reason Code": {
    checked: true,
    partialChecked: false,
  },
  "ADD-REASON-CODE": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-REASON-CODE": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-REASON-CODE": {
    checked: true,
    partialChecked: false,
  },
  "DELETE-REASON-CODE": {
    checked: true,
    partialChecked: false,
  },
  // "Cancel Code": {
  //   checked: true,
  //   partialChecked: false,
  // },
  // "SELECT-CANCEL-CODE": {
  //   checked: true,
  //   partialChecked: false,
  // },
  // "ADD-CANCEL-CODE": {
  //   checked: true,
  //   partialChecked: false,
  // },
  Customization: {
    checked: true,
    partialChecked: false,
  },
  LOGO: {
    checked: true,
    partialChecked: false,
  },
  "THEME-COLOR": {
    checked: true,
    partialChecked: false,
  },
  Clubs: {
    checked: true,
    partialChecked: false,
  },
  "VIEW-CLUBS-INFO": {
    checked: true,
    partialChecked: false,
  },
  "Job Title": {
    checked: true,
    partialChecked: false,
  },
  "ADD-JOB-TITLE": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-JOB-TITLE": {
    checked: true,
    partialChecked: false,
  },
  "DELETE-JOB-TITLE": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-JOB-TITLE": {
    checked: true,
    partialChecked: false,
  },
  "Staff Set-up": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-ALL-STAFF-BASIC-INFORMATION": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-ALL-STAFF-PAYROLL-INFORMATION": {
    checked: true,
    partialChecked: false,
  },
  "CREATE-NEW-STAFF": {
    checked: true,
    partialChecked: false,
  },
  undefined: {
    checked: true,
    partialChecked: false,
  },
  "DELETE-STAFF_INFO": {
    checked: true,
    partialChecked: false,
  },
  "Staff Action Verification": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-EMPLOYEE-ACCESS-CODES": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-EMPLOYEE-ACCESS-CODES": {
    checked: true,
    partialChecked: false,
  },
  "Staff Payroll": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-TIMESHEETS-ALL": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-TIMESHEETS-INDIVIDUAL": {
    checked: true,
    partialChecked: false,
  },
  "TIMESHEETS-CHANGE-REQUEST-INDIVIDUAL": {
    checked: true,
    partialChecked: false,
  },
  "TIMESHEETS-CHANGE-REQUEST-ALL": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-TIMESHEETS-ALL": {
    checked: true,
    partialChecked: false,
  },
  "Staff Scheduling": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-STAFF-SHIFT-SCHEDULE": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-STAFF-SHIFT-SCHEDULE": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-STAFF-SHIFT-SCHEDULE": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-COVER-SCHEDULE-INDIVIDUAL": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-COVER-SCHEDULE-ALL": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-AVAILABILTY-INDIVIDUAL": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-AVAILABILITY-ALL": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-AVAILABILITY-ALL": {
    checked: true,
    partialChecked: false,
  },
  Departments: {
    checked: true,
    partialChecked: false,
  },
  "VIEW-DEPARTMENTS": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-DEPARTMENTS": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-DEPARTMENTS": {
    checked: true,
    partialChecked: false,
  },
  "DELETE-DEPARTMENTS": {
    checked: true,
    partialChecked: false,
  },
  "CREATE-DEPARTMENTS": {
    checked: true,
    partialChecked: false,
  },
  "Staff Security": {
    checked: true,
    partialChecked: false,
  },
  "ADD-SECURITY-ROLE": {
    checked: true,
    partialChecked: false,
  },
  "DELETE-SECURITY-ROLE": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-SECURITY-ROLES": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-SECURITY-ROLES": {
    checked: true,
    partialChecked: false,
  },
  "ADD-REPORT-SECURITY": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-REPORT-SECURITY": {
    checked: true,
    partialChecked: false,
  },
  Commission: {
    checked: true,
    partialChecked: false,
  },
  "VIEW-COMMISSION": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-COMMISSION": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-COMMISSION": {
    checked: true,
    partialChecked: false,
  },
  "DELETE-COMMISSION-GROUP": {
    checked: true,
    partialChecked: false,
  },
  "CREATE-COMMISSION-GROUP": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-COMMISSION-GROUP": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-COMMISSION-GROUP": {
    checked: true,
    partialChecked: false,
  },
  "CREATE-COMMISSION": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-MEMBERSHIP-TYPES": {
    checked: true,
    partialChecked: false,
  },
  "Request Edit Membership Types": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-DISCOUNTS": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-SERVICE-ACCESS": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-ENTRY-ACCESS": {
    checked: true,
    partialChecked: false,
  },
  "Membership types": {
    checked: true,
    partialChecked: false,
  },
  DISCOUNTS: {
    checked: true,
    partialChecked: false,
  },
  "SERVICE-ACCESS": {
    checked: true,
    partialChecked: false,
  },
  "ENTRY-ACCESS": {
    checked: true,
    partialChecked: false,
  },
  "CREATE-MEMBERSHIP-TYPES": {
    checked: true,
    partialChecked: false,
  },
  "DELETE-MEMBERSHIP-TYPES": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-FREEZE-POLICY": {
    checked: true,
    partialChecked: false,
  },
  "FREEZE-POLICY": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-FREEZE-POLICY": {
    checked: true,
    partialChecked: false,
  },
  "ADD-FREEZE-POLICY": {
    checked: true,
    partialChecked: false,
  },
  "OVERRIDE-FREEZE-POLICY": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-ALERT-TYPES": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-ALERT-TYPES": {
    checked: true,
    partialChecked: false,
  },
  "ADD-ALERT-TYPES": {
    checked: true,
    partialChecked: false,
  },
  SUGGESTION: {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-BRANDING-COLORS-LOGOS": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-BRANDING-COLORS-LOGOS": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-TAB-LAYOUTS-DEPARTMENTS": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-TAB-LAYOUTS-DEPARTMENT": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-TAB-LAYOUTS-ALL": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-TAB-LAYOUTS-ALL": {
    checked: true,
    partialChecked: false,
  },
  "POS Register": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-DRAWER-SUMMARY-CURRENT": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-DRAWER-SUMMARY-ALL": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-PAST-DRAWERS": {
    checked: true,
    partialChecked: false,
  },
  "PRINT-DRAWER-REPORTS": {
    checked: true,
    partialChecked: false,
  },
  "CLOSE-OUT-REGISTER": {
    checked: true,
    partialChecked: false,
  },
  "ADD-DROP": {
    checked: true,
    partialChecked: false,
  },
  "POS Sales": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-SALE-PRICE": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-SALE-PRICE": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-ITEM-DISCOUNT-AMOUNTS": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-ITEM-DISCOUNT-AMOUNTS": {
    checked: true,
    partialChecked: false,
  },
  "WAIVE-TAX": {
    checked: true,
    partialChecked: false,
  },
  "APPLY-DISCOUNT": {
    checked: true,
    partialChecked: false,
  },
  "APPLY-COMMISSIONS": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-DISCOUNT": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-WAIVE-TAX": {
    checked: true,
    partialChecked: false,
  },
  "VOID-SALE": {
    checked: true,
    partialChecked: false,
  },
  "POS-ACCESS": {
    checked: true,
    partialChecked: false,
  },
  "REFUND-SALE": {
    checked: true,
    partialChecked: false,
  },
  "REFUND-SALES-NO-LIMIT": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-REFUND": {
    checked: true,
    partialChecked: false,
  },
  "Catalog Access": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-PROFIT-CENTER": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-PROFIT-CENTER": {
    checked: true,
    partialChecked: false,
  },
  "ADD-PROFIT-CENTER": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-POS-ITEMS": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-POS-ITEMS": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-POS-ITEMS": {
    checked: true,
    partialChecked: false,
  },
  "CREATE-POS-ITEMS": {
    checked: true,
    partialChecked: false,
  },
  "DELETE-POS-ITEMS": {
    checked: true,
    partialChecked: false,
  },
  "CREATE-POS-CATEGORIES": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-POS-CATEGORIES": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-POS-CATEGORIES": {
    checked: true,
    partialChecked: false,
  },
  "DELETE-POS-CATEGORIES": {
    checked: true,
    partialChecked: false,
  },
  "CREATE-DISCOUNTS": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-DISCOUNTS": {
    checked: true,
    partialChecked: false,
  },
  "REQUESTS-EDIT-DISCOUNT": {
    checked: true,
    partialChecked: false,
  },
  "INVENTORY-TRACKING-EDIT-CURRENT-COUNT": {
    checked: true,
    partialChecked: false,
  },
  "INVENTORY-TRACKING-REQUEST-CURRENT-COUNT": {
    checked: true,
    partialChecked: false,
  },
  "INVENTORY-TRACKING-EDIT-VENDORS": {
    checked: true,
    partialChecked: false,
  },
  "INVENTORY-TRACKING-REQUEST-EDIT-VENDORS": {
    checked: true,
    partialChecked: false,
  },
  "INVENTORY-TRACKING-CREATE-NEW-VENDORS": {
    checked: true,
    partialChecked: false,
  },
  "INVENTORY-TRACKING-REQUEST-NEW-VENDORS": {
    checked: true,
    partialChecked: false,
  },
  "INVENTORY-TRACKING-ACCESS-WHOLESALE-COSTS": {
    checked: true,
    partialChecked: false,
  },
  "INVENTORY-TRACKING-EDIT-WHOLESALE-COSTS": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-ASSESSED-FEES": {
    checked: true,
    partialChecked: false,
  },
  "CREATE-ASSESSED-FEES": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-ASSESSED-FEES": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-AGREEMENT-TEMPLATES": {
    checked: true,
    partialChecked: false,
  },
  "CREATE-AGREEMENT-TEMPLATES": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-AGREEMENT-TEMPLATES": {
    checked: true,
    partialChecked: false,
  },
  "DELETE-AGREEMENT-TEMPLATES": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-PAYMENT-PLANS-TYPE": {
    checked: true,
    partialChecked: false,
  },
  "CREATE-NEW-PAYMENT-PLANS-TYPE": {
    checked: true,
    partialChecked: false,
  },
  "COPY-PAYMENT-PLANS-TYPE": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-PAYMENT-PLANS-TYPE": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-AGREEMENT-PROMOTIONS": {
    checked: true,
    partialChecked: false,
  },
  "CREATE-AGREEMENT-PROMOTIONS": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-AGREEMENT-PROMOTIONS": {
    checked: true,
    partialChecked: false,
  },
  "DELETE-AGREEMENT-PROMOTIONS": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-DOCUMENTS": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-SERVICES": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-TASKS": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-RESOURCE-TYPE": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-NOTES": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-CHECK-INS-HISTORY": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-BILLING-HISTORY": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-ALERTS": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-ALERTS": {
    checked: true,
    partialChecked: false,
  },
  "CREATE-NEW-PAYMENT-METHOD": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-PAYMENT-METHODS": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-PAYMENT-METHODS": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-AGREEMENTS": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-ACCESS-CODE": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-MEMBERSHIP-INFO": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-PERSONAL-INFORMATION": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-PERSONAL": {
    checked: true,
    partialChecked: false,
  },
  "QUICK-ENROLL": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-ASSIGNED-CLIENTS-ONLY": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-ALL-MEMBERS": {
    checked: true,
    partialChecked: false,
  },
  "ACCESS-CHECK-IN": {
    checked: true,
    partialChecked: false,
  },
  "LOOK-UP-CLIENT": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-CLIENT-ALERTS": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-CLIENT-ALERTS": {
    checked: true,
    partialChecked: false,
  },
  "DEDUCT-SERVICE-FROM-CHECK-IN": {
    checked: true,
    partialChecked: false,
  },
  "CREATE-RESOURCE-TYPE": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-RESOURCE-TYPE": {
    checked: true,
    partialChecked: false,
  },
  "DELETE-RESOURCE-TYPE": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-RESOURCES": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-RESOURCES": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-RESOURCES": {
    checked: true,
    partialChecked: false,
  },
  "CREATE-RESOURCES": {
    checked: true,
    partialChecked: false,
  },
  "Reserve Resources": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-RESOURCE-RESERVES": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-RESOURCE-RESERVES": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-RESOURCE-RESERVES": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-RESERVATION-OF-RESOURCES": {
    checked: true,
    partialChecked: false,
  },
  "RESERVE-RESOURCE": {
    checked: true,
    partialChecked: false,
  },
  "RETURN-RESOURCE": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-EVENT-CATEGORIES": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-EVENT-CATEGORIES": {
    checked: true,
    partialChecked: false,
  },
  "CREATE-EVENT-CATEGORIES": {
    checked: true,
    partialChecked: false,
  },
  "DELETE-EVENT-CATEGORIES": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-EVENTS": {
    checked: true,
    partialChecked: false,
  },
  "CREATE-EVENTS": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-EVENTS": {
    checked: true,
    partialChecked: false,
  },
  "DELETE-EVENTS": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-LEVELS": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-ALL-SCHEDULE": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-ONLY-INDIVIDUAL-SCHEDULE": {
    checked: true,
    partialChecked: false,
  },
  "BOOK-NEW-APPOINTMENT": {
    checked: true,
    partialChecked: false,
  },
  "SCHEDULE-CLASSES": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-SCHEDULE-CLASS": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-INSTRUCTOR-CLASSES": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-INSTRUCTOR-EVENTS": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-INSTRUCTOR-CLASSES": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-INSTRUCTOR-EVENTS": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-SCHEDULED-CLASSES": {
    checked: true,
    partialChecked: false,
  },
  "CREATE-LEVELS": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-LEVELS": {
    checked: true,
    partialChecked: false,
  },
  "DELETE-LEVELS": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-LOCATION-TYPE": {
    checked: true,
    partialChecked: false,
  },
  "CREATE-LOCATION-TYPE": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-SCHEDULED-EVENTS": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-CLASSES": {
    checked: true,
    partialChecked: false,
  },
  "RESCHEDULE-APPOINTMENT": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-COMPLETE-EVENT": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-COMPLETED-EVENT": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-PAST-EVENT": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-PAST-EVENT": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-LOCATION-TYPE": {
    checked: true,
    partialChecked: false,
  },
  "DELETE-LOCATION-TYPE": {
    checked: true,
    partialChecked: false,
  },
  "VIEW-LOCATIONS": {
    checked: true,
    partialChecked: false,
  },
  "CANCEL-EVENT-OUTSIDE": {
    checked: true,
    partialChecked: false,
  },
  "REQUEST-CANCEL-EVENT-OUTSIDE": {
    checked: true,
    partialChecked: false,
  },
  "CREATE-LOCATIONS": {
    checked: true,
    partialChecked: false,
  },
  "EDIT-LOCATIONS": {
    checked: true,
    partialChecked: false,
  },
  "DELETE-LOCATIONS": {
    checked: true,
    partialChecked: false,
  },
  "CREATE-CLASS": {
    checked: true,
    partialChecked: false,
  },
};
const ALL_KEYS = Object.keys(all);

const normalizePermissionKey = (node) => node?.key || node?.Key || node?.label;

const getPermissionKeys = (nodes = []) => {
  const keys = [];

  nodes.forEach((node) => {
    const nodeKey = normalizePermissionKey(node);
    if (nodeKey) {
      keys.push(nodeKey);
    }

    if (Array.isArray(node?.children) && node.children.length > 0) {
      keys.push(...getPermissionKeys(node.children));
    }
  });

  return [...new Set(keys)];
};

const getPermissionSelection = (keys = []) => {
  const selection = {};

  keys.forEach((key) => {
    selection[key] = all[key] || {
      checked: true,
      partialChecked: false,
    };
  });

  return selection;
};

const removePermissionKeys = (selection = {}, keys = []) => {
  const nextSelection = { ...selection };
  keys.forEach((key) => {
    delete nextSelection[key];
  });
  return nextSelection;
};

function CardSelectAll({ selected, setSelected, permissions }) {
  const checkboxRef = useRef(null);
  const permissionKeys = useMemo(
    () => getPermissionKeys(permissions),
    [permissions],
  );

  const selectedCount = permissionKeys.filter((key) => selected?.[key]).length;
  const isAllSelected =
    permissionKeys.length > 0 && selectedCount === permissionKeys.length;
  const isPartial = selectedCount > 0 && !isAllSelected;

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isPartial;
    }
  }, [isPartial]);

  const handleChange = (e) => {
    if (e.target.checked) {
      setSelected({
        ...selected,
        ...getPermissionSelection(permissionKeys),
      });
    } else {
      setSelected(removePermissionKeys(selected, permissionKeys));
    }
  };

  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
        fontWeight: 500,
      }}
    >
      <input
        ref={checkboxRef}
        type="checkbox"
        checked={isAllSelected}
        onChange={handleChange}
        style={{ width: 18, height: 18, cursor: "pointer" }}
      />
      Select All
    </label>
  );
}

function Permissions({ selected, setSelected }) {
  const checkboxRef = useRef(null);

  const allPermissionKeys = useMemo(
    () => [...new Set(allPermissions.flatMap(({ permissions }) => getPermissionKeys(permissions)))],
    [],
  );

  const selectedCount = allPermissionKeys.filter((key) => selected?.[key]).length;
  const isAllSelected = allPermissionKeys.length > 0 && selectedCount === allPermissionKeys.length;
  const isPartial = selectedCount > 0 && !isAllSelected;

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isPartial;
    }
  }, [isPartial]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected({ ...selected, ...getPermissionSelection(allPermissionKeys) });
    } else {
      setSelected(removePermissionKeys(selected, allPermissionKeys));
    }
  };

  const renderPermissionTabs = () => {
    return allPermissions.map(({ department, expended, permissions }, i) => (
      <CustomCard
        key={i}
        title={department}
        size={4}
        headers={
          <CardSelectAll
            selected={selected}
            setSelected={setSelected}
            permissions={permissions}
          />
        }
      >
        <div className="c-col-12">
          <CustomTree
            expandedKeys={expended}
            values={permissions}
            selectionKeys={selected}
            onSelectionChange={setSelected}
          />
        </div>
      </CustomCard>
    ));
  };

  return (
    <>
      <div className="c-col-12 flex justify-content-between align-items-center">
        <div>Permissions</div>
        {/* <PrimaryButton label="Select All" onClick={() => setSelected(all)} />
         */}
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: 500 }}>
          <input
            ref={checkboxRef}
            type="checkbox"
            checked={isAllSelected}
            onChange={handleSelectAll}
            style={{ width: 18, height: 18, cursor: "pointer" }}
          />
          Select All
        </label>
      </div>
      <div className="c-grid">{renderPermissionTabs()}</div>
    </>
  );
  
}
export default React.memo(Permissions);
