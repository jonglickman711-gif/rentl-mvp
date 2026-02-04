import React from "react";
import { Link } from "react-router-dom";
import { mockPlaylists } from "../data/mockPlaylists";

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: 16,
  marginTop: 20,
};

const cardStyle = {
  border: "1px solid #e5e5e5",
  borderRadius: 16,
  padding: 18,
  textDecoration: "none",
  color: "#111",
  background: "white",
  transition: "box-shadow 0.15s ease, transform 0.15s ease",
};

const cardHoverStyle = {
  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
  transform: "translateY(-2px)",
};

export default function Playlists() {
  return (
    <div>
      <h1>Playlists</h1>
      <p style={{ color: "#444", maxWidth: 520 }}>
        Curated bundles that guide you to what you’ll actually need. Each playlist is a starting point, not a checkout.
      </p>

      <div style={gridStyle}>
        {mockPlaylists.map((p) => (
          <Link
            key={p.id}
            to={`/playlists/${p.id}`}
            style={cardStyle}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle)}
          >
            <h3 style={{ margin: "0 0 6px 0" }}>{p.title}</h3>

            <div style={{ color: "#666", marginBottom: 10 }}>
              {p.subtitle}
            </div>

            <div style={{ fontSize: 12, color: "#777" }}>
              Includes {p.itemIds.length} item{p.itemIds.length !== 1 ? "s" : ""} • optional upsells
            </div>

            <div style={{ fontSize: 12, color: "#999", marginTop: 6 }}>
              Availability and pricing vary by item
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
