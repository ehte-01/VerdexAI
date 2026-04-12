package com.verdex.verdex_backend.controller;

import com.verdex.verdex_backend.model.dto.LegalAnalysisResponse;
import com.verdex.verdex_backend.model.dto.SituationRequest;
import com.verdex.verdex_backend.service.SituationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class SituationController {

    private final SituationService situationService;

    @PostMapping("/analyse")
    public ResponseEntity<LegalAnalysisResponse> analyse(
            @Valid @RequestBody SituationRequest request) {
        log.info("Received analysis request — language: {}", request.getLanguage());
        LegalAnalysisResponse response = situationService.analyse(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("VERDEX Backend is running!");
    }
}