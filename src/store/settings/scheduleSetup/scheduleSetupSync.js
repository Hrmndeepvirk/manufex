import { updateItem, removeItem } from "./scheduleSetupSlice";
import {
  updateDropDownItem,
  removeDropDownItem,
} from "../../dropdown/dropdownSlice";

const dropdownSyncedModels = new Set([
  "levels",
  "locationTypes",
  "locations",
  "eventSetups",
  "eventCategories",
  "classes",
]);

const syncScheduleSetupItem = (dispatch, model, item) => {
  if (!item) return;

  dispatch(updateItem({ option: model, item }));

  if (!dropdownSyncedModels.has(model)) return;

  if (item.isActive) {
    dispatch(updateDropDownItem({ option: model, item }));
  } else {
    dispatch(removeDropDownItem({ option: model, id: item._id }));
  }
};

const removeScheduleSetupItem = (dispatch, model, id) => {
  if (!id) return;

  dispatch(removeItem({ option: model, id }));

  if (dropdownSyncedModels.has(model)) {
    dispatch(removeDropDownItem({ option: model, id }));
  }
};

export { syncScheduleSetupItem, removeScheduleSetupItem };
