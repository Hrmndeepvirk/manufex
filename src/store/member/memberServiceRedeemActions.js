import api from "@api";
import endPoints from "@endPoints";
import { setLastCheckin } from "../checkin/checkinSlice";
import { setMemberServiceRedeems, setMemberResourceUsage, setMemberPastDues } from "./memberSlice";

const getMemberRedeemedServices =
  (id, setLoading, next) => async (dispatch) => {
    if (setLoading) {
      setLoading(true);
    }

    const res = await api("get", endPoints.MEMBER.MEMBER_SERVICE_REDEEM + id);

    if (res?.success) {
      dispatch(setMemberServiceRedeems(res?.data));
    }

    if (setLoading) {
      setLoading(false);
    }
  };

const redeemService = (id, data, setLoading, next) => async (dispatch) => {
  if (setLoading) {
    setLoading(true);
  }

  const res = await api(
    "post",
    endPoints.MEMBER.MEMBER_SERVICE_REDEEM + id,
    data,
  );

  if (res?.success) {
    next(true, res?.data);
  } else {
    next(null, res?.formErrors);
  }

  if (setLoading) {
    setLoading(false);
  }
};

const onRevertMemberService =
  (id, memberId, setLoading, next) => async (dispatch) => {
    setLoading(true);

    let res = await api("put", endPoints.MEMBER.MEMBER_SERVICE_REDEEM + id);

    if (res?.success) {
      next(true, null);
      dispatch(getMemberRedeemedServices(memberId));
    }
    setLoading(false);
  };

const getMemberResourceUsage = (id, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.MEMBER.MEMBER_RESOURCE_USAGE + id);
  if (res?.success) {
    dispatch(setMemberResourceUsage(res.data));
    if (next) next(res.data);
  }
  if (setLoading) setLoading(false);
};

const getMemberPastDues = (id, setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.MEMBER.MEMBER_PAST_DUE + id);
  if (res?.success) {
    dispatch(setMemberPastDues(res.data));
  }
  if (setLoading) setLoading(false);
};

export { redeemService, getMemberRedeemedServices, onRevertMemberService, getMemberResourceUsage, getMemberPastDues };
