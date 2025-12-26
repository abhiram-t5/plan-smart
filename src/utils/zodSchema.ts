import { z } from "zod";

/* -----------------------------
   1. Zod Schemas (STRICT)
-------------------------------- */

// Conversational response schema

const allowedUI = ["budget", "groupSize", "tripDuration", "final"] as const;

export const chatResponseSchema = z.object({
  resp: z.string(),

  ui: z
    .union([z.string(), z.null()])
    .transform((value) =>
      allowedUI.includes(value as any) ? value : null
    ),
});

/* -----------------------------
   Shared Sub-Schemas
-------------------------------- */

const geoCoordinatesSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

/* -----------------------------
   Hotel Schema
-------------------------------- */

const hotelSchema = z.object({
  hotel_name: z.string(),
  hotel_address: z.string(),
  price_per_night: z.string(),
  hotel_image_url: z.string(),
  geo_coordinates: geoCoordinatesSchema,
  rating: z.number(),
  description: z.string(),
});

/* -----------------------------
   Activity Schema
-------------------------------- */

const activitySchema = z.object({
  place_name: z.string(),
  place_details: z.string(),
  place_image_url: z.string(),
  geo_coordinates: geoCoordinatesSchema,
  place_address: z.string(),
  ticket_pricing: z.string(),
  time_travel_each_location: z.string(),
  best_time_to_visit: z.string(),
});

/* -----------------------------
   Itinerary Schema
-------------------------------- */

const itinerarySchema = z.object({
  day: z.number(),
  day_plan: z.string(),
  best_time_to_visit_day: z.string(),
  activities: z.array(activitySchema),
});

/* -----------------------------
   FINAL TripInfo Schema
-------------------------------- */

export const tripInfoSchema = z.object({
  destination: z.string(),
  duration: z.string(),
  origin: z.string(),
  budget: z.string(),
  group_size: z.string(),
  hotels: z.array(hotelSchema),
  itinerary: z.array(itinerarySchema),
});

/* -----------------------------
   Gemini FINAL Response Schema
-------------------------------- */

export const finalTripSchema = z.object({
  destination: z.string(),
  duration: z.string(),
  origin: z.string(),
  budget: z.string(),
  group_size: z.string(),
  hotels: z.array(
    z.object({
      hotel_name: z.string(),
      hotel_address: z.string(),
      price_per_night: z.string(),
      hotel_image_url: z.string(),
      geo_coordinates: z.object({
        latitude: z.number(),
        longitude: z.number(),
      }),
      rating: z.number(),
      description: z.string(),
    })
  ),
  itinerary: z.array(
    z.object({
      day: z.number(),
      day_plan: z.string(),
      best_time_to_visit_day: z.string(),
      activities: z.array(
        z.object({
          place_name: z.string(),
          place_details: z.string(),
          place_image_url: z.string(),
          geo_coordinates: z.object({
            latitude: z.number(),
            longitude: z.number(),
          }),
          place_address: z.string(),
          ticket_pricing: z.string(),
          time_travel_each_location: z.string(),
          best_time_to_visit: z.string(),
        })
      ),
    })
  ),
});
