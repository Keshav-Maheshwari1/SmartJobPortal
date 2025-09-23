package com.portal.appliedJobs.service;

import com.portal.jobs.entities.Job;

import java.io.IOException;

public interface ResumeService {
    String extractResumeText(String resumeUrl) throws IOException;
    double calculateMatchScore(String resumeText, Job job);
}
