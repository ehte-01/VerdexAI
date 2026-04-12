package com.verdex.verdex_backend.repository;

import com.verdex.verdex_backend.model.JusticeLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JusticeLocationRepository extends JpaRepository<JusticeLocation, String> {
    List<JusticeLocation> findByTypeIgnoreCase(String type);
    List<JusticeLocation> findByCityIgnoreCase(String city);
    List<JusticeLocation> findByTypeIgnoreCaseAndCityIgnoreCase(String type, String city);
}