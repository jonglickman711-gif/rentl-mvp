<div style={{ fontWeight: 900, color: "red" }}>LANDING VERSION CHECK</div>

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const wrap = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "32px 16px",
};

const section = {
  marginTop: 56,
};

const card = {
  border: "1px solid #eee",
  borderRadius: 18,
  padding: 20,
  background: "white",
};

const muted = {
  color: "#555",
  lineHeight: 1.6,
};

const btnPrimary = {
  padding: "12px 18px",
  borderRadius: 14,
  border: "1px solid #111",
  background: "#111",
  color: "white",
  cursor: "pointer",
  fontWeight: 700,
};

const btnSecondary = {
  padding: "12px 18px",
  borderRadius: 14,
  border: "1px solid #ddd",
  background: "white",
  color: "#111",
  cursor: "pointer",
  fontWeight: 700,
  textDecoration: "none",
};

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={wrap}>
      {/* HERO */}
      <section style={{ textAlign: "center", marginTop: 40 }}>
        <h1 style={{ fontSize: 44, marginBottom: 12 }}>Borrow. Lend. Own less.</h1>
        <p style={{ ...muted, maxWidth: 720, margin: "0 auto" }}>
          RentL is a peer-to-peer rental marketplace designed around communities.
          Borrow what you need, earn from what you own, and reduce unnecessary purchases.
        </p>

        <div style={{ marginTop: 24, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button style={btnPrimary} onClick={() => navigate("/get-started")}>
            Get Started
          </button>
          <Link to="/browse" style={btnSecondary}>
            Browse items
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={section}>
        <h2>How RentL works</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 16 }}>
          <div style={card}>
            <h3>1. Start local</h3>
            <p style={muted}>
              Communities unlock shared inventory first. Items can remain community-only or go public later.
            </p>
          </div>

          <div style={card}>
            <h3>2. Request what you need</h3>
            <p style={muted}>
              Select dates, send a request, and coordinate pickup after approval.
            </p>
          </div>

          <div style={card}>
            <h3>3. Earn from what you own</h3>
            <p style={muted}>
              List rarely-used items and earn while helping neighbors avoid unnecessary purchases.
            </p>
          </div>
        </div>
      </section>

      {/* WHY COMMUNITIES */}
      <section style={section}>
        <h2>Why communities first</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 16, marginTop: 16 }}>
          <div style={card}>
            <p style={muted}>
              Most rental marketplaces struggle with trust and supply density.
              RentL solves this by onboarding buildings, HOAs, and groups first.
            </p>

            <ul style={{ marginTop: 12, paddingLeft: 18, color: "#444", lineHeight: 1.7 }}>
              <li>Higher trust between renters and owners</li>
              <li>Faster access to useful inventory</li>
              <li>Lower friction for first-time users</li>
            </ul>
          </div>

          <div style={card}>
            <h3>Public access, later</h3>
            <p style={muted}>
              As communities grow, listings can optionally become public to meet broader demand.
            </p>
          </div>
        </div>
      </section>

      {/* GUIDELINES */}
      <section style={section}>
        <h2>Guidelines & expectations</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginTop: 16 }}>
          <div style={card}>
            <h3>For renters</h3>
            <ul style={{ paddingLeft: 18, color: "#444", lineHeight: 1.7 }}>
              <li>Return items on time and in agreed condition</li>
              <li>Communicate clearly with owners</li>
              <li>Respect community-only access rules</li>
            </ul>
          </div>

          <div style={card}>
            <h3>For owners</h3>
            <ul style={{ paddingLeft: 18, color: "#444", lineHeight: 1.7 }}>
              <li>List accurate descriptions and availability</li>
              <li>Approve or decline requests promptly</li>
              <li>Set clear pickup and return expectations</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={section}>
        <h2>Frequently asked questions</h2>

        <FAQ
          q="Is RentL live yet?"
          a="RentL is an active MVP. Payments, insurance, and automated dispute handling are coming next."
        />
        <FAQ
          q="Do I need to be in a community to use RentL?"
          a="No. Public listings are available, but community access unlocks more inventory and trust."
        />
        <FAQ
          q="How do community codes work?"
          a="Community codes grant access to community-only listings. Codes are shared by property managers or organizers."
        />
      </section>

      {/* CTA */}
      <section style={{ ...section, textAlign: "center" }}>
        <h2>Ready to borrow instead of buy?</h2>
        <p style={{ ...muted, maxWidth: 640, margin: "8px auto" }}>
          Join RentL, start with your community, and help build a more efficient way to share.
        </p>

        <div style={{ marginTop: 18 }}>
          <button style={btnPrimary} onClick={() => navigate("/get-started")}>
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
}

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        marginTop: 12,
        border: "1px solid #eee",
        borderRadius: 16,
        padding: 16,
        cursor: "pointer",
        background: "white",
      }}
      onClick={() => setOpen(!open)}
    >
      <div style={{ fontWeight: 800 }}>{q}</div>
      {open ? <div style={{ marginTop: 8, color: "#444", lineHeight: 1.6 }}>{a}</div> : null}
    </div>
  );
}
