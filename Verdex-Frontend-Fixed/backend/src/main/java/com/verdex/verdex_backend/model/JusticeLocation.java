package com.verdex.verdex_backend.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "justice_locations")
public class JusticeLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "queue_time")
    private String queueTime;

    @Column(name = "success_rate")
    private String successRate;

    @ElementCollection
    @CollectionTable(name = "justice_location_languages", joinColumns = @JoinColumn(name = "location_id"))
    @Column(name = "language")
    private List<String> languages;

    @Transient
    private Double distance;

    public JusticeLocation() {}

    public JusticeLocation(String id, String name, String type, String city, String description,
                           Double latitude, Double longitude, String queueTime, String successRate,
                           List<String> languages) {
        this.id = id; this.name = name; this.type = type; this.city = city;
        this.description = description; this.latitude = latitude; this.longitude = longitude;
        this.queueTime = queueTime; this.successRate = successRate; this.languages = languages;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getQueueTime() { return queueTime; }
    public void setQueueTime(String queueTime) { this.queueTime = queueTime; }
    public String getSuccessRate() { return successRate; }
    public void setSuccessRate(String successRate) { this.successRate = successRate; }
    public List<String> getLanguages() { return languages; }
    public void setLanguages(List<String> languages) { this.languages = languages; }
    public Double getDistance() { return distance; }
    public void setDistance(Double distance) { this.distance = distance; }
}