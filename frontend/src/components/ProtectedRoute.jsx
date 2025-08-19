
import { Navigate } from "react-router-dom";
import useStore from "../store/useStore";

const ProtectedRoute = ({ children }) => {
  const { token } = useStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
