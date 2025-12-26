/* =====================================================
   BROKEN RESPONSE RECOVERY HELPERS
===================================================== */

function extractString(text: string, key: string): string {
  const match = text.match(new RegExp(`"${key}"\\s*,\\s*"([^"]+)"`, "i"));
  return match?.[1] ?? "";
}

function extractNumber(text: string, key: string): number {
  const match = text.match(new RegExp(`"${key}"\\s*,\\s*([0-9.]+)`));
  return match ? Number(match[1]) : 0;
}

function extractBlocks(text: string, key: string): string[] {
  return text.split(`"${key}"`).slice(1).map(p => `"${key}"${p}`);
}

function parseHotels(raw: string) {
  return extractBlocks(raw, "hotel_name").map(block => ({
    hotel_name: extractString(block, "hotel_name"),
    hotel_address: extractString(block, "hotel_address"),
    price_per_night: extractString(block, "price_per_night"),
    hotel_image_url: extractString(block, "hotel_image_url"),
    geo_coordinates: {
      latitude: extractNumber(block, "latitude"),
      longitude: extractNumber(block, "longitude"),
    },
    rating: extractNumber(block, "rating"),
    description: extractString(block, "description"),
  }));
}

function parseActivities(block: string) {
  return extractBlocks(block, "place_name").map(b => ({
    place_name: extractString(b, "place_name"),
    place_details: extractString(b, "place_details"),
    place_image_url: extractString(b, "place_image_url"),
    geo_coordinates: {
      latitude: extractNumber(b, "latitude"),
      longitude: extractNumber(b, "longitude"),
    },
    place_address: extractString(b, "place_address"),
    ticket_pricing: extractString(b, "ticket_pricing"),
    time_travel_each_location: extractString(b, "time_travel_each_location"),
    best_time_to_visit: extractString(b, "best_time_to_visit"),
  }));
}

function parseItinerary(raw: string) {
  return extractBlocks(raw, "day").map(block => ({
    day: extractNumber(block, "day"),
    day_plan: extractString(block, "day_plan"),
    best_time_to_visit_day: extractString(block, "best_time_to_visit_day"),
    activities: parseActivities(block),
  }));
}

export function transformBrokenTripPlan(raw: string) {
  return {
    destination: extractString(raw, "destination"),
    duration: extractString(raw, "duration"),
    origin: extractString(raw, "origin"),
    budget: extractString(raw, "budget"),
    group_size: extractString(raw, "group_size"),
    hotels: parseHotels(raw),
    itinerary: parseItinerary(raw),
  };
}
