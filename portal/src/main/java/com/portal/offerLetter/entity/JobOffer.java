package com.portal.offerLetter.entity;// --- Entity: JobOffer.java ---


import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.UUID;

@Document(collection = "offer_letter")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobOffer {

    @Id
    private String id;

    private String applicantEmail;
    private String jobId;

    // Auto-filled from Job/User/AppliedJob
    private String candidateName;
    private String jobTitle;
    private String jobLocation;
    private String reportingManager;
    private String companyName;
    private String startDate;
    private String responseDeadline;

    // From Frontend
    private String offerDate;
    private String baseSalary;
    private String bonus;
    private String benefits;
    private String employmentType;
    private String noticePeriod;
    private String probationPeriod;

    private String status; // SENT, ACCEPTED, etc.
    private LocalDateTime createdAt;
}
