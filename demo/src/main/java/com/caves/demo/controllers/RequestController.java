package com.caves.demo.controllers;

import com.caves.demo.mail.MailService;
import com.caves.demo.api.RequestDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class RequestController {

    private final MailService mailService;

    public RequestController(MailService mailService) {
        this.mailService = mailService;
    }

    @PostMapping("/request")
    public ResponseEntity<?> sendRequest(@RequestBody RequestDto dto) {

        mailService.sendRequest(
                dto.name(),
                dto.email(),
                dto.request()
        );

        return ResponseEntity.ok().build();
    }
}