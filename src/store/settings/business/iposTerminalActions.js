import api from "@api";
import endPoints from "@endPoints";
import { setIposTerminals } from "./businessSlice";

const getIposTerminals = () => async (dispatch) => {
  const res = await api("get", endPoints.SETTINGS.BUSINESS.IPOS_TERMINAL);
  if (res.success) {
    dispatch(setIposTerminals(res.data));
  }
};

const getIposTerminal = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api("get", endPoints.SETTINGS.BUSINESS.IPOS_TERMINAL + id);
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};

const addOrUpdateIposTerminal =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    const res = await api(
      "put",
      endPoints.SETTINGS.BUSINESS.IPOS_TERMINAL + id,
      data
    );
    if (res.success) {
      next(true, null);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };

const deleteIposTerminal = (id) => async (dispatch) => {
  const res = await api(
    "delete",
    endPoints.SETTINGS.BUSINESS.IPOS_TERMINAL + id
  );
  if (res.success) {
    dispatch(getIposTerminals());
  }
};

export {
  getIposTerminals,
  getIposTerminal,
  addOrUpdateIposTerminal,
  deleteIposTerminal,
};
