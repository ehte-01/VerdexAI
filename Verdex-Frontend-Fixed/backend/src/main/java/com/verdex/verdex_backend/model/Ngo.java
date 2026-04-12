package com.verdex.verdex_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "ngos")
public class Ngo {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "contact")
    private String contact;

    @Column(name = "location")
    private String location;

    public Ngo() {}

    public Ngo(String id, String name, String category, String contact, String location) {
        this.id = id; this.name = name; this.category = category;
        this.contact = contact; this.location = location;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}