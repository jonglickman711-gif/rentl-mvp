import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Welcome to RentL</h1>
      <button onClick={() => navigate("/public")}>
        Public Account
      </button>
      <button onClick={() => navigate("/community")}>
        Community Member
      </button>
    </div>
  );
}
