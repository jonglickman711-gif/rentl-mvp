// src/theme.js
// RentL Theme (MVP) – single source of truth for styling
// Inspired by modern marketplace UI patterns (Airbnb-like: clean, friendly, high-contrast CTAs)

const theme = {
    meta: {
      brandName: "RentL",
      version: "mvp-v1",
    },
  
    // Brand colors from your kit
    brand: {
      teal: "#17BEBB",
      charcoal: "#2E282A",
      orange: "#E4572E",
    },
  
    // Full UI palette (light mode MVP)
    colors: {
      // Backgrounds / surfaces (Airbnb-like: very light, clean, lots of whitespace)
      bg: "#FFFFFF",
      bgSubtle: "#F7F9FA",
      surface: "#FFFFFF",
      surfaceHover: "#F3F4F6",
  
      // Text
      text: "#2E282A",
      textSubtle: "#6B7280",
      textMuted: "#9CA3AF",
      textOnDark: "#FFFFFF",
  
      // Lines
      border: "#E5E7EB",
      borderStrong: "#D1D5DB",
  
      // Brand roles
      primary: "#17BEBB", // teal
      primaryHover: "#14AAA7",
      primarySoft: "rgba(23, 190, 187, 0.12)",
  
      secondary: "#2E282A", // charcoal
      secondaryHover: "#1F1B1C",
      secondarySoft: "rgba(46, 40, 42, 0.10)",
  
      accent: "#E4572E", // orange
      accentHover: "#CF4B26",
      accentSoft: "rgba(228, 87, 46, 0.12)",
  
      // Status
      success: "#17BEBB",
      warning: "#E4572E",
      danger: "#DC2626",
      info: "#2563EB",
  
      // Focus ring (accessible)
      focus: "rgba(23, 190, 187, 0.35)",
  
      // Overlays
      overlay: "rgba(0,0,0,0.45)",
    },
  
    // Typography (your kit: Inter + Lato)
    typography: {
      fonts: {
        primary:
          "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji'",
        secondary:
          "'Lato', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans'",
        mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
      },
  
      // Airbnb-ish scale: readable, friendly, modern
      sizes: {
        xs: "0.75rem", // 12
        sm: "0.875rem", // 14
        base: "1rem", // 16
        lg: "1.125rem", // 18
        xl: "1.25rem", // 20
        "2xl": "1.5rem", // 24
        "3xl": "1.875rem", // 30
        "4xl": "2.25rem", // 36
        "5xl": "3rem", // 48
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
  
    // Spacing + layout rhythm
    spacing: {
      "0": "0px",
      "1": "4px",
      "2": "8px",
      "3": "12px",
      "4": "16px",
      "5": "20px",
      "6": "24px",
      "8": "32px",
      "10": "40px",
      "12": "48px",
      "16": "64px",
      "20": "80px",
      "24": "96px",
    },
  
    // Rounded corners (marketplace-friendly: soft, not bubbly)
    radius: {
      xs: "6px",
      sm: "10px",
      md: "14px",
      lg: "18px",
      xl: "24px",
      pill: "9999px",
    },
  
    // Shadows (subtle, like Airbnb cards)
    shadows: {
      xs: "0 1px 2px rgba(0,0,0,0.06)",
      sm: "0 2px 8px rgba(0,0,0,0.08)",
      md: "0 8px 24px rgba(0,0,0,0.10)",
      lg: "0 16px 40px rgba(0,0,0,0.14)",
    },
  
    // Motion
    motion: {
      fast: "120ms",
      normal: "180ms",
      slow: "260ms",
      easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    },
  
    // Z-index scale
    z: {
      base: 0,
      dropdown: 50,
      sticky: 100,
      overlay: 200,
      modal: 300,
      toast: 400,
    },
  
    // Common component tokens so your UI stays consistent
    components: {
      container: {
        maxWidth: "1120px",
        paddingX: "20px",
      },
  
      nav: {
        height: "64px",
        bg: "#FFFFFF",
        border: "#E5E7EB",
        shadow: "0 1px 2px rgba(0,0,0,0.06)",
        blur: "blur(10px)", // for a “floating” feel if you use backdrop-filter
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
        primary: { bg: "rgba(23, 190, 187, 0.12)", text: "#0F6E6C", border: "rgba(23, 190, 187, 0.25)" },
        accent: { bg: "rgba(228, 87, 46, 0.12)", text: "#9A3A1F", border: "rgba(228, 87, 46, 0.25)" },
      },
    },
  };
  
  export default theme;
  export { theme };
  