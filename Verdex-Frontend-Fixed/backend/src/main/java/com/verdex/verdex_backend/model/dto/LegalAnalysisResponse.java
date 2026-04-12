package com.verdex.verdex_backend.model.dto;

import lombok.Data;
import java.util.List;

@Data
public class LegalAnalysisResponse {

    private String analysisTitle;
    private String analysisLaws;
    private List<String> rights;
    private List<String> steps;
    private String outcome;
    private String category;
    private int successRate;
    private String poweredBy = "Groq LLaMA 3.3 70B";
}