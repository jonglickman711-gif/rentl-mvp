import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAppStore } from "../store/AppStore";
import theme from "../styles/themes";
import ListingCard from "../components/ListingCard";
import {
  getEffectiveBrowseMode,
  getVisibleListings,
  getHiddenCommunityMatchCount,
  getListingScope,
} from "../selectors/browseSelectors";
import { getAvailabilityHint, getAvailabilityData } from "../utils/availability";
import { debounce } from "../utils/debounce";

// Page container
const pageContainer = {
  maxWidth: theme.components.container.maxWidth,
  margin: "0 auto",
  padding: `${theme.space[6]} ${theme.components.container.paddingX}`,
  fontFamily: theme.typography.fonts.primary,
  color: theme.colors.text,
};

// Header section
const headerSection = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: theme.space[4],
  flexWrap: "wrap",
  marginBottom: theme.space[6],
};

const headerText = {
  flex: 1,
  minWidth: "250px",
};

const titleStyle = {
  margin: 0,
  marginBottom: theme.space[2],
  fontSize: theme.typography.sizes["3xl"],
  fontWeight: theme.typography.weights.bold,
  lineHeight: theme.typography.lineHeights.tight,
  color: theme.colors.text,
};

const subtitleStyle = {
  margin: 0,
  fontSize: theme.typography.sizes.base,
  color: theme.colors.textSubtle,
  lineHeight: theme.typography.lineHeights.normal,
};

// Mode switch controls
const controlsSection = {
  display: "flex",
  flexDirection: "column",
  gap: theme.space[3],
  alignItems: "flex-end",
};

const modeSwitchRow = {
  display: "flex",
  alignItems: "center",
  gap: theme.space[2],
  flexWrap: "wrap",
};

const modeLabel = {
  fontSize: theme.typography.sizes.sm,
  color: theme.colors.textSubtle,
  fontWeight: theme.typography.weights.medium,
};

const modeButton = (active) => ({
  padding: `${theme.space[2]} ${theme.space[3]}`,
  borderRadius: theme.radius.pill,
  border: `1px solid ${active ? theme.colors.primary : theme.colors.border}`,
  background: active ? theme.colors.primary : theme.colors.bg,
  color: active ? theme.colors.textOnDark : theme.colors.text,
  cursor: "pointer",
  fontWeight: theme.typography.weights.semibold,
  fontSize: theme.typography.sizes.sm,
  transition: `all ${theme.motion.normal} ${theme.motion.easing}`,
  fontFamily: theme.typography.fonts.primary,
  outline: "none",
  opacity: 1,
});

const mixedModeToggle = {
  display: "flex",
  alignItems: "center",
  gap: theme.space[2],
  fontSize: theme.typography.sizes.xs,
  color: theme.colors.textSubtle,
  cursor: "pointer",
  userSelect: "none",
};

// Search input
const searchContainer = {
  marginBottom: theme.space[3],
};

const searchInputStyle = {
  width: "100%",
  maxWidth: "760px",
  padding: `${theme.components.input.paddingY} ${theme.components.input.paddingX}`,
  borderRadius: theme.components.input.radius,
  border: `1px solid ${theme.components.input.border}`,
  fontSize: theme.typography.sizes.base,
  fontFamily: theme.typography.fonts.primary,
  color: theme.colors.text,
  background: theme.components.input.bg,
  transition: `all ${theme.motion.normal} ${theme.motion.easing}`,
  outline: "none",
  boxSizing: "border-box",
};

// Filters UI (no-overlap layout using flex-wrap)
const filtersWrap = {
  marginBottom: theme.space[5],
};

const filtersSection = {
  display: "grid",
  gap: theme.space[3],
};

const filtersRowFull = {
  width: "100%",
};

const filtersRowFlex = {
  display: "flex",
  flexWrap: "wrap",
  gap: theme.space[3],
  alignItems: "end",
};

const fieldCell = (basisPx = 240, grow = 1) => ({
  flex: `${grow} 1 ${basisPx}px`,
  minWidth: 0,
});

const fieldCellFixed = (basisPx = 170) => ({
  flex: `0 1 ${basisPx}px`,
  minWidth: 0,
});

const clearCell = {
  flex: "0 0 auto",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "end",
  marginLeft: "auto",
};

const fieldLabel = {
  fontSize: theme.typography.sizes.xs,
  color: theme.colors.textSubtle,
  fontWeight: theme.typography.weights.semibold,
  marginBottom: 6,
};

const inputStyle = {
  width: "100%",
  padding: `${theme.components.input.paddingY} ${theme.components.input.paddingX}`,
  borderRadius: theme.components.input.radius,
  border: `1px solid ${theme.components.input.border}`,
  fontSize: theme.typography.sizes.sm,
  fontFamily: theme.typography.fonts.primary,
  color: theme.colors.text,
  background: theme.components.input.bg,
  outline: "none",
  boxSizing: "border-box",
};

const selectStyle = { ...inputStyle };

const dateInputStyle = {
  ...inputStyle,
  // Helps prevent weird overlay behavior on some browsers by ensuring the control is fully self-contained.
  appearance: "auto",
};

const pillRow = {
  display: "flex",
  gap: theme.space[2],
  flexWrap: "wrap",
};

const pill = (active) => ({
  padding: `8px 12px`,
  borderRadius: theme.radius.pill,
  border: `1px solid ${active ? theme.colors.primary : theme.colors.border}`,
  background: active ? theme.colors.primarySoft : theme.colors.bg,
  color: active ? theme.colors.primary : theme.colors.text,
  cursor: "pointer",
  fontWeight: theme.typography.weights.semibold,
  fontSize: theme.typography.sizes.sm,
  userSelect: "none",
});

const clearButton = {
  padding: "10px 14px",
  borderRadius: theme.components.button.radius,
  border: `1px solid ${theme.colors.border}`,
  background: theme.colors.bg,
  color: theme.colors.text,
  cursor: "pointer",
  fontWeight: theme.typography.weights.semibold,
  fontSize: theme.typography.sizes.sm,
  whiteSpace: "nowrap",
};

// Notice/alert styles
const notice = {
  marginTop: theme.space[4],
  marginBottom: theme.space[4],
  padding: theme.space[4],
  border: `1px solid ${theme.colors.warning}`,
  background: theme.colors.accentSoft,
  borderRadius: theme.components.card.radius,
  color: theme.colors.text,
  fontSize: theme.typography.sizes.sm,
  lineHeight: theme.typography.lineHeights.relaxed,
};

const noticeTitle = {
  fontWeight: theme.typography.weights.bold,
  marginBottom: theme.space[2],
  color: theme.colors.text,
};

const noticeActions = {
  marginTop: theme.space[3],
  display: "flex",
  gap: theme.space[2],
  flexWrap: "wrap",
};

const noticeButton = {
  padding: `${theme.space[2]} ${theme.space[3]}`,
  borderRadius: theme.components.button.radius,
  border: `1px solid ${theme.colors.text}`,
  background: theme.colors.text,
  color: theme.colors.textOnDark,
  textDecoration: "none",
  fontWeight: theme.typography.weights.semibold,
  fontSize: theme.typography.sizes.sm,
  display: "inline-flex",
  alignItems: "center",
  transition: `all ${theme.motion.normal} ${theme.motion.easing}`,
};

const noticeButtonSecondary = {
  ...noticeButton,
  background: theme.colors.bg,
  color: theme.colors.text,
  borderColor: theme.colors.border,
};

// Results summary
const resultsSummary = {
  marginBottom: theme.space[4],
  fontSize: theme.typography.sizes.sm,
  color: theme.colors.textSubtle,
  fontFamily: theme.typography.fonts.primary,
};

// Grid layout
const gridContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: theme.space[4],
  marginTop: theme.space[6],
};

// Empty state
const emptyState = {
  padding: theme.space[8],
  textAlign: "center",
  color: theme.colors.textMuted,
  fontSize: theme.typography.sizes.base,
  fontFamily: theme.typography.fonts.primary,
};

// CTA button
const ctaButton = {
  padding: `${theme.space[2]} ${theme.space[3]}`,
  borderRadius: theme.components.button.radius,
  border: `1px solid ${theme.colors.text}`,
  background: theme.colors.text,
  color: theme.colors.textOnDark,
  textDecoration: "none",
  fontWeight: theme.typography.weights.semibold,
  fontSize: theme.typography.sizes.sm,
  display: "inline-flex",
  alignItems: "center",
  transition: `all ${theme.motion.normal} ${theme.motion.easing}`,
  marginTop: theme.space[2],
};

function getModeLabels(mode, session) {
  if (mode === "public") {
    return {
      title: "Browse Public Listings",
      subtitle: "Explore items available to everyone",
      resultsLabel: "public listings",
      emptyMessage: "No public listings found.",
    };
  }

  if (mode === "community") {
    const code = session?.communityCode;
    return {
      title: "Browse Community Listings",
      subtitle: code ? `Items from your community (${code})` : "Items from your community",
      resultsLabel: "community listings",
      emptyMessage: code ? `No community listings found for ${code}.` : "No community listings found.",
    };
  }

  return {
    title: "Browse All Listings",
    subtitle: "Public and community items",
    resultsLabel: "listings (public + community)",
    emptyMessage: "No listings found.",
  };
}

// Helpers for advanced filters
function normalizeStr(v) {
  return String(v || "").trim().toLowerCase();
}

function parseISODate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(`${dateStr}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function getListingFulfillmentModes(listing) {
  if (Array.isArray(listing?.fulfillmentModes) && listing.fulfillmentModes.length) {
    return listing.fulfillmentModes.map((m) => normalizeStr(m));
  }

  const text = normalizeStr(`${listing?.description || ""} ${listing?.title || ""}`);

  const hasPickup = text.includes("pickup") || text.includes("pick up") || text.includes("pick-up");
  const hasDelivery =
    text.includes("delivery") ||
    text.includes("deliver") ||
    text.includes("drop off") ||
    text.includes("drop-off");

  if (hasPickup && hasDelivery) return ["pickup", "delivery"];
  if (hasDelivery) return ["delivery"];
  if (hasPickup) return ["pickup"];
  return ["pickup"];
}

function getListingLocationText(listing) {
  return listing?.locationText || listing?.location || listing?.city || listing?.neighborhood || "";
}

function getListingAvailabilityWindow(listing) {
  const a = listing?.availability;
  const startRaw = a?.startDate || listing?.availableFrom || listing?.availabilityStart || listing?.startDate;
  const endRaw = a?.endDate || listing?.availableTo || listing?.availabilityEnd || listing?.endDate;

  const start = startRaw ? new Date(startRaw) : null;
  const end = endRaw ? new Date(endRaw) : null;

  const validStart = start && !Number.isNaN(start.getTime()) ? start : null;
  const validEnd = end && !Number.isNaN(end.getTime()) ? end : null;

  return { start: validStart, end: validEnd, isUnknown: !validStart && !validEnd };
}

function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  if (!bStart && !bEnd) return true;
  if (!aStart && !aEnd) return true;

  const startA = aStart || new Date("1970-01-01T00:00:00");
  const endA = aEnd || new Date("2999-12-31T00:00:00");
  const startB = bStart || new Date("1970-01-01T00:00:00");
  const endB = bEnd || new Date("2999-12-31T00:00:00");

  return startA <= endB && startB <= endA;
}

function applyAdvancedFilters(listings, filters) {
  const {
    fulfillment = "either",
    locationText = "",
    radiusMiles = 10,
    startDate = "",
    endDate = "",
  } = filters || {};

  const locQ = normalizeStr(locationText);
  const sd = parseISODate(startDate);
  const ed = parseISODate(endDate);

  return (Array.isArray(listings) ? listings : []).filter((l) => {
    if (!l) return false;

    if (fulfillment !== "either") {
      const modes = getListingFulfillmentModes(l);
      if (!modes.includes(fulfillment)) return false;
    }

    if (locQ) {
      const locText = normalizeStr(getListingLocationText(l));
      const fallback = normalizeStr(`${l.title || ""} ${l.category || ""}`);
      if (!locText.includes(locQ) && !fallback.includes(locQ)) return false;
    }

    const distance = Number(l?.distanceMiles);
    if (!Number.isNaN(distance) && typeof distance === "number") {
      if (Number(radiusMiles) > 0 && distance > Number(radiusMiles)) return false;
    }

    if (sd || ed) {
      const { start, end, isUnknown } = getListingAvailabilityWindow(l);
      if (!isUnknown) {
        if (!rangesOverlap(start, end, sd, ed)) return false;
      }
    }

    return true;
  });
}

export default function Browse() {
  const { listings, session, requests } = useAppStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL params
  const initialQuery = searchParams.get("q") || "";
  const initialFulfillment = searchParams.get("fulfillment") || "either";
  const initialLoc = searchParams.get("loc") || "";
  const initialRadius = Number(searchParams.get("radius") || 10);
  const initialStart = searchParams.get("start") || "";
  const initialEnd = searchParams.get("end") || "";

  // Search
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  // Advanced filters
  const [fulfillment, setFulfillment] = useState(initialFulfillment);
  const [locationText, setLocationText] = useState(initialLoc);
  const [radiusMiles, setRadiusMiles] = useState(Number.isNaN(initialRadius) ? 10 : initialRadius);
  const [startDate, setStartDate] = useState(initialStart);
  const [endDate, setEndDate] = useState(initialEnd);

  // Determine effective browse mode from session
  const effectiveMode = useMemo(() => getEffectiveBrowseMode(session), [session]);
  const [currentMode, setCurrentMode] = useState(() => effectiveMode);
  const [showMixed, setShowMixed] = useState(false);

  useEffect(() => {
    const newEffectiveMode = getEffectiveBrowseMode(session);
    setCurrentMode(newEffectiveMode);
    setShowMixed(false);
  }, [session]);

  // Stable ref to setSearchParams
  const setSearchParamsRef = useRef(setSearchParams);
  setSearchParamsRef.current = setSearchParams;

  // Debounced URL sync for q
  const debouncedSearchRef = useRef(
    debounce((query) => {
      setDebouncedQuery(query);

      const newParams = new URLSearchParams(window.location.search);
      if (query.trim()) newParams.set("q", query);
      else newParams.delete("q");

      setSearchParamsRef.current(newParams, { replace: true });
    }, 300)
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearchRef.current(value);
  };

  // Sync filter params immediately
  useEffect(() => {
    const newParams = new URLSearchParams(window.location.search);

    if (fulfillment && fulfillment !== "either") newParams.set("fulfillment", fulfillment);
    else newParams.delete("fulfillment");

    if (locationText.trim()) newParams.set("loc", locationText.trim());
    else newParams.delete("loc");

    if (radiusMiles) newParams.set("radius", String(radiusMiles));
    else newParams.delete("radius");

    if (startDate) newParams.set("start", startDate);
    else newParams.delete("start");

    if (endDate) newParams.set("end", endDate);
    else newParams.delete("end");

    setSearchParamsRef.current(newParams, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fulfillment, locationText, radiusMiles, startDate, endDate]);

  // Sync URL param with local state on mount only
  useEffect(() => {
    const urlQ = searchParams.get("q") || "";
    if (urlQ && urlQ !== searchQuery) {
      setSearchQuery(urlQ);
      setDebouncedQuery(urlQ);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actualMode = showMixed && currentMode === "community" ? "mixed" : currentMode;

  const safeListings = Array.isArray(listings) ? listings : [];
  const safeRequests = Array.isArray(requests) ? requests : [];

  const baseVisibleListings = useMemo(() => {
    try {
      return getVisibleListings(safeListings, actualMode, session, debouncedQuery);
    } catch (error) {
      console.error("Error getting visible listings:", error);
      return [];
    }
  }, [safeListings, actualMode, session, debouncedQuery]);

  const filteredVisibleListings = useMemo(() => {
    return applyAdvancedFilters(baseVisibleListings, {
      fulfillment,
      locationText,
      radiusMiles,
      startDate,
      endDate,
    });
  }, [baseVisibleListings, fulfillment, locationText, radiusMiles, startDate, endDate]);

  const hiddenCommunityMatches = useMemo(() => {
    try {
      return getHiddenCommunityMatchCount(safeListings, debouncedQuery);
    } catch (error) {
      console.error("Error getting hidden matches:", error);
      return 0;
    }
  }, [safeListings, debouncedQuery]);

  const publicResultsCount = useMemo(() => {
    try {
      if (!debouncedQuery.trim()) return 0;
      return getVisibleListings(safeListings, "public", null, debouncedQuery).length;
    } catch (error) {
      console.error("Error getting public results count:", error);
      return 0;
    }
  }, [safeListings, debouncedQuery]);

  const modeLabels = useMemo(() => getModeLabels(actualMode, session), [actualMode, session]);

  const needsCommunityCode = actualMode === "community" && !session?.communityCode;

  const showHiddenSupplyNote =
    actualMode === "public" &&
    debouncedQuery.trim().length > 0 &&
    publicResultsCount === 0 &&
    hiddenCommunityMatches > 0;

  const showRadiusHelperNote = useMemo(() => {
    const anyDistance = baseVisibleListings.some(
      (l) => typeof Number(l?.distanceMiles) === "number" && !Number.isNaN(Number(l?.distanceMiles))
    );
    return !anyDistance && (locationText.trim() || radiusMiles);
  }, [baseVisibleListings, locationText, radiusMiles]);

  const showDateHelperNote = useMemo(() => {
    if (!startDate && !endDate) return false;
    const anyHasWindow = baseVisibleListings.some((l) => {
      const a = l?.availability;
      return Boolean(a?.startDate || a?.endDate || l?.availableFrom || l?.availableTo);
    });
    return !anyHasWindow;
  }, [baseVisibleListings, startDate, endDate]);

  const hasActiveFilters =
    fulfillment !== "either" ||
    Boolean(locationText.trim()) ||
    Boolean(startDate) ||
    Boolean(endDate) ||
    Number(radiusMiles) !== 10;

  const handleClearFilters = () => {
    setFulfillment("either");
    setLocationText("");
    setRadiusMiles(10);
    setStartDate("");
    setEndDate("");

    const newParams = new URLSearchParams(window.location.search);
    newParams.delete("fulfillment");
    newParams.delete("loc");
    newParams.delete("radius");
    newParams.delete("start");
    newParams.delete("end");
    setSearchParams(newParams, { replace: true });
  };

  return (
    <div style={pageContainer}>
      <style>{`
        .mode-button:hover:not(:disabled) {
          border-color: ${theme.colors.primary} !important;
          background: ${theme.colors.primarySoft} !important;
          color: ${theme.colors.primary} !important;
        }
        .mode-button:focus-visible {
          outline: 2px solid ${theme.colors.focusRing};
          outline-offset: 2px;
        }
        .search-input:focus,
        .filter-input:focus {
          border-color: ${theme.components.input.borderFocus} !important;
          box-shadow: ${theme.components.input.shadowFocus} !important;
        }

        /* Extra safety: ensure all form controls size predictably */
        input, select { box-sizing: border-box; }
      `}</style>

      <div style={headerSection}>
        <div style={headerText}>
          <h1 style={titleStyle}>{modeLabels.title}</h1>
          <p style={subtitleStyle}>{modeLabels.subtitle}</p>
        </div>

        <div style={controlsSection}>
          <div style={modeSwitchRow}>
            <span style={modeLabel}>Viewing as</span>

            <button
              onClick={() => {
                setCurrentMode("public");
                setShowMixed(false);
              }}
              className="mode-button"
              style={modeButton(currentMode === "public")}
            >
              Public
            </button>

            {session?.role === "community" && (
              <>
                <button
                  onClick={() => {
                    setCurrentMode("community");
                    setShowMixed(false);
                  }}
                  className="mode-button"
                  style={modeButton(currentMode === "community")}
                >
                  Community
                </button>

                {currentMode === "community" && (
                  <label style={mixedModeToggle}>
                    <input
                      type="checkbox"
                      checked={showMixed}
                      onChange={(e) => setShowMixed(e.target.checked)}
                      style={{ cursor: "pointer" }}
                    />
                    Show both
                  </label>
                )}
              </>
            )}
          </div>

          {session?.role === "community" && (
            <Link to="/list-item" style={ctaButton}>
              List an Item
            </Link>
          )}
        </div>
      </div>

      {needsCommunityCode && (
        <div style={notice}>
          <div style={noticeTitle}>Community listings require a community code</div>
          <div>
            Go to{" "}
            <Link
              to="/get-started"
              style={{ color: theme.colors.primary, fontWeight: theme.typography.weights.semibold }}
            >
              Get Started
            </Link>{" "}
            and sign in as a Community Member using your code.
          </div>
        </div>
      )}

      <div style={searchContainer}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search items, category, location..."
          className="search-input"
          style={searchInputStyle}
          aria-label="Search listings"
        />
      </div>

      {/* Advanced filters */}
      <div style={filtersWrap}>
        <div style={filtersSection}>
          <div style={filtersRowFull}>
            <div style={fieldLabel}>Pickup / delivery</div>
            <div style={pillRow}>
              <button type="button" style={pill(fulfillment === "either")} onClick={() => setFulfillment("either")}>
                Either
              </button>
              <button type="button" style={pill(fulfillment === "pickup")} onClick={() => setFulfillment("pickup")}>
                Pickup
              </button>
              <button type="button" style={pill(fulfillment === "delivery")} onClick={() => setFulfillment("delivery")}>
                Delivery
              </button>
            </div>
          </div>

          <div style={filtersRowFlex}>
            <div style={fieldCell(320, 2)}>
              <div style={fieldLabel}>Location</div>
              <input
                className="filter-input"
                style={inputStyle}
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                placeholder="Neighborhood, city, or building"
                aria-label="Location filter"
              />
            </div>

            <div style={fieldCellFixed(170)}>
              <div style={fieldLabel}>Radius</div>
              <select
                className="filter-input"
                style={selectStyle}
                value={radiusMiles}
                onChange={(e) => setRadiusMiles(Number(e.target.value))}
                aria-label="Radius filter"
              >
                <option value={5}>5 mi</option>
                <option value={10}>10 mi</option>
                <option value={25}>25 mi</option>
                <option value={50}>50 mi</option>
              </select>
            </div>

            <div style={fieldCellFixed(220)}>
              <div style={fieldLabel}>Start date</div>
              <input
                type="date"
                className="filter-input"
                style={dateInputStyle}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                aria-label="Start date filter"
              />
            </div>

            <div style={fieldCellFixed(220)}>
              <div style={fieldLabel}>End date</div>
              <input
                type="date"
                className="filter-input"
                style={dateInputStyle}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                aria-label="End date filter"
              />
            </div>

            <div style={clearCell}>
              <button type="button" style={clearButton} onClick={handleClearFilters} disabled={!hasActiveFilters}>
                Clear filters
              </button>
            </div>
          </div>

          {showRadiusHelperNote && (
            <div style={{ fontSize: theme.typography.sizes.xs, color: theme.colors.textSubtle }}>
              Radius is a soft filter in MVP until listings have precise geo distance (later: lat/lng or zip).
            </div>
          )}

          {showDateHelperNote && (
            <div style={{ fontSize: theme.typography.sizes.xs, color: theme.colors.textSubtle }}>
              Date filtering is a soft filter in MVP until listings have availability windows (later: availableFrom/availableTo + booking conflicts).
            </div>
          )}
        </div>
      </div>

      {showHiddenSupplyNote && (
        <div style={notice}>
          <div style={noticeTitle}>No public results for "{debouncedQuery.trim()}"</div>
          <div>
            There are items matching this search inside communities nearby. Want access? Help onboard your building or HOA.
          </div>
          <div style={noticeActions}>
            <Link to="/request-community" style={noticeButton}>
              Invite my community
            </Link>
            <Link to="/get-started" style={noticeButtonSecondary}>
              Enter a community code
            </Link>
          </div>
        </div>
      )}

      <div style={resultsSummary}>
        Showing <strong>{filteredVisibleListings.length}</strong> {modeLabels.resultsLabel}
        {debouncedQuery.trim() && ` matching "${debouncedQuery.trim()}"`}
        {hasActiveFilters && <span> • filters active</span>}
      </div>

      {filteredVisibleListings.length === 0 ? (
        <div style={emptyState}>
          <p>{modeLabels.emptyMessage}</p>
          {hasActiveFilters && (
            <button type="button" style={clearButton} onClick={handleClearFilters}>
              Clear filters
            </button>
          )}
          {!session && (
            <div>
              <Link to="/get-started" style={ctaButton}>
                Get Started
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div style={gridContainer}>
          {filteredVisibleListings.map((listing) => {
            if (!listing || !listing.id) return null;

            const scope = getListingScope(listing);
            const availabilityStatus = getAvailabilityHint(listing, safeRequests);
            const availabilityData = getAvailabilityData(listing, safeRequests);

            return (
              <ListingCard
                key={listing.id}
                listing={listing}
                visibilityScope={scope}
                availabilityStatus={availabilityStatus}
                communityCode={scope === "community" ? session?.communityCode : null}
                showAvailabilityPlaceholder={false}
                availabilityData={availabilityData}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
