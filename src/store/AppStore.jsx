import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { mockListings as initialListings } from "../data/mockListings";
import { mockPlaylists as initialPlaylists } from "../data/mockPlaylists";

const LS_KEY_LISTINGS = "rentl_listings_v1";
const LS_KEY_REQUESTS = "rentl_requests_v1";
const SESSION_KEY = "rentl_session";

function loadListings() {
  try {
    const raw = localStorage.getItem(LS_KEY_LISTINGS);
    if (!raw) return initialListings;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : initialListings;
  } catch {
    return initialListings;
  }
}

function loadRequests() {
  try {
    const raw = localStorage.getItem(LS_KEY_REQUESTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const AppStoreContext = createContext(null);

export function AppStoreProvider({ children }) {
  const [listings, setListings] = useState(() => loadListings());
  const [playlists, setPlaylists] = useState(initialPlaylists);
  const [requests, setRequests] = useState(() => loadRequests());

  // ✅ session state must live inside the Provider (a component)
  const [session, setSession] = useState(() => loadSession());

  useEffect(() => {
    localStorage.setItem(LS_KEY_LISTINGS, JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem(LS_KEY_REQUESTS, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  }, [session]);

  const loginAs = ({ name, role }) => {
    const id = `u_${Math.random().toString(16).slice(2)}`;
    setSession({ id, name, role });
  };

  const setRole = (role) => {
    setSession((prev) => (prev ? { ...prev, role } : prev));
  };

  const logout = () => setSession(null);

  const addListing = (newListing) => {
    setListings((prev) => [newListing, ...prev]);
  };

  const addRequest = (newRequest) => {
    setRequests((prev) => [newRequest, ...prev]);
  };

  const value = useMemo(
    () => ({
      listings,
      setListings,
      addListing,
      playlists,
      setPlaylists,
      requests,
      setRequests,
      addRequest,
      session,
      loginAs,
      setRole,
      logout,
    }),
    [listings, playlists, requests, session]
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used inside AppStoreProvider");
  return ctx;
}
