import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Signup() {
  const q = useQuery();
  const navigate = useNavigate();
  const role = q.get("role"); // "public" or "community"

  const roleLabel =
    role === "community" ? "Community Member" : role === "public" ? "Public" : null;

  return (
    <div style={{ textAlign: "center", marginTop: 60 }}>
      <h1>Signup</h1>

      {roleLabel ? (
        <p style={{ color: "#444" }}>
          You selected: <b>{roleLabel}</b>
        </p>
      ) : (
        <p style={{ color: "#b00020" }}>
          No role selected. Go back to Get Started.
        </p>
      )}

      <div style={{ marginTop: 16, display: "grid", gap: 10, justifyContent: "center" }}>
        <input placeholder="Email" style={{ padding: 10, width: 280 }} />
        <input placeholder="Password" type="password" style={{ padding: 10, width: 280 }} />
        <button
          onClick={() => alert("Later: connect to auth")}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid #111",
            background: "#111",
            color: "white",
            cursor: "pointer",
          }}
        >
          Create account
        </button>

        <button
          onClick={() => navigate("/get-started")}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid #ddd",
            background: "white",
            cursor: "pointer",
          }}
        >
          Back to Get Started
        </button>
      </div>
    </div>
  );
}
