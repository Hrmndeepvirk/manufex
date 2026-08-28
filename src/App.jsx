import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import ForgetPassword from "./pages/ForgetPassword";
import NotFoundPage from "./pages/NotFound";
import ManufacturingHome from "./pages/ManufacturingWebsite/Home";
import ManufacturingAbout from "./pages/ManufacturingWebsite/About";
import { isAuthenticated } from "./services/auth";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import OnUnAuthenticatedWindow from "./components/OnUnAuthenticatedWindow";
import VisitorRegisteration from "./views/VisitorRegisteration";
import Env from "./components/Env";
import { getCompanyBySubdomain } from "@store/company/companyActions";
import { generateToken, messaging, onMessage } from "./services/firebase";
import { saveFcmTokenAction, deleteFcmTokenAction } from "@store/user/userActions";
import { setPushNotification } from "@store/common/commonSlice";
import PushNotificationPopup from "./components/PushNotificationPopup";

const publicMarketingPaths = ["/", "/about"];

function AppContent() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const authenticated = isAuthenticated();
  const isPublicMarketingPath = publicMarketingPaths.includes(pathname);

  useEffect(() => {
    if (isPublicMarketingPath) return;
    dispatch(getCompanyBySubdomain());
    onMessage(messaging, (message) => {
      const { title, body, image } = message.data || {};
      dispatch(setPushNotification({ title, body, image }));
    });
  }, [dispatch, isPublicMarketingPath]);

  useEffect(() => {
    if (isPublicMarketingPath) return;
    if (authenticated) {
      handleSaveFcmToken();
    } else {
      handleDeleteFcmToken();
    } // eslint-disable-next-line
  }, [authenticated, isPublicMarketingPath]);

  const handleSaveFcmToken = async () => {
    const token = await generateToken();
    if (token) {
      dispatch(saveFcmTokenAction(token));
    }
  };

  const handleDeleteFcmToken = async () => {
    const token = localStorage.getItem("fcm");
    if (token) {
      dispatch(deleteFcmTokenAction(token));
    }
  };

  return (
    <>
      <Env />
      {!isPublicMarketingPath && <OnUnAuthenticatedWindow />}
      {!isPublicMarketingPath && <PushNotificationPopup />}
      <Routes>
        <Route path="/" element={<ManufacturingHome />} />
        <Route path="/about" element={<ManufacturingAbout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="/*" element={<ProtectedRoutes />} />
        <Route
          path="/visitor-registeration"
          element={<VisitorRegisteration />}
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router basename="/manufex">
      <AppContent />
    </Router>
  );
}

export default App;
