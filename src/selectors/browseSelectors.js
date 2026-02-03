// Browse Selectors - Backend-agnostic derived state
// These selectors can be swapped from localStorage to Supabase queries without UI changes

/**
 * Get the visibility scope of a listing
 * @param {Object} listing - The listing object
 * @returns {string} - "public" | "community"
 */
export function getListingScope(listing) {
  return listing.visibility ?? listing.ownerType ?? listing.ownerRole ?? "public";
}

/**
 * Check if a user can see a community listing based on their session
 * @param {Object} listing - The listing object
 * @param {Object|null} session - The user session
 * @returns {boolean}
 */
export function canSeeCommunityListing(listing, session) {
  const listingCode = (listing.communityCode || "").toUpperCase();
  const userCode = (session?.communityCode || "").toUpperCase();
  
  if (!listingCode) return false;
  if (!userCode) return false;
  return listingCode === userCode;
}

/**
 * Determine the effective browse mode based on session
 * @param {Object|null} session - The user session
 * @returns {"public" | "community" | "mixed"}
 */
export function getEffectiveBrowseMode(session) {
  if (!session) return "public";
  if (session.role === "community") return "community";
  return "public";
}

/**
 * Filter listings by visibility scope and session
 * @param {Array} listings - All listings
 * @param {string} mode - "public" | "community" | "mixed"
 * @param {Object|null} session - The user session
 * @returns {Array} - Filtered listings
 */
export function filterListingsByMode(listings, mode, session) {
  if (!Array.isArray(listings)) return [];
  if (!mode) return [];
  
  if (mode === "public") {
    return listings.filter((l) => {
      if (!l) return false;
      return getListingScope(l) === "public";
    });
  }
  
  if (mode === "community") {
    return listings.filter((l) => {
      if (!l) return false;
      const scope = getListingScope(l);
      if (scope === "community") {
        return canSeeCommunityListing(l, session);
      }
      return false;
    });
  }
  
  if (mode === "mixed") {
    return listings.filter((l) => {
      if (!l) return false;
      const scope = getListingScope(l);
      if (scope === "public") return true;
      if (scope === "community") return canSeeCommunityListing(l, session);
      return false;
    });
  }
  
  return [];
}

/**
 * Multi-field search matcher
 * @param {Object} listing - The listing object
 * @param {string} query - The search query (lowercase)
 * @returns {boolean}
 */
export function matchesSearchQuery(listing, query) {
  if (!listing) return false;
  if (!query || !query.trim()) return true;
  
  try {
    const searchFields = [
      listing.title,
      listing.category,
      listing.location,
      listing.ownerName,
      listing.description,
      getListingScope(listing),
    ];
    
    const normalizedQuery = query.trim().toLowerCase();
    const haystack = searchFields
      .map((field) => String(field ?? "").toLowerCase())
      .join(" ");
    
    return haystack.includes(normalizedQuery);
  } catch (error) {
    console.error("Error in matchesSearchQuery:", error);
    return false;
  }
}

/**
 * Calculate relevance score for sorting
 * @param {Object} listing - The listing object
 * @param {string} query - The search query
 * @returns {number} - Higher is more relevant
 */
export function calculateRelevanceScore(listing, query) {
  if (!query || !query.trim()) return 0;
  
  const normalizedQuery = query.trim().toLowerCase();
  let score = 0;
  
  // Title matches are highest priority
  if (listing.title?.toLowerCase().includes(normalizedQuery)) {
    score += 100;
    // Exact match bonus
    if (listing.title?.toLowerCase() === normalizedQuery) {
      score += 50;
    }
  }
  
  // Category matches
  if (listing.category?.toLowerCase().includes(normalizedQuery)) {
    score += 30;
  }
  
  // Location matches
  if (listing.location?.toLowerCase().includes(normalizedQuery)) {
    score += 20;
  }
  
  // Owner name matches
  if (listing.ownerName?.toLowerCase().includes(normalizedQuery)) {
    score += 10;
  }
  
  return score;
}

/**
 * Sort listings by relevance, price, then availability
 * @param {Array} listings - Listings to sort
 * @param {string} query - Search query for relevance
 * @returns {Array} - Sorted listings
 */
export function sortListings(listings, query = "") {
  return [...listings].sort((a, b) => {
    // 1. Relevance (if query exists)
    if (query && query.trim()) {
      const scoreA = calculateRelevanceScore(a, query);
      const scoreB = calculateRelevanceScore(b, query);
      if (scoreA !== scoreB) {
        return scoreB - scoreA; // Higher score first
      }
    }
    
    // 2. Price (lower first)
    const priceA = a.pricePerDay ?? 0;
    const priceB = b.pricePerDay ?? 0;
    if (priceA !== priceB) {
      return priceA - priceB;
    }
    
    // 3. Availability (more available first - placeholder for future)
    // For now, we'll use title as tiebreaker for deterministic sorting
    const titleA = (a.title || "").toLowerCase();
    const titleB = (b.title || "").toLowerCase();
    return titleA.localeCompare(titleB);
  });
}

/**
 * Get all visible listings for the current mode and search
 * @param {Array} listings - All listings
 * @param {string} mode - "public" | "community" | "mixed"
 * @param {Object|null} session - The user session
 * @param {string} searchQuery - The search query
 * @returns {Array} - Filtered and sorted listings
 */
export function getVisibleListings(listings, mode, session, searchQuery = "") {
  if (!Array.isArray(listings)) return [];
  if (!mode) return [];
  
  try {
    // Filter by mode
    const filtered = filterListingsByMode(listings, mode, session);
    
    // Filter by search query
    const normalizedQuery = (searchQuery || "").trim().toLowerCase();
    const searched = normalizedQuery
      ? filtered.filter((l) => l && matchesSearchQuery(l, normalizedQuery))
      : filtered;
    
    // Sort
    return sortListings(searched, normalizedQuery);
  } catch (error) {
    console.error("Error in getVisibleListings:", error);
    return [];
  }
}

/**
 * Get hidden community match count (for growth signals)
 * @param {Array} listings - All listings
 * @param {string} searchQuery - The search query
 * @returns {number}
 */
export function getHiddenCommunityMatchCount(listings, searchQuery) {
  if (!searchQuery || !searchQuery.trim()) return 0;
  
  const normalizedQuery = searchQuery.trim().toLowerCase();
  return listings.filter((l) => {
    const scope = getListingScope(l);
    return scope === "community" && matchesSearchQuery(l, normalizedQuery);
  }).length;
}

