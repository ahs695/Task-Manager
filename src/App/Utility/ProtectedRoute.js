import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hasPermission } from "./permission";

const ProtectedRoute = ({ resource, children }) => {
  const navigate = useNavigate();
  const permissions = useSelector((state) => state.auth.permissions);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const isAllowed = hasPermission(permissions, resource, "view");

  useEffect(() => {
    if (!isAllowed && isAuthenticated) {
      alert(`Access denied to ${resource}`);
      setShouldRedirect(true);
    }
  }, [isAllowed, isAuthenticated, resource]);

  useEffect(() => {
    if (shouldRedirect) {
      navigate("/admin-dashboard/info");
    }
  }, [shouldRedirect, navigate]);

  if (!isAllowed && isAuthenticated) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
