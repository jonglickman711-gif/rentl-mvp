import React from "react";
import Nav from "./Nav";

export default function Layout({ children }) {
  return (
    <div>
      <Nav />
      <div style={{ maxWidth: 980, margin: "0 auto", padding: 24 }}>
        {children}
      </div>
    </div>
  );
}
