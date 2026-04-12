package com.verdex.verdex_backend;

import com.verdex.verdex_backend.model.Ngo;
import com.verdex.verdex_backend.repository.NgoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class NgosDataLoader implements CommandLineRunner {

    private final NgoRepository ngoRepository;

    public NgosDataLoader(NgoRepository ngoRepository) {
        this.ngoRepository = ngoRepository;
    }

    @Override
    public void run(String... args) {
        if (ngoRepository.count() > 0) return;
        List<Ngo> ngos = List.of(
                new Ngo(null, "Legal Rights Alliance", "domestic", "support@legalrights.in", "New Delhi"),
                new Ngo(null, "Safe Work Network", "workplace", "helpline@worknets.in", "Mumbai"),
                new Ngo(null, "Anti-corruption Watch", "corruption", "report@acwatch.org", "Bengaluru"),
                new Ngo(null, "Women Safe Centre", "domestic", "181@womensafe.in", "Kolkata"),
                new Ngo(null, "Ethics Support Trust", "corruption", "helpdesk@ethicstrust.org", "Chennai")
        );
        ngoRepository.saveAll(ngos);
        System.out.println("Loaded " + ngos.size() + " NGOs into PostgreSQL.");
    }
}