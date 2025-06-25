package com.portal.offerLetter.controller;

import com.portal.offerLetter.dto.OfferLetterRequest;
import com.portal.offerLetter.entity.JobOffer;
import com.portal.offerLetter.service.JobOfferService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/job-offers")

public class OfferLetterController {
    private final JobOfferService jobOfferService;

    public OfferLetterController(JobOfferService jobOfferService) {
        this.jobOfferService = jobOfferService;
    }

    @PostMapping("/send")
    public ResponseEntity<JobOffer> sendOfferLetter(@RequestBody OfferLetterRequest request) {
        JobOffer offer = jobOfferService.createAndSendOffer(request);
        return ResponseEntity.ok(offer);
    }
}
