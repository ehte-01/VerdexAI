package com.verdex.verdex_backend.controller;

import com.verdex.verdex_backend.model.JusticeLocation;
import com.verdex.verdex_backend.repository.JusticeLocationRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/justice-map")
public class JusticeMapController {

    private final JusticeLocationRepository repository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public JusticeMapController(JusticeLocationRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<JusticeLocation> getLocations(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng
    ) {
        List<JusticeLocation> results;

        // ── Case 1: City name search ─────────────────────────────────
        if (city != null && !city.isBlank()) {
            String normalizedCity = normalizeCityName(city.trim());

            // Try DB first (case-insensitive)
            results = repository.findByCityIgnoreCase(normalizedCity);

            // If not in DB → reverse geocode via OpenStreetMap Nominatim
            if (results.isEmpty()) {
                results = fetchFromOpenStreetMap(normalizedCity, type);
            }
        }
        // ── Case 2: Lat/Lng → reverse geocode city → DB lookup ───────
        else if (lat != null && lng != null) {
            String resolvedCity = reverseGeocode(lat, lng);
            results = repository.findByCityIgnoreCase(resolvedCity);

            // Still empty? Return nearest by distance from DB
            if (results.isEmpty()) {
                results = findNearestByCoords(lat, lng);
            }
        }
        // ── Case 3: No params → return all ───────────────────────────
        else {
            results = repository.findAll();
        }

        // Apply type filter if provided
        if (type != null && !type.isBlank()) {
            final String typeFilter = type.trim();
            results = results.stream()
                    .filter(loc -> loc.getType().equalsIgnoreCase(typeFilter))
                    .collect(Collectors.toList());
        }

        // Sort by real distance when coordinates are available; otherwise
        // fall back to the seeded queue-time estimate.
        if (lat != null && lng != null) {
            for (JusticeLocation loc : results) {
                if (loc.getLatitude() != null && loc.getLongitude() != null) {
                    double dist = calculateDistanceKm(lat, lng, loc.getLatitude(), loc.getLongitude());
                    loc.setDistance(Math.round(dist * 10.0) / 10.0);
                }
            }
            results.sort(Comparator.comparing(
                    JusticeLocation::getDistance,
                    Comparator.nullsLast(Comparator.naturalOrder())
            ));
        } else {
            results.sort(Comparator.comparingInt(loc -> parseDistance(loc.getQueueTime())));
        }

        return results;
    }

    // ── Haversine distance in km between two lat/lng points ──────────
    private double calculateDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    // ── Reverse geocode lat/lng → city name via Nominatim ────────────
    private String reverseGeocode(double lat, double lng) {
        try {
            String url = String.format(
                    "https://nominatim.openstreetmap.org/reverse?lat=%s&lon=%s&format=json",
                    lat, lng
            );
            String response = restTemplate.getForObject(url, String.class);
            JsonNode node = objectMapper.readTree(response);
            JsonNode address = node.get("address");
            if (address != null) {
                // Try city → town → state_district in order
                for (String field : new String[]{"city", "town", "state_district", "county"}) {
                    if (address.has(field)) {
                        return address.get(field).asText();
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Nominatim reverse geocode failed: " + e.getMessage());
        }
        return "Delhi"; // Safe fallback
    }

    // ── Forward geocode city → coordinates via Nominatim → synthetic results ──
    private List<JusticeLocation> fetchFromOpenStreetMap(String city, String type) {
        List<JusticeLocation> syntheticLocations = new ArrayList<>();
        try {
            String url = String.format(
                    "https://nominatim.openstreetmap.org/search?city=%s&country=India&format=json&limit=1",
                    city.replace(" ", "+")
            );

            // ── User-Agent header add karna zaroori hai Nominatim ke liye ──
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.set("User-Agent", "VerdexApp/1.0 (legal-aid-app)");
            org.springframework.http.HttpEntity<String> entity =
                    new org.springframework.http.HttpEntity<>(headers);

            org.springframework.http.ResponseEntity<String> responseEntity =
                    restTemplate.exchange(url, org.springframework.http.HttpMethod.GET, entity, String.class);

            String response = responseEntity.getBody();
            System.out.println("Nominatim response for " + city + ": " + response); // debug log

            JsonNode nodes = objectMapper.readTree(response);

            if (nodes.isArray() && nodes.size() > 0) {
                JsonNode place = nodes.get(0);
                double foundLat = place.get("lat").asDouble();
                double foundLng = place.get("lon").asDouble();

                List<String[]> templates = Arrays.asList(
                        new String[]{"District Labour Office", "Labour Issue",
                                "Handles salary disputes and labour law violations."},
                        new String[]{"Women Legal Aid Centre", "Women Safety",
                                "Support for domestic violence and harassment cases."},
                        new String[]{"Consumer Disputes Forum", "Consumer Fraud",
                                "Redressal for product defects and service failures."},
                        new String[]{"District Legal Services Authority", "Free Legal Help",
                                "Free legal aid for eligible citizens."}
                );

                String[] queueTimes   = {"20 mins", "15 mins", "30 mins", "10 mins"};
                String[] successRates = {"85%", "90%", "82%", "91%"};
                double   offset       = 0.005;

                for (int i = 0; i < templates.size(); i++) {
                    String[] t = templates.get(i);
                    syntheticLocations.add(new JusticeLocation(
                            null,
                            t[0] + " – " + city,
                            t[1],
                            city,
                            t[2],
                            foundLat + (i * offset),
                            foundLng + (i * offset),
                            queueTimes[i],
                            successRates[i],
                            Arrays.asList("Hindi", "English")
                    ));
                }
                System.out.println("✅ Synthetic locations created for: " + city);
            } else {
                System.out.println("⚠️ Nominatim returned no results for: " + city);
            }
        } catch (Exception e) {
            System.err.println("❌ OpenStreetMap failed for " + city + ": " + e.getMessage());
        }
        return syntheticLocations;
    }

    // ── Find nearest DB entries by raw lat/lng distance ──────────────
    private List<JusticeLocation> findNearestByCoords(double lat, double lng) {
        List<JusticeLocation> all = repository.findAll();
        all.sort(Comparator.comparingDouble(loc ->
                Math.pow(loc.getLatitude() - lat, 2) + Math.pow(loc.getLongitude() - lng, 2)
        ));
        return all.stream().limit(6).collect(Collectors.toList());
    }

    // ── Normalize common city aliases ─────────────────────────────────
    private String normalizeCityName(String input) {
        Map<String, String> aliases = new HashMap<>();
        aliases.put("bombay",     "Mumbai");
        aliases.put("calcutta",   "Kolkata");
        aliases.put("bengaluru",  "Bangalore");
        aliases.put("madras",     "Chennai");
        aliases.put("new delhi",  "Delhi");
        aliases.put("ncr",        "Delhi");
        aliases.put("gurugram",   "Delhi");
        aliases.put("gurgaon",    "Delhi");
        aliases.put("noida",      "Delhi");
        aliases.put("faridabad",  "Delhi");
        aliases.put("trivandrum", "Thiruvananthapuram");
        return aliases.getOrDefault(input.toLowerCase(), capitalize(input));
    }

    private String capitalize(String s) {
        if (s == null || s.isEmpty()) return s;
        return Character.toUpperCase(s.charAt(0)) + s.substring(1);
    }

    private int parseDistance(String queueTime) {
        try {
            return Integer.parseInt(queueTime.replaceAll("[^0-9]", ""));
        } catch (Exception e) {
            return 999;
        }
    }
}