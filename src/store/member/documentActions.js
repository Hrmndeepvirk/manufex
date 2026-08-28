import api from "@api";
import endPoints from "@endPoints";

const getDocuments = (memberId, setLoading, next) => async () => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.MEMBER.DOCUMENT + memberId);
  if (res.success) {
    if (next) next(res.data);
  } else {
    if (next) next([]);
  }
  if (setLoading) setLoading(false);
};

const addDocument = (data, setLoading, next) => async () => {
  if (setLoading) setLoading(true);
  const res = await api("post", endPoints.MEMBER.DOCUMENT, data);
  if (res.success) {
    if (next) next(true, null);
  } else {
    if (next) next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const deleteDocument = (id, setLoading, next) => async () => {
  if (setLoading) setLoading(true);
  const res = await api("delete", endPoints.MEMBER.DOCUMENT + id);
  if (res.success) {
    if (next) next(true);
  } else {
    if (next) next(null);
  }
  if (setLoading) setLoading(false);
};

export { getDocuments, addDocument, deleteDocument };
