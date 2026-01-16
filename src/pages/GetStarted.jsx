import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppStore } from "../store/AppStore";

const wrap = {
  maxWidth: 860,
  margin: "0 auto",
  padding: "28px 16px",
};

const card = {
  border: "1px solid #eee",
  borderRadius: 18,
  padding: 16,
  background: "white",
};

const cardStyle = (selected) => ({
  border: selected ? "2px solid #111" : "1px solid #ddd",
  borderRadius: 16,
  padding: 16,
  cursor: "pointer",
  background: selected ? "#f4f4f4" : "white",
});

const input = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #ddd",
};

const btnDark = {
  padding: "10px 14px",
  borderRadius: 12,
  border: "1px solid #111",
  background: "#111",
  color: "white",
  cursor: "pointer",
  fontWeight: 800,
};

const btnLight = {
  padding: "10px 14px",
  borderRadius: 12,
  border: "1px solid #ddd",
  background: "white",
  cursor: "pointer",
  fontWeight: 800,
  textDecoration: "none",
  color: "#111",
  display: "inline-block",
};

export default function GetStarted() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showLoginPopout, setShowLoginPopout] = useState(Boolean(location.state?.loginRequired));

  const { session, loginAs, logout } = useAppStore();

  const [role, setRole] = useState(null);
  const [name, setName] = useState("");
  const [communityCode, setCommunityCode] = useState("");

  const canContinue = useMemo(() => {
    return (
      !!role &&
      (session || name.trim()) &&
      (session || role !== "community" || communityCode.trim())
    );
  }, [role, session, name, communityCode]);

  const go = () => {
    if (!role) return;

    // already signed in: just route based on chosen role
    if (session) {
      navigate(role === "community" ? "/dashboard" : "/browse");
      return;
    }

    if (!name.trim()) return;
    if (role === "community" && !communityCode.trim()) return;

    loginAs({
      name: name.trim(),
      role,
      communityCode: role === "community" ? communityCode.trim().toUpperCase() : undefined,
    });

    navigate(role === "community" ? "/dashboard" : "/browse");
  };

  return (
    <div style={wrap}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0 }}>Get Started</h1>
          <p style={{ marginTop: 8, color: "#555", lineHeight: 1.5 }}>
            Start a session so RentL can personalize your experience. No real auth yet (MVP).
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <Link to="/" style={btnLight}>About</Link>
          <Link to="/browse" style={btnLight}>Browse</Link>
        </div>
      </div>

      {showLoginPopout ? (
        <div
          style={{
            marginTop: 14,
            border: "1px solid #ffd7b5",
            background: "#fff7ef",
            borderRadius: 16,
            padding: 14,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontWeight: 900, marginBottom: 4 }}>Login required</div>
            <div style={{ color: "#444", fontSize: 13, lineHeight: 1.4 }}>
              Please start a session to access <b>{location.state?.from || "that page"}</b>.
            </div>
          </div>

          <button
            onClick={() => setShowLoginPopout(false)}
            style={{
              border: "1px solid #ddd",
              background: "white",
              borderRadius: 10,
              padding: "6px 10px",
              cursor: "pointer",
            }}
          >
            Dismiss
          </button>
        </div>
      ) : null}

      {/* Signed in state */}
      {session ? (
        <div style={{ ...card, marginTop: 16 }}>
          <div style={{ fontWeight: 900, marginBottom: 6 }}>You’re signed in</div>
          <div style={{ color: "#444" }}>
            Signed in as <b>{session.name}</b> ({session.role}
            {session.communityCode ? ` • ${session.communityCode}` : ""})
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => navigate(session.role === "community" ? "/dashboard" : "/browse")}
              style={btnDark}
            >
              Continue
            </button>

            <button
              onClick={() => logout()}
              style={{
                ...btnLight,
                border: "1px solid #ddd",
              }}
            >
              Log out
            </button>
          </div>

          <div style={{ marginTop: 10, fontSize: 12, color: "#777", lineHeight: 1.5 }}>
            Tip: Use the same name + community code to return to the same profile (MVP behavior).
          </div>
        </div>
      ) : null}

      {/* Onboarding selection */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 16 }}>
        <div role="button" tabIndex={0} onClick={() => setRole("public")} style={cardStyle(role === "public")}>
          <div style={{ fontWeight: 900, fontSize: 16 }}>Public Account</div>
          <div style={{ marginTop: 8, color: "#444", fontSize: 13, lineHeight: 1.5 }}>
            Browse items, request rentals, and manage your rental requests.
          </div>
        </div>

        <div role="button" tabIndex={0} onClick={() => setRole("community")} style={cardStyle(role === "community")}>
          <div style={{ fontWeight: 900, fontSize: 16 }}>Community Member</div>
          <div style={{ marginTop: 8, color: "#444", fontSize: 13, lineHeight: 1.5 }}>
            List items, approve requests, and manage your community inventory.
          </div>
        </div>
      </div>

      {/* Inputs */}
      {!session ? (
        <div style={{ ...card, marginTop: 14 }}>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>Your details</div>

          <div style={{ display: "grid", gap: 12 }}>
            <label>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>Your name</div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Jordan"
                style={input}
              />
            </label>

            {role === "community" ? (
              <label>
                <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>Community code</div>
                <input
                  value={communityCode}
                  onChange={(e) => setCommunityCode(e.target.value)}
                  placeholder="e.g., SKYLINE"
                  style={{ ...input, textTransform: "uppercase" }}
                />
                <div style={{ marginTop: 8, fontSize: 12, color: "#777", lineHeight: 1.5 }}>
                  Community-only listings are only visible to members with the same code.
                </div>
              </label>
            ) : null}

            <button
              onClick={go}
              disabled={!canContinue}
              style={{
                ...btnDark,
                background: canContinue ? "#111" : "#999",
                cursor: canContinue ? "pointer" : "not-allowed",
              }}
            >
              Start session
            </button>

            <div style={{ fontSize: 12, color: "#777", lineHeight: 1.5 }}>
              MVP note: this is a lightweight session, not full authentication.
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
