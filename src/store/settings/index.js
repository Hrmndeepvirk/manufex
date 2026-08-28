import { combineReducers } from "@reduxjs/toolkit";
import businessReducer from "./business/businessSlice";
import employeeSetupSlice from "./employeeSetup/employeeSetupSlice";
import pointOfSaleSlice from "./pointOfSale/pointOfSaleSlice";
import memberSetupSlice from "./memberSetup/memberSetupSlice";
import agreementSetupSlice from "./agreementSetup/agreementSetupSlice";
import scheduleSetupSlice from "./scheduleSetup/scheduleSetupSlice";
import inventorySlice from "./inventory/inventorySlice";
import rewardsSlice from "./rewards/rewardsSlice";

const settingsReducer = combineReducers({
  business: businessReducer,
  employeeSetup: employeeSetupSlice,
  pointOfSale: pointOfSaleSlice,
  memberSetup: memberSetupSlice,
  agreementSetup: agreementSetupSlice,
  scheduleSetup: scheduleSetupSlice,
  inventory: inventorySlice,
  rewards: rewardsSlice,
});

export default settingsReducer;
