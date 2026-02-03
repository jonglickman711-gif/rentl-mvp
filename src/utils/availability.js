// Availability calculation utilities
// Backend-agnostic: works with any date format

/**
 * Calculate availability ranges from blocked ranges
 * @param {Array} blockedRanges - Array of {start, end} date strings or Date objects
 * @param {Date} minDate - Minimum date to start from (default: today)
 * @returns {Array} - Array of {start, end} availability ranges
 */
export function calculateAvailabilityRanges(blockedRanges, minDate = new Date()) {
  if (!blockedRanges || blockedRanges.length === 0) {
    return [{ start: minDate, end: new Date(2099, 11, 31) }];
  }

  const normalizedMin = new Date(minDate);
  normalizedMin.setHours(0, 0, 0, 0);

  const sorted = [...blockedRanges]
    .map((r) => ({
      start: new Date(r.start),
      end: new Date(r.end),
    }))
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  const available = [];
  let currentStart = normalizedMin;

  for (const blocked of sorted) {
    blocked.start.setHours(0, 0, 0, 0);
    blocked.end.setHours(23, 59, 59, 999);

    if (currentStart < blocked.start) {
      const gapEnd = new Date(blocked.start);
      gapEnd.setDate(gapEnd.getDate() - 1);
      gapEnd.setHours(23, 59, 59, 999);
      available.push({ start: new Date(currentStart), end: gapEnd });
    }

    currentStart = new Date(blocked.end);
    currentStart.setDate(currentStart.getDate() + 1);
    currentStart.setHours(0, 0, 0, 0);
  }

  if (currentStart <= new Date(2099, 11, 31)) {
    available.push({ start: currentStart, end: new Date(2099, 11, 31) });
  }

  return available;
}

/**
 * Get human-readable availability hint
 * @param {Object} listing - The listing object
 * @param {Array} requests - All rental requests
 * @returns {string} - Human-readable availability text
 */
export function getAvailabilityHint(listing, requests) {
  // Get approved requests for this listing
  const approvedRequests = requests.filter(
    (r) => r.listingId === listing.id && r.status === "approved"
  );

  // Combine blocked ranges from listing with approved request dates
  const listingBlocked = Array.isArray(listing.blockedRanges) ? listing.blockedRanges : [];
  const approvedRanges = approvedRequests
    .filter((r) => r.startDate && r.endDate)
    .map((r) => ({
      start: r.startDate,
      end: r.endDate,
    }));

  const allBlocked = [...listingBlocked, ...approvedRanges];
  const availabilityRanges = calculateAvailabilityRanges(allBlocked);

  if (availabilityRanges.length === 0) {
    return "Limited availability";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find the first available range that starts today or in the future
  const nextAvailable = availabilityRanges.find((range) => {
    const rangeStart = new Date(range.start);
    rangeStart.setHours(0, 0, 0, 0);
    return rangeStart >= today;
  });

  if (!nextAvailable) {
    return "Limited availability";
  }

  const nextStart = new Date(nextAvailable.start);
  nextStart.setHours(0, 0, 0, 0);

  // Check if available today
  if (nextStart.getTime() === today.getTime()) {
    // Check if there are multiple blocks suggesting limited availability
    if (allBlocked.length > 2) {
      return "Available now (limited dates)";
    }
    return "Available now";
  }

  // Calculate days until next available
  const daysUntil = Math.ceil((nextStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntil <= 3) {
    if (daysUntil === 1) {
      return "Available tomorrow";
    }
    return `Available in ${daysUntil} days`;
  }

  // Format date for display (e.g., "Jan 15")
  const month = nextStart.toLocaleDateString("en-US", { month: "short" });
  const day = nextStart.getDate();
  return `Available ${month} ${day}`;
}

/**
 * Get structured availability data (reserved for future calendar integration)
 * @param {Object} listing - The listing object
 * @param {Array} requests - All rental requests
 * @returns {Object} - Structured availability data
 */
export function getAvailabilityData(listing, requests) {
  const listingBlocked = Array.isArray(listing.blockedRanges) ? listing.blockedRanges : [];
  const approvedRequests = requests.filter(
    (r) => r.listingId === listing.id && r.status === "approved"
  );
  const approvedRanges = approvedRequests
    .filter((r) => r.startDate && r.endDate)
    .map((r) => ({
      start: r.startDate,
      end: r.endDate,
    }));

  const allBlocked = [...listingBlocked, ...approvedRanges];
  const availabilityRanges = calculateAvailabilityRanges(allBlocked);

  return {
    blockedRanges: allBlocked,
    availableRanges: availabilityRanges,
    nextAvailable: availabilityRanges.find((range) => {
      const rangeStart = new Date(range.start);
      rangeStart.setHours(0, 0, 0, 0);
      return rangeStart >= new Date();
    }),
  };
}

