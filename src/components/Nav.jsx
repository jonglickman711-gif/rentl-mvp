import React, { useMemo, useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import theme from "../styles/themes";
import logo from "../assets/brand/Signature Logo.png";
import { useAppStore } from "../store/AppStore";

const shell = {
  position: "sticky",
  top: 0,
  zIndex: theme.z.sticky,
  background: theme.components.nav.bg,
  backdropFilter: theme.components.nav.backdropBlur,
  WebkitBackdropFilter: theme.components.nav.backdropBlur,
  borderBottom: `1px solid ${theme.components.nav.border}`,
  boxShadow: theme.components.nav.shadow,
};

const inner = {
  height: theme.components.nav.height,
  maxWidth: theme.components.container.maxWidth,
  margin: "0 auto",
  padding: `0 ${theme.components.container.paddingX}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontFamily: theme.typography.fonts.primary,
};

const leftSection = {
  display: "flex",
  alignItems: "center",
  flexShrink: 0,
};

const logoStyle = {
  height: "32px",
  width: "auto",
  display: "block",
};

const navLinks = {
  display: "flex",
  alignItems: "center",
  gap: theme.space[2],
  justifyContent: "flex-end",
  marginLeft: theme.space[4],
  marginRight: theme.space[4],
  flex: 1,
  minWidth: 0,
};

const baseLinkStyle = {
  padding: `${theme.space[2]} ${theme.space[3]}`,
  borderRadius: theme.radius.sm,
  textDecoration: "none",
  color: theme.colors.text,
  fontSize: theme.typography.sizes.sm,
  fontWeight: theme.typography.weights.medium,
  transition: `all ${theme.motion.normal} ${theme.motion.easing}`,
  position: "relative",
  outline: "none",
};

const activeUnderline = {
  content: '""',
  position: "absolute",
  left: theme.space[3],
  right: theme.space[3],
  bottom: "6px",
  height: "2px",
  borderRadius: theme.radius.pill,
  background: theme.colors.primary,
  opacity: 1,
};

const linkHover = {
  background: "rgba(23, 190, 187, 0.08)",
  color: theme.colors.primary,
};

const searchIconButton = {
  ...baseLinkStyle,
  padding: theme.space[2],
  width: "40px",
  height: "40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  border: "none",
  background: "transparent",
};

const searchIconSvg = {
  width: "20px",
  height: "20px",
  stroke: theme.colors.text,
  fill: "none",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

// Floating search overlay
const searchOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0, 0, 0, 0.4)",
  backdropFilter: "blur(4px)",
  WebkitBackdropFilter: "blur(4px)",
  zIndex: theme.z.modal,
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  paddingTop: "120px",
  animation: "fadeIn 0.15s ease-out",
};

const searchContainer = {
  width: "100%",
  maxWidth: "600px",
  margin: `0 ${theme.space[6]}`,
  position: "relative",
};

const searchInputWrapper = {
  position: "relative",
  background: theme.colors.bg,
  borderRadius: theme.components.input.radius,
  boxShadow: theme.shadow.lg,
  border: `2px solid ${theme.components.input.borderFocus}`,
};

const searchInput = {
  width: "100%",
  padding: `${theme.components.input.paddingY} ${theme.components.input.paddingX}`,
  paddingRight: "48px",
  borderRadius: theme.components.input.radius,
  border: "none",
  fontSize: theme.typography.sizes.base,
  fontFamily: theme.typography.fonts.primary,
  color: theme.colors.text,
  outline: "none",
  background: "transparent",
};

const searchInputPlaceholder = {
  color: theme.components.input.placeholder,
};

const suggestionsList = {
  marginTop: theme.space[2],
  background: theme.colors.bg,
  borderRadius: theme.components.input.radius,
  boxShadow: theme.shadow.md,
  border: `1px solid ${theme.colors.border}`,
  maxHeight: "400px",
  overflowY: "auto",
  overflowX: "hidden",
};

const suggestionItem = {
  padding: `${theme.space[3]} ${theme.components.input.paddingX}`,
  cursor: "pointer",
  borderBottom: `1px solid ${theme.colors.border}`,
  transition: `background ${theme.motion.fast} ${theme.motion.easing}`,
  display: "flex",
  flexDirection: "column",
  gap: theme.space[1],
};

const suggestionItemHover = {
  background: theme.colors.surfaceHover,
};

const suggestionTitle = {
  fontWeight: theme.typography.weights.semibold,
  color: theme.colors.text,
  fontSize: theme.typography.sizes.sm,
};

const suggestionMeta = {
  fontSize: theme.typography.sizes.xs,
  color: theme.colors.textSubtle,
};

const noSuggestions = {
  padding: theme.space[4],
  textAlign: "center",
  color: theme.colors.textMuted,
  fontSize: theme.typography.sizes.sm,
};

// Helper function to match query (same as Browse.jsx)
function matchesQuery(l, query) {
  if (!query) return false;
  const hay = [l.title, l.category, l.location, l.ownerName].map((x) => String(x ?? "").toLowerCase());
  return hay.some((x) => x.includes(query));
}

export default function Nav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { session, listings } = useAppStore();
  const [hoveredLink, setHoveredLink] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredSuggestion, setHoveredSuggestion] = useState(null);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  const isActive = (path) => pathname === path;

  // Regular nav links
  const baseLinks = [
    { path: "/", label: "Home" },
    { path: "/browse", label: "Browse" },
    { path: "/playlists", label: "Playlists" },
    { path: "/dashboard", label: "Dashboard" },
  ];

  const regularLinks = session
    ? baseLinks
    : baseLinks;

  // Generate search suggestions
  const suggestions = useMemo(() => {
    if (!searchQuery.trim() || !listings) return [];
    
    const query = searchQuery.trim().toLowerCase();
    const matched = listings
      .filter((l) => matchesQuery(l, query))
      .slice(0, 8); // Limit to 8 suggestions
    
    return matched;
  }, [searchQuery, listings]);

  // Open search and focus input
  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  };

  // Close search
  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
    setHoveredSuggestion(null);
  };

  // Handle search submission
  const handleSearch = (query = searchQuery) => {
    if (query.trim()) {
      navigate(`/browse?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate("/browse");
    }
    closeSearch();
  };

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (hoveredSuggestion !== null && suggestions[hoveredSuggestion]) {
        const suggestion = suggestions[hoveredSuggestion];
        handleSearch(suggestion.title);
      } else {
        handleSearch();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHoveredSuggestion((prev) => 
        prev === null ? 0 : Math.min(prev + 1, suggestions.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHoveredSuggestion((prev) => 
        prev === null ? suggestions.length - 1 : Math.max(prev - 1, -1)
      );
    } else if (e.key === "Escape") {
      closeSearch();
    }
  };

  // Click outside to close
  useEffect(() => {
    if (!searchOpen) return;

    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        closeSearch();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen]);

  // Escape key to close
  useEffect(() => {
    if (!searchOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        closeSearch();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [searchOpen]);

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .search-icon-button:hover {
          background: rgba(23, 190, 187, 0.08) !important;
        }
        .search-icon-button:hover svg {
          stroke: ${theme.colors.primary};
        }
        .search-icon-button:focus-visible {
          outline: 2px solid ${theme.colors.focusRing};
          outline-offset: 2px;
        }
        a:focus-visible {
          outline: 2px solid ${theme.colors.focusRing};
          outline-offset: 2px;
          border-radius: ${theme.radius.sm};
        }
      `}</style>
      <header style={shell}>
        <nav style={inner}>
          <div style={leftSection}>
            <Link
              to="/"
              style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}
              aria-label="RentL Home"
            >
              <img src={logo} alt="RentL" style={logoStyle} />
            </Link>
          </div>

          <div style={navLinks} aria-label="Primary navigation">
            {regularLinks.map((link) => {
              const active = isActive(link.path);
              const hovered = hoveredLink === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    ...baseLinkStyle,
                    ...(hovered ? linkHover : {}),
                    color: active ? theme.colors.primary : (hovered ? theme.colors.primary : theme.colors.text),
                  }}
                  onMouseEnter={() => setHoveredLink(link.path)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  {link.label}
                  {active ? <span style={activeUnderline} /> : null}
                </Link>
              );
            })}
          </div>

          <button
            onClick={openSearch}
            className="search-icon-button"
            style={searchIconButton}
            aria-label="Search"
          >
            <svg style={searchIconSvg} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </nav>
      </header>

      {searchOpen && (
        <div style={searchOverlay} onClick={closeSearch}>
          <div style={searchContainer} ref={searchContainerRef} onClick={(e) => e.stopPropagation()}>
            <div style={searchInputWrapper}>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setHoveredSuggestion(null);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search items, category, location..."
                style={searchInput}
                autoComplete="off"
              />
              <button
                onClick={closeSearch}
                style={{
                  position: "absolute",
                  right: theme.space[2],
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: theme.space[1],
                  color: theme.colors.textMuted,
                  fontSize: theme.typography.sizes.lg,
                  lineHeight: 1,
                }}
                aria-label="Close search"
              >
                ×
              </button>
            </div>

            {searchQuery.trim() && (
              <div style={suggestionsList}>
                {suggestions.length > 0 ? (
                  suggestions.map((listing, index) => (
                    <div
                      key={listing.id}
                      style={{
                        ...suggestionItem,
                        ...(hoveredSuggestion === index ? suggestionItemHover : {}),
                        ...(index === suggestions.length - 1 ? { borderBottom: "none" } : {}),
                      }}
                      onMouseEnter={() => setHoveredSuggestion(index)}
                      onMouseLeave={() => setHoveredSuggestion(null)}
                      onClick={() => handleSearch(listing.title)}
                    >
                      <div style={suggestionTitle}>{listing.title}</div>
                      <div style={suggestionMeta}>
                        {listing.category} • {listing.location}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={noSuggestions}>
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
