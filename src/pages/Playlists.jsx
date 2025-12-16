import React from "react";
import { Link } from "react-router-dom";
import { mockPlaylists } from "../data/mockPlaylists";

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: 14,
  padding: 16,
  textDecoration: "none",
  color: "#111",
  background: "white",
};

export default function Playlists() {
  return (
    <div>
      <h1>Playlists</h1>
      <p style={{ color: "#444" }}>
        Curated bundles that guide you to what you’ll actually need.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginTop: 18 }}>
        {mockPlaylists.map((p) => (
          <Link key={p.id} to={`/playlists/${p.id}`} style={cardStyle}>
            <h3 style={{ margin: "0 0 6px 0" }}>{p.title}</h3>
            <div style={{ color: "#666", marginBottom: 10 }}>{p.subtitle}</div>
            <div style={{ fontSize: 12, color: "#777" }}>
              Includes {p.itemIds.length} item{p.itemIds.length !== 1 ? "s" : ""} • plus upsells
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}