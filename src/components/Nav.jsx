import React from "react";
import { Link, useLocation } from "react-router-dom";
import theme from "../styles/themes";
import logo from "../assets/brand/Signature Logo.png";
import { useAppStore } from "../store/AppStore";

const navStyle = {
  position: "sticky",
  top: 0,
  zIndex: theme.z.sticky,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: `0 ${theme.space[6]}`,
  height: theme.components.nav.height,
  background: theme.components.nav.bg,
  backdropFilter: theme.components.nav.backdropBlur,
  WebkitBackdropFilter: theme.components.nav.backdropBlur,
  borderBottom: `1px solid ${theme.components.nav.border}`,
  boxShadow: theme.components.nav.shadow,
  fontFamily: theme.typography.fonts.primary,
};

const leftSection = {
  display: "flex",
  alignItems: "center",
  gap: theme.space[3],
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
  gap: theme.space[1],
  flex: 1,
  justifyContent: "flex-end",
  marginRight: theme.space[4],
};

const linkStyle = (active) => ({
  padding: `${theme.space[2]} ${theme.space[3]}`,
  borderRadius: theme.radius.sm,
  textDecoration: "none",
  color: active ? theme.colors.primary : theme.colors.text,
  background: active ? theme.colors.primarySoft : "transparent",
  fontSize: theme.typography.sizes.sm,
  fontWeight: active ? theme.typography.weights.semibold : theme.typography.weights.regular,
  transition: `all ${theme.motion.normal} ${theme.motion.easing}`,
  position: "relative",
});

const linkHoverStyle = {
  color: theme.colors.primary,
  background: theme.colors.primarySoft,
  transform: "translateY(-1px)",
};

const ctaButtonStyle = {
  padding: `${theme.space[2]} ${theme.components.button.paddingX}`,
  height: theme.components.button.height,
  borderRadius: theme.components.button.radius,
  border: "none",
  background: theme.components.button.primary.bg,
  color: theme.components.button.primary.text,
  fontWeight: theme.components.button.fontWeight,
  fontSize: theme.typography.sizes.sm,
  cursor: "pointer",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: theme.components.button.primary.shadow,
  transition: `all ${theme.components.button.transition}`,
  fontFamily: theme.typography.fonts.primary,
  whiteSpace: "nowrap",
};

const ctaHoverStyle = {
  background: theme.components.button.primary.bgHover,
  boxShadow: theme.components.button.primary.shadowHover,
  transform: "translateY(-1px)",
};

export default function Nav() {
  const { pathname } = useLocation();
  const { session } = useAppStore();
  const [hoveredLink, setHoveredLink] = React.useState(null);
  const [hoveredCta, setHoveredCta] = React.useState(false);

  const isActive = (path) => pathname === path;

  const regularLinks = [
    { path: "/", label: "Home" },
    { path: "/browse", label: "Browse" },
    { path: "/playlists", label: "Playlists" },
    { path: "/dashboard", label: "Dashboard" },
  ];

  // When session exists, show Dashboard as primary CTA; otherwise Get Started
  const ctaLink = session 
    ? { path: "/dashboard", label: "Dashboard" }
    : { path: "/get-started", label: "Get Started" };

  return (
    <nav style={navStyle}>
      {/* Left: Logo */}
      <div style={leftSection}>
        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src={logo} alt="RentL Logo" style={logoStyle} />
        </Link>
      </div>

      {/* Middle/Right: Nav Links */}
      <div style={navLinks}>
        {regularLinks.map((link) => {
          const active = isActive(link.path);
          const hovered = hoveredLink === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              style={{
                ...linkStyle(active),
                ...(hovered ? linkHoverStyle : {}),
              }}
              onMouseEnter={() => setHoveredLink(link.path)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Right: CTA Button */}
      <Link
        to={ctaLink.path}
        style={{
          ...ctaButtonStyle,
          ...(hoveredCta ? ctaHoverStyle : {}),
        }}
        onMouseEnter={() => setHoveredCta(true)}
        onMouseLeave={() => setHoveredCta(false)}
      >
        {ctaLink.label}
      </Link>
    </nav>
  );
}
