package com.caves.demo.mail;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String from;

    @Value("${app.mail.to}")
    private String to;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendRequest(String name, String email, String request) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(from);
        message.setTo(to);
        message.setSubject("New Demo-Caves Request from " + name);

        message.setText(
                "Name: " + name + "\n" +
                "Email: " + email + "\n\n" +
                "Request:\n" + request
        );

        mailSender.send(message);
    }
}