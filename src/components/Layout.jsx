import React from "react";
import Nav from "./Nav";

const shell = {
  minHeight: "100vh",
  background:
    "radial-gradient(1200px 600px at 20% 0%, rgba(0,0,0,0.06), transparent 60%), radial-gradient(900px 500px at 80% 10%, rgba(0,0,0,0.05), transparent 55%), #fbfbfb",
};

const topBarWrap = {
  position: "sticky",
  top: 0,
  zIndex: 50,
  backdropFilter: "blur(10px)",
  background: "rgba(251,251,251,0.85)",
  borderBottom: "1px solid rgba(0,0,0,0.06)",
};

const topBarInner = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "10px 16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const contentWrap = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "22px 16px 56px",
};

const pageCard = {
  border: "1px solid rgba(0,0,0,0.07)",
  borderRadius: 22,
  background: "rgba(255,255,255,0.9)",
  boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
  padding: 22,
};

const bottomBand = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "0 16px 26px",
};

const contrastGrid = {
  display: "grid",
  gridTemplateColumns: "1.2fr 0.8fr 1fr",
  gap: 12,
};

const contrastCardDark = {
  borderRadius: 22,
  padding: 18,
  background:
    "linear-gradient(135deg, rgba(0,0,0,0.92), rgba(0,0,0,0.82))",
  color: "white",
  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const contrastCardLight = {
  borderRadius: 22,
  padding: 18,
  background: "white",
  boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
  border: "1px solid rgba(0,0,0,0.07)",
};

const miniTitle = {
  fontWeight: 900,
  marginBottom: 8,
};

const miniBody = {
  color: "rgba(255,255,255,0.85)",
  lineHeight: 1.5,
  fontSize: 13,
};

const miniBodyDarkText = {
  color: "#444",
  lineHeight: 1.5,
  fontSize: 13,
};

const footer = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "16px 16px 26px",
  color: "#666",
  fontSize: 12,
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

const footerLink = {
  color: "#111",
  fontWeight: 800,
  textDecoration: "none",
};

export default function Layout({ children }) {
  return (
    <div style={shell}>
      {/* Sticky nav shell */}
      <div style={topBarWrap}>
        <div style={topBarInner}>
          <Nav />
        </div>
      </div>

      {/* Page content */}
      <div style={contentWrap}>
        <div style={pageCard}>{children}</div>
      </div>

      {/* Contrast band (makes the app feel premium) */}
      <div style={bottomBand}>
        <div style={contrastGrid}>
          <div style={contrastCardDark}>
            <div style={miniTitle}>RentL Mission</div>
            <div style={miniBody}>
              Borrow what you need, earn from what you own, and reduce unnecessary purchases.
              Communities unlock trusted supply first, then scale to public demand.
            </div>
          </div>

          <div style={contrastCardLight}>
            <div style={{ ...miniTitle, color: "#111" }}>Customer Support</div>
            <div style={miniBodyDarkText}>
              Email:{" "}
              <a href="mailto:support@rentl.app" style={footerLink}>
                support@rentl.app
              </a>
              <br />
              MVP note: responses are manual while we build.
            </div>
          </div>

          <div style={contrastCardLight}>
            <div style={{ ...miniTitle, color: "#111" }}>Trust & Safety</div>
            <div style={miniBodyDarkText}>
              Payments, coverage, and dispute resolution are coming next.
              For now, requests are coordinated after approval.
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={footer}>
        <div>
          © {new Date().getFullYear()} RentL. All rights reserved.
        </div>
        <div>
          Work in progress by <b>Jonathan Glickman</b> •{" "}
          <a href="mailto:support@rentl.app" style={footerLink}>
            Contact support
          </a>
        </div>
      </div>
    </div>
  );
}
