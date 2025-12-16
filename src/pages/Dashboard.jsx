import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { mockListings } from "../data/mockListings";
import { mockRequests } from "../data/mockRequests";

export default function Dashboard() {
  // Mock session: change this later to real auth
  const [role, setRole] = useState("public"); // "public" or "community"
  const [currentUserName, setCurrentUserName] = useState("Jon");

  const myListings = useMemo(
    () => mockListings.filter((l) => l.ownerName === currentUserName),
    [currentUserName]
  );

  const myRentalRequests = useMemo(
    () => mockRequests.filter((r) => r.renterName === currentUserName),
    [currentUserName]
  );

  const incomingRequests = useMemo(
    () => mockRequests.filter((r) => r.ownerName === currentUserName),
    [currentUserName]
  );

  return (
    <div>
      <h1>Dashboard</h1>
      <p style={{ color: "#444" }}>MVP: mock session (we’ll replace with real auth later).</p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#666" }}>Role</span>
          <button onClick={() => setRole("public")} style={pill(role === "public")}>Public</button>
          <button onClick={() => setRole("community")} style={pill(role === "community")}>Community</button>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#666" }}>User</span>
          <select
            value={currentUserName}
            onChange={(e) => setCurrentUserName(e.target.value)}
            style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #ddd" }}
          >
            <option>Jon</option>
            <option>Rachel</option>
            <option>Mahdi</option>
            <option>Alex</option>
            <option>Sam</option>
            <option>Taylor</option>
            <option>Jordan</option>
          </select>
        </div>
      </div>

      {role === "public" ? (
        <section style={{ marginTop: 20 }}>
          <h2 style={{ marginBottom: 8 }}>My Rentals</h2>
          <div style={{ display: "grid", gap: 10 }}>
            {myRentalRequests.length === 0 ? (
              <div style={emptyBox}>No rental requests yet. Go to <Link to="/browse">Browse</Link>.</div>
            ) : (
              myRentalRequests.map((r) => (
                <div key={r.id} style={box}>
                  <div><b>Request:</b> {r.id}</div>
                  <div style={{ color: "#444" }}>Status: <b>{r.status}</b></div>
                  <div style={{ marginTop: 6 }}>
                    <Link to={`/listing/${r.listingId}`}>View listing</Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      ) : (
        <section style={{ marginTop: 20 }}>
          <h2 style={{ marginBottom: 8 }}>My Listings</h2>
          <div style={{ display: "grid", gap: 10 }}>
            {myListings.length === 0 ? (
              <div style={emptyBox}>No listings yet. (Next: build List Item page.)</div>
            ) : (
              myListings.map((l) => (
                <div key={l.id} style={box}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <b>{l.title}</b>
                    <span>${l.pricePerDay}/day</span>
                  </div>
                  <div style={{ color: "#666", fontSize: 12 }}>{l.category} • {l.location}</div>
                  <div style={{ marginTop: 6 }}>
                    <Link to={`/listing/${l.id}`}>View</Link>
                  </div>
                </div>
              ))
            )}
          </div>

          <h2 style={{ margin: "18px 0 8px" }}>Incoming Requests</h2>
          <div style={{ display: "grid", gap: 10 }}>
            {incomingRequests.length === 0 ? (
              <div style={emptyBox}>No incoming requests yet.</div>
            ) : (
              incomingRequests.map((r) => (
                <div key={r.id} style={box}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div><b>{r.renterName}</b> requested <Link to={`/listing/${r.listingId}`}>{r.listingId}</Link></div>
                    <span style={{ fontSize: 12, color: "#444" }}><b>{r.status}</b></span>
                  </div>

                  <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                    <button onClick={() => alert("Later: approve request")} style={smallBtnDark}>
                      Approve
                    </button>
                    <button onClick={() => alert("Later: decline request")} style={smallBtnLight}>
                      Decline
                    </button>
                  </div>

                  <div style={{ marginTop: 10, fontSize: 12, color: "#777" }}>
                    Payments later. For now, owner and renter coordinate manually after approval.
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
}

const pill = (active) => ({
  padding: "8px 10px",
  borderRadius: 999,
  border: "1px solid #ddd",
  background: active ? "#111" : "white",
  color: active ? "white" : "#111",
  cursor: "pointer",
});

const box = {
  border: "1px solid #ddd",
  borderRadius: 14,
  padding: 14,
  background: "white",
};

const emptyBox = {
  border: "1px dashed #bbb",
  borderRadius: 14,
  padding: 14,
  background: "#fafafa",
  color: "#444",
};

const smallBtnDark = {
  padding: "8px 10px",
  borderRadius: 12,
  border: "1px solid #111",
  background: "#111",
  color: "white",
  cursor: "pointer",
};

const smallBtnLight = {
  padding: "8px 10px",
  borderRadius: 12,
  border: "1px solid #ddd",
  background: "white",
  cursor: "pointer",
};
