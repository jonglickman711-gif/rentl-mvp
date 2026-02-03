import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppStore } from "../store/AppStore";
import theme from "../styles/themes";

function overlaps(aStart, aEnd, bStart, bEnd) {
  const aS = new Date(aStart).getTime();
  const aE = new Date(aEnd).getTime();
  const bS = new Date(bStart).getTime();
  const bE = new Date(bEnd).getTime();
  return aS <= bE && bS <= aE;
}

// Mobile-safe responsive padding
const page = {
  padding: `${theme.space[4]} ${theme.space[6]}`,
  maxWidth: theme.components.container.maxWidth,
  margin: "0 auto",
  fontFamily: theme.typography.fonts.primary,
  color: theme.colors.text,
};

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: theme.space[4],
  flexWrap: "wrap",
  alignItems: "flex-start",
};

// Added line-height for typography hierarchy
const title = {
  margin: 0,
  fontSize: theme.typography.sizes["3xl"],
  lineHeight: theme.typography.lineHeights.tight,
  letterSpacing: theme.typography.letterSpacing.tight,
  fontWeight: theme.typography.weights.bold,
};

const subtitle = {
  marginTop: theme.space[2],
  color: theme.colors.textSubtle,
  fontSize: theme.typography.sizes.sm,
  lineHeight: theme.typography.lineHeights.normal,
};

const pill = {
  display: "inline-flex",
  alignItems: "center",
  gap: theme.space[2],
  padding: `${theme.space[1]} ${theme.space[3]}`,
  borderRadius: theme.radius.pill,
  border: `1px solid ${theme.colors.border}`,
  background: theme.colors.bgSubtle,
  color: theme.colors.text,
  fontSize: theme.typography.sizes.xs,
  fontWeight: theme.typography.weights.semibold,
};

const actionsRow = {
  display: "flex",
  gap: theme.space[2],
  alignItems: "center",
  flexWrap: "wrap",
};

// Mobile-safe responsive section spacing
const section = {
  marginTop: theme.space[6],
};

// Added line-height for typography hierarchy
const sectionTitle = {
  margin: 0,
  marginBottom: theme.space[3],
  fontSize: theme.typography.sizes.xl,
  lineHeight: theme.typography.lineHeights.snug,
  letterSpacing: theme.typography.letterSpacing.tight,
  fontWeight: theme.typography.weights.bold,
};

const grid = {
  display: "grid",
  gap: theme.space[3],
};

// Card with hover class for CSS-based hover effects
const cardBase = {
  border: `1px solid ${theme.components.card.border}`,
  borderRadius: theme.components.card.radius,
  padding: theme.components.card.padding,
  background: theme.components.card.bg,
  boxShadow: theme.components.card.shadow,
  transition: `all ${theme.motion.normal} ${theme.motion.easing}`,
  cursor: "default",
};

// Empty card with consistent padding
const emptyCard = {
  ...cardBase,
  borderStyle: "dashed",
  background: theme.colors.bgSubtle,
  color: theme.colors.textSubtle,
  marginTop: theme.space[4],
  padding: theme.components.card.padding,
  textAlign: "center",
};

const rowBetween = {
  display: "flex",
  justifyContent: "space-between",
  gap: theme.space[3],
  flexWrap: "wrap",
  alignItems: "center",
};

const strongLink = {
  color: theme.colors.text,
  textDecoration: "none",
  fontWeight: theme.typography.weights.semibold,
  transition: `color ${theme.motion.fast} ${theme.motion.easing}`,
};

const subtleLink = {
  color: theme.colors.primary,
  textDecoration: "none",
  fontWeight: theme.typography.weights.semibold,
  transition: `color ${theme.motion.fast} ${theme.motion.easing}`,
};

// Standardized hint spacing
const hint = {
  marginTop: theme.space[3],
  fontSize: theme.typography.sizes.xs,
  color: theme.colors.textMuted,
  lineHeight: theme.typography.lineHeights.relaxed,
};

// Standardized meta line spacing
const metaLine = {
  marginTop: theme.space[2],
  color: theme.colors.textSubtle,
  fontSize: theme.typography.sizes.sm,
  lineHeight: theme.typography.lineHeights.normal,
};

// Standardized card title style
const cardTitle = {
  fontWeight: theme.typography.weights.bold,
  fontSize: theme.typography.sizes.base,
  lineHeight: theme.typography.lineHeights.snug,
  color: theme.colors.text,
};

// Price typography with distinct styling
const priceText = {
  fontWeight: theme.typography.weights.bold,
  fontSize: theme.typography.sizes.lg,
  color: theme.colors.primary,
  lineHeight: theme.typography.lineHeights.tight,
};

// Button base with focus states
const buttonBase = {
  height: theme.components.button.height,
  padding: `0 ${theme.components.button.paddingX}`,
  borderRadius: theme.components.button.radius,
  fontWeight: theme.components.button.fontWeight,
  fontSize: theme.typography.sizes.sm,
  fontFamily: theme.typography.fonts.primary,
  cursor: "pointer",
  transition: `all ${theme.components.button.transition}`,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.space[2],
  textDecoration: "none",
  border: "none",
  outline: "none",
};

// Primary button with hover and focus
const btnPrimary = {
  ...buttonBase,
  background: theme.components.button.primary.bg,
  color: theme.components.button.primary.text,
  boxShadow: theme.components.button.primary.shadow,
};

// Improved disabled button styling
const btnPrimaryDisabled = {
  ...btnPrimary,
  background: theme.colors.bgSubtle,
  color: theme.colors.textMuted,
  cursor: "not-allowed",
  boxShadow: theme.shadow.xs,
  opacity: 1,
};

// Ghost button with hover and focus
const btnGhost = {
  ...buttonBase,
  background: theme.components.button.ghost.bg,
  color: theme.components.button.ghost.text,
  border: `1px solid ${theme.components.button.ghost.border}`,
};

// Improved disabled ghost button
const btnGhostDisabled = {
  ...btnGhost,
  background: theme.colors.bgSubtle,
  color: theme.colors.textMuted,
  borderColor: theme.colors.border,
  cursor: "not-allowed",
  opacity: 1,
};

// Standardized button row spacing
const buttonRow = {
  marginTop: theme.space[3],
  display: "flex",
  gap: theme.space[2],
  flexWrap: "wrap",
};

const getStatusBadgeStyle = (status) => {
  const base = {
    padding: `${theme.components.badge.paddingY} ${theme.components.badge.paddingX}`,
    borderRadius: theme.components.badge.radius,
    fontSize: theme.components.badge.fontSize,
    fontWeight: theme.components.badge.fontWeight,
    border: "1px solid",
    textTransform: "capitalize",
    fontFamily: theme.typography.fonts.primary,
    letterSpacing: theme.typography.letterSpacing.tight,
    whiteSpace: "nowrap",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  if (status === "approved") {
    return {
      ...base,
      background: theme.components.badge.primary.bg,
      color: theme.components.badge.primary.text,
      borderColor: theme.components.badge.primary.border,
    };
  }

  if (status === "declined") {
    return {
      ...base,
      background: theme.components.badge.accent.bg,
      color: theme.components.badge.accent.text,
      borderColor: theme.components.badge.accent.border,
    };
  }

  return {
    ...base,
    background: theme.components.badge.neutral.bg,
    color: theme.components.badge.neutral.text,
    borderColor: theme.components.badge.neutral.border,
  };
};

function getListingLabel(listings, listingId) {
  const l = listings.find((x) => x.id === listingId);
  return l ? l.title : listingId;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { session, requests, setRequests, listings, setListings } = useAppStore();

  if (!session) {
    return (
      <>
        <style>{`
          .dashboard-card-hover:hover {
            box-shadow: ${theme.components.card.shadowHover} !important;
            border-color: ${theme.components.card.borderHover} !important;
            transform: translateY(-1px);
          }
          .btn-primary:hover:not(:disabled) {
            background: ${theme.components.button.primary.bgHover} !important;
            box-shadow: ${theme.components.button.primary.shadowHover} !important;
            transform: translateY(-1px);
          }
          .btn-primary:focus-visible {
            outline: 2px solid ${theme.colors.focusRing};
            outline-offset: 2px;
          }
          .btn-ghost:hover:not(:disabled) {
            background: ${theme.components.button.ghost.bgHover} !important;
          }
          .btn-ghost:focus-visible {
            outline: 2px solid ${theme.colors.focusRing};
            outline-offset: 2px;
          }
          a:focus-visible {
            outline: 2px solid ${theme.colors.focusRing};
            outline-offset: 2px;
            border-radius: ${theme.radius.sm};
          }
        `}</style>
        <div style={page}>
          <h1 style={title}>Dashboard</h1>
          <div style={emptyCard}>
            <div style={{ marginBottom: theme.space[3] }}>
              Start a session to view your dashboard.
            </div>
            <div style={{ display: "flex", gap: theme.space[2], flexWrap: "wrap", justifyContent: "center" }}>
              <Link to="/get-started" className="btn-primary" style={btnPrimary}>
                Get Started
              </Link>
              <Link to="/browse" className="btn-ghost" style={btnGhost}>
                Browse
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const myListings = useMemo(
    () => listings.filter((l) => l.ownerId === session.id),
    [listings, session.id]
  );

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
    updateRequestStatus(req.id, "approved");

    setListings((prev) =>
      prev.map((l) => {
        if (l.id !== req.listingId) return l;

        const existing = Array.isArray(l.blockedRanges) ? l.blockedRanges : [];
        const nextRange = { start: req.startDate, end: req.endDate };

        const alreadyBlocked = existing.some((r) => r.start === nextRange.start && r.end === nextRange.end);
        const conflicts = existing.some((r) => overlaps(nextRange.start, nextRange.end, r.start, r.end));

        if (alreadyBlocked) return l;
        if (conflicts) return l;

        return { ...l, blockedRanges: [nextRange, ...existing] };
      })
    );
  };

  return (
    <>
      <style>{`
        .dashboard-card-hover:hover {
          box-shadow: ${theme.components.card.shadowHover} !important;
          border-color: ${theme.components.card.borderHover} !important;
          transform: translateY(-1px);
        }
        .btn-primary:hover:not(:disabled) {
          background: ${theme.components.button.primary.bgHover} !important;
          box-shadow: ${theme.components.button.primary.shadowHover} !important;
          transform: translateY(-1px);
        }
        .btn-primary:focus-visible {
          outline: 2px solid ${theme.colors.focusRing};
          outline-offset: 2px;
        }
        .btn-ghost:hover:not(:disabled) {
          background: ${theme.components.button.ghost.bgHover} !important;
        }
        .btn-ghost:focus-visible {
          outline: 2px solid ${theme.colors.focusRing};
          outline-offset: 2px;
        }
        a:focus-visible {
          outline: 2px solid ${theme.colors.focusRing};
          outline-offset: 2px;
          border-radius: ${theme.radius.sm};
        }
      `}</style>
      <div style={page}>
        <div style={headerRow}>
          <div>
            <h1 style={title}>Dashboard</h1>
            <div style={subtitle}>
              Signed in as <b>{session.name}</b>
              <span style={{ marginLeft: theme.space[2] }}>
                <span style={pill}>
                  {session.role}
                  {session.communityCode ? ` • ${session.communityCode}` : ""}
                </span>
              </span>
            </div>
          </div>

          <div style={actionsRow}>
            <button onClick={() => navigate("/browse")} className="btn-ghost" style={btnGhost}>
              Browse
            </button>
            {session.role === "community" ? (
              <button onClick={() => navigate("/list-item")} className="btn-primary" style={btnPrimary}>
                List an Item
              </button>
            ) : null}
          </div>
        </div>

        {session.role === "public" ? (
          <section style={section}>
            <h2 style={sectionTitle}>My Rentals</h2>

            <div style={grid}>
              {myRentalRequests.length === 0 ? (
                <div style={emptyCard}>
                  <div style={{ marginBottom: theme.space[3] }}>
                    No rental requests yet.
                  </div>
                  <Link to="/browse" style={subtleLink}>
                    Browse to find something
                  </Link>
                </div>
              ) : (
                myRentalRequests.map((r) => (
                  <div key={r.id} className="dashboard-card-hover" style={cardBase}>
                    <div style={rowBetween}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={cardTitle}>
                          Request for{" "}
                          <Link to={`/listing/${r.listingId}`} style={strongLink}>
                            {getListingLabel(listings, r.listingId)}
                          </Link>
                        </div>
                        <div style={metaLine}>
                          Dates: <b>{r.startDate}</b> → <b>{r.endDate}</b>
                        </div>
                      </div>

                      <div style={getStatusBadgeStyle(r.status)}>{r.status}</div>
                    </div>

                    <div style={hint}>After approval, coordinate pickup and return with the owner.</div>
                  </div>
                ))
              )}
            </div>
          </section>
        ) : (
          <>
            <section style={section}>
              <h2 style={sectionTitle}>My Listings</h2>

              <div style={grid}>
                {myListings.length === 0 ? (
                  <div style={emptyCard}>
                    <div style={{ marginBottom: theme.space[3] }}>
                      No listings yet.
                    </div>
                    <Link to="/list-item" style={subtleLink}>
                      List an Item
                    </Link>
                  </div>
                ) : (
                  myListings.map((l) => (
                    <div key={l.id} className="dashboard-card-hover" style={cardBase}>
                      <div style={rowBetween}>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={cardTitle}>{l.title}</div>
                          <div style={metaLine}>
                            {l.category} • {l.location}
                          </div>
                        </div>
                        <div style={priceText}>${l.pricePerDay}/day</div>
                      </div>

                      <div style={{ marginTop: theme.space[3], display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: theme.space[2] }}>
                        <Link to={`/listing/${l.id}`} style={subtleLink}>
                          View listing
                        </Link>

                        <div style={{ fontSize: theme.typography.sizes.xs, color: theme.colors.textMuted }}>
                          Blocked dates:{" "}
                          <b style={{ color: theme.colors.text }}>
                            {Array.isArray(l.blockedRanges) ? l.blockedRanges.length : 0}
                          </b>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section style={section}>
              <h2 style={sectionTitle}>Incoming Requests</h2>

              <div style={grid}>
                {incomingRequests.length === 0 ? (
                  <div style={emptyCard}>
                    <div style={{ marginBottom: theme.space[3] }}>
                      No incoming requests yet.
                    </div>
                  </div>
                ) : (
                  incomingRequests.map((r) => (
                    <div key={r.id} className="dashboard-card-hover" style={cardBase}>
                      <div style={rowBetween}>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={cardTitle}>
                            <b>{r.renterName}</b> requested{" "}
                            <Link to={`/listing/${r.listingId}`} style={strongLink}>
                              {getListingLabel(listings, r.listingId)}
                            </Link>
                          </div>
                          <div style={metaLine}>
                            Dates: <b>{r.startDate}</b> → <b>{r.endDate}</b>
                          </div>
                        </div>

                        <div style={getStatusBadgeStyle(r.status)}>{r.status}</div>
                      </div>

                      <div style={buttonRow}>
                        <button
                          onClick={() => approveAndBlockDates(r)}
                          disabled={r.status !== "pending"}
                          className="btn-primary"
                          style={r.status === "pending" ? btnPrimary : btnPrimaryDisabled}
                        >
                          Approve and block dates
                        </button>

                        <button
                          onClick={() => updateRequestStatus(r.id, "declined")}
                          disabled={r.status !== "pending"}
                          className="btn-ghost"
                          style={r.status === "pending" ? btnGhost : btnGhostDisabled}
                        >
                          Decline
                        </button>
                      </div>

                      <div style={hint}>
                        Approving blocks the dates on the listing so renters can't double-book.
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}
