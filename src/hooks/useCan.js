import { useSelector } from "react-redux";

export const useCan = (code) =>
  useSelector((s) => {
    const role = s.user.profile?.role;
    if (role === "ADMIN") return true;
    const permissions = s.user.permissions || [];
    return permissions.includes(code);
  });

export default useCan;
