import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Landing from "./pages/Landing";
import GetStarted from "./pages/GetStarted";
import SignupPublic from "./pages/SignupPublic";
import SignupCommunity from "./pages/SignupCommunity";
import Browse from "./pages/Browse";
import Dashboard from "./pages/Dashboard";
import ListingDetails from "./pages/ListingDetails";
import Playlists from "./pages/Playlists";
import PlaylistDetails from "./pages/PlaylistDetails";
import ListItem from "./pages/ListItem";
import RequireSession from "./components/RequireSession";
import RequestCommunity from "./pages/RequestCommunity";



export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/get-started" element={<GetStarted />} />

          <Route path="/public" element={<SignupPublic />} />
          <Route path="/community" element={<SignupCommunity />} />
          <Route path="/request-community" element={<RequestCommunity />} />

          <Route
            path="/list-item"
            element={
              <RequireSession>
                <ListItem />
              </RequireSession>
            }
          />

          <Route path="/browse" element={<Browse />} />
          <Route path="/dashboard" element={<RequireSession><Dashboard /> </RequireSession>}/>
          <Route path="/listing/:id" element={<ListingDetails />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/playlists/:id" element={<PlaylistDetails />} />
          
        </Routes>
      </Layout>
    </Router>
  );
}
