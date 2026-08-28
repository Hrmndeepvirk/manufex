import { Suspense } from "react";
import { ProgressBar } from "primereact/progressbar";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { isAuthenticated } from "@services/auth";
import Layout from "../layout/Layout";
import { PrivateRoutes } from "./PrivateRoutes";
import NotFoundPage from "../pages/NotFound";

const Auth = () => {
  return isAuthenticated() ? (
    <Layout>
      <Suspense
        fallback={
          <ProgressBar
            mode="indeterminate"
            style={{ height: "3px" }}
          ></ProgressBar>
        }
      >
        <Outlet />
      </Suspense>
    </Layout>
  ) : (
    <Navigate to="/login" />
  );
};
const renderRoutes = (routes, parentPath = "") => {
  return routes.map((route, key) => {
    let currentPath = parentPath + route.path;
    return (
      <>
        <Route
          key={currentPath + key}
          path={currentPath}
          element={<route.component />}
          exact={route?.exact}
        />
        {route.items &&
          route.items.length > 0 &&
          renderRoutes(route.items, currentPath)}
      </>
    );
  });
};
export default function ProtectedRoutes() {
  return (
    <Suspense>
      <Routes>
        <Route element={<Auth />}>
          {renderRoutes(PrivateRoutes)}
          <Route path="/*" element={<NotFoundPage />} />
        </Route>
        {/* <Route path="/*" element={<Navigate to="/404" />} /> */}
      </Routes>
    </Suspense>
  );
}
