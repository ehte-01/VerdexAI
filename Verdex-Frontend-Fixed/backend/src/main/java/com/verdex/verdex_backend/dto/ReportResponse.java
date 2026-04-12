package com.verdex.verdex_backend.dto;

public class ReportResponse {
    private String caseId;
    private String status;

    public ReportResponse() {}
    public ReportResponse(String caseId, String status) {
        this.caseId = caseId; this.status = status;
    }

    public String getCaseId() { return caseId; }
    public void setCaseId(String caseId) { this.caseId = caseId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}