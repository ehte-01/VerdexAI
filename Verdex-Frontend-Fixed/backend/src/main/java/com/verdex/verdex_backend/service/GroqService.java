package com.verdex.verdex_backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class GroqService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    @Value("${groq.api.model}")
    private String model;

    @Value("${groq.api.max-tokens}")
    private int maxTokens;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // BUG 3 FIX: removed escaped-quote typo on "analysisLaws" key,
    //            removed duplicate "steps" key, removed stray comma.
    private static final String SYSTEM_PROMPT = """
        You are VERDEX, an AI legal assistant specialized EXCLUSIVELY in Indian law.
        You help common Indian citizens understand their legal rights in simple language.

        STRICT RULES:
        1. ONLY analyze situations under Indian law
        2. Always cite EXACT Act name, year, and Section number
        3. Never give advice outside Indian jurisdiction
        4. Response MUST be valid JSON only — no preamble, no markdown, no explanation outside JSON
        5. If situation is in Hindi, respond with Hindi values inside JSON fields
        6. Be specific, practical, and actionable

        VERIFIED INDIAN LAWS TO USE:
        - Labour: Payment of Wages Act 1936, Industrial Disputes Act 1947, Minimum Wages Act 1948, Factories Act 1948, ESIC Act 1948, Maternity Benefit Act 1961, Gratuity Act 1972
        - Consumer: Consumer Protection Act 2019, Sale of Goods Act 1930, Bureau of Indian Standards Act
        - Property/Rent: Transfer of Property Act 1882, Rent Control Acts (state-wise), RERA Act 2016
        - Harassment: POSH Act 2013 (SHWW Act), IPC Section 354A, IPC Section 509
        - Criminal: IPC 1860, CrPC 1973, BNSS 2023, IT Act 2000
        - RTI: Right to Information Act 2005
        - Domestic Violence: Protection of Women from Domestic Violence Act 2005, Dowry Prohibition Act 1961
        - Corruption: Prevention of Corruption Act 1988, Whistleblowers Protection Act 2014
        - Family: Hindu Marriage Act 1955, Special Marriage Act 1954, Hindu Succession Act 1956

        RESPONSE FORMAT — Return ONLY this JSON, nothing else:
        {
          "analysisTitle": "Short title describing the legal issue in 5-7 words",
          "analysisLaws": "Act Name Year §Section: explanation of how it protects the user · Act Name Year §Section: explanation",
          "rights": ["Right 1 — specific and actionable", "Right 2", "Right 3"],
          "steps": ["Step 1 to take TODAY", "Step 2", "Step 3"],
          "outcome": "Expected outcome with success percentage if applicable",
          "category": "LABOUR|CONSUMER|PROPERTY|CRIMINAL|FAMILY|RTI|HARASSMENT|DOMESTIC|OTHER",
          "successRate": 0
        }
        """;

    public String callGroq(String situation, String language, String category) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            String userPrompt = buildUserPrompt(situation, language, category);

            ObjectNode requestBody = objectMapper.createObjectNode();
            requestBody.put("model", model);
            requestBody.put("max_tokens", maxTokens);
            requestBody.put("temperature", 0.3);

            ObjectNode responseFormat = objectMapper.createObjectNode();
            responseFormat.put("type", "json_object");
            requestBody.set("response_format", responseFormat);

            ArrayNode messages = objectMapper.createArrayNode();

            ObjectNode systemMsg = objectMapper.createObjectNode();
            systemMsg.put("role", "system");
            systemMsg.put("content", SYSTEM_PROMPT);
            messages.add(systemMsg);

            ObjectNode userMsg = objectMapper.createObjectNode();
            userMsg.put("role", "user");
            userMsg.put("content", userPrompt);
            messages.add(userMsg);

            requestBody.set("messages", messages);

            HttpEntity<String> entity = new HttpEntity<>(
                    objectMapper.writeValueAsString(requestBody), headers
            );

            ResponseEntity<String> response = restTemplate.exchange(
                    apiUrl, HttpMethod.POST, entity, String.class
            );

            JsonNode responseJson = objectMapper.readTree(response.getBody());
            return responseJson
                    .path("choices")
                    .path(0)
                    .path("message")
                    .path("content")
                    .asText();

        } catch (Exception e) {
            log.error("Groq API call failed: {}", e.getMessage());
            throw new RuntimeException("Failed to get legal analysis. Please try again.");
        }
    }

    private String buildUserPrompt(String situation, String language, String category) {
        String langInstruction = "HI".equalsIgnoreCase(language)
                ? "User is asking in Hindi. Provide rights, steps, and outcome in Hindi language. Keep Act names and section numbers in English."
                : "Respond in English.";

        return String.format("""
            %s

            Detected category: %s

            User's situation: %s

            Analyze this situation under Indian law and return the JSON response.
            """, langInstruction, category, situation);
    }
}