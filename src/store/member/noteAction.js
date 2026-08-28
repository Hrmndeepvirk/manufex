import api from "@api";
import endPoints from "@endPoints";

const getNotes = (memberId, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", `${endPoints.MEMBER.MEMBER}${memberId}/notes`);
  
  if (res.success) {
    next(res.data);
  } else {
    next([]);
  }
  if (setLoading) setLoading(false);
};

const addNote = (memberId, data, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api("post", `${endPoints.MEMBER.MEMBER}${memberId}/notes`, data);

  if (res.success) {
    next(true, null);
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};

const updateNote = (memberId, noteId, data, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api(
    "put",
    `${endPoints.MEMBER.MEMBER}${memberId}/notes/${noteId}`,
    data
  );

  if (res.success) {
    next(true, null);
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};



const deleteNote = (memberId, noteId, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("delete", `${endPoints.MEMBER.MEMBER}${memberId}/notes/${noteId}`);

  if (res.success) {
    next(true);
  } else {
    next(false);
  }
  if (setLoading) setLoading(false);
};

export { getNotes, addNote, deleteNote ,updateNote};