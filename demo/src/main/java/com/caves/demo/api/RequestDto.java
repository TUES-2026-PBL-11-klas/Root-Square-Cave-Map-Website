package com.caves.demo.api;

public record RequestDto(
        String name,
        String email,
        String request
) {}