package com.verdex.verdex_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class WhistleblowerReportRequest {

    // Frontend sends "reportCategory" - map it to caseType via setter
    private String caseType;

    // Frontend field name alias - if frontend sends "reportCategory", this setter binds it
    private String reportCategory;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 5000, message = "Describe your incident in at least 10 characters")
    private String description;

    // Optional fields from the extended form
    private String incidentLocation;
    private String dateOfIncident;
    private String peopleInvolved;

    public String getCaseType() {
        // Return whichever is set - frontend may send either
        return caseType != null ? caseType : reportCategory;
    }
    public void setCaseType(String caseType) { this.caseType = caseType; }

    public String getReportCategory() { return reportCategory; }
    public void setReportCategory(String reportCategory) {
        this.reportCategory = reportCategory;
        if (this.caseType == null) this.caseType = reportCategory;
    }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIncidentLocation() { return incidentLocation; }
    public void setIncidentLocation(String incidentLocation) { this.incidentLocation = incidentLocation; }

    public String getDateOfIncident() { return dateOfIncident; }
    public void setDateOfIncident(String dateOfIncident) { this.dateOfIncident = dateOfIncident; }

    public String getPeopleInvolved() { return peopleInvolved; }
    public void setPeopleInvolved(String peopleInvolved) { this.peopleInvolved = peopleInvolved; }
}
