import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { mockListings } from "../data/MockListings";

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: 14,
  padding: 16,
  textDecoration: "none",
  color: "#111",
  background: "white",
};

export default function Browse() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return mockListings;
    return mockListings.filter((l) =>
      [l.title, l.category, l.location, l.ownerName].some((x) =>
        String(x).toLowerCase().includes(query)
      )
    );
  }, [q]);

  return (
    <div>
      <h1>Browse</h1>
      <p style={{ color: "#444" }}>Explore what’s available near you.</p>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search items, category, location..."
        style={{ padding: 10, width: "100%", maxWidth: 520, borderRadius: 12, border: "1px solid #ddd" }}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginTop: 18 }}>
        {filtered.map((l) => (
          <Link key={l.id} to={`/listing/${l.id}`} style={cardStyle}>
            <div style={{ fontSize: 12, color: "#666" }}>{l.category} • {l.location}</div>
            <h3 style={{ margin: "8px 0" }}>{l.title}</h3>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
              <span style={{ color: "#444" }}>Owner: {l.ownerName}</span>
              <b>${l.pricePerDay}/day</b>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
