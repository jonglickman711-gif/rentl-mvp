import React from "react";
import { Link, useLocation } from "react-router-dom";

const linkStyle = (active) => ({
  padding: "10px 12px",
  borderRadius: "10px",
  textDecoration: "none",
  color: active ? "white" : "#111",
  background: active ? "#111" : "transparent",
});

export default function Nav() {
  const { pathname } = useLocation();

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 10, padding: 16, borderBottom: "1px solid #eee" }}>
      <Link to="/" style={linkStyle(pathname === "/")}>Home</Link>
      <Link to="/browse" style={linkStyle(pathname === "/browse")}>Browse</Link>
      <Link to="/playlists" style={linkStyle(pathname === "/playlists")}>Playlists</Link>
      <Link to="/dashboard" style={linkStyle(pathname === "/dashboard")}>Dashboard</Link>
      <Link to="/get-started" style={linkStyle(pathname === "/get-started")}>Get Started</Link>
      
    </div>
  );
}
