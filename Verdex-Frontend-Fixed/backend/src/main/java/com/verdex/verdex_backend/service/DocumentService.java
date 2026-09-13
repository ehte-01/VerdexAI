package com.verdex.verdex_backend.service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.io.RandomAccessReadBuffer;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.verdex.verdex_backend.util.JsonCleaner;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentService {

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

    private static final String SYSTEM_PROMPT = """
        You are VERDEX, an AI legal document scanner specialized in Indian law.
        Analyze the provided document and identify dangerous, illegal, or one-sided clauses.

        STRICT RULES:
        1. Only flag clauses that violate Indian law
        2. Cite exact Act name, year, and Section for each violation
        3. Suggest a practical counter-clause for each dangerous clause
        4. Response MUST be valid JSON only — no preamble, no markdown

        RESPONSE FORMAT:
        {
          "riskScore": 0,
          "clauses": [
            {
              "title": "Brief clause title with location e.g. (Clause 8.2)",
              "explanation": "Why this is dangerous and which Indian law/section it violates",
              "counter": "Safer replacement clause the user can propose"
            }
          ]
        }

        If document is not legal/contractual, return:
        {"riskScore": 0, "clauses": [], "error": "Not a legal document"}
        """;

    // ── TEXT EXTRACTION ──────────────────────────────────────────
    private String extractText(MultipartFile file) throws IOException {
        String name = file.getOriginalFilename();
        if (name == null) throw new IOException("Filename is missing.");

        String lower = name.toLowerCase();

        if (lower.endsWith(".txt")) {
            return new String(file.getBytes(), StandardCharsets.UTF_8);
        }

        if (lower.endsWith(".pdf")) {
            try (PDDocument doc = Loader.loadPDF(new RandomAccessReadBuffer(file.getInputStream()))) {
                PDFTextStripper stripper = new PDFTextStripper();
                String text = stripper.getText(doc);
                if (text == null || text.isBlank()) {
                    throw new IOException(
                            "This PDF appears to be scanned/image-based and cannot be " +
                                    "read as text. Please upload a text-based PDF."
                    );
                }
                log.info("PDF extracted — {} characters", text.length());
                return text;
            }
        }

        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png")) {
            throw new IOException(
                    "Image files (JPG/PNG) are not yet supported. " +
                            "Please upload a text-based PDF or .txt file."
            );
        }

        throw new IOException("Unsupported file type: " + name +
                ". Please upload a PDF or TXT file.");
    }

    // ── MAIN METHOD ──────────────────────────────────────────────
    public JsonNode analyseDocument(MultipartFile file, String language) {
        try {
            // Step 1: Extract text based on file type
            String documentText = extractText(file);

            // Step 2: Truncate if too long for Groq context
            if (documentText.length() > 8000) {
                documentText = documentText.substring(0, 8000) + "\n...[truncated]";
            }

            // Step 3: Build Groq request
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            String langInstruction = "HI".equalsIgnoreCase(language)
                    ? "Provide explanations and counter-clauses in Hindi. " +
                    "Keep Act names and section numbers in English."
                    : "Respond in English.";

            String userPrompt = String.format("""
                %s
                Analyze this document under Indian law and return the JSON response.

                DOCUMENT:
                %s
                """, langInstruction, documentText);

            ObjectNode requestBody = objectMapper.createObjectNode();
            requestBody.put("model", model);
            requestBody.put("max_tokens", maxTokens);
            requestBody.put("temperature", 0.2);

            // Force strict JSON output — without this, newer models (e.g. gpt-oss)
            // can interleave reasoning/thinking text with the JSON answer, which
            // breaks parsing or gets truncated before the JSON closes.
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

            // Step 4: Call Groq
            ResponseEntity<String> response = restTemplate.exchange(
                    apiUrl, HttpMethod.POST, entity, String.class
            );

            // Step 5: Parse response
            JsonNode responseJson = objectMapper.readTree(response.getBody());
            String content = responseJson
                    .path("choices").path(0)
                    .path("message").path("content")
                    .asText();

            content = JsonCleaner.clean(content);

            return objectMapper.readTree(content);

        } catch (IOException e) {
            // File reading / unsupported format — return user-friendly error
            log.warn("Document extraction failed: {}", e.getMessage());
            try {
                ObjectNode err = objectMapper.createObjectNode();
                err.put("riskScore", 0);
                err.putArray("clauses");
                err.put("error", e.getMessage());
                return err;
            } catch (Exception ex) {
                throw new RuntimeException(e.getMessage());
            }
        } catch (Exception e) {
            log.error("Document analysis failed: {}", e.getMessage());
            throw new RuntimeException("Document analysis failed. Please try again.");
        }
    }
}