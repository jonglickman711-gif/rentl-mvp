import React, { useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { mockPlaylists } from "../data/mockPlaylists";
import { mockListings } from "../data/mockListings";

const btnBase = {
  padding: "10px 14px",
  borderRadius: 12,
  border: "1px solid #ddd",
  background: "white",
  cursor: "pointer",
};

export default function PlaylistDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const playlist = useMemo(() => mockPlaylists.find((p) => p.id === id), [id]);

  if (!playlist) {
    return (
      <div>
        <h1>Playlist Not Found</h1>
        <button onClick={() => navigate("/playlists")} style={btnBase}>
          Back to Playlists
        </button>
      </div>
    );
  }

  // Map itemIds to listings, but keep missing items for a better UX
  const resolvedItems = useMemo(() => {
    return playlist.itemIds.map((itemId) => {
      const listing = mockListings.find((l) => l.id === itemId);
      return { itemId, listing };
    });
  }, [playlist.itemIds]);

  const includedListings = useMemo(
    () => resolvedItems.filter((x) => Boolean(x.listing)).map((x) => x.listing),
    [resolvedItems]
  );

  const missingCount = useMemo(
    () => resolvedItems.filter((x) => !x.listing).length,
    [resolvedItems]
  );

  const estTotalPerDay = useMemo(() => {
    return includedListings.reduce((sum, l) => sum + (Number(l.pricePerDay) || 0), 0);
  }, [includedListings]);

  const upsells = Array.isArray(playlist.upsell) ? playlist.upsell : [];

  return (
    <div>
      <button onClick={() => navigate("/playlists")} style={{ ...btnBase, padding: "8px 12px" }}>
        ← Back
      </button>

      <h1 style={{ marginTop: 14 }}>{playlist.title}</h1>
      <div style={{ color: "#666", marginTop: 4 }}>{playlist.subtitle}</div>

      <div style={{ marginTop: 12, fontSize: 13, color: "#666" }}>
        Includes <b>{playlist.itemIds.length}</b> item{playlist.itemIds.length !== 1 ? "s" : ""} •
        Est. <b>${estTotalPerDay}/day</b>
        {missingCount > 0 ? (
          <span style={{ color: "#a15" }}> • {missingCount} unavailable</span>
        ) : null}
      </div>

      <div style={{ marginTop: 18, border: "1px solid #eee", borderRadius: 14, padding: 16, background: "white" }}>
        <h3 style={{ marginTop: 0 }}>Included rentals</h3>

        <div style={{ display: "grid", gap: 10 }}>
          {resolvedItems.map(({ itemId, listing }) => {
            if (!listing) {
              return (
                <div
                  key={itemId}
                  style={{
                    border: "1px dashed #ddd",
                    borderRadius: 12,
                    padding: 12,
                    background: "#fafafa",
                    color: "#777",
                  }}
                >
                  <div style={{ fontSize: 12, marginBottom: 6 }}>Unavailable item</div>
                  <div style={{ fontSize: 13 }}>
                    This item is not currently listed, but the playlist still recommends it.
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={listing.id}
                to={`/listing/${listing.id}`}
                style={{
                  textDecoration: "none",
                  color: "#111",
                  border: "1px solid #ddd",
                  borderRadius: 12,
                  padding: 12,
                  background: "white",
                }}
              >
                <div style={{ fontSize: 12, color: "#666" }}>
                  {listing.category} • {listing.location}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <b>{listing.title}</b>
                  <span>${listing.pricePerDay}/day</span>
                </div>

                <div style={{ marginTop: 6, fontSize: 12, color: "#666" }}>
                  Owner: {listing.ownerName}
                </div>
              </Link>
            );
          })}
        </div>

        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #eee" }}>
          <h3 style={{ marginTop: 0 }}>Suggested one-ups!</h3>

          {upsells.length === 0 ? (
            <div style={{ fontSize: 13, color: "#777" }}>
              No one-ups for this playlist yet.
            </div>
          ) : (
            <ul style={{ marginTop: 8, color: "#444", paddingLeft: 18 }}>
              {upsells.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          )}

          {playlist.notes ? (
            <div style={{ marginTop: 10, fontSize: 12, color: "#777" }}>
              {playlist.notes}
            </div>
          ) : null}
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={() =>
              alert(
                `MVP stub: Request this playlist\nIncluded listings: ${includedListings.length}\nEst total/day: $${estTotalPerDay}`
              )
            }
            style={{
              ...btnBase,
              border: "1px solid #111",
              background: "#111",
              color: "white",
            }}
          >
            Request this playlist
          </button>

          <button
            onClick={() => alert("Later: show same-owner bundle discounts and bundle-aware upsells")}
            style={btnBase}
          >
            Same-owner bundles
          </button>
        </div>
      </div>
    </div>
  );
}
