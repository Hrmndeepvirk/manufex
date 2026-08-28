import api from "@api";
import endPoints from "@endPoints";
import { setDropdownData } from "./dropdownSlice";

const getAllDropdownDataAction = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const activeClub = localStorage.getItem("club");
  const params = activeClub ? { club: activeClub } : {};
  const res = await api("get", endPoints.DROPDOWN.ALL, null, params);
  if (res.success) {
    dispatch(setDropdownData(res.data));
  } else {
    //show error toast
  }
  if (setLoading) setLoading(false);
};

export { getAllDropdownDataAction };
