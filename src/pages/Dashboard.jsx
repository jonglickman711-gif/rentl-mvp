import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppStore } from "../store/AppStore";

const box = {
  border: "1px solid #ddd",
  borderRadius: 16,
  padding: 14,
  background: "white",
};

const emptyBox = {
  border: "1px dashed #bbb",
  borderRadius: 16,
  padding: 14,
  background: "#fafafa",
  color: "#444",
};

const btnDark = {
  padding: "8px 10px",
  borderRadius: 12,
  border: "1px solid #111",
  background: "#111",
  color: "white",
  cursor: "pointer",
};

const btnLight = {
  padding: "8px 10px",
  borderRadius: 12,
  border: "1px solid #ddd",
  background: "white",
  cursor: "pointer",
};

const statusBadge = (status) => {
  const base = {
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    border: "1px solid #ddd",
    background: "white",
    color: "#111",
  };

  if (status === "approved") return { ...base, border: "1px solid #1b5e20", color: "#1b5e20" };
  if (status === "declined") return { ...base, border: "1px solid #b00020", color: "#b00020" };
  return { ...base, border: "1px solid #999", color: "#444" };
};

function overlaps(aStart, aEnd, bStart, bEnd) {
  const aS = new Date(aStart).getTime();
  const aE = new Date(aEnd).getTime();
  const bS = new Date(bStart).getTime();
  const bE = new Date(bEnd).getTime();
  return aS <= bE && bS <= aE;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { session, requests, setRequests, listings, setListings } = useAppStore();

  if (!session) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Dashboard</h1>
        <div style={emptyBox}>
          Start a session to view your dashboard.
          <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link
              to="/get-started"
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid #111",
                background: "#111",
                color: "white",
                textDecoration: "none",
                fontWeight: 800,
              }}
            >
              Get Started
            </Link>
            <Link
              to="/browse"
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid #ddd",
                background: "white",
                color: "#111",
                textDecoration: "none",
                fontWeight: 800,
              }}
            >
              Browse
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const myListings = useMemo(() => listings.filter((l) => l.ownerId === session.id), [listings, session.id]);

  const myRentalRequests = useMemo(
    () => requests.filter((r) => r.renterId === session.id),
    [requests, session.id]
  );

  const incomingRequests = useMemo(() => {
    return requests.filter((r) => {
      const listing = listings.find((l) => l.id === r.listingId);
      return listing?.ownerId === session.id;
    });
  }, [requests, listings, session.id]);

  const updateRequestStatus = (requestId, status) => {
    setRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status } : r)));
  };

  const approveAndBlockDates = (req) => {
    // 1) approve request
    updateRequestStatus(req.id, "approved");

    // 2) block dates on the listing
    setListings((prev) =>
      prev.map((l) => {
        if (l.id !== req.listingId) return l;

        const existing = Array.isArray(l.blockedRanges) ? l.blockedRanges : [];
        const nextRange = { start: req.startDate, end: req.endDate };

        // prevent duplicate blocks
        const alreadyBlocked = existing.some(
          (r) => r.start === nextRange.start && r.end === nextRange.end
        );

        // prevent blocking conflicting dates twice (should not happen, but safe)
        const conflicts = existing.some((r) => overlaps(nextRange.start, nextRange.end, r.start, r.end));

        if (alreadyBlocked) return l;
        if (conflicts) return l;

        return { ...l, blockedRanges: [nextRange, ...existing] };
      })
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ marginBottom: 6 }}>Dashboard</h1>
          <div style={{ color: "#444" }}>
            Signed in as <b>{session.name}</b> ({session.role}
            {session.communityCode ? ` • ${session.communityCode}` : ""})
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/browse")} style={btnLight}>
            Browse
          </button>
          {session.role === "community" ? (
            <button onClick={() => navigate("/list-item")} style={btnDark}>
              List an Item
            </button>
          ) : null}
        </div>
      </div>

      {/* PUBLIC: My Rentals */}
      {session.role === "public" ? (
        <section style={{ marginTop: 20 }}>
          <h2 style={{ marginBottom: 8 }}>My Rentals</h2>

          <div style={{ display: "grid", gap: 10 }}>
            {myRentalRequests.length === 0 ? (
              <div style={emptyBox}>
                No rental requests yet. Go to <Link to="/browse">Browse</Link>.
              </div>
            ) : (
              myRentalRequests.map((r) => (
                <div key={r.id} style={box}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontWeight: 800 }}>
                        Request for{" "}
                        <Link to={`/listing/${r.listingId}`} style={{ color: "#111" }}>
                          {r.listingId}
                        </Link>
                      </div>
                      <div style={{ marginTop: 6, color: "#444" }}>
                        Dates: <b>{r.startDate}</b> → <b>{r.endDate}</b>
                      </div>
                    </div>

                    <div style={statusBadge(r.status)}>{r.status}</div>
                  </div>

                  <div style={{ marginTop: 10, fontSize: 12, color: "#777" }}>
                    After approval, coordinate pickup and return with the owner.
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      ) : (
        <>
          {/* COMMUNITY: My Listings */}
          <section style={{ marginTop: 20 }}>
            <h2 style={{ marginBottom: 8 }}>My Listings</h2>

            <div style={{ display: "grid", gap: 10 }}>
              {myListings.length === 0 ? (
                <div style={emptyBox}>
                  No listings yet. Go to <Link to="/list-item">List an Item</Link>.
                </div>
              ) : (
                myListings.map((l) => (
                  <div key={l.id} style={box}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontWeight: 900 }}>{l.title}</div>
                        <div style={{ color: "#666", fontSize: 12 }}>
                          {l.category} • {l.location}
                        </div>
                      </div>
                      <div style={{ fontWeight: 900 }}>${l.pricePerDay}/day</div>
                    </div>

                    <div style={{ marginTop: 10 }}>
                      <Link to={`/listing/${l.id}`} style={{ color: "#111", fontWeight: 800 }}>
                        View listing
                      </Link>
                    </div>

                    <div style={{ marginTop: 10, fontSize: 12, color: "#777" }}>
                      Blocked dates: <b>{Array.isArray(l.blockedRanges) ? l.blockedRanges.length : 0}</b>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* COMMUNITY: Incoming Requests */}
          <section style={{ marginTop: 20 }}>
            <h2 style={{ marginBottom: 8 }}>Incoming Requests</h2>

            <div style={{ display: "grid", gap: 10 }}>
              {incomingRequests.length === 0 ? (
                <div style={emptyBox}>No incoming requests yet.</div>
              ) : (
                incomingRequests.map((r) => (
                  <div key={r.id} style={box}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontWeight: 900 }}>
                          <b>{r.renterName}</b> requested{" "}
                          <Link to={`/listing/${r.listingId}`} style={{ color: "#111" }}>
                            {r.listingId}
                          </Link>
                        </div>
                        <div style={{ marginTop: 6, color: "#444" }}>
                          Dates: <b>{r.startDate}</b> → <b>{r.endDate}</b>
                        </div>
                      </div>

                      <div style={statusBadge(r.status)}>{r.status}</div>
                    </div>

                    <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button
                        onClick={() => approveAndBlockDates(r)}
                        disabled={r.status !== "pending"}
                        style={{
                          ...btnDark,
                          opacity: r.status === "pending" ? 1 : 0.5,
                          cursor: r.status === "pending" ? "pointer" : "not-allowed",
                        }}
                      >
                        Approve and block dates
                      </button>

                      <button
                        onClick={() => updateRequestStatus(r.id, "declined")}
                        disabled={r.status !== "pending"}
                        style={{
                          ...btnLight,
                          opacity: r.status === "pending" ? 1 : 0.5,
                          cursor: r.status === "pending" ? "pointer" : "not-allowed",
                        }}
                      >
                        Decline
                      </button>
                    </div>

                    <div style={{ marginTop: 10, fontSize: 12, color: "#777" }}>
                      Approving blocks the dates on the listing so renters can’t double-book.
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
