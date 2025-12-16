import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { mockListings } from "../data/mockListings";

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: 14,
  padding: 16,
  textDecoration: "none",
  color: "#111",
  background: "white",
};

const pill = (active) => ({
  padding: "8px 10px",
  borderRadius: 999,
  border: "1px solid #ddd",
  background: active ? "#111" : "white",
  color: active ? "white" : "#111",
  cursor: "pointer",
});

const badge = {
  fontSize: 11,
  padding: "4px 8px",
  borderRadius: 999,
  border: "1px solid #ddd",
  color: "#333",
  background: "#fafafa",
};

export default function Browse() {
  const [q, setQ] = useState("");
  const [viewAs, setViewAs] = useState("public"); // "public" | "community"

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
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ marginBottom: 6 }}>Browse</h1>
          <p style={{ color: "#444", marginTop: 0 }}>Explore what’s available near you.</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#666" }}>Viewing as</span>
          <button onClick={() => setViewAs("public")} style={pill(viewAs === "public")}>
            Public
          </button>
          <button onClick={() => setViewAs("community")} style={pill(viewAs === "community")}>
            Community
          </button>

          {viewAs === "community" && (
            <Link
              to="/list-item"
              style={{
                marginLeft: 8,
                padding: "8px 10px",
                borderRadius: 12,
                border: "1px solid #111",
                background: "#111",
                color: "white",
                textDecoration: "none",
              }}
            >
              List an Item
            </Link>
          )}
        </div>
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search items, category, location..."
        style={{
          padding: 10,
          width: "100%",
          maxWidth: 520,
          borderRadius: 12,
          border: "1px solid #ddd",
        }}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginTop: 18 }}>
        {filtered.map((l) => (
          <Link key={l.id} to={`/listing/${l.id}`} style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
              <div style={{ fontSize: 12, color: "#666" }}>
                {l.category} • {l.location}
              </div>
              <div style={badge}>{l.ownerType === "community" ? "Community" : "Public"}</div>
            </div>

            <h3 style={{ margin: "8px 0" }}>{l.title}</h3>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
              <span style={{ color: "#444" }}>Owner: {l.ownerName}</span>
              <b>${l.pricePerDay}/day</b>
            </div>

            {viewAs === "public" ? (
              <div style={{ marginTop: 10, fontSize: 12, color: "#777" }}>
                Tip: request now, coordinate pickup after approval.
              </div>
            ) : (
              <div style={{ marginTop: 10, fontSize: 12, color: "#777" }}>
                Community view: see how your listing appears publicly.
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
