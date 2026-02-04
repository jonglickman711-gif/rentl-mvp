import React, { useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAppStore } from "../store/AppStore";
import AvailabilityCalendar from "../components/AvailabilityCalendar";

function toISO(date) {
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
  const aS = new Date(aStart).getTime();
  const aE = new Date(aEnd).getTime();
  const bS = new Date(bStart).getTime();
  const bE = new Date(bEnd).getTime();
  return aS <= bE && bS <= aE;
}

function formatRange(r) {
  return `${r.start} → ${r.end}`;
}

function calculateAvailabilityRanges(blockedRanges, minDate = new Date()) {
  if (!blockedRanges || blockedRanges.length === 0) {
    return [{ start: minDate, end: new Date(2099, 11, 31) }];
  }

  const normalizedMin = new Date(minDate);
  normalizedMin.setHours(0, 0, 0, 0);

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

    if (currentStart < blocked.start) {
      const gapEnd = new Date(blocked.start);
      gapEnd.setDate(gapEnd.getDate() - 1);
      gapEnd.setHours(23, 59, 59, 999);
      available.push({ start: new Date(currentStart), end: gapEnd });
    }

    currentStart = new Date(blocked.end);
    currentStart.setDate(currentStart.getDate() + 1);
    currentStart.setHours(0, 0, 0, 0);
  }

  if (currentStart <= new Date(2099, 11, 31)) {
    available.push({ start: currentStart, end: new Date(2099, 11, 31) });
  }

  return available;
}

function normalizeStr(v) {
  return String(v || "").trim().toLowerCase();
}

function tokenize(text) {
  return normalizeStr(text)
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function scoreRelated(baseListing, candidate) {
  if (!baseListing || !candidate) return 0;

  let score = 0;

  // Same category is a strong signal
  if (normalizeStr(candidate.category) && normalizeStr(candidate.category) === normalizeStr(baseListing.category)) {
    score += 6;
  }

  // Title keyword overlap
  const baseTokens = new Set(tokenize(`${baseListing.title} ${baseListing.description}`));
  const candTokens = tokenize(`${candidate.title} ${candidate.description}`);

  let overlapCount = 0;
  for (const t of candTokens) {
    if (baseTokens.has(t)) overlapCount += 1;
  }
  score += Math.min(overlapCount, 6); // cap

  // Same location is mild signal
  if (normalizeStr(candidate.location) && normalizeStr(candidate.location) === normalizeStr(baseListing.location)) {
    score += 2;
  }

  return score;
}

const page = { padding: 24 };

const backBtn = {
  padding: "8px 12px",
  borderRadius: 12,
  border: "1px solid #ddd",
  background: "white",
  cursor: "pointer",
};

const badge = (active) => ({
  fontSize: 12,
  padding: "4px 10px",
  borderRadius: 999,
  border: "1px solid #ddd",
  background: active ? "#fafafa" : "white",
  color: "#333",
});

const card = {
  border: "1px solid #eee",
  borderRadius: 16,
  padding: 16,
  background: "white",
};

const miniCard = {
  textDecoration: "none",
  color: "#111",
  border: "1px solid #eee",
  borderRadius: 14,
  padding: 12,
  background: "white",
  display: "block",
};

const miniCardTitleRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: 10,
  alignItems: "baseline",
  marginTop: 6,
};

const sectionTitle = {
  fontWeight: 900,
  marginBottom: 10,
  marginTop: 18,
};

const pillSmall = {
  fontSize: 11,
  padding: "4px 10px",
  borderRadius: 999,
  border: "1px solid #eee",
  background: "#fafafa",
  color: "#444",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { listings, addRequest, session, requests } = useAppStore();
  const listing = listings.find((l) => l.id === id);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  if (!listing) {
    return (
      <div style={page}>
        <h1>Listing Not Found</h1>
        <button onClick={() => navigate("/browse")} style={backBtn}>
          Back to Browse
        </button>
      </div>
    );
  }

  // Requests scoped to this listing
  const listingRequests = useMemo(() => {
    return requests.filter((r) => r.listingId === listing.id);
  }, [requests, listing.id]);

  const approvedRequests = useMemo(() => {
    return listingRequests.filter((r) => r.status === "approved");
  }, [listingRequests]);

  const pendingRequests = useMemo(() => {
    return listingRequests.filter((r) => r.status === "pending" && r.renterId !== session?.id);
  }, [listingRequests, session?.id]);

  const allBlockedRanges = useMemo(() => {
    const listingBlocked = Array.isArray(listing.blockedRanges) ? listing.blockedRanges : [];
    const approvedRanges = approvedRequests.map((r) => ({ start: r.startDate, end: r.endDate }));

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

  const availabilityRanges = useMemo(() => {
    return calculateAvailabilityRanges(allBlockedRanges);
  }, [allBlockedRanges]);

  const hasOverlap = useMemo(() => {
    if (!isValidRange(startDate, endDate)) return false;
    const startISO = toISO(startDate);
    const endISO = toISO(endDate);
    return allBlockedRanges.some((r) => overlaps(startISO, endISO, r.start, r.end));
  }, [startDate, endDate, allBlockedRanges]);

  const hasPendingOverlap = useMemo(() => {
    if (!isValidRange(startDate, endDate)) return false;
    const startISO = toISO(startDate);
    const endISO = toISO(endDate);
    return pendingRequests.some((r) => overlaps(startISO, endISO, r.startDate, r.endDate));
  }, [startDate, endDate, pendingRequests]);

  const canRequest = !!session && isValidRange(startDate, endDate) && !hasOverlap;

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

      renterId: session.id,
      renterName: session.name,
      renterRole: session.role,

      ownerId: listing.ownerId,
      ownerName: listing.ownerName,

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

  // One-ups
  const oneUpsSameOwner = useMemo(() => {
    const all = Array.isArray(listings) ? listings : [];
    const ownerKey = normalizeStr(listing.ownerId || listing.ownerName);
    const scoped = all
      .filter((l) => l && l.id !== listing.id)
      .filter((l) => normalizeStr(l.ownerId || l.ownerName) === ownerKey);

    // Keep it tight and useful
    return scoped.slice(0, 6);
  }, [listings, listing.id, listing.ownerId, listing.ownerName]);

  const oneUpsRelated = useMemo(() => {
    const all = Array.isArray(listings) ? listings : [];
    const candidates = all.filter((l) => l && l.id !== listing.id);

    const scored = candidates
      .map((c) => ({ listing: c, score: scoreRelated(listing, c) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((x) => x.listing);

    // Fallback: same category only
    if (scored.length > 0) return scored;

    const sameCategory = candidates
      .filter((c) => normalizeStr(c.category) === normalizeStr(listing.category))
      .slice(0, 6);

    return sameCategory;
  }, [listings, listing.id, listing.category, listing.title, listing.description]);

  return (
    <div style={page}>
      <button onClick={() => navigate("/browse")} style={backBtn}>
        ← Back
      </button>

      <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
        <h1 style={{ margin: 0 }}>{listing.title}</h1>
        <span style={badge(scope === "community")}>{scopeLabel}</span>
      </div>

      <div style={{ color: "#666", marginBottom: 10, marginTop: 6 }}>
        {listing.category} • {listing.location} • Owner: {listing.ownerName}
      </div>

      <div style={card}>
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
          <div style={{ fontSize: 12, color: "#666", marginBottom: 12, fontWeight: 600 }}>
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

        <div style={{ marginTop: 16, fontSize: 13 }}>
          {!startDate || !endDate ? (
            <div style={{ color: "#666" }}>Select dates to check availability.</div>
          ) : !isValidRange(startDate, endDate) ? (
            <div style={{ color: "#b00020", fontWeight: 800 }}>End date must be on or after start date.</div>
          ) : hasOverlap ? (
            <div style={{ color: "#b00020", fontWeight: 800 }}>
              Unavailable for those dates. These dates are already approved or blocked.
            </div>
          ) : hasPendingOverlap ? (
            <div style={{ color: "#E4572E", fontWeight: 800 }}>
              ⚠️ Heads up: someone else has a pending request for these dates. If theirs gets approved first, yours may
              be declined.
            </div>
          ) : (
            <div style={{ color: "#1b5e20", fontWeight: 800 }}>Available for those dates.</div>
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

        {/* One-ups */}
        {(oneUpsSameOwner.length > 0 || oneUpsRelated.length > 0) && (
          <div style={{ marginTop: 18 }}>
            <div style={{ display: "grid", gap: 14 }}>
              {oneUpsSameOwner.length > 0 && (
                <div>
                  <div style={sectionTitle}>One-ups from {listing.ownerName}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
                    {oneUpsSameOwner.map((l) => (
                      <Link key={l.id} to={`/listing/${l.id}`} style={miniCard}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
                          <span style={pillSmall}>Same owner</span>
                          <span style={{ fontSize: 12, color: "#666" }}>${l.pricePerDay}/day</span>
                        </div>
                        <div style={miniCardTitleRow}>
                          <b style={{ lineHeight: 1.2 }}>{l.title}</b>
                        </div>
                        <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
                          {l.category} • {l.location}
                        </div>
                        <div style={{ fontSize: 12, color: "#777", marginTop: 8, lineHeight: 1.4 }}>
                          {String(l.description || "").slice(0, 90)}
                          {String(l.description || "").length > 90 ? "..." : ""}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {oneUpsRelated.length > 0 && (
                <div>
                  <div style={sectionTitle}>One-ups you might like</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
                    {oneUpsRelated.map((l) => (
                      <Link key={l.id} to={`/listing/${l.id}`} style={miniCard}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
                          <span style={pillSmall}>Related</span>
                          <span style={{ fontSize: 12, color: "#666" }}>${l.pricePerDay}/day</span>
                        </div>
                        <div style={miniCardTitleRow}>
                          <b style={{ lineHeight: 1.2 }}>{l.title}</b>
                        </div>
                        <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
                          {l.category} • {l.location} • Owner: {l.ownerName}
                        </div>
                        <div style={{ fontSize: 12, color: "#777", marginTop: 8, lineHeight: 1.4 }}>
                          {String(l.description || "").slice(0, 90)}
                          {String(l.description || "").length > 90 ? "..." : ""}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: 10, color: "#777", fontSize: 12 }}>
              MVP note: one-ups are powered by category + keyword matching. Later: add tags, seller bundles, and “people
              also rented” signals.
            </div>
          </div>
        )}

        {/* Unavailable dates */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 900, marginBottom: 8 }}>Unavailable dates</div>

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

        {/* Pending requests */}
        {pendingRequests.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontWeight: 900, marginBottom: 8, color: "#E4572E" }}>
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
  