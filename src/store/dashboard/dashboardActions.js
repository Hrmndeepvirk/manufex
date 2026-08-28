import api from "@api";
import endPoints from "@endPoints";
import { setDashboardStats } from "./dashboardSlice";

const getDashboardStats = (setLoading) => async (dispatch) => {
    if (setLoading) setLoading(true);
    let res = await api("get", endPoints.DASHBOARD);
    if (res.success) {
        dispatch(setDashboardStats(res.data));
    }
    if (setLoading) setLoading(false);
};

const onDashboardStatsUpdate = (data) => async (dispatch) => {
    dispatch(setDashboardStats(data));
};

export { getDashboardStats, onDashboardStatsUpdate };