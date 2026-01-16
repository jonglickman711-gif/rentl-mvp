import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppStore } from "../store/AppStore";

export default function RequireSession({ children }) {
  const { session } = useAppStore();
  const location = useLocation();

  if (!session) {
    return (
      <Navigate
        to="/get-started"
        replace
        state={{
          loginRequired: true,
          from: location.pathname,
        }}
      />
    );
  }

  return children;
}
