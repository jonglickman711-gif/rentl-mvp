import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppStore } from "../store/AppStore";

const wrap = {
  maxWidth: 980,
  margin: "0 auto",
  padding: "24px 16px",
};

const card = {
  border: "1px solid #eee",
  borderRadius: 18,
  padding: 16,
  background: "white",
};

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
};

const btnLight = {
  padding: "10px 14px",
  borderRadius: 12,
  border: "1px solid #ddd",
  background: "white",
  cursor: "pointer",
  textDecoration: "none",
  color: "#111",
  display: "inline-block",
};

export default function RequestCommunity() {
  const { session } = useAppStore();

  const [fullName, setFullName] = useState(session?.name || "");
  const [email, setEmail] = useState("");
  const [communityName, setCommunityName] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");

  const referralCode = useMemo(() => {
    const base = `${(communityName || "RENTL").trim()}-${(city || "NYC").trim()}`
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 18);

    const suffix = Math.floor(100 + Math.random() * 900);
    return `${base}-${suffix}`;
  }, [communityName, city]);

  const canSubmit =
    fullName.trim() &&
    email.trim().includes("@") &&
    communityName.trim() &&
    city.trim();

  const submit = () => {
    if (!canSubmit) return;

    alert(
      `MVP: Request submitted!\n\nReferral code: ${referralCode}\n\nNext (later): this will send to a backend + notify the RentL team.`
    );

    // Optional: clear form
    setNotes("");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      alert("Copied referral code.");
    } catch {
      alert("Could not copy. You can manually copy the code shown.");
    }
  };

  return (
    <div style={wrap}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0 }}>Invite your community</h1>
          <p style={{ marginTop: 8, color: "#444", maxWidth: 720, lineHeight: 1.5 }}>
            RentL works best when a building or HOA has shared inventory. This page is a growth lever:
            request onboarding, share a referral code, and unlock community-only listings.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <Link to="/browse" style={btnLight}>Back to Browse</Link>
          <Link to="/get-started" style={btnLight}>Get Started</Link>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 14, marginTop: 18 }}>
        <div style={card}>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>Onboarding request (MVP fake door)</div>

          <div style={{ display: "grid", gap: 10 }}>
            <Field label="Your name">
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} style={input} placeholder="e.g., Jordan Lee" />
            </Field>

            <Field label="Email">
              <input value={email} onChange={(e) => setEmail(e.target.value)} style={input} placeholder="e.g., jordan@email.com" />
            </Field>

            <Field label="Community name (building, HOA, campus, etc.)">
              <input value={communityName} onChange={(e) => setCommunityName(e.target.value)} style={input} placeholder="e.g., Skyline Apartments" />
            </Field>

            <Field label="City">
              <input value={city} onChange={(e) => setCity(e.target.value)} style={input} placeholder="e.g., New York" />
            </Field>

            <Field label="Notes (optional)">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ ...input, height: 110 }}
                placeholder="Any details that help onboard your community faster..."
              />
            </Field>

            <button onClick={submit} disabled={!canSubmit} style={{ ...btnDark, opacity: canSubmit ? 1 : 0.55 }}>
              Submit request
            </button>

            <div style={{ fontSize: 12, color: "#777", lineHeight: 1.5 }}>
              MVP note: this does not submit to a backend yet. It’s a “fake door” to validate demand and grow supply.
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          <div style={card}>
            <div style={{ fontWeight: 900, marginBottom: 8 }}>Referral code</div>
            <div style={{ color: "#444", fontSize: 13, lineHeight: 1.5 }}>
              Share this code with your community manager or friends in your building.
              Later, this will unlock community-only inventory.
            </div>

            <div
              style={{
                marginTop: 12,
                border: "1px solid #ddd",
                borderRadius: 14,
                padding: 12,
                background: "#fafafa",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                fontWeight: 800,
              }}
            >
              {referralCode}
            </div>

            <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={copy} style={btnLight}>Copy code</button>
              <Link to="/get-started" style={btnLight}>Enter community code</Link>
            </div>
          </div>

          <div style={card}>
            <div style={{ fontWeight: 900, marginBottom: 10 }}>What happens next</div>
            <ul style={{ margin: 0, paddingLeft: 18, color: "#444", lineHeight: 1.7 }}>
              <li>We verify the community and create a shared inventory space.</li>
              <li>Members get a community code to access community-only listings.</li>
              <li>Over time, listings can optionally become public to drive demand.</li>
            </ul>

            <div style={{ marginTop: 12, fontSize: 12, color: "#777" }}>
              This is designed to build trusted supply first, then scale.
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 18, borderRadius: 18, padding: 16, border: "1px solid #eee", background: "white" }}>
        <div style={{ fontWeight: 900, marginBottom: 8 }}>Why this works</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          <MiniCard title="Supply-first growth" body="Communities create dense, trusted inventory fast." />
          <MiniCard title="Lower friction" body="Members don’t need to list publicly to participate." />
          <MiniCard title="Easy conversion" body="Once supply exists, public demand becomes a growth engine." />
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label>
      <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>{label}</div>
      {children}
    </label>
  );
}

function MiniCard({ title, body }) {
  return (
    <div style={{ border: "1px solid #eee", borderRadius: 16, padding: 12, background: "#fafafa" }}>
      <div style={{ fontWeight: 900, marginBottom: 6 }}>{title}</div>
      <div style={{ color: "#444", fontSize: 13, lineHeight: 1.5 }}>{body}</div>
    </div>
  );
}
