package com.portal.offerLetter.dto;
import lombok.*;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OfferLetterRequest {
    private String applicantEmail;
    private String jobId;
    private String salary;
    private String offerDate;
    private String bonus;
    private String benefits;
    private String employmentType;
    private String noticePeriod;
    private String probationPeriod;
}
