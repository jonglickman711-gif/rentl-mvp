import React, { useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAppStore } from "../store/AppStore";
import AvailabilityCalendar from "../components/AvailabilityCalendar";

function toISO(date) {
  // Convert Date object to "YYYY-MM-DD" format
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isValidRange(start, end) {
  if (!start || !end) return false;
  const startDate = start instanceof Date ? start : new Date(start);
  const endDate = end instanceof Date ? end : new Date(end);
  return startDate <= endDate;
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

// Convert blocked ranges to availability ranges (inverse logic)
// If there are blocked ranges, calculate available date ranges
function calculateAvailabilityRanges(blockedRanges, minDate = new Date()) {
  if (!blockedRanges || blockedRanges.length === 0) {
    // No blocked dates, so all dates from today onwards are available
    return [{ start: minDate, end: new Date(2099, 11, 31) }]; // Far future date
  }

  const normalizedMin = new Date(minDate);
  normalizedMin.setHours(0, 0, 0, 0);

  // Sort blocked ranges by start date
  const sorted = [...blockedRanges]
    .map((r) => ({
      start: new Date(r.start),
      end: new Date(r.end),
    }))
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  const available = [];
  let currentStart = normalizedMin;

  for (const blocked of sorted) {
    blocked.start.setHours(0, 0, 0, 0);
    blocked.end.setHours(23, 59, 59, 999);

    // If there's a gap before this blocked range, it's available
    if (currentStart < blocked.start) {
      const gapEnd = new Date(blocked.start);
      gapEnd.setDate(gapEnd.getDate() - 1);
      gapEnd.setHours(23, 59, 59, 999);
      available.push({ start: new Date(currentStart), end: gapEnd });
    }

    // Move currentStart to after this blocked range
    currentStart = new Date(blocked.end);
    currentStart.setDate(currentStart.getDate() + 1);
    currentStart.setHours(0, 0, 0, 0);
  }

  // Add remaining available range after last blocked range
  if (currentStart <= new Date(2099, 11, 31)) {
    available.push({ start: currentStart, end: new Date(2099, 11, 31) });
  }

  return available;
}

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { listings, addRequest, session, requests } = useAppStore();
  const listing = listings.find((l) => l.id === id);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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

  // Get all requests for this listing
  const listingRequests = useMemo(() => {
    return requests.filter((r) => r.listingId === listing.id);
  }, [requests, listing.id]);

  // Get approved requests - these should block dates
  const approvedRequests = useMemo(() => {
    return listingRequests.filter((r) => r.status === "approved");
  }, [listingRequests]);

  // Get pending requests (excluding current user's pending requests to avoid self-warning)
  const pendingRequests = useMemo(() => {
    return listingRequests.filter(
      (r) => r.status === "pending" && r.renterId !== session?.id
    );
  }, [listingRequests, session?.id]);

  // Combine blocked ranges from listing with approved request dates
  const allBlockedRanges = useMemo(() => {
    const listingBlocked = Array.isArray(listing.blockedRanges) ? listing.blockedRanges : [];
    
    // Add approved request dates as blocked ranges
    const approvedRanges = approvedRequests.map((r) => ({
      start: r.startDate,
      end: r.endDate,
    }));

    // Merge and deduplicate
    const all = [...listingBlocked, ...approvedRanges];
    const unique = [];
    const seen = new Set();

    for (const range of all) {
      const key = `${range.start}-${range.end}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(range);
      }
    }

    return unique;
  }, [listing.blockedRanges, approvedRequests]);

  // Calculate availability ranges from all blocked ranges
  const availabilityRanges = useMemo(() => {
    return calculateAvailabilityRanges(allBlockedRanges);
  }, [allBlockedRanges]);

  // Check for overlap with blocked dates (approved requests + listing blocked ranges)
  const hasOverlap = useMemo(() => {
    if (!isValidRange(startDate, endDate)) return false;
    const startISO = toISO(startDate);
    const endISO = toISO(endDate);
    return allBlockedRanges.some((r) => overlaps(startISO, endISO, r.start, r.end));
  }, [startDate, endDate, allBlockedRanges]);

  // Check for overlap with pending requests (warning only)
  const hasPendingOverlap = useMemo(() => {
    if (!isValidRange(startDate, endDate)) return false;
    const startISO = toISO(startDate);
    const endISO = toISO(endDate);
    return pendingRequests.some((r) => overlaps(startISO, endISO, r.startDate, r.endDate));
  }, [startDate, endDate, pendingRequests]);

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

      // dates (convert Date objects to ISO strings)
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

        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 12, fontWeight: 500 }}>
            Select rental dates
          </div>
          <AvailabilityCalendar
            availabilityRanges={availabilityRanges}
            value={{ startDate, endDate }}
            onChange={({ startDate: newStart, endDate: newEnd }) => {
              setStartDate(newStart);
              setEndDate(newEnd);
            }}
            minDate={new Date()}
          />
        </div>

        {/* Availability feedback */}
        <div style={{ marginTop: 16, fontSize: 13 }}>
          {!startDate || !endDate ? (
            <div style={{ color: "#666" }}>Select dates to check availability.</div>
          ) : !isValidRange(startDate, endDate) ? (
            <div style={{ color: "#b00020", fontWeight: 700 }}>End date must be on or after start date.</div>
          ) : hasOverlap ? (
            <div style={{ color: "#b00020", fontWeight: 700 }}>
              Unavailable for those dates. These dates are already approved or blocked.
            </div>
          ) : hasPendingOverlap ? (
            <div style={{ color: "#E4572E", fontWeight: 700 }}>
              ⚠️ Warning: Another renter has a pending request for these dates. Your request may be declined if theirs is approved first.
            </div>
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

          {allBlockedRanges.length === 0 ? (
            <div style={{ fontSize: 13, color: "#666" }}>No blocked dates yet.</div>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {allBlockedRanges.map((r, idx) => (
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

        {/* Pending requests warning */}
        {pendingRequests.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontWeight: 800, marginBottom: 8, color: "#E4572E" }}>
              Pending requests (may affect availability)
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {pendingRequests.map((r) => (
                <div
                  key={r.id}
                  style={{
                    border: "1px solid #E4572E",
                    borderRadius: 14,
                    padding: 10,
                    background: "rgba(228, 87, 46, 0.08)",
                    fontSize: 13,
                    color: "#444",
                  }}
                >
                  {r.renterName}: {r.startDate} → {r.endDate} (pending)
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
