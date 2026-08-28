import {
  removeDropDownItem,
  setDropDownItem,
  updateDropDownItem,
} from "../dropdown/dropdownSlice";

const onCreateDB = (payload) => async (dispatch) => {
  const { model, data } = payload;
  updateList(dispatch, model, data);
  dispatch(setDropDownItem({ option: model, item: data }));
};
const onUpdateDB = (payload) => async (dispatch) => {
  const { model, data } = payload;
  updateList(dispatch, model, data);
  if (data.isActive) {
    dispatch(updateDropDownItem({ option: model, item: data }));
  } else if (model === "campaignGroups") {
    dispatch(updateDropDownItem({ option: model, item: data }));
  } else {
    dispatch(removeDropDownItem({ option: model, id: data._id }));
  }
};
const onDeleteDB = (payload) => async (dispatch) => {
  const { model, data } = payload;
  updateList(dispatch, model, data, true);
  dispatch(removeDropDownItem({ option: model, id: data._id }));
};

export { onCreateDB, onUpdateDB, onDeleteDB };

import {
  updateItem as updateBusinessItem,
  removeItem as removeBusinessItem,
} from "../settings/business/businessSlice";

import {
  updateItem as updateEmployeeSetupItem,
  removeItem as removeEmployeeSetupItem,
} from "../settings/employeeSetup/employeeSetupSlice";

import {
  removeItem as removeScheduleSetupItem,
  updateItem as updateScheduleSetupItem,
} from "../settings/scheduleSetup/scheduleSetupSlice";

import {
  removeItem as removePointOfSaleItem,
  updateItem as updatePointOfSaleItem,
} from "../settings/pointOfSale/pointOfSaleSlice";

import {
  removeItem as removeInventoryItem,
  updateItem as updateInventoryItem,
} from "../settings/inventory/inventorySlice";

import {
  removeItem as removeMemberSetupItem,
  updateItem as updateMemberSetupItem,
} from "../settings/memberSetup/memberSetupSlice";

import {
  removeItem as removeAgreementSetupItem,
  updateItem as updateAgreementSetupItem,
} from "../settings/agreementSetup/agreementSetupSlice";

import {
  removeItem as removeRewardsItem,
  updateItem as updateRewardsItem,
} from "../settings/rewards/rewardsSlice";

import {
  removeItem as removeCalendarItem,
  updateItem as updateCalendarItem,
} from "../calendar/calendarSlice";

import {
  removeQueuedReport as removeQueuedReportItem,
  updateQueuedItem as updateQueuedReportItem,
} from "../reports/queuedReportsSlice";

import { onCompanyUpdate } from "../company/companyActions";
import { onScheduleSettingsUpdate } from "../calendar/calendarActions";

import {
  upsertShiftCoverRequest,
  removeShiftCoverRequest,
} from "../settings/employeeSetup/shiftCoverRequestSlice";

function updateList(dispatch, model, data, remove = false) {
  switch (model) {
    case "company":
      return dispatch(onCompanyUpdate(data));
    case "scheduleOption":
      return dispatch(onScheduleSettingsUpdate(data));
    case "reasonCodes":
    case "clubs":
      return remove
        ? dispatch(removeBusinessItem({ option: model, id: data._id }))
        : dispatch(updateBusinessItem({ option: model, item: data }));

    case "employees":
    case "jobTitles":
    case "departments":
    case "securityRoles":
    case "timesheets":
      return remove
        ? dispatch(removeEmployeeSetupItem({ option: model, id: data._id }))
        : dispatch(updateEmployeeSetupItem({ option: model, item: data }));

    case "levels":
    case "locationTypes":
    case "locations":
    case "eventSetups":
    case "eventCategories":
    case "classes":
      return remove
        ? dispatch(removeScheduleSetupItem({ option: model, id: data._id }))
        : dispatch(updateScheduleSetupItem({ option: model, item: data }));

    case "tax":
    case "paymentMethods":
    case "discounts":
    case "registers":
      return remove
        ? dispatch(removePointOfSaleItem({ option: model, id: data._id }))
        : dispatch(updatePointOfSaleItem({ option: model, item: data }));

    case "catalogItems":
    case "profitCenters":
    case "catalogCategories":
    case "vendors":
    case "commissionGroups":
    case "referralGroups":
      return remove
        ? dispatch(removeInventoryItem({ option: model, id: data._id }))
        : dispatch(updateInventoryItem({ option: model, item: data }));

    case "membershipTypes":
    case "campaignGroups":
    case "campaigns":
    case "accessSchedules":
    case "resourceTypes":
    case "resources":
      return remove
        ? dispatch(removeMemberSetupItem({ option: model, id: data._id }))
        : dispatch(updateMemberSetupItem({ option: model, item: data }));

    case "assessedFees":
    case "agreementTemplates":
    case "agreementCategories":
    case "agreementPlans":
    case "agreementPromotions":
      return remove
        ? dispatch(removeAgreementSetupItem({ option: model, id: data._id }))
        : dispatch(updateAgreementSetupItem({ option: model, item: data }));
    case "pointsEarningRules":
    case "rewardCatalogs":
      return remove
        ? dispatch(removeRewardsItem({ option: model, id: data._id }))
        : dispatch(updateRewardsItem({ option: model, item: data }));

    case "calendarEvents":
      return remove
        ? dispatch(removeCalendarItem({ option: model, id: data._id }))
        : dispatch(updateCalendarItem({ option: model, item: data }));
    case "queuedReports":
      return remove
        ? dispatch(removeQueuedReportItem({ option: model, id: data._id }))
        : dispatch(updateQueuedReportItem({ option: model, item: data }));

    case "shiftCoverRequest":
      return remove
        ? dispatch(removeShiftCoverRequest(data._id))
        : dispatch(upsertShiftCoverRequest(data));

    default:
      return null;
  }
}
