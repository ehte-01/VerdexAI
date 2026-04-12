package com.verdex.verdex_backend.service;

import org.springframework.stereotype.Service;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class RateLimiterService {
    private static final int MAX_REQUESTS_PER_MINUTE = 12;
    private static final Duration WINDOW = Duration.ofMinutes(1);
    private final Map<String, RequestBucket> buckets = new ConcurrentHashMap<>();

    public boolean allowRequest(String key) {
        RequestBucket bucket = buckets.computeIfAbsent(key, k -> new RequestBucket(Instant.now().plus(WINDOW)));
        synchronized (bucket) {
            Instant now = Instant.now();
            if (now.isAfter(bucket.resetAt)) {
                bucket.count.set(1);
                bucket.resetAt = now.plus(WINDOW);
                return true;
            }
            return bucket.count.incrementAndGet() <= MAX_REQUESTS_PER_MINUTE;
        }
    }

    private static class RequestBucket {
        private final AtomicInteger count = new AtomicInteger(0);
        private Instant resetAt;
        RequestBucket(Instant resetAt) { this.resetAt = resetAt; }
    }
}