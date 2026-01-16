// src/styles/theme.js
// RentL Theme (MVP) - single source of truth for styling
// Clean, marketplace-ready, backend-agnostic

export const theme = {
    meta: {
      brandName: "RentL",
      version: "mvp-v1",
    },
  
    // Base brand kit (do not use directly in components unless needed)
    brand: {
      teal: "#17BEBB",
      charcoal: "#2E282A",
      orange: "#E4572E",
    },
  
    // Semantic palette (use this everywhere)
    colors: {
      // Surfaces
      bg: "#FFFFFF",
      bgSubtle: "#F7F9FA",
      surface: "#FFFFFF",
      surfaceHover: "#F3F4F6",
  
      // Text
      text: "#2E282A",
      textSubtle: "#6B7280",
      textMuted: "#9CA3AF",
      textOnDark: "#FFFFFF",
  
      // Borders
      border: "#E5E7EB",
      borderStrong: "#D1D5DB",
  
      // Brand roles
      primary: "#17BEBB",
      primaryHover: "#14AAA7",
      primarySoft: "rgba(23, 190, 187, 0.12)",
  
      secondary: "#2E282A",
      secondaryHover: "#1F1B1C",
      secondarySoft: "rgba(46, 40, 42, 0.10)",
  
      accent: "#E4572E",
      accentHover: "#CF4B26",
      accentSoft: "rgba(228, 87, 46, 0.12)",
  
      // Status
      success: "#17BEBB",
      warning: "#E4572E",
      danger: "#DC2626",
      info: "#2563EB",
  
      // Utility
      focusRing: "rgba(23, 190, 187, 0.35)",
      overlay: "rgba(0,0,0,0.45)",
    },
  
    typography: {
      fonts: {
        primary:
          "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji'",
        secondary:
          "'Lato', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans'",
        mono:
          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
      },
  
      sizes: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
      },
  
      weights: {
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
  
      lineHeights: {
        tight: 1.15,
        snug: 1.25,
        normal: 1.5,
        relaxed: 1.65,
      },
  
      letterSpacing: {
        tight: "-0.02em",
        normal: "0em",
        wide: "0.02em",
      },
    },
  
    // Spacing rhythm (use theme.space[4] style)
    space: {
      0: "0px",
      1: "4px",
      2: "8px",
      3: "12px",
      4: "16px",
      5: "20px",
      6: "24px",
      8: "32px",
      10: "40px",
      12: "48px",
      16: "64px",
      20: "80px",
      24: "96px",
    },
  
    radius: {
      xs: "6px",
      sm: "10px",
      md: "14px",
      lg: "18px",
      xl: "24px",
      pill: "9999px",
    },
  
    shadow: {
      xs: "0 1px 2px rgba(0,0,0,0.06)",
      sm: "0 2px 8px rgba(0,0,0,0.08)",
      md: "0 8px 24px rgba(0,0,0,0.10)",
      lg: "0 16px 40px rgba(0,0,0,0.14)",
    },
  
    motion: {
      fast: "120ms",
      normal: "180ms",
      slow: "260ms",
      easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    },
  
    z: {
      base: 0,
      dropdown: 50,
      sticky: 100,
      overlay: 200,
      modal: 300,
      toast: 400,
    },
  
    // Component tokens (derived from colors, so no repeated hexes)
    components: {
      container: {
        maxWidth: "1120px",
        paddingX: "20px",
      },
  
      nav: {
        height: "64px",
        bg: "rgba(255,255,255,0.82)",
        border: "rgba(229,231,235,0.9)",
        shadow: "0 1px 2px rgba(0,0,0,0.06)",
        backdropBlur: "blur(10px)",
      },
  
      card: {
        bg: "#FFFFFF",
        border: "#E5E7EB",
        borderHover: "#D1D5DB",
        radius: "18px",
        shadow: "0 2px 8px rgba(0,0,0,0.08)",
        shadowHover: "0 8px 24px rgba(0,0,0,0.10)",
        padding: "16px",
      },
  
      input: {
        bg: "#FFFFFF",
        border: "#D1D5DB",
        borderFocus: "#17BEBB",
        radius: "14px",
        paddingY: "12px",
        paddingX: "14px",
        placeholder: "#9CA3AF",
        shadowFocus: "0 0 0 4px rgba(23, 190, 187, 0.18)",
      },
  
      button: {
        radius: "14px",
        height: "44px",
        paddingX: "16px",
        fontWeight: 600,
        transition: "180ms cubic-bezier(0.2, 0.8, 0.2, 1)",
  
        primary: {
          bg: "#17BEBB",
          bgHover: "#14AAA7",
          text: "#FFFFFF",
          shadow: "0 2px 8px rgba(23, 190, 187, 0.25)",
          shadowHover: "0 8px 24px rgba(23, 190, 187, 0.30)",
        },
  
        secondary: {
          bg: "#2E282A",
          bgHover: "#1F1B1C",
          text: "#FFFFFF",
          shadow: "0 2px 10px rgba(46, 40, 42, 0.22)",
          shadowHover: "0 10px 26px rgba(46, 40, 42, 0.26)",
        },
  
        accent: {
          bg: "#E4572E",
          bgHover: "#CF4B26",
          text: "#FFFFFF",
          shadow: "0 2px 10px rgba(228, 87, 46, 0.22)",
          shadowHover: "0 10px 26px rgba(228, 87, 46, 0.26)",
        },
  
        ghost: {
          bg: "transparent",
          bgHover: "rgba(46, 40, 42, 0.06)",
          text: "#2E282A",
          border: "#E5E7EB",
        },
      },
  
      badge: {
        radius: "9999px",
        paddingX: "10px",
        paddingY: "6px",
        fontSize: "0.75rem",
        fontWeight: 600,
        neutral: { bg: "#F3F4F6", text: "#2E282A", border: "#E5E7EB" },
        primary: {
          bg: "rgba(23, 190, 187, 0.12)",
          text: "#0F6E6C",
          border: "rgba(23, 190, 187, 0.25)",
        },
        accent: {
          bg: "rgba(228, 87, 46, 0.12)",
          text: "#9A3A1F",
          border: "rgba(228, 87, 46, 0.25)",
        },
      },
    },
  
    // Back-compat: keep your old key name so you don't have to refactor everything today
    spacing: null,
  };
  
  // Back-compat alias: theme.spacing -> theme.space
  theme.spacing = theme.space;
  
  export default theme;
  