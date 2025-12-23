import React, { createContext, useContext, useMemo, useState } from "react";
import { mockListings as initialListings } from "../data/mockListings";
import { mockPlaylists as initialPlaylists } from "../data/mockPlaylists";

const AppStoreContext = createContext(null);

export function AppStoreProvider({ children }) {
  const [listings, setListings] = useState(initialListings);
  const [playlists, setPlaylists] = useState(initialPlaylists);

  const addListing = (newListing) => {
    setListings((prev) => [newListing, ...prev]);
  };

  const value = useMemo(
    () => ({ listings, setListings, addListing, playlists, setPlaylists }),
    [listings, playlists]
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used inside AppStoreProvider");
  return ctx;
}
