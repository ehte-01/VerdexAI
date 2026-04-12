package com.verdex.verdex_backend.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "whistleblower_reports")
public class WhistleblowerReport {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "case_id", unique = true, nullable = false)
    private String caseId;

    @Column(name = "case_type", nullable = false)
    private String caseType;

    @Column(name = "encrypted_description", nullable = false, columnDefinition = "TEXT")
    private String encryptedDescription;

    @ElementCollection
    @CollectionTable(name = "whistleblower_file_urls", joinColumns = @JoinColumn(name = "report_id"))
    @Column(name = "file_url")
    private List<String> fileUrls;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "status", nullable = false)
    private String status;

    public WhistleblowerReport() {}

    public WhistleblowerReport(String id, String caseId, String caseType, String encryptedDescription,
                               List<String> fileUrls, Instant createdAt, String status) {
        this.id = id;
        this.caseId = caseId;
        this.caseType = caseType;
        this.encryptedDescription = encryptedDescription;
        this.fileUrls = fileUrls;
        this.createdAt = createdAt;
        this.status = status;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCaseId() { return caseId; }
    public void setCaseId(String caseId) { this.caseId = caseId; }
    public String getCaseType() { return caseType; }
    public void setCaseType(String caseType) { this.caseType = caseType; }
    public String getEncryptedDescription() { return encryptedDescription; }
    public void setEncryptedDescription(String encryptedDescription) { this.encryptedDescription = encryptedDescription; }
    public List<String> getFileUrls() { return fileUrls; }
    public void setFileUrls(List<String> fileUrls) { this.fileUrls = fileUrls; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}