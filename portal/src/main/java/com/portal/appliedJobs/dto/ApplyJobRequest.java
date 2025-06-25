package com.portal.appliedJobs.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ApplyJobRequest {
    private String applicantEmail;
    private String resumeUrl;
    private String portfolioUrl;
    private String expectedSalary;
    private String noticePeriod;
    private String currentLocation;
    private String experienceLevel;
    private String jobId;
}
