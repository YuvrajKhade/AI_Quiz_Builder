package com.quizBuilder.gateway;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Optional;

/**
 * Fetches a Wikipedia article summary to inject as grounding context
 * into the quiz-generation prompt, improving factual accuracy.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class WikipediaGateway {

    private final WebClient.Builder webClientBuilder;

    @Value("${app.wikipedia.base-url}")
    private String baseUrl;

    @Value("${app.wikipedia.enabled:true}")
    private boolean enabled;

    /**
     * Returns the Wikipedia summary for the given topic, or empty if disabled / not found.
     * Capped at ~1500 chars to stay within prompt budget.
     */
    public Optional<String> fetchSummary(String topic) {
        if (!enabled) return Optional.empty();

        try {
            String slug = topic.trim().replace(" ", "_");
            WikipediaSummary result = webClientBuilder.build()
                    .get()
                    .uri(baseUrl + "/page/summary/" + slug)
                    .retrieve()
                    .bodyToMono(WikipediaSummary.class)
                    .block();

            if (result == null || result.extract() == null) return Optional.empty();

            String extract = result.extract().length() > 1500
                    ? result.extract().substring(0, 1500) + "…"
                    : result.extract();

            log.info("Wikipedia context fetched for topic '{}'", topic);
            return Optional.of(extract);

        } catch (Exception e) {
            log.warn("Wikipedia fetch failed for topic '{}': {}", topic, e.getMessage());
            return Optional.empty();
        }
    }

    // Inner record to map Wikipedia REST response
    private record WikipediaSummary(String title, String extract) {}
}