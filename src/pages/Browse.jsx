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

const title = {
  margin: 0,
  marginBottom: theme.space[2],
  fontSize: theme.typography.sizes["3xl"],
  fontWeight: theme.typography.weights.bold,
  lineHeight: theme.typography.lineHeights.tight,
  color: theme.colors.text,
};

const subtitle = {
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
  marginBottom: theme.space[4],
};

const searchInput = {
  width: "100%",
  maxWidth: "600px",
  padding: `${theme.components.input.paddingY} ${theme.components.input.paddingX}`,
  borderRadius: theme.components.input.radius,
  border: `1px solid ${theme.components.input.border}`,
  fontSize: theme.typography.sizes.base,
  fontFamily: theme.typography.fonts.primary,
  color: theme.colors.text,
  background: theme.components.input.bg,
  transition: `all ${theme.motion.normal} ${theme.motion.easing}`,
  outline: "none",
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

/**
 * Get mode-specific labels and helper text
 */
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
      subtitle: code
        ? `Items from your community (${code})`
        : "Items from your community",
      resultsLabel: "community listings",
      emptyMessage: code
        ? `No community listings found for ${code}.`
        : "No community listings found.",
    };
  }

  // mixed mode
  return {
    title: "Browse All Listings",
    subtitle: "Public and community items",
    resultsLabel: "listings (public + community)",
    emptyMessage: "No listings found.",
  };
}

export default function Browse() {
  const { listings, session, requests } = useAppStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize search from URL
  const initialQuery = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  // Determine effective browse mode from session
  const effectiveMode = useMemo(
    () => getEffectiveBrowseMode(session),
    [session]
  );

  // Local mode state (can override effective mode)
  const [currentMode, setCurrentMode] = useState(() => effectiveMode);
  const [showMixed, setShowMixed] = useState(false);

  // Sync mode when session changes
  useEffect(() => {
    const newEffectiveMode = getEffectiveBrowseMode(session);
    setCurrentMode(newEffectiveMode);
    setShowMixed(false);
  }, [session]);

  // Create stable debounced function using useRef
  const setSearchParamsRef = useRef(setSearchParams);
  setSearchParamsRef.current = setSearchParams;

  const debouncedSearchRef = useRef(
    debounce((query) => {
      setDebouncedQuery(query);
      const newParams = new URLSearchParams(window.location.search);
      if (query.trim()) {
        newParams.set("q", query);
      } else {
        newParams.delete("q");
      }
      setSearchParamsRef.current(newParams, { replace: true });
    }, 300)
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearchRef.current(value);
  };

  // Sync URL param with local state on mount only
  useEffect(() => {
    const urlQ = searchParams.get("q") || "";
    if (urlQ && urlQ !== searchInput) {
      setSearchInput(urlQ);
      setDebouncedQuery(urlQ);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Determine actual mode (mixed if enabled)
  const actualMode = showMixed && currentMode === "community" ? "mixed" : currentMode;

  // Get visible listings using selectors
  const visibleListings = useMemo(() => {
    try {
      if (!listings || !Array.isArray(listings)) return [];
      return getVisibleListings(listings, actualMode, session, debouncedQuery);
    } catch (error) {
      console.error("Error getting visible listings:", error);
      return [];
    }
  }, [listings, actualMode, session, debouncedQuery]);

  // Get hidden community match count for growth signals
  const hiddenCommunityMatches = useMemo(() => {
    try {
      if (!listings || !Array.isArray(listings)) return 0;
      return getHiddenCommunityMatchCount(listings, debouncedQuery);
    } catch (error) {
      console.error("Error getting hidden matches:", error);
      return 0;
    }
  }, [listings, debouncedQuery]);

  // Get public results count for growth signals
  const publicResultsCount = useMemo(() => {
    try {
      if (!debouncedQuery.trim()) return 0;
      if (!listings || !Array.isArray(listings)) return 0;
      return getVisibleListings(listings, "public", null, debouncedQuery).length;
    } catch (error) {
      console.error("Error getting public results count:", error);
      return 0;
    }
  }, [listings, debouncedQuery]);

  // Mode labels
  const modeLabels = useMemo(
    () => getModeLabels(actualMode, session),
    [actualMode, session]
  );

  // Check if needs community code
  const needsCommunityCode =
    actualMode === "community" && !session?.communityCode;

  // Show hidden supply note
  const showHiddenSupplyNote =
    actualMode === "public" &&
    debouncedQuery.trim().length > 0 &&
    publicResultsCount === 0 &&
    hiddenCommunityMatches > 0;

  // Safety check - ensure listings is an array
  const safeListings = Array.isArray(listings) ? listings : [];
  const safeRequests = Array.isArray(requests) ? requests : [];

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
        .search-input:focus {
          border-color: ${theme.components.input.borderFocus} !important;
          box-shadow: ${theme.components.input.shadowFocus} !important;
        }
        .listing-card:focus-visible {
          outline: 2px solid ${theme.colors.focusRing};
          outline-offset: 2px;
        }
      `}</style>

      <div style={headerSection}>
        <div style={headerText}>
          <h1 style={title}>{modeLabels.title}</h1>
          <p style={subtitle}>{modeLabels.subtitle}</p>
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
              disabled={!session}
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
            <Link to="/get-started" style={{ color: theme.colors.primary, fontWeight: theme.typography.weights.semibold }}>
              Get Started
            </Link>{" "}
            and sign in as a Community Member using your code.
          </div>
        </div>
      )}

      <div style={searchContainer}>
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search items, category, location..."
          className="search-input"
          style={searchInput}
          aria-label="Search listings"
        />
      </div>

      {showHiddenSupplyNote && (
        <div style={notice}>
          <div style={noticeTitle}>No public results for "{debouncedQuery.trim()}"</div>
          <div>
            There are items matching this search inside communities nearby. Want access? Help
            onboard your building or HOA.
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
        Showing <strong>{visibleListings.length}</strong> {modeLabels.resultsLabel}
        {debouncedQuery.trim() && ` matching "${debouncedQuery.trim()}"`}
      </div>

      {visibleListings.length === 0 ? (
        <div style={emptyState}>
          <p>{modeLabels.emptyMessage}</p>
          {!session && (
            <Link to="/get-started" style={ctaButton}>
              Get Started
            </Link>
          )}
        </div>
      ) : (
        <div style={gridContainer}>
          {visibleListings.map((listing) => {
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
