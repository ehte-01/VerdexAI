package com.verdex.verdex_backend.controller;

import com.verdex.verdex_backend.dto.ReportResponse;
import com.verdex.verdex_backend.dto.WhistleblowerReportRequest;
import com.verdex.verdex_backend.model.Ngo;
import com.verdex.verdex_backend.model.WhistleblowerReport;
import com.verdex.verdex_backend.service.RateLimiterService;
import com.verdex.verdex_backend.service.WhistleblowerService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/whistleblower")
public class WhistleblowerController {

    private final WhistleblowerService whistleblowerService;
    private final RateLimiterService rateLimiterService;

    public WhistleblowerController(WhistleblowerService whistleblowerService, RateLimiterService rateLimiterService) {
        this.whistleblowerService = whistleblowerService;
        this.rateLimiterService = rateLimiterService;
    }

    @GetMapping("/health")
    public ResponseEntity<Object> health() {
        return ResponseEntity.ok(Collections.singletonMap("status", "UP"));
    }

    @GetMapping("/ngos")
    public List<Ngo> getNgos(@RequestParam(required = false) String type, HttpServletRequest request) {
        if (!rateLimiterService.allowRequest(extractIp(request)))
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Too many requests.");
        return whistleblowerService.getNgosByCategory(type);
    }

    @PostMapping(value = "/report", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReportResponse> submitReport(
            @ModelAttribute @Valid WhistleblowerReportRequest req,
            BindingResult bindingResult,
            @RequestParam(value = "files", required = false) MultipartFile[] files,
            HttpServletRequest servletRequest) {

        if (bindingResult.hasErrors()) {
            String msg = bindingResult.getFieldErrors().stream()
                    .map(e -> e.getField() + ": " + e.getDefaultMessage())
                    .collect(Collectors.joining("; "));
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, msg);
        }
        if (!rateLimiterService.allowRequest(extractIp(servletRequest)))
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Too many requests.");

        try {
            WhistleblowerReport report = whistleblowerService.saveReport(req.getCaseType(), req.getDescription(), files);
            return ResponseEntity.ok(new ReportResponse(report.getCaseId(), report.getStatus()));
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to submit report.");
        }
    }

    private String extractIp(HttpServletRequest request) {
        String fwd = request.getHeader("X-Forwarded-For");
        return (fwd != null && !fwd.isBlank()) ? fwd.split(",")[0].trim() : request.getRemoteAddr();
    }
}