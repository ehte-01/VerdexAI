package com.verdex.verdex_backend.util;

/**
 * Shared helper for stripping markdown code fences (```json ... ```)
 * that LLM responses sometimes wrap their JSON output in, despite
 * being told not to. Used by DocumentService, GroqService, and
 * DraftController so a fix only needs to happen in one place.
 */
public final class JsonCleaner {

    private JsonCleaner() {}

    public static String clean(String raw) {
        if (raw == null) return "{}";
        raw = raw.trim();

        if (raw.startsWith("```json")) {
            raw = raw.substring(7);
        } else if (raw.startsWith("```")) {
            raw = raw.substring(3);
        }
        if (raw.endsWith("```")) {
            raw = raw.substring(0, raw.length() - 3);
        }
        return raw.trim();
    }
}