import api from "@api";
import endPoints from "@endPoints";
import { setNotes } from "../employeeSetupSlice";

const getNotes = (employeeId, setLoading) => async (dispatch) => {
  try {
    if (setLoading) setLoading(true);
    const res = await api(
      "get",
      endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.NOTES(employeeId)
    );

    if (res.success) {
      dispatch(setNotes(res.data));
    } else {
      console.error(res.formErrors);
    }
  } catch (err) {
    console.error("Error fetching notes:", err);
  } finally {
    if (setLoading) setLoading(false);
  }
};

const addOrUpdateNote =
  (employeeId, id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.NOTES(employeeId) +
          id,
        data
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.NOTES(employeeId),
        data
      );
    }

    if (res.success) {
      dispatch(getNotes(employeeId, setLoading));
      next(true, null);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };

const deleteNote = (employeeId, id) => async (dispatch) => {
  const res = await api(
    "delete",
    endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.NOTES(employeeId) + id
  );
  if (res.success) {
    dispatch(getNotes(employeeId));
  }
};

export { getNotes, addOrUpdateNote, deleteNote };
