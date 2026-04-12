package com.verdex.verdex_backend.repository;

import com.verdex.verdex_backend.model.WhistleblowerReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WhistleblowerReportRepository extends JpaRepository<WhistleblowerReport, String> {
    boolean existsByCaseId(String caseId);
}