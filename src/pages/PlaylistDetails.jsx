import React from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { mockPlaylists } from "../data/mockPlaylists";
import { mockListings } from "../data/mockListings";

export default function PlaylistDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const playlist = mockPlaylists.find((p) => p.id === id);

  if (!playlist) {
    return (
      <div>
        <h1>Playlist Not Found</h1>
        <button onClick={() => navigate("/playlists")}>Back to Playlists</button>
      </div>
    );
  }

  const items = playlist.itemIds
    .map((itemId) => mockListings.find((l) => l.id === itemId))
    .filter(Boolean);

  return (
    <div>
      <button
        onClick={() => navigate("/playlists")}
        style={{ padding: "8px 12px", borderRadius: 12, border: "1px solid #ddd", background: "white", cursor: "pointer" }}
      >
        ← Back
      </button>

      <h1 style={{ marginTop: 14 }}>{playlist.title}</h1>
      <div style={{ color: "#666" }}>{playlist.subtitle}</div>

      <div style={{ marginTop: 18, border: "1px solid #eee", borderRadius: 14, padding: 16, background: "white" }}>
        <h3 style={{ marginTop: 0 }}>Included rentals</h3>

        <div style={{ display: "grid", gap: 10 }}>
          {items.map((l) => (
            <Link
              key={l.id}
              to={`/listing/${l.id}`}
              style={{ textDecoration: "none", color: "#111", border: "1px solid #ddd", borderRadius: 12, padding: 12 }}
            >
              <div style={{ fontSize: 12, color: "#666" }}>{l.category} • {l.location}</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <b>{l.title}</b>
                <span>${l.pricePerDay}/day</span>
              </div>
              <div style={{ marginTop: 6, fontSize: 12, color: "#666" }}>Owner: {l.ownerName}</div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #eee" }}>
          <h3 style={{ marginTop: 0 }}>Suggested add-ons (upsells)</h3>
          <ul style={{ marginTop: 8, color: "#444" }}>
            {playlist.upsell.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>

          <div style={{ marginTop: 10, fontSize: 12, color: "#777" }}>
            {playlist.notes}
          </div>
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
          <button
            onClick={() => alert("MVP: request bundle (later: create multiple requests or one booking)")}
            style={{ padding: "10px 14px", borderRadius: 12, border: "1px solid #111", background: "#111", color: "white", cursor: "pointer" }}
          >
            Request this playlist
          </button>

          <button
            onClick={() => alert("Later: show same-owner bundle discounts")}
            style={{ padding: "10px 14px", borderRadius: 12, border: "1px solid #ddd", background: "white", cursor: "pointer" }}
          >
            Same-owner bundles
          </button>
        </div>
      </div>
    </div>
  );
}