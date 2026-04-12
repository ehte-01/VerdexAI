package com.verdex.verdex_backend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.verdex.verdex_backend.service.DocumentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class DocumentAnalysisController {

    private final DocumentService documentService;

    @PostMapping("/analyse-document")
    public ResponseEntity<?> analyseDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "language", defaultValue = "EN") String language) {

        log.info("Document analysis request — file: {}, size: {} bytes, language: {}",
                file.getOriginalFilename(), file.getSize(), language);

        try {
            JsonNode result = documentService.analyseDocument(file, language);

            // If service returned an error node, still send 200 so frontend
            // can display the error message gracefully
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            log.error("Controller caught exception: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(Map.of(
                            "riskScore", 0,
                            "clauses", java.util.List.of(),
                            "error", e.getMessage()
                    ));
        }
    }
}