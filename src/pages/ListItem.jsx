import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/AppStore";

export default function ListItem() {
  const navigate = useNavigate();

  // If store isn't wired correctly, this will throw.
  // We catch it so the page never goes blank.
  let store;
  try {
    store = useAppStore();
  } catch (e) {
    return (
      <div style={{ padding: 24 }}>
        <h1>List an Item</h1>
        <p style={{ color: "#b00020" }}>
          Store not connected. Make sure AppStoreProvider wraps App in <code>src/main.jsx</code>.
        </p>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            background: "#fafafa",
            padding: 12,
            borderRadius: 12,
            border: "1px solid #eee",
          }}
        >
          {String(e)}
        </pre>
      </div>
    );
  }

  const addListing = store.addListing;
  const session = store.session;

  const [title, setTitle] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [location, setLocation] = useState("NYC");
  const [category, setCategory] = useState("Party");
  const [description, setDescription] = useState("");

  // NEW: visibility selector (defaults based on your role if available)
  const [visibility, setVisibility] = useState(
    session?.role === "community" ? "community" : "public"
  );

  const canSubmit = title.trim() && Number(pricePerDay) > 0 && description.trim();

  const submit = () => {
    if (!canSubmit) return;

    if (!session) {
      alert("Start a session first.");
      return;
    }

    // If trying to list community-only, require community code
    if (visibility === "community" && !session.communityCode) {
      alert("Community listings require a community code. Log in via Get Started with your community code.");
      return;
    }

    const newListing = {
      id: `l${Date.now()}`,
      title: title.trim(),
      pricePerDay: Number(pricePerDay),

      ownerId: session.id,
      ownerName: session.name,
      ownerRole: session.role,

      // NEW: visibility + community code gating
      visibility,
      communityCode: visibility === "community" ? session.communityCode : null,

      location,
      category,
      description: description.trim(),

      // NEW: used later for availability blocking
      blockedRanges: [],
    };

    addListing(newListing);
    navigate(`/listing/${newListing.id}`);
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>List an Item</h1>
      <p style={{ color: "#444" }}>MVP: adds listing in-memory (later swaps to database).</p>

      {session ? (
        <p style={{ color: "#444" }}>
          Listing as <strong>{session.name}</strong> ({session.role}
          {session.communityCode ? ` • ${session.communityCode}` : ""})
        </p>
      ) : (
        <p style={{ color: "#b00020" }}>
          Start a session on Get Started page before creating a listing.
        </p>
      )}

      <div style={{ display: "grid", gap: 10, maxWidth: 520 }}>
        <Field label="Title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={input}
            placeholder="e.g., Folding Table + Chairs"
          />
        </Field>

        <Field label="Price per day">
          <input
            value={pricePerDay}
            onChange={(e) => setPricePerDay(e.target.value)}
            style={input}
            placeholder="e.g., 25"
          />
        </Field>

        <Field label="Category">
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={input}>
            <option>Party</option>
            <option>Tools</option>
            <option>Electronics</option>
            <option>Outdoors</option>
            <option>Family</option>
            <option>Travel</option>
          </select>
        </Field>

        <Field label="Location">
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={input}
            placeholder="e.g., Brooklyn"
          />
        </Field>

        {/* NEW: Visibility selector */}
        <Field label="Visibility">
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            style={input}
          >
            <option value="public">Public</option>
            <option value="community">Community only</option>
          </select>
        </Field>

        {/* NEW: Show code hint if community-only */}
        {visibility === "community" ? (
          <div style={{ fontSize: 12, color: "#777", marginTop: -4 }}>
            This listing will only be visible to members signed in with your community code.
          </div>
        ) : null}

        <Field label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...input, height: 110 }}
            placeholder="What’s included, pickup/delivery notes, condition..."
          />
        </Field>

        <button
          onClick={submit}
          disabled={!canSubmit}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid #111",
            background: canSubmit ? "#111" : "#999",
            color: "white",
            cursor: canSubmit ? "pointer" : "not-allowed",
          }}
        >
          Create Listing
        </button>
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

const input = { width: "100%", padding: 10, borderRadius: 12, border: "1px solid #ddd" };
