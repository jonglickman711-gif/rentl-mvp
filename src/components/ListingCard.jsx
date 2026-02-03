import React from "react";
import { Link } from "react-router-dom";
import theme from "../styles/themes";

// Card container
const cardContainer = {
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.components.card.radius,
  padding: theme.components.card.padding,
  background: theme.components.card.bg,
  textDecoration: "none",
  color: theme.colors.text,
  display: "flex",
  flexDirection: "column",
  transition: `all ${theme.motion.normal} ${theme.motion.easing}`,
  cursor: "pointer",
  position: "relative",
};

const cardHover = {
  boxShadow: theme.components.card.shadowHover,
  borderColor: theme.components.card.borderHover,
  transform: "translateY(-2px)",
};

// Header row with category/location and badge
const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: theme.space[2],
  marginBottom: theme.space[2],
};

const metaInfo = {
  fontSize: theme.typography.sizes.xs,
  color: theme.colors.textSubtle,
  fontFamily: theme.typography.fonts.primary,
};

// Scope badge
const badgeBase = {
  fontSize: theme.typography.sizes.xs,
  padding: `${theme.space[1]} ${theme.space[2]}`,
  borderRadius: theme.radius.pill,
  border: `1px solid ${theme.colors.border}`,
  fontWeight: theme.typography.weights.semibold,
  whiteSpace: "nowrap",
  flexShrink: 0,
};

const badgePublic = {
  ...badgeBase,
  background: theme.colors.bg,
  color: theme.colors.text,
};

const badgeCommunity = {
  ...badgeBase,
  background: theme.colors.bgSubtle,
  color: theme.colors.text,
};

// Title
const title = {
  fontSize: theme.typography.sizes.base,
  fontWeight: theme.typography.weights.bold,
  color: theme.colors.text,
  margin: 0,
  marginBottom: theme.space[3],
  lineHeight: theme.typography.lineHeights.snug,
  fontFamily: theme.typography.fonts.primary,
};

// Price and owner row
const priceRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.space[3],
  gap: theme.space[2],
};

const ownerInfo = {
  fontSize: theme.typography.sizes.sm,
  color: theme.colors.textSubtle,
  fontFamily: theme.typography.fonts.primary,
};

const price = {
  fontSize: theme.typography.sizes.base,
  fontWeight: theme.typography.weights.bold,
  color: theme.colors.text,
  fontFamily: theme.typography.fonts.primary,
};

// Trust cues and availability section
const trustSection = {
  marginTop: "auto",
  paddingTop: theme.space[3],
  borderTop: `1px solid ${theme.colors.border}`,
};

const trustText = {
  fontSize: theme.typography.sizes.xs,
  color: theme.colors.textMuted,
  lineHeight: theme.typography.lineHeights.relaxed,
  marginBottom: theme.space[2],
  fontFamily: theme.typography.fonts.primary,
};

const availabilityText = {
  fontSize: theme.typography.sizes.xs,
  color: theme.colors.text,
  fontWeight: theme.typography.weights.medium,
  fontFamily: theme.typography.fonts.primary,
};

// Availability calendar placeholder
const availabilityPlaceholder = {
  marginTop: theme.space[2],
  padding: theme.space[2],
  background: theme.colors.bgSubtle,
  borderRadius: theme.radius.sm,
  border: `1px dashed ${theme.colors.border}`,
  fontSize: theme.typography.sizes.xs,
  color: theme.colors.textMuted,
  textAlign: "center",
  fontFamily: theme.typography.fonts.primary,
};

/**
 * ListingCard - Reusable listing card component
 * 
 * @param {Object} listing - The listing object
 * @param {string} visibilityScope - "public" | "community"
 * @param {string} availabilityStatus - Human-readable availability text
 * @param {string} trustCue - Trust/approval message
 * @param {string} communityCode - Optional community code to display
 * @param {boolean} showAvailabilityPlaceholder - Show calendar placeholder
 * @param {Object} availabilityData - Structured availability data (reserved for future)
 */
export default function ListingCard({
  listing,
  visibilityScope = "public",
  availabilityStatus = "Available now",
  trustCue = null,
  communityCode = null,
  showAvailabilityPlaceholder = false,
  availabilityData = null, // Reserved for future calendar integration
}) {
  const badgeStyle = visibilityScope === "community" ? badgeCommunity : badgePublic;
  const badgeLabel = visibilityScope === "community" ? "Community" : "Public";

  // Default trust cue if not provided
  const defaultTrustCue =
    visibilityScope === "public"
      ? "Public listing: request and coordinate after approval."
      : `Community listing${communityCode ? ` • ${communityCode}` : ""}`;

  const displayTrustCue = trustCue ?? defaultTrustCue;

  return (
    <>
      <style>{`
        .listing-card-hover:hover {
          box-shadow: ${theme.components.card.shadowHover} !important;
          border-color: ${theme.components.card.borderHover} !important;
          transform: translateY(-2px);
        }
      `}</style>
      <Link
        to={`/listing/${listing.id}`}
        style={cardContainer}
        className="listing-card listing-card-hover"
      >
      <div style={headerRow}>
        <div style={metaInfo}>
          {listing.category} • {listing.location}
        </div>
        <div style={badgeStyle}>{badgeLabel}</div>
      </div>

      <h3 style={title}>{listing.title}</h3>

      <div style={priceRow}>
        <span style={ownerInfo}>Owner: {listing.ownerName}</span>
        <span style={price}>${listing.pricePerDay}/day</span>
      </div>

      <div style={trustSection}>
        <div style={trustText}>{displayTrustCue}</div>
        <div style={availabilityText}>{availabilityStatus}</div>
        
        {showAvailabilityPlaceholder && (
          <div style={availabilityPlaceholder}>
            📅 Calendar view coming soon
          </div>
        )}
      </div>
    </Link>
    </>
  );
}

