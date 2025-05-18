import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");

  return token ? (
    children
  ) : (
    <Navigate to="/" state={{ message: "Please Login first" }} />
  );
};

export default ProtectedRoute;
