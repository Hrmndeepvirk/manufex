import api from "@api";
import endPoints from "@endPoints";
import { setRepeatingEvents } from "./scheduleSlice";

const getRepeatingEvents = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);

  const res = await api(
    "get",
    endPoints.MORE.REPEATING_EVENTS
  );
  if (res?.success && Array.isArray(res.data)) {
    dispatch(setRepeatingEvents(res.data)); 
  }

  if (setLoading) setLoading(false);
};

export { getRepeatingEvents };

