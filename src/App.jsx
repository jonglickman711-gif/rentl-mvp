import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Landing from "./pages/Landing";
import GetStarted from "./pages/GetStarted";
import SignupPublic from "./pages/SignupPublic";
import SignupCommunity from "./pages/SignupCommunity";
import Browse from "./pages/Browse";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/public" element={<SignupPublic />} />
          <Route path="/community" element={<SignupCommunity />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}
