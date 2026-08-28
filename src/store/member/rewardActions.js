import api from "@api";
import endPoints from "@endPoints";
import { setRewards } from "./memberSlice";

const getMemberRewards = (id, setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.MEMBER.MEMBER_REWARDS + id);
  if (res.success) {
    dispatch(setRewards(res.data));
  }
  if (setLoading) setLoading(false);
};

const adjustMemberReward = (id, data, setLoading, next) => async () => {
  if (setLoading) setLoading(true);
  const res = await api(
    "post",
    endPoints.MEMBER.MEMBER_REWARDS_ADJUST + id + "/adjust",
    data,
  );
  if (res.success) {
    if (next) next(true);
  } else {
    if (next) next(false, res.message);
  }
  if (setLoading) setLoading(false);
};

export { getMemberRewards, adjustMemberReward };
