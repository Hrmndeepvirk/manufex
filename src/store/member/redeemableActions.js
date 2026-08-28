import api from "@api";
import endPoints from "@endPoints";
import { setMemberRedeemables } from "./memberSlice";

const getMemberRedeemables = (memberId, setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.MEMBER.MEMBER_REDEEMABLE + memberId);
  if (res.success) {
    dispatch(setMemberRedeemables(res.data));
  }
  if (setLoading) setLoading(false);
};

const redeemReward =
  (rewardCatalogId, data, setLoading, next) => async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api(
      "post",
      endPoints.MEMBER.MEMBER_REDEEMABLE + rewardCatalogId,
      data
    );
    if (res.success) {
      if (next) next(true, null, res.message);
    } else {
      if (next) next(null, res.formErrors, res.message);
    }
    if (setLoading) setLoading(false);
  };

export { getMemberRedeemables, redeemReward };
