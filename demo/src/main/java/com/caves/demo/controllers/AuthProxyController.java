package com.caves.demo.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/auth")
public class AuthProxyController {

    @Value("${iam.service.url}")
    private String iamUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody String body) {
        return forward("/api/auth/login", body);
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody String body) {
        return forward("/api/auth/register", body);
    }

    @GetMapping("/me")
    public ResponseEntity<String> me(@RequestHeader("Authorization") String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        try {
            return restTemplate.exchange(iamUrl + "/api/users/me", HttpMethod.GET, entity, String.class);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    private ResponseEntity<String> forward(String path, String body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<>(body, headers);
        try {
            return restTemplate.exchange(iamUrl + path, HttpMethod.POST, entity, String.class);
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            // 4xx errors — pass the message through
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        } catch (org.springframework.web.client.HttpServerErrorException e) {
            // 5xx errors — return a clean 400 with a safe message
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Wrong email or password.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Service unavailable.");
        }
    }
}