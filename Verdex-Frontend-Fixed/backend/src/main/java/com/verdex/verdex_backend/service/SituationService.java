package com.verdex.verdex_backend.service;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.verdex.verdex_backend.entity.QueryHistory;
import com.verdex.verdex_backend.model.dto.LegalAnalysisResponse;
import com.verdex.verdex_backend.model.dto.SituationRequest;
import com.verdex.verdex_backend.repository.QueryHistoryRepository;
import com.verdex.verdex_backend.util.JsonCleaner;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class SituationService {

    private final GroqService groqService;
    private final ClassifierService classifierService;
    private final QueryHistoryRepository queryHistoryRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public LegalAnalysisResponse analyse(SituationRequest request) {
        try {
            // Step 1: Classify the situation
            String category = classifierService.classify(request.getSituation());
            log.info("Classified situation as: {}", category);

            // Step 2: Call Groq API
            String groqResponse = groqService.callGroq(
                    request.getSituation(),
                    request.getLanguage(),
                    category
            );
            log.info("Groq response received");

            // Step 3: Clean and parse response
            String cleanJson = JsonCleaner.clean(groqResponse);
            LegalAnalysisResponse response = objectMapper.readValue(
                    cleanJson, LegalAnalysisResponse.class
            );

            // Step 4: Set powered by
            response.setPoweredBy("Groq LLaMA 3.3 70B");

            // Step 5: Save to database
            saveToHistory(request, category, cleanJson);

            return response;

        } catch (Exception e) {
            log.error("Analysis failed: {}", e.getMessage());
            throw new RuntimeException("Legal analysis failed. Please try again.");
        }
    }

    private void saveToHistory(SituationRequest request, String category, String analysisJson) {
        try {
            QueryHistory history = new QueryHistory();
            history.setSituationText(request.getSituation());
            history.setLanguage(request.getLanguage());
            history.setCategory(category);
            history.setAnalysisJson(analysisJson);
            queryHistoryRepository.save(history);
        } catch (Exception e) {
            log.warn("Failed to save query history: {}", e.getMessage());
        }
    }
}