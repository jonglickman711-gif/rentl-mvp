import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppStore } from "../store/AppStore";

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: 14,
  padding: 16,
  textDecoration: "none",
  color: "#111",
  background: "white",
};

const pill = (active) => ({
  padding: "8px 10px",
  borderRadius: 999,
  border: "1px solid #ddd",
  background: active ? "#111" : "white",
  color: active ? "white" : "#111",
  cursor: "pointer",
  fontWeight: 800,
});

const badge = (type) => ({
  fontSize: 11,
  padding: "4px 8px",
  borderRadius: 999,
  border: "1px solid #ddd",
  color: "#333",
  background: type === "community" ? "#fafafa" : "white",
});

const notice = {
  marginTop: 12,
  border: "1px solid #ffd7b5",
  background: "#fff7ef",
  borderRadius: 14,
  padding: 12,
  color: "#444",
  fontSize: 13,
  lineHeight: 1.5,
};

function getScope(l) {
  return l.visibility ?? l.ownerType ?? l.ownerRole;
}

function matchesQuery(l, query) {
  if (!query) return true;
  const hay = [l.title, l.category, l.location, l.ownerName, getScope(l)].map((x) => String(x ?? "").toLowerCase());
  return hay.some((x) => x.includes(query));
}

// Calculate availability ranges from blocked ranges (similar to ListingDetails)
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

// Compute human-readable availability hint
function getAvailabilityHint(listing, requests) {
  // Get approved requests for this listing
  const approvedRequests = requests.filter(
    (r) => r.listingId === listing.id && r.status === "approved"
  );

  // Combine blocked ranges from listing with approved request dates
  const listingBlocked = Array.isArray(listing.blockedRanges) ? listing.blockedRanges : [];
  const approvedRanges = approvedRequests
    .filter((r) => r.startDate && r.endDate)
    .map((r) => ({
      start: r.startDate,
      end: r.endDate,
    }));

  const allBlocked = [...listingBlocked, ...approvedRanges];
  const availabilityRanges = calculateAvailabilityRanges(allBlocked);

  if (availabilityRanges.length === 0) {
    return "Limited availability";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find the first available range that starts today or in the future
  const nextAvailable = availabilityRanges.find((range) => {
    const rangeStart = new Date(range.start);
    rangeStart.setHours(0, 0, 0, 0);
    return rangeStart >= today;
  });

  if (!nextAvailable) {
    return "Limited availability";
  }

  const nextStart = new Date(nextAvailable.start);
  nextStart.setHours(0, 0, 0, 0);

  // Check if available today
  if (nextStart.getTime() === today.getTime()) {
    // Check if there are multiple blocks suggesting limited availability
    if (allBlocked.length > 2) {
      return "Available now (limited dates)";
    }
    return "Available now";
  }

  // Calculate days until next available
  const daysUntil = Math.ceil((nextStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntil <= 3) {
    if (daysUntil === 1) {
      return "Available tomorrow";
    }
    return `Available in ${daysUntil} days`;
  }

  // Format date for display (e.g., "Jan 15")
  const month = nextStart.toLocaleDateString("en-US", { month: "short" });
  const day = nextStart.getDate();
  return `Available ${month} ${day}`;
}

export default function Browse() {
  const { listings, session, requests } = useAppStore();

  const [q, setQ] = useState("");
  const [viewAs, setViewAs] = useState("public"); // "public" | "community"
  const [showBoth, setShowBoth] = useState(false);

  const query = q.trim().toLowerCase();

  // Can the signed in user see this specific community listing?
  const canSeeCommunityListing = (l) => {
    const listingCode = (l.communityCode || "").toUpperCase();
    const userCode = (session?.communityCode || "").toUpperCase();

    if (!listingCode) return false;
    if (!userCode) return false;
    return listingCode === userCode;
  };

  // What would a public user see (public listings only), with search applied?
  const publicResults = useMemo(() => {
    return listings
      .filter((l) => getScope(l) === "public")
      .filter((l) => matchesQuery(l, query));
  }, [listings, query]);

  // Hidden supply signal: are there community items that match this query, but are not visible in public?
  const hiddenCommunityMatchCount = useMemo(() => {
    if (!query) return 0;
    return listings
      .filter((l) => getScope(l) === "community")
      .filter((l) => matchesQuery(l, query))
      .length;
  }, [listings, query]);

  // What the current view actually shows
  const visibleListings = useMemo(() => {
    let pool = listings;

    if (viewAs === "public") {
      pool = pool.filter((l) => getScope(l) === "public");
    } else {
      // community view
      if (showBoth) {
        pool = pool.filter((l) => {
          const scope = getScope(l);
          if (scope === "public") return true;
          if (scope === "community") return canSeeCommunityListing(l);
          return false;
        });
      } else {
        pool = pool.filter((l) => getScope(l) === "community" && canSeeCommunityListing(l));
      }
    }

    if (!query) return pool;

    return pool.filter((l) => matchesQuery(l, query));
  }, [listings, viewAs, showBoth, query, session]);

  const needsCommunityCode = viewAs === "community" && !showBoth && !(session?.communityCode);

  // Growth note: only show when in public view AND search yields 0 public results BUT hidden community matches exist
  const showHiddenSupplyNote =
    viewAs === "public" &&
    query.length > 0 &&
    publicResults.length === 0 &&
    hiddenCommunityMatchCount > 0;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ marginBottom: 6 }}>Browse</h1>
          <p style={{ color: "#444", marginTop: 0 }}>Explore what’s available near you.</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "#666" }}>Viewing as</span>

          <button
            onClick={() => {
              setViewAs("public");
              setShowBoth(false);
            }}
            style={pill(viewAs === "public")}
          >
            Public
          </button>

          <button onClick={() => setViewAs("community")} style={pill(viewAs === "community")}>
            Community
          </button>

          {viewAs === "community" ? (
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#444" }}>
              <input
                type="checkbox"
                checked={showBoth}
                onChange={(e) => setShowBoth(e.target.checked)}
              />
              Show both (public + my community)
            </label>
          ) : null}

          <Link
            to="/list-item"
            style={{
              padding: "8px 10px",
              borderRadius: 12,
              border: "1px solid #111",
              background: "#111",
              color: "white",
              textDecoration: "none",
              fontWeight: 900,
            }}
          >
            List an Item
          </Link>
        </div>
      </div>

      {needsCommunityCode ? (
        <div style={notice}>
          Community listings require a community code. Go to{" "}
          <Link to="/get-started" style={{ color: "#111", fontWeight: 900 }}>
            Get Started
          </Link>{" "}
          and sign in as a Community Member using your code.
        </div>
      ) : null}

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search items, category, location..."
        style={{
          padding: 10,
          width: "100%",
          maxWidth: 520,
          borderRadius: 12,
          border: "1px solid #ddd",
          marginTop: 12,
        }}
      />

      {showHiddenSupplyNote ? (
        <div style={notice}>
          <div style={{ fontWeight: 900, marginBottom: 4 }}>No public results for “{q.trim()}”</div>
          <div>
            There are items matching this search inside communities nearby.
            Want access? Help onboard your building or HOA.
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link
              to="/request-community"
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid #111",
                background: "#111",
                color: "white",
                textDecoration: "none",
                fontWeight: 900,
              }}
            >
              Invite my community
            </Link>

            <Link
              to="/get-started"
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid #ddd",
                background: "white",
                color: "#111",
                textDecoration: "none",
                fontWeight: 900,
              }}
            >
              Enter a community code
            </Link>
          </div>
        </div>
      ) : null}

      <div style={{ marginTop: 10, fontSize: 12, color: "#666" }}>
        Showing <b>{visibleListings.length}</b> items{" "}
        {viewAs === "public" ? "(public only)" : showBoth ? "(public + my community)" : "(my community only)"}.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginTop: 18 }}>
        {visibleListings.map((l) => {
          const scope = getScope(l);

          return (
            <Link key={l.id} to={`/listing/${l.id}`} style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <div style={{ fontSize: 12, color: "#666" }}>
                  {l.category} • {l.location}
                </div>

                <div style={badge(scope)}>{scope === "community" ? "Community" : "Public"}</div>
              </div>

              <h3 style={{ margin: "8px 0" }}>{l.title}</h3>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                <span style={{ color: "#444" }}>Owner: {l.ownerName}</span>
                <b>${l.pricePerDay}/day</b>
              </div>

              <div style={{ marginTop: 10, fontSize: 12, color: "#777" }}>
                <div style={{ marginBottom: 4 }}>
                  {scope === "public"
                    ? "Public listing: request and coordinate after approval."
                    : `Community listing${session?.communityCode ? ` • ${session.communityCode}` : ""}`}
                </div>
                <div style={{ color: "#444", fontWeight: 500, marginTop: 6 }}>
                  {getAvailabilityHint(l, requests)}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
