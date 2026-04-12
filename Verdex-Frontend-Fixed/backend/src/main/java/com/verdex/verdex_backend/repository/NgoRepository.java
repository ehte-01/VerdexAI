package com.verdex.verdex_backend.repository;

import com.verdex.verdex_backend.model.Ngo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NgoRepository extends JpaRepository<Ngo, String> {
    List<Ngo> findByCategoryIgnoreCase(String category);
}
