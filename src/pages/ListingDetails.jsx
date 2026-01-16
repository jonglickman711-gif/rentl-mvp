import React, { useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAppStore } from "../store/AppStore";

function toISO(d) {
  // expects "YYYY-MM-DD" already from input[type=date]
  return d;
}

function isValidRange(start, end) {
  if (!start || !end) return false;
  return new Date(start) <= new Date(end);
}

function overlaps(aStart, aEnd, bStart, bEnd) {
  // inclusive overlap
  const aS = new Date(aStart).getTime();
  const aE = new Date(aEnd).getTime();
  const bS = new Date(bStart).getTime();
  const bE = new Date(bEnd).getTime();
  return aS <= bE && bS <= aE;
}

function formatRange(r) {
  return `${r.start} → ${r.end}`;
}

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { listings, addRequest, session } = useAppStore();
  const listing = listings.find((l) => l.id === id);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  if (!listing) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Listing Not Found</h1>
        <button
          onClick={() => navigate("/browse")}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid #ddd",
            background: "white",
            cursor: "pointer",
          }}
        >
          Back to Browse
        </button>
      </div>
    );
  }

  const blockedRanges = Array.isArray(listing.blockedRanges) ? listing.blockedRanges : [];

  const hasOverlap = useMemo(() => {
    if (!isValidRange(startDate, endDate)) return false;
    return blockedRanges.some((r) => overlaps(startDate, endDate, r.start, r.end));
  }, [startDate, endDate, blockedRanges]);

  const canRequest =
    !!session &&
    isValidRange(startDate, endDate) &&
    !hasOverlap;

  const submitRequest = () => {
    if (!session) {
      alert("Please start a session on Get Started first.");
      navigate("/get-started", { state: { loginRequired: true, from: "Listing Details" } });
      return;
    }

    if (!isValidRange(startDate, endDate)) {
      alert("Please choose a valid start and end date.");
      return;
    }

    if (hasOverlap) {
      alert("Those dates are unavailable. Please choose different dates.");
      return;
    }

    const request = {
      id: `r${Date.now()}`,
      listingId: listing.id,

      // renter
      renterId: session.id,
      renterName: session.name,
      renterRole: session.role,

      // owner snapshot (handy for dashboard filtering and display)
      ownerId: listing.ownerId,
      ownerName: listing.ownerName,

      // dates
      startDate: toISO(startDate),
      endDate: toISO(endDate),

      status: "pending",
      createdAt: new Date().toISOString(),
    };

    addRequest(request);
    alert("Request sent! Check your Dashboard for status.");
    navigate("/dashboard");
  };

  const scope = listing.visibility ?? listing.ownerType ?? listing.ownerRole;
  const scopeLabel = scope === "community" ? "Community" : "Public";

  return (
    <div style={{ padding: 24 }}>
      <button
        onClick={() => navigate("/browse")}
        style={{
          padding: "8px 12px",
          borderRadius: 12,
          border: "1px solid #ddd",
          background: "white",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>

      <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
        <h1 style={{ margin: 0 }}>{listing.title}</h1>
        <span
          style={{
            fontSize: 12,
            padding: "4px 10px",
            borderRadius: 999,
            border: "1px solid #ddd",
            background: scope === "community" ? "#fafafa" : "white",
            color: "#333",
          }}
        >
          {scopeLabel}
        </span>
      </div>

      <div style={{ color: "#666", marginBottom: 10, marginTop: 6 }}>
        {listing.category} • {listing.location} • Owner: {listing.ownerName}
      </div>

      <div style={{ border: "1px solid #eee", borderRadius: 16, padding: 16, background: "white" }}>
        <p style={{ marginTop: 0, color: "#333", lineHeight: 1.5 }}>{listing.description}</p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
          <b style={{ fontSize: 18 }}>${listing.pricePerDay}/day</b>
          <div style={{ fontSize: 12, color: "#666" }}>
            {session ? (
              <span>
                Signed in as <b>{session.name}</b> ({session.role})
              </span>
            ) : (
              <span>
                Not signed in.{" "}
                <Link to="/get-started" style={{ color: "#111", fontWeight: 800 }}>
                  Get Started
                </Link>
              </span>
            )}
          </div>
        </div>

        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxWidth: 520 }}>
          <label>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>Start date</div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: 12, border: "1px solid #ddd" }}
            />
          </label>

          <label>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>End date</div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: 12, border: "1px solid #ddd" }}
            />
          </label>
        </div>

        {/* Availability feedback */}
        <div style={{ marginTop: 10, fontSize: 13 }}>
          {!startDate || !endDate ? (
            <div style={{ color: "#666" }}>Select dates to check availability.</div>
          ) : !isValidRange(startDate, endDate) ? (
            <div style={{ color: "#b00020", fontWeight: 700 }}>End date must be on or after start date.</div>
          ) : hasOverlap ? (
            <div style={{ color: "#b00020", fontWeight: 700 }}>Unavailable for those dates.</div>
          ) : (
            <div style={{ color: "#1b5e20", fontWeight: 700 }}>Available for those dates.</div>
          )}
        </div>

        <button
          onClick={submitRequest}
          disabled={!canRequest}
          style={{
            marginTop: 14,
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid #111",
            background: canRequest ? "#111" : "#999",
            color: "white",
            cursor: canRequest ? "pointer" : "not-allowed",
          }}
        >
          Request to Rent
        </button>

        <div style={{ marginTop: 12, color: "#777", fontSize: 12, lineHeight: 1.5 }}>
          MVP note: approvals block dates so other renters can’t double-book. Payments come later.
        </div>

        {/* Blocked dates display */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Unavailable dates</div>

          {blockedRanges.length === 0 ? (
            <div style={{ fontSize: 13, color: "#666" }}>No blocked dates yet.</div>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {blockedRanges.map((r, idx) => (
                <div
                  key={`${r.start}-${r.end}-${idx}`}
                  style={{
                    border: "1px solid #eee",
                    borderRadius: 14,
                    padding: 10,
                    background: "#fafafa",
                    fontSize: 13,
                    color: "#444",
                  }}
                >
                  {formatRange(r)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
