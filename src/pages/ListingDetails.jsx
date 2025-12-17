import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mockListings } from "../data/mockListings";

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const listing = mockListings.find((l) => l.id === id);

  if (!listing) {
    return (
      <div>
        <h1>Listing Not Found</h1>
        <button onClick={() => navigate("/browse")}>Back to Browse</button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate("/browse")}
        style={{ padding: "8px 12px", borderRadius: 12, border: "1px solid #ddd", background: "white", cursor: "pointer" }}
      >
        ← Back
      </button>

      <h1 style={{ marginTop: 14 }}>{listing.title}</h1>
      <div style={{ color: "#666", marginBottom: 10 }}>
        {listing.category} • {listing.location} • Owner: {listing.ownerName}
      </div>

      <div style={{ border: "1px solid #eee", borderRadius: 14, padding: 16, background: "white" }}>
        <p style={{ marginTop: 0 }}>{listing.description}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
          <b style={{ fontSize: 18 }}>${listing.pricePerDay}/day</b>

          <button
            onClick={() => alert("MVP: request created (later: store request + notify owner)")}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid #111",
              background: "#111",
              color: "white",
              cursor: "pointer",
            }}
          >
            Request to Rent
          </button>
        </div>

        <div style={{ marginTop: 10, color: "#777", fontSize: 12 }}>
          Payments coming later. For now, requests are facilitated and confirmed manually.
        </div>
      </div>
    </div>
  );
}
