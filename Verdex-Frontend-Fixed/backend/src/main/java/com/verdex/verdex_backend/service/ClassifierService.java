package com.verdex.verdex_backend.service;

import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.List;

@Service
public class ClassifierService {

    private static final Map<String, List<String>> CATEGORY_KEYWORDS = Map.of(
            "LABOUR", List.of(
                    "salary", "wage", "wages", "unpaid", "employer", "employee",
                    "job", "fired", "terminated", "resign", "pf", "provident",
                    "gratuity", "overtime", "leave", "maternity", "labour",
                    "वेतन", "नौकरी", "मजदूरी", "नियोक्ता", "कर्मचारी"
            ),
            "CONSUMER", List.of(
                    "product", "defective", "fraud", "refund", "cheated",
                    "online", "amazon", "flipkart", "ecommerce", "seller",
                    "warranty", "guarantee", "consumer", "purchase", "bought",
                    "उपभोक्ता", "धोखाधड़ी", "वापसी", "खरीदा"
            ),
            "PROPERTY", List.of(
                    "landlord", "tenant", "rent", "eviction", "house",
                    "flat", "apartment", "lease", "property", "plot",
                    "builder", "possession", "registry", "makaan",
                    "मकान मालिक", "किराया", "संपत्ति", "किरायेदार"
            ),
            "HARASSMENT", List.of(
                    "harassment", "sexual", "workplace harassment", "posh",
                    "hostile", "abuse", "bully", "threatening", "unsafe",
                    "उत्पीड़न", "यौन उत्पीड़न", "कार्यस्थल"
            ),
            "DOMESTIC", List.of(
                    "domestic violence", "husband", "wife", "dowry",
                    "abuse", "beaten", "threat", "divorce", "marriage",
                    "घरेलू हिंसा", "दहेज", "पति", "पत्नी"
            ),
            "CRIMINAL", List.of(
                    "fir", "police", "complaint", "arrested", "theft",
                    "robbery", "assault", "cheating", "fraud", "ipc",
                    "एफआईआर", "पुलिस", "चोरी", "धोखा"
            ),
            "RTI", List.of(
                    "rti", "right to information", "government",
                    "public authority", "information", "corruption",
                    "आरटीआई", "सूचना का अधिकार", "भ्रष्टाचार"
            ),
            "FAMILY", List.of(
                    "divorce", "custody", "child", "alimony", "maintenance",
                    "inheritance", "will", "succession", "adoption",
                    "तलाक", "बच्चा", "गुजारा भत्ता", "विरासत"
            )
    );

    public String classify(String situation) {
        if (situation == null || situation.isBlank()) return "OTHER";
        String lower = situation.toLowerCase();
        String bestCategory = "OTHER";
        int bestScore = 0;

        for (Map.Entry<String, List<String>> entry : CATEGORY_KEYWORDS.entrySet()) {
            int score = 0;
            for (String keyword : entry.getValue()) {
                if (lower.contains(keyword.toLowerCase())) {
                    score++;
                }
            }
            if (score > bestScore) {
                bestScore = score;
                bestCategory = entry.getKey();
            }
        }
        return bestCategory;
    }
}