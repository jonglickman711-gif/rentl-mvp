import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/AppStore";



export default function ListItem() {
  const navigate = useNavigate();
  
  // If store isn't wired correctly, this will throw.
  // We catch it so the page never goes blank.
  let addListing, session;
  try {
    ({ addListing, session } = useAppStore());
  } catch (e) {
    return (
      <div style={{ padding: 24 }}>
        <h1>List an Item</h1>
        <p style={{ color: "#b00020" }}>
          Store not connected. Make sure AppStoreProvider wraps App in <code>src/main.jsx</code>.
        </p>
        <pre style={{ whiteSpace: "pre-wrap", background: "#fafafa", padding: 12, borderRadius: 12, border: "1px solid #eee" }}>
          {String(e)}
        </pre>
      </div>
    );
  }

  const [title, setTitle] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [location, setLocation] = useState("NYC");
  const [category, setCategory] = useState("Party");
  
  const [description, setDescription] = useState("");

  const canSubmit = title.trim() && Number(pricePerDay) > 0 && description.trim() && session;

  const submit = () => {
    if (!canSubmit || !session) return;
    
    const newListing = {
      id: `l${Date.now()}`,
      title: title.trim(),
      pricePerDay: Number(pricePerDay),
      ownerId: session.id,
      ownerName: session.name,
      ownerType: session.role,
      location,
      category,
      description: description.trim(),
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
          Listing as <strong>{session.name}</strong> ({session.role})
        </p>
      ) : (
        <p style={{ color: "#b00020" }}>
          Start a session above before creating a listing.
        </p>
      )}

      <div style={{ display: "grid", gap: 10, maxWidth: 520 }}>
        <Field label="Title">
          <input value={title} onChange={(e) => setTitle(e.target.value)} style={input} placeholder="e.g., Folding Table + Chairs" />
        </Field>

        <Field label="Price per day">
          <input value={pricePerDay} onChange={(e) => setPricePerDay(e.target.value)} style={input} placeholder="e.g., 25" />
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
          <input value={location} onChange={(e) => setLocation(e.target.value)} style={input} placeholder="e.g., Brooklyn" />
        </Field>

        <Field label="Description">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ ...input, height: 110 }} placeholder="What’s included, pickup/delivery notes, condition..." />
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
