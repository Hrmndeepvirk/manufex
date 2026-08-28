import React, { useState, useEffect, useRef, useMemo } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getMembers } from "@store/member/memberActions";
import { recentCheckinsAction } from "@store/checkin/checkinActions";
import Lottie from "lottie-react";
import Bees from "@assets/lotties/Bees.json";
import { Skeleton } from "primereact/skeleton";
import { getDateTime, getMinutesAgo, getTime } from "../../utils/dateTime";
import UserProfileImage from "../../shared/userCards/UserProfileImage";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../sockets/SocketContext";
import { updateCheckinItem } from "../../store/checkin/checkinSlice";
import CustomAutoComplete from "../../shared/inputs/CustomAutoComplete";
import CustomCheckbox from "../../shared/inputs/CustomCheckbox";
import { checkinsAction } from "../../store/checkin/checkinActions";

function RecentCheckin() {
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const recentCheckinsRaw = useSelector((state) => state.checkin.recent);
  const members = useSelector((state) => state.member.members);

  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const recentCheckins = useMemo(() => {
    if (!recentCheckinsRaw) return [];
    const now = Date.now();
    return recentCheckinsRaw.filter((item) => {
      if (item.status === "SUCCESS") {
        const createdAt = new Date(item.createdAt).getTime();
        return now - createdAt <= 5 * 60 * 1000;
      }
      return true;
    });
  }, [recentCheckinsRaw, tick]);

  const scrollContainerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const memberOptions = useMemo(() => {
    return (members || [])
      .map((member) => ({
        _id: member?._id,
        barCode: member?.barCode,
        mobilePhone: member?.mobilePhone,
        primaryPhone: member?.primaryPhone,
        workPhone: member?.workPhone,
        email: member?.email,
        title:
          `${member?.firstName || ""} ${member?.lastName || ""}`.trim() ||
          "Unknown Member",
      }))
      .filter((member) => member._id && member.title);
  }, [members]);

  useEffect(() => {
    dispatch(recentCheckinsAction(setLoading));
    dispatch(getMembers(null, { showForbiddenPopup: false }));
  }, []);

  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
    scrollContainerRef.current.style.cursor = "grabbing";
    scrollContainerRef.current.style.userSelect = "none";
  };

  const handleMouseLeave = () => {
    isDraggingRef.current = false;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = "grab";
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = "grab";
    }
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const showCheckinToast = (checkIn, index) => {
    toast.custom((t) => <CheckinToast t={t} checkIn={checkIn} />, {
      position: "top-center",
      duration: 5000,
    });
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("checkin:create", (data) => {
      dispatch(updateCheckinItem(data));
      if (!isOpen) {
        showCheckinToast(data);
      }
    });
    return () => {
      socket.off("checkin:create");
    };
  }, [socket, dispatch, isOpen]);

  function CheckinCard({ checkIn }) {
    return (
      <div className={`checkin-card checkin-card--${checkIn.status}`}>
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
            <div className="checkin-card__extra">
              {getTime(checkIn.createdAt)} • {getMinutesAgo(checkIn.createdAt)}{" "}
              min ago
            </div>
          </div>
        </div>
      </div>
    );
  }

  function CheckinToast({ t, checkIn }) {
    return (
      <div
        className={`flex border-round shadow-3 overflow-hidden min-w-20rem checkin-card--${checkIn.status}`}
      >
        <div className="flex-1 p-2">
          <div className="flex align-items-start">
            <div className="flex-shrink-0 mr-3">
              <UserProfileImage
                src={checkIn.member?.image}
                gender={checkIn.member?.gender}
                height={40}
                width={40}
              />
            </div>
            <div className="flex-1">
              <div
                className="text-900 font-medium cursor-pointer"
                onClick={() => navigate(`/members/${checkIn.member?._id}`)}
              >
                {checkIn.member?.firstName} {checkIn.member?.lastName}
              </div>

              <div className="text-500 text-sm mt-1">
                {getDateTime(checkIn.createdAt)}
              </div>
            </div>
          </div>
        </div>
        <div className="flex border-left-1 surface-border">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="p-2 border-none bg-transparent text-primary font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const [loadingCheckIn, setLoadingCheckin] = useState(false);

  const handleMemberCheckIn = ({ value }) => {
    if (!value) return;
    dispatch(
      checkinsAction({ member: value }, setLoadingCheckin, () => {
        navigate("/check-in");
      }),
    );
  };

  const handleMemberNavigate = ({ value }) => {
    if (!value) return;
    navigate(`/members/${value}`);
  };

  useEffect(() => {
    const className = "recent-checkin-open";
    if (isOpen) {
      document.body.classList.add(className);
    } else {
      document.body.classList.remove(className);
    }
    return () => document.body.classList.remove(className);
  }, [isOpen]);

  const [filterAlerts, setFilterAlerts] = useState(false);
  const [filterTasks, setFilterTasks] = useState(false);

  const filteredCheckins = useMemo(() => {
    if (!filterAlerts && !filterTasks) return recentCheckins;
    return recentCheckins.filter((item) => {
      if (filterAlerts && filterTasks) return item.isAlert || item.isTask;
      if (filterAlerts) return item.isAlert;
      if (filterTasks) return item.isTask;
      return true;
    });
  }, [recentCheckins, filterAlerts, filterTasks]);

  return (
    <div className="recent-checkin">
      <button className="floating-button" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Close Recent Check-in" : "Open Recent Check-in"}
      </button>

      <div className={`recent-checkin-bar ${isOpen ? "open" : "closed"}`}>
        <div className="c-grid justify-content-between w-full">
          <CustomAutoComplete
            name="recentCheckinMember"
            placeholder="Check-in: Search Name, Barcode or Phone #"
            options={memberOptions}
            searchFields={[
              "title",
              "barCode",
              "mobilePhone",
              "primaryPhone",
              "workPhone",
              "email",
            ]}
            onChange={handleMemberCheckIn}
            dropdown
            hideLabel
            autoClear
            loading={loadingCheckIn}
          />
          <div className="c-col-4 hidden md:flex gap-4 my-auto justify-content-center ">
            <CustomCheckbox
              name="alerts"
              value={filterAlerts}
              onChange={(e) => setFilterAlerts(e.value)}
              label="Alerts"
            />
            <CustomCheckbox
              name="activeTasks"
              value={filterTasks}
              onChange={(e) => setFilterTasks(e.value)}
              label="Active Tasks"
            />
          </div>

          <CustomAutoComplete
            name="recentCheckinMemberNavigate"
            placeholder="Member: Search Name, Barcode or Phone #"
            options={memberOptions}
            searchFields={[
              "title",
              "barCode",
              "mobilePhone",
              "primaryPhone",
              "workPhone",
              "email",
            ]}
            onChange={handleMemberNavigate}
            dropdown
            hideLabel
            autoClear
          />
        </div>
        <div className="bar-content mt-1">
          <div
            ref={scrollContainerRef}
            className="flex gap-2 overflow-x-auto "
            style={{ scrollbarWidth: "none", cursor: "grab" }}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            <>
              {loading ? (
                <>
                  {Array(10)
                    .fill()
                    .map((_, index) => (
                      <Skeleton
                        key={index}
                        width="14rem"
                        height="2.5rem"
                        borderRadius="20px"
                      ></Skeleton>
                    ))}
                </>
              ) : (
                <>
                  {filteredCheckins?.length > 0 ? (
                    <>
                      {filteredCheckins.map((checkIn, index) => (
                        <CheckinCard key={index} checkIn={checkIn} />
                      ))}
                    </>
                  ) : (
                    <div className="flex">
                      <div
                        className="hidden md:block"
                        style={{ height: "100%", width: "38%" }}
                      >
                        <Lottie animationData={Bees} height={140} />
                      </div>
                      <div className="text-sm flex align-items-center text-color-primary">
                        Looks like there haven't been any check-ins lately!
                      </div>
                    </div>
                  )}
                </>
              )}
            </>{" "}
          </div>
          {/* <div className="flex flex-column gap-2 pl-2 py-1">
            <span title="Filter">
              <i className="pi pi-filter text-xl cursor-pointer text-color-primary"></i>
            </span>
            <span title="Minimize">
              <i
                className="pi pi-times-circle text-xl cursor-pointer text-color-primary"
                onClick={() => setIsOpen(false)}
              ></i>
            </span>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default React.memo(RecentCheckin);
