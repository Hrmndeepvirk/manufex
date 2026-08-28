import { recentCheckinsAction } from "@store/checkin/checkinActions";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserProfileImage from "@shared/userCards/UserProfileImage";
import { getDateTime } from "../utils/dateTime";

export default function LatestCheckIn() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const recentCheckins = useSelector((state) => state.checkin.recent);

  useEffect(() => {
    dispatch(recentCheckinsAction(setLoading));
  }, []);

  function CheckinCard({ checkIn }) {
    return (
      <div
        className={` absolute checkin-card checkin-card--${checkIn.status}`}
        style={{ bottom: "10px", left: "10px" }}
      >
        <div className="checkin-card__content">
          <UserProfileImage
            src={checkIn.member?.image}
            gender={checkIn.member?.gender}
            height={36}
            width={36}
          />
          <div className="checkin-card__details">
            <div
              className="checkin-card__member"
              onClick={() => navigate(`/members/${checkIn.member?._id}`)}
            >
              {checkIn.member?.firstName} {checkIn.member?.lastName}
            </div>
            {/* <p className="checkin-card__reason">{checkIn.status}</p> */}
            <div className="checkin-card__extra">
              {getDateTime(checkIn.createdAt)}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      {recentCheckins?.slice(0, 10).map((checkIn, index) => (
        <CheckinCard key={index} checkIn={checkIn} />
      ))}
    </>
  );
}
