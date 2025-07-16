package com.portal.appliedJobs.service.impl;

import com.portal.appliedJobs.service.EmailService;
import com.portal.jobs.entities.Job;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class EmailServiceImpl implements EmailService {

    @Value("${brevo.api-key}")
    private String BREVO_API;


    private final RestTemplate restTemplate;



    public EmailServiceImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }


    @Override
    public ResponseEntity<String> sendHrEmail(String applicantEmail, Job job, String resumeUrl, String applicantName) {

        sendEmail(
                job.getEmail(),
                1,
                applicantEmail,
                job.getTitle(),
                resumeUrl,
                job.getDescription(),
                job.getCategory(),
                applicantName,
                "",
                job.getCompanyName()
        );
        return ResponseEntity.ok("Mail sent Successfully");
    }



    @Override
    public ResponseEntity<String> sendRejectionEmail(String applicantEmail, Job job, String resumeUrl, String applicantName) {

        sendEmail(
                applicantEmail,
                2,
                applicantEmail,
                job.getTitle(), 
                resumeUrl,
                job.getDescription(),
                job.getCategory(),
                applicantName,
                "",
                job.getCompanyName()
        );
        return ResponseEntity.ok("Mail sent successfully");
    }

    @Override
    public ResponseEntity<String> sendRoomEmail(String hrEmail, Job job, String applicantEmail,String applicantName, String roomId, String time) {
        String url = "https://api.brevo.com/v3/smtp/email";
        HttpHeaders headers = new HttpHeaders();
        headers.set("api-key", BREVO_API);
        headers.setContentType(MediaType.APPLICATION_JSON);
        Map<String, Object> body = new HashMap<>();
        body.put("sender", Map.of("name", "SmartHire", "email", "maheshwari.keshav2090@gmail.com"));
        body.put("to", List.of(Map.of("email", applicantEmail)));
        body.put("templateId", 3);

        Map<String, Object> params = new HashMap<>();
        params.put("jobTitle", job.getTitle());
        params.put("applicantEmail", applicantEmail);
        params.put("resumeUrl", "");
        params.put("hrEmail", hrEmail);
        params.put("jobDescription", job.getDescription());
        params.put("role", job.getCategory());
        params.put("applicantName", applicantName);
        params.put("roomId", roomId);
        params.put("time", time);
        params.put("companyName", job.getCompanyName());
        body.put("params", params);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        try {
            ResponseEntity<String> exchange = restTemplate.exchange(url, HttpMethod.POST, request, String.class);
        } catch (Exception e) {
            log.error("Failed to send Brevo email");

        }

        return ResponseEntity.ok("Mail sent successfully");
    }
    public void sendOfferLetterEmail(String toEmail,
                                     String applicantName,
                                     String jobTitle,
                                     String startDate,
                                     String salary,
                                     String benefits,
                                     String responseDate,
                                     String hrName,
                                     String companyName,
                                     byte[] byteArray,
                                     String fileName) {

        String url = "https://api.brevo.com/v3/smtp/email";
        HttpHeaders headers = new HttpHeaders();
        headers.set("api-key", BREVO_API);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Prepare email body
        Map<String, Object> body = new HashMap<>();
        body.put("sender", Map.of(
                "name", "SmartHire",
                "email", "maheshwari.keshav2090@gmail.com"
        ));
        body.put("to", List.of(Map.of("email", toEmail)));
        body.put("templateId", 4);

        // Template variables
        Map<String, Object> params = new HashMap<>();
        params.put("applicantName", applicantName);
        params.put("jobTitle", jobTitle);
        params.put("startDate", startDate);
        params.put("salary", salary);
        params.put("benefits", benefits);
        params.put("responseDate", responseDate);
        params.put("hrName", hrName);
        params.put("companyName", companyName);
        body.put("params", params);

        // Attach PDF
        if (byteArray != null && byteArray.length > 0) {
            String base64Pdf = Base64.getEncoder().encodeToString(byteArray);
            Map<String, Object> attachment = new HashMap<>();
            attachment.put("content", base64Pdf);
            attachment.put("name", fileName); // e.g. Offer_Letter.pdf
            body.put("attachment", List.of(attachment));
        }

        // Send request
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        try {
            ResponseEntity<String> exchange = restTemplate.exchange(url, HttpMethod.POST, request, String.class);
            log.info("Brevo email sent: {}", exchange.getBody());
        } catch (Exception e) {
            log.error("Failed to send Brevo email");

        }
    }


    private void sendEmail(String toEmail,int templateId,
                           String applicantEmail, String jobTitle, String resumeUrl,
                           String jobDescription, String category, String applicantName,
                           String roomId, String companyName) {

        String url = "https://api.brevo.com/v3/smtp/email";
        HttpHeaders headers = new HttpHeaders();
        headers.set("api-key", BREVO_API);
        headers.setContentType(MediaType.APPLICATION_JSON);
        Map<String, Object> body = new HashMap<>();
        body.put("sender", Map.of("name", "SmartHire", "email", "maheshwari.keshav2090@gmail.com"));
        body.put("to", List.of(Map.of("email", toEmail)));
        body.put("templateId", templateId);

        Map<String, Object> params = new HashMap<>();
        params.put("jobTitle", jobTitle);
        params.put("applicantEmail", applicantEmail);
        params.put("resumeUrl", resumeUrl);
        params.put("jobDescription", jobDescription);
        params.put("role", category);
        params.put("applicantName", applicantName);
        params.put("roomId", roomId);
        body.put("params", params);
        params.put("companyName", companyName);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        try {
            ResponseEntity<String> exchange = restTemplate.exchange(url, HttpMethod.POST, request, String.class);
        } catch (Exception e) {
            log.error("Failed to send Brevo email");
        }

    }
}
