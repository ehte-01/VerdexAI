package com.verdex.verdex_backend.service;

import com.verdex.verdex_backend.model.Ngo;
import com.verdex.verdex_backend.model.WhistleblowerReport;
import com.verdex.verdex_backend.repository.NgoRepository;
import com.verdex.verdex_backend.repository.WhistleblowerReportRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.time.Instant;
import java.util.*;

@Service
public class WhistleblowerService {
    private static final Set<String> ALLOWED_TYPES = Set.of("application/pdf", "image/png", "image/jpeg");
    private static final Set<String> ALLOWED_EXT = Set.of("pdf", "png", "jpg", "jpeg");
    private static final long MAX_SIZE = 10L * 1024 * 1024;
    private static final int MAX_FILES = 5;

    private final WhistleblowerReportRepository reportRepository;
    private final NgoRepository ngoRepository;
    private final EncryptionService encryptionService;
    private final Path uploadDirectory;
    private final String baseUrl;

    public WhistleblowerService(
            WhistleblowerReportRepository reportRepository,
            NgoRepository ngoRepository,
            EncryptionService encryptionService,
            @Value("${file.upload-dir}") String uploadDir,
            @Value("${application.base-url}") String baseUrl) {
        this.reportRepository = reportRepository;
        this.ngoRepository = ngoRepository;
        this.encryptionService = encryptionService;
        this.uploadDirectory = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
    }

    @PostConstruct
    public void createUploadDirectory() throws IOException {
        Files.createDirectories(uploadDirectory);
    }

    public WhistleblowerReport saveReport(String caseType, String description, MultipartFile[] files) {
        if (caseType == null || caseType.isBlank()) caseType = "General";
        if (files != null && files.length > MAX_FILES)
            throw new IllegalArgumentException("Maximum " + MAX_FILES + " files allowed.");

        List<String> fileUrls = storeFiles(files);
        String caseId = generateCaseId();
        WhistleblowerReport report = new WhistleblowerReport(
                null, caseId, caseType, encryptionService.encrypt(description.trim()),
                fileUrls, Instant.now(), "SUBMITTED");
        return reportRepository.save(report);
    }

    private List<String> storeFiles(MultipartFile[] files) {
        if (files == null || files.length == 0) return Collections.emptyList();
        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) continue;
            validateFile(file);
            String filename = UUID.randomUUID() + "-" + sanitize(file.getOriginalFilename());
            try {
                Files.copy(file.getInputStream(), uploadDirectory.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
            } catch (IOException e) {
                throw new IllegalStateException("Unable to store file", e);
            }
            urls.add(baseUrl + "/uploads/" + filename);
        }
        return urls;
    }

    private void validateFile(MultipartFile file) {
        if (file.getSize() > MAX_SIZE) throw new IllegalArgumentException("File must be under 10MB.");
        String ct = file.getContentType();
        if (ct == null || !ALLOWED_TYPES.contains(ct)) throw new IllegalArgumentException("Only PDF, PNG, JPEG allowed.");
        String name = file.getOriginalFilename();
        if (name == null || !name.contains(".")) throw new IllegalArgumentException("Invalid file extension.");
        String ext = name.substring(name.lastIndexOf('.') + 1).toLowerCase();
        if (!ALLOWED_EXT.contains(ext)) throw new IllegalArgumentException("Unsupported file type: " + ext);
    }

    private String sanitize(String name) {
        return name == null ? "unknown" : name.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    private String generateCaseId() {
        String id;
        do { id = "VERDEX-" + String.format("%06d", (int)(Math.random() * 900000) + 100000); }
        while (reportRepository.existsByCaseId(id));
        return id;
    }

    public List<Ngo> getNgosByCategory(String category) {
        if (category == null || category.isBlank()) return ngoRepository.findAll();
        List<Ngo> result = ngoRepository.findByCategoryIgnoreCase(category);
        return result.isEmpty() ? ngoRepository.findAll() : result;
    }
}