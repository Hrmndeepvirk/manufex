import React, { useState, useRef, useEffect } from "react";
import { Sidebar } from "primereact/sidebar";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import AppLogo from "@assets/images/AppLogoLandscape.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutAction } from "@store/user/userActions";
import { customConfirmDialog } from "@shared/overlays/CustomConfirmDialog";
import GlobalSearch from "../../components/GlobalSearch";
import { useSocket } from "@socket";
import { isAuthenticated } from "../../services/auth";
import EmployeeClockInOut from "../../components/EmployeeClockInOut";
import SwitchClub from "../../components/SwitchClub";
import CreateTask from "../../views/Members/TaskAndAlert/CreateTask";
import MyTasks from "../../components/MyTasks";
import { getRequests } from "@store/settings/employeeSetup/requestActions";
function Topbar() {
  const dispatch = useDispatch();
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.auth = { token: isAuthenticated() };
      socket.connect();
    }
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [globalSearchVisible, setGlobalSearchVisible] = useState(false);
  const [showClockInOutForm, setShowClockInOutForm] = useState(false);
  const [showSwitchClubDialog, setShowSwitchClubDialog] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showMyTasks, setShowMyTasks] = useState(false);
  const menuRef = useRef(null);

  const userProfile = useSelector((state) => state.user.profile);
  const dropdownClubs = useSelector((state) => state.dropdown.clubs);
  const requests = useSelector(
    (state) => state.settings.employeeSetup.requests || [],
  );
  const pendingRequestsCount = requests.filter(
    (r) => r?.status === "PENDING",
  ).length;

  useEffect(() => {
    dispatch(getRequests());
  }, [dispatch]);
  const company = useSelector((state) => state.settings.business.company);
  const CompanyLogo =
    company?.brandAssets?.logo?.horizontal ||
    company?.brandAssets?.logo?.primary ||
    AppLogo;

  const userMenuItems = [
    {
      label: "Profile Settings",
      icon: "pi pi-user",
      command: () => navigate("/profile"),
    },
    {
      label: "Switch Club",
      icon: "pi pi-arrow-right-arrow-left",
      command: () => {
        setShowSwitchClubDialog(true);
      },
    },
    {
      label: "Settings",
      icon: "pi pi-cog",
      command: () => navigate("/settings"),
    },
    { separator: true },
    { label: "Logout", icon: "pi pi-sign-out", command: onLogoutClick },
  ];

  const mainMenuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      command: () => navigate("/dashboard"),
    },
    {
      label: "Check-In",
      path: "/check-in",
      command: () => navigate("/check-in"),
    },
    {
      label: "Members",
      path: "/members",
      command: () => navigate("/members"),
    },
    {
      label: "Calendar",
      path: "/calendar",
      command: () => navigate("/calendar"),
    },
    {
      label: "Point of Sale",
      path: "/point-of-sale",
      command: () => navigate("/point-of-sale"),
    },
    {
      label: "Plans",
      path: "/plans",
      command: () => navigate("/plans"),
    },
    {
      label: "Reports",
      path: "/reports",
      command: () => navigate("/reports"),
    },
    {
      label: "More",
      path: "/more",
      command: () => navigate("/more"),
    },
  ];
  const iconsMenuItems = [
    {
      icon: "pi pi-search",
      label: "Search",
      command: onGlobalSearch,
    },
    {
      icon: "pi pi-calendar-plus",
      label: "My Tasks",
      command: () => setShowMyTasks(true),
      badge: pendingRequestsCount,
    },
    {
      icon: "pi pi-plus-circle",
      label: "Fast Add Member",
      command: () => navigate("/members/fast-add-member"),
    },
    // {
    //   icon: "pi pi-calendar-plus",
    //   label: "Create New Task",
    //   command: () => {
    //     setShowCreateTask(true);
    //   },
    // },
    {
      icon: "pi pi-clock",
      label: "Employee Clock In/Out",
      command: () => {
        setShowClockInOutForm(true);
      },
    },
    {
      icon: "pi pi-cog",
      label: "Settings",
      command: () => navigate("/settings"),
    },
    {
      icon: "pi pi-question-circle",
      label: "Help",
      command: () => console.log("Help clicked"),
    },
  ];

  const isActive = (itemPath) =>
    !!itemPath &&
    (pathname === itemPath || pathname.startsWith(itemPath + "/"));

  const DesktopMainMenu = () => {
    return (
      <div className="hidden md:flex gap-3">
        {mainMenuItems.map((item, index) => {
          const isMenuActive = isActive(item?.path);
          const isPlansMenu = item?.path === "/plans";

          return (
            <div
              key={index}
              className={`cursor-pointer select-none hover:text-highlight pb-1 ${
                isMenuActive
                  ? "text-highlight font-medium"
                  : "text-color-primary font-light"
              }`}
              style={
                isPlansMenu && isMenuActive
                  ? {
                      borderBottom: "2px solid var(--highlight-text-color)",
                      marginBottom: "-2px",
                    }
                  : undefined
              }
              onClick={item?.command}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    );
  };
  const MobileMainMenu = () => {
    return (
      <>
        <div className="flex-auto overflow-y-auto border-top-1">
          {mainMenuItems.map((item, index) => {
            const isMenuActive = isActive(item?.path);
            const isPlansMenu = item?.path === "/plans";

            return (
              <div
                key={index}
                className={`block p-2 cursor-pointer hover:text-highlight ${
                  isMenuActive
                    ? "text-highlight font-bold"
                    : "text-color-primary"
                }`}
                style={
                  isPlansMenu && isMenuActive
                    ? {
                        borderLeft: "3px solid var(--highlight-text-color)",
                        paddingLeft: "0.85rem",
                      }
                    : undefined
                }
                onClick={() => {
                  item?.command();
                  setSidebarVisible(false);
                }}
              >
                {item.label}
              </div>
            );
          })}
        </div>
      </>
    );
  };
  const IconMenu = () => {
    return (
      <>
        {iconsMenuItems.map((item, index) => (
          <span
            key={index}
            title={item.label}
            onClick={item.command}
            className="relative inline-block"
          >
            <i
              className={`cursor-pointer pi ${item.icon} text-color-primary`}
            />
            {item.badge > 0 && (
              <span className="topbar-icon-badge">{item.badge}</span>
            )}
          </span>
        ))}
      </>
    );
  };
  const UserProfile = () => {
    let clubName = "";
    const storedClubId = localStorage.getItem("club");
    const clubOptions = dropdownClubs?.length
      ? dropdownClubs
      : userProfile?.clubs || [];
    if (clubOptions?.length > 0) {
      let club = clubOptions?.find((c) => c._id === storedClubId);
      if (club) {
        clubName = club.title || club.name || "";
      } else {
        localStorage.setItem("club", clubOptions?.[0]?._id);
        clubName = clubOptions?.[0]?.title || clubOptions?.[0]?.name || "";
      }
    }

    return (
      <div
        className="flex align-items-center gap-2 cursor-pointer justify-content-between"
        onClick={(e) => menuRef.current.toggle(e)}
      >
        <div className="flex align-items-center gap-2">
          <Avatar
            image="/user.jpg"
            label={userProfile?.firstName.slice(0, 1)}
            shape="circle"
            size="large"
          />
          <div className="flex flex-column">
            <span className="text-color-primary font-semibold">
              {userProfile?.firstName} {userProfile?.lastName}
            </span>
            <span className="text-color-primary text-sm">{clubName}</span>
          </div>
        </div>
        <i className="pi pi-chevron-down text-color-primary" />
      </div>
    );
  };

  const MobileBottomNavBar = () => {
    return (
      <div className="bottom-navbar flex md:hidden justify-content-around align-items-center">
        {iconsMenuItems.map((item, index) => (
          <span
            key={index}
            title={item.label}
            onClick={item.command}
            className="relative inline-block"
          >
            <i
              className={`cursor-pointer pi ${item.icon} text-color text-2xl`}
            />
            {item.badge > 0 && (
              <span className="topbar-icon-badge">{item.badge}</span>
            )}
          </span>
        ))}
      </div>
    );
  };

  function handleMenuClick() {
    setSidebarVisible(true);
  }

  function onLogoutClick() {
    customConfirmDialog({
      message: "Are you sure you want to logout?",
      accept: () => onLogout(),
      reject: () => {},
    });
  }

  function onLogout() {
    dispatch(logoutAction(navigate));
  }

  const CustomSidebarHeader = (
    <img src={CompanyLogo} alt="logo" className="h-2rem  ml-1" />
  );

  function onGlobalSearchHide() {
    setGlobalSearchVisible(false);
  }
  function onGlobalSearch() {
    setGlobalSearchVisible(true);
  }

  function onHideClockInOutForm() {
    setShowClockInOutForm(false);
  }

  function onHideSwitchClubForm() {
    setShowSwitchClubDialog(false);
  }

  function onHideMyTasksDialog() {
    setShowMyTasks(false);
  }

  function onAddNewTask() {
    setShowMyTasks(false);
    setShowCreateTask(true);
  }

  function onTaskCreated() {
    setShowMyTasks(true);
  }

  return (
    <>
      <EmployeeClockInOut
        visible={showClockInOutForm}
        onHide={onHideClockInOutForm}
      />

      <SwitchClub
        visible={showSwitchClubDialog}
        onHide={onHideSwitchClubForm}
      />

      <GlobalSearch visible={globalSearchVisible} onHide={onGlobalSearchHide} />

      <MyTasks
        visible={showMyTasks}
        onHide={onHideMyTasksDialog}
        onAddNewTask={onAddNewTask}
      />
      {showCreateTask && (
        <CreateTask
          visible={showCreateTask}
          onHide={() => {
            setShowCreateTask(false);
            setShowMyTasks(true);
          }}
          onTaskCreated={onTaskCreated}
        />
      )}

      <div className="topbar hidden md:flex">
        <div className="flex align-items-center gap-3">
          <img
            src={CompanyLogo}
            alt="logo"
            className="h-2rem mr-3 cusror-pointer"
            onClick={() => navigate("/dashboard")}
          />
          {DesktopMainMenu()}
        </div>

        <div className="hidden md:flex align-items-center gap-3">
          {IconMenu()}
          {UserProfile()}
        </div>
      </div>
      {/* Sidebar for Mobile */}
      <div className="topbar md:hidden">
        <div className="flex justify-content-between align-items-center w-full">
          <Button
            icon="pi pi-bars"
            className="p-button-text text-color"
            onClick={handleMenuClick}
          />
          <img src={CompanyLogo} alt="logo" className="h-2rem" />
          <div className="px-3"></div>
        </div>
      </div>
      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        className="p-sidebar-md w-18rem"
        header={CustomSidebarHeader}
      >
        {/* Sidebar Content */}
        <div className="flex flex-column h-full ">
          {/* Menu Items */}
          {MobileMainMenu()}

          {/* User profile at bottom */}
          <div className="mt-auto">
            <UserProfile withDetails={true} />
          </div>
        </div>
      </Sidebar>
      {MobileBottomNavBar()}
      {/* User Dropdown Menu */}
      <Menu model={userMenuItems} popup ref={menuRef} />
    </>
  );
}

export default React.memo(Topbar);
