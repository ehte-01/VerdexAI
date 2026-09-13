package com.verdex.verdex_backend.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.verdex.verdex_backend.util.JsonCleaner;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class DraftController {

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

    // -----------------------------------------------------------------------
    // DTOs
    // -----------------------------------------------------------------------

    public static class DraftRequest {
        public String noticeType;
        public String yourName;
        public String oppositeParty;
        public String issueSummary;
        public String sinceWhen;
        public String amountInvolved;
        public String additionalNotes;
        public String language;
    }

    public static class DraftResponse {
        public String documentText;
        public String subject;
        public List<String> applicableLaws;
        public String registeredPostHeader;
        public String dateFormatted;
        public String noticeType;
        public String senderName;
        public String recipientBlock;
    }

    // -----------------------------------------------------------------------
    // SYSTEM PROMPT
    // -----------------------------------------------------------------------

    private static final String DRAFT_SYSTEM_PROMPT = """
        You are VERDEX Legal Drafting Engine — a senior Indian advocate with 20+ years of
        experience drafting ready-to-file legal notices for Indian courts.

        CRITICAL RULES — NEVER VIOLATE:

        1. The "documentText" field must contain ONLY the body of the notice — starting
           from "Dear Sir/Madam," and ending with the closing signature.
           DO NOT include "REGISTERED POST WITH A/D", date, "To," block, or subject line
           inside documentText. These are separate fields (registeredPostHeader, recipientBlock, subject).

        2. "recipientBlock" must contain ONLY the To: address block, e.g.:
           "The HR Manager,\\nABC Pvt. Ltd.,\\n[Office Address],\\n[City - PIN]"

        3. "subject" must be ONE line only — the Re:/Subject line without the word "Subject:".

        4. "registeredPostHeader" must be exactly:
           - "REGISTERED POST WITH A/D" for all notices EXCEPT RTI
           - "SPEED POST" for RTI Application

        5. Each factual paragraph in documentText MUST begin with "That..."

        6. Cite EXACT Indian Acts with section numbers. Examples:
           - §3 of the Payment of Wages Act, 1936
           - §12 of the Consumer Protection Act, 2019
           - §106 of the Transfer of Property Act, 1882
           - §154 of CrPC, 1973 / §173 of BNSS, 2023
           - §6(1) of the Right to Information Act, 2005

        FORMAT BY NOTICE TYPE:

        === SALARY NOTICE ===
        Laws: Payment of Wages Act 1936 §3, §5; Industrial Disputes Act 1947 §2(s); 
              Minimum Wages Act 1948; Payment of Gratuity Act 1972 (if applicable)
        Structure in documentText:
        - Dear Sir/Madam,
        - Opening: "Under instructions from and on behalf of my client [NAME]..."
        - That para 1: Employment details and salary due
        - That para 2: Acts violated with section numbers
        - That para 3: Demand paragraph — "You are hereby called upon to pay ₹[amount] within 15 days"
        - That para 4: Consequence — civil + criminal proceedings warning
        - "Yours faithfully," + name + "Employee / Complainant"

        === TENANT NOTICE ===
        Laws: Transfer of Property Act 1882 §106, §111; applicable State Rent Control Act;
              Specific Relief Act 1963
        Structure in documentText:
        - Dear Sir/Madam,
        - Opening line
        - That para 1: Tenancy details, rent agreement, default
        - That para 2: Acts violated
        - That para 3: Demand — vacate within 30 days OR pay arrears within 15 days
        - That para 4: Consequence — eviction proceedings + damages
        - Closing

        === CONSUMER COMPLAINT ===
        Laws: Consumer Protection Act 2019 §2(7), §2(34), §35; 
              Sale of Goods Act 1930 §12-16 (if product); 
              IT Act 2000 §43 (if online)
        Structure in documentText:
        - Dear Sir/Madam,
        - Opening line
        - That para 1: Purchase/service details, defect/deficiency
        - That para 2: Acts violated — "deficiency in service" or "unfair trade practice"
        - That para 3: Demand — refund/replacement/compensation within 15 days
        - That para 4: Consequence — Consumer Disputes Redressal Commission complaint
        - Closing

        === FIR DRAFT ===
        Laws: CrPC 1973 §154 / BNSS 2023 §173; relevant IPC/BNS sections based on offence.
              For assault: IPC §351, §352, §323 / BNS §115, §131
              For fraud: IPC §420, §415 / BNS §318
              For cheating: IPC §406, §420 / BNS §316, §318
        Note: FIR Draft is addressed TO the Station House Officer (SHO), not a private party.
        recipientBlock: "The Station House Officer,\\n[Police Station Name],\\n[District], [State]"
        registeredPostHeader: "REGISTERED POST WITH A/D"
        Structure in documentText:
        - "Respected Sir/Madam,"
        - Opening: "I, [NAME], hereby lodge the following complaint..."
        - That para 1: Complainant details
        - That para 2: Incident details — date, time, place, what happened
        - That para 3: IPC/BNS sections attracted
        - Prayer: "It is therefore prayed that an FIR be registered under the above sections..."
        - "Yours faithfully," + name + "Complainant"

        === RTI APPLICATION ===
        Laws: Right to Information Act 2005 §6(1), §6(3), §7(1)
        registeredPostHeader: "SPEED POST"
        recipientBlock: "The Public Information Officer (PIO),\\n[Department Name],\\n[Office Address]"
        Structure in documentText:
        - "Respected Sir/Madam,"
        - "I, [NAME], a citizen of India, hereby request the following information under §6(1) of the RTI Act, 2005:"
        - Information requested: numbered list (1. 2. 3.) of specific questions
        - "Application Fee: ₹10 (as prescribed under RTI Act)"
        - "Kindly provide the above information within 30 days as mandated under §7(1) of the RTI Act, 2005."
        - "In case the information is held by another public authority, kindly transfer this application under §6(3) of the Act."
        - Closing

        RESPONSE FORMAT: Return ONLY valid JSON. No markdown, no preamble, nothing else.
        {
          "subject": "one-line subject without the word Subject:",
          "recipientBlock": "To block only — name, designation, address",
          "documentText": "body only — from Dear Sir/Madam to closing signature",
          "applicableLaws": ["Full Act Name Year §Section — reason", "..."],
          "registeredPostHeader": "REGISTERED POST WITH A/D"
        }
        """;

    // -----------------------------------------------------------------------
    // POST /api/v1/draft
    // -----------------------------------------------------------------------

    @PostMapping("/draft")
    public ResponseEntity<?> generateDraft(@RequestBody DraftRequest req) {
        log.info("Draft request — type: {}, name: {}", req.noticeType, req.yourName);

        try {
            String groqRaw   = callGroq(req);
            String cleanJson = JsonCleaner.clean(groqRaw);

            JsonNode parsed = objectMapper.readTree(cleanJson);

            DraftResponse resp = new DraftResponse();
            resp.noticeType           = req.noticeType;
            resp.senderName           = req.yourName;
            resp.subject              = parsed.path("subject").asText();
            resp.recipientBlock       = parsed.path("recipientBlock").asText();
            resp.documentText         = parsed.path("documentText").asText();
            resp.registeredPostHeader = parsed.path("registeredPostHeader")
                    .asText("REGISTERED POST WITH A/D");

            JsonNode lawsNode = parsed.path("applicableLaws");
            resp.applicableLaws = new java.util.ArrayList<>();
            if (lawsNode.isArray()) {
                lawsNode.forEach(n -> resp.applicableLaws.add(n.asText()));
            }

            resp.dateFormatted = LocalDate.now()
                    .format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));

            return ResponseEntity.ok(resp);

        } catch (Exception e) {
            log.error("Draft generation failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Draft generation failed. Please try again."));
        }
    }

    // -----------------------------------------------------------------------
    // Groq API call
    // -----------------------------------------------------------------------

    private String callGroq(DraftRequest req) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        ObjectNode body = objectMapper.createObjectNode();
        body.put("model", model);
        body.put("max_tokens", maxTokens);
        body.put("temperature", 0.15);

        ObjectNode responseFormat = objectMapper.createObjectNode();
        responseFormat.put("type", "json_object");
        body.set("response_format", responseFormat);

        ArrayNode messages = objectMapper.createArrayNode();

        ObjectNode sysMsg = objectMapper.createObjectNode();
        sysMsg.put("role", "system");
        sysMsg.put("content", DRAFT_SYSTEM_PROMPT);
        messages.add(sysMsg);

        ObjectNode userMsg = objectMapper.createObjectNode();
        userMsg.put("role", "user");
        userMsg.put("content", buildUserPrompt(req));
        messages.add(userMsg);

        body.set("messages", messages);

        HttpEntity<String> entity = new HttpEntity<>(
                objectMapper.writeValueAsString(body), headers);

        ResponseEntity<String> response = restTemplate.exchange(
                apiUrl, HttpMethod.POST, entity, String.class);

        JsonNode responseJson = objectMapper.readTree(response.getBody());
        return responseJson
                .path("choices").path(0)
                .path("message").path("content")
                .asText();
    }

    // -----------------------------------------------------------------------
    // Build user prompt — notice-type-specific instructions
    // -----------------------------------------------------------------------

    private String buildUserPrompt(DraftRequest req) {
        String langInstruction = "HI".equalsIgnoreCase(req.language)
                ? "Draft in formal Hindi. Keep Act names, section numbers, and legal terms in English."
                : "Draft in formal legal English.";

        String today = LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));

        // Extra type-specific hints injected into user prompt
        String typeHint = switch (req.noticeType == null ? "" : req.noticeType.toLowerCase()) {
            case "fir draft" -> """
                IMPORTANT: This is an FIR complaint to the Police.
                - recipientBlock must be addressed to the SHO of a police station.
                - Use "Respected Sir/Madam," NOT "Dear Sir/Madam,"
                - Use "I hereby lodge the following complaint" style.
                - Cite IPC sections AND their BNS 2023 equivalents.
                - End with a Prayer paragraph requesting FIR registration.
                """;
            case "rti application" -> """
                IMPORTANT: This is an RTI Application under RTI Act 2005.
                - registeredPostHeader must be "SPEED POST"
                - recipientBlock must be addressed to the PIO of relevant department.
                - List the specific information requested as numbered points.
                - Include ₹10 application fee mention.
                - Cite §6(1), §6(3), §7(1) of RTI Act 2005.
                """;
            case "consumer complaint" -> """
                IMPORTANT: This is a Consumer Complaint notice.
                - Cite Consumer Protection Act 2019 specifically.
                - Mention "deficiency in service" or "unfair trade practice" as applicable.
                - Demand must include refund/replacement AND compensation.
                - Warn of complaint to Consumer Disputes Redressal Commission.
                """;
            case "tenant notice" -> """
                IMPORTANT: This is a Tenant/Landlord notice.
                - Cite Transfer of Property Act 1882 §106 for eviction.
                - Mention the applicable State Rent Control Act.
                - Demand must specify 30-day vacating period OR arrears payment timeline.
                - Warn of eviction suit in Civil Court.
                """;
            default -> """
                IMPORTANT: This is a Salary/Labour notice.
                - Cite Payment of Wages Act 1936 §3 and §5 specifically.
                - Also cite Industrial Disputes Act 1947.
                - Demand must specify exact amount and 15-day timeline.
                - Warn of both civil suit AND labour court complaint.
                """;
        };

        return String.format("""
                %s

                %s

                === CASE DETAILS ===
                Notice Type     : %s
                Today's Date    : %s
                Client Name     : %s
                Opposite Party  : %s
                Issue Summary   : %s
                Since When      : %s
                Amount Involved : %s
                Additional Notes: %s

                Generate a complete, ready-to-file Indian legal notice.
                REMEMBER: documentText must start from "Dear Sir/Madam," (or "Respected Sir/Madam," for FIR).
                Do NOT put the header, date, To block, or subject inside documentText.
                Each factual paragraph MUST begin with "That..."
                """,
                langInstruction,
                typeHint,
                req.noticeType,
                today,
                req.yourName,
                req.oppositeParty,
                req.issueSummary,
                req.sinceWhen       != null ? req.sinceWhen       : "Not specified",
                req.amountInvolved  != null ? req.amountInvolved  : "Not specified",
                req.additionalNotes != null ? req.additionalNotes : "None"
        );
    }
}