package com.verdex.verdex_backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Fixed-window rate limiter backed by Redis, so the limit is shared across
 * all app instances. If Redis is unreachable it falls back to the old
 * in-memory limiter, so the API keeps working.
 */
@Service
public class RateLimiterService {
    private static final Logger log = LoggerFactory.getLogger(RateLimiterService.class);
    private static final int MAX_REQUESTS_PER_MINUTE = 12;
    private static final Duration WINDOW = Duration.ofMinutes(1);

    private final StringRedisTemplate redis;
    private final Map<String, RequestBucket> localBuckets = new ConcurrentHashMap<>();

    public RateLimiterService(StringRedisTemplate redis) {
        this.redis = redis;
    }

    public boolean allowRequest(String key) {
        try {
            long window = System.currentTimeMillis() / WINDOW.toMillis();
            String redisKey = "rl:" + key + ":" + window;
            Long count = redis.opsForValue().increment(redisKey);
            if (count == null) return allowLocal(key);
            if (count == 1L) redis.expire(redisKey, WINDOW.multipliedBy(2));
            return count <= MAX_REQUESTS_PER_MINUTE;
        } catch (Exception e) {
            log.warn("Redis unavailable, using in-memory rate limiter: {}", e.getMessage());
            return allowLocal(key);
        }
    }

    private boolean allowLocal(String key) {
        RequestBucket bucket = localBuckets.computeIfAbsent(key, k -> new RequestBucket(Instant.now().plus(WINDOW)));
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
