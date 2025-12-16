import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const cardStyle = (selected) => ({
  border: selected ? "2px solid #111" : "1px solid #ddd",
  borderRadius: 14,
  padding: 18,
  cursor: "pointer",
  background: selected ? "#f4f4f4" : "white",
});

export default function GetStarted() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  const go = () => {
    if (!role) return;
    navigate(`/signup?role=${role}`);
  };

  return (
    <div>
      <h1 style={{ marginBottom: 8 }}>Get Started</h1>
      <p style={{ marginTop: 0, color: "#444" }}>
        Choose your account type. You can change this later.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 18 }}>
        <div
          role="button"
          tabIndex={0}
          onClick={() => setRole("public")}
          style={cardStyle(role === "public")}
        >
          <h2 style={{ marginTop: 0 }}>Public Account</h2>
          <p style={{ marginBottom: 0, color: "#444" }}>
            Browse items, request rentals, and manage your rentals.
          </p>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => setRole("community")}
          style={cardStyle(role === "community")}
        >
          <h2 style={{ marginTop: 0 }}>Community Member</h2>
          <p style={{ marginBottom: 0, color: "#444" }}>
            List items, approve requests, and manage your listings.
          </p>
        </div>
      </div>

      <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
        <button
          onClick={go}
          disabled={!role}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid #111",
            background: role ? "#111" : "#999",
            color: "white",
            cursor: role ? "pointer" : "not-allowed",
          }}
        >
          Continue
        </button>

        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid #ddd",
            background: "white",
            cursor: "pointer",
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
}
