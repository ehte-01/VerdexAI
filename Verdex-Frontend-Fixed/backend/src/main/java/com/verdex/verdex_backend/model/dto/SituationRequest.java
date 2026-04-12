package com.verdex.verdex_backend.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SituationRequest {

    @NotBlank(message = "Situation cannot be empty")
    @Size(min = 10, max = 2000, message = "Situation must be between 10 and 2000 characters")
    private String situation;

    private String language = "EN";
}