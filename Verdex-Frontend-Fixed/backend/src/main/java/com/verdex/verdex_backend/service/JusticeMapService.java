package com.verdex.verdex_backend.service;

import com.verdex.verdex_backend.model.JusticeLocation;
import com.verdex.verdex_backend.repository.JusticeLocationRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JusticeMapService {
    private final JusticeLocationRepository repository;

    public JusticeMapService(JusticeLocationRepository repository) {
        this.repository = repository;
    }

    public List<JusticeLocation> getLocations(String type, String city, Double lat, Double lng) {
        List<JusticeLocation> locations;
        if (type != null && city != null) locations = repository.findByTypeIgnoreCaseAndCityIgnoreCase(type, city);
        else if (type != null) locations = repository.findByTypeIgnoreCase(type);
        else if (city != null) locations = repository.findByCityIgnoreCase(city);
        else locations = repository.findAll();

        locations.forEach(loc -> {
            if (lat != null && lng != null && loc.getLatitude() != null && loc.getLongitude() != null) {
                double dist = calculateDistance(lat, lng, loc.getLatitude(), loc.getLongitude());
                loc.setDistance(Math.round(dist * 10.0) / 10.0);
            }
        });

        if (lat != null && lng != null) {
            return locations.stream()
                    .sorted((a, b) -> {
                        if (a.getDistance() == null && b.getDistance() == null) return 0;
                        if (a.getDistance() == null) return 1;
                        if (b.getDistance() == null) return -1;
                        return Double.compare(a.getDistance(), b.getDistance());
                    })
                    .limit(5)
                    .collect(Collectors.toList());
        }
        return locations;
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat/2) * Math.sin(dLat/2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon/2) * Math.sin(dLon/2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
}