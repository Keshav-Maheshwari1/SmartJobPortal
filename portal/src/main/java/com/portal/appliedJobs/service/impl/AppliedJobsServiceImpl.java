package com.portal.appliedJobs.service.impl;

import com.portal.Role;
import com.portal.appliedJobs.Status;
import com.portal.appliedJobs.dto.ApplyJobRequest;
import com.portal.appliedJobs.entity.AppliedJobs;
import com.portal.appliedJobs.repository.AppliedJobRepository;
import com.portal.appliedJobs.service.AppliedJobsService;
import com.portal.appliedJobs.service.EmailService;
import com.portal.appliedJobs.service.ResumeService;
import com.portal.jobs.entities.Job;
import com.portal.jobs.service.JobService;

import com.portal.offerLetter.reposiory.JobOfferRepository;
import com.portal.user.Entities.User;
import com.portal.user.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class AppliedJobsServiceImpl implements AppliedJobsService {

    private final AppliedJobRepository appliedJobsRepository;
    private final ResumeService resumeService;
    private final EmailService emailService;
    private final JobService jobService;
    private final UserService userService;
    private final JobOfferRepository jobOfferRepository;


    public AppliedJobsServiceImpl(AppliedJobRepository appliedJobsRepository, ResumeService resumeService, EmailService emailService, JobService jobService, UserService userService, JobOfferRepository jobOfferRepository) {
        this.appliedJobsRepository = appliedJobsRepository;
        this.resumeService = resumeService;
        this.emailService = emailService;
        this.jobService = jobService;
        this.userService = userService;
        this.jobOfferRepository = jobOfferRepository;
    }


    private String extractGoogleDriveFileId(String url) {
        if (url == null || url.isEmpty()) return null;

        String fileId = null;
        Pattern pattern = Pattern.compile("(?<=/d/|id=)([a-zA-Z0-9_-]{10,})");
        Matcher matcher = pattern.matcher(url);
        if (matcher.find()) {
            fileId = matcher.group(1);
        }
        return fileId;
    }
    private boolean isProfileComplete(User user) {
        return user.getGitHubUrl() != null &&
                user.getLinkedInUrl() != null &&
                user.getPanCard() != null;
    }
    @Override
    public ResponseEntity<String> applyForJob(ApplyJobRequest request) {
        // Fetch job
        Job job = jobService.getJobById(request.getJobId()).getBody();
        if (job == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Job not found");
        }

        // Fetch user
        User user = userService.getUser(request.getApplicantEmail()).getBody();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        }

        // Profile-completeness guard
        if (!isProfileComplete(user)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Please complete your profile before proceeding.");
        }

        // HR cannot apply to their own job
        if (user.getRole() == Role.HR && job.getEmail().equals(request.getApplicantEmail())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("HRs cannot apply to their own job");
        }

        // Deadline check
        if (LocalDateTime.now().isAfter(job.getDeadline())) {
            jobService.deleteJob(request.getJobId(), job.getEmail());
            return ResponseEntity.badRequest()
                    .body("Job has expired");
        }

        // Duplicate / ban check
        Optional<AppliedJobs> existingOpt = appliedJobsRepository
                .findByApplicantEmailAndJobId(request.getApplicantEmail(), request.getJobId());
        if (existingOpt.isPresent()) {
            AppliedJobs existing = existingOpt.get();
            if (existing.getStatus() == Status.REJECTED
                    && existing.getBanExpiryDate() != null
                    && LocalDateTime.now().isBefore(existing.getBanExpiryDate())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Previously rejected. You can reapply after "
                                + existing.getBanExpiryDate().toLocalDate());
            }
            if (existing.getStatus() == Status.PENDING) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("You have already applied and it's under review.");
            }
        }

        try {
            // Validate and parse Drive URL
            String resumeUrl = request.getResumeUrl();
            String fileId = extractGoogleDriveFileId(resumeUrl);
            if (fileId == null) {
                return ResponseEntity.badRequest()
                        .body("Invalid Google Drive resume URL.");
            }
            String cleanedUrl = "https://drive.google.com/uc?export=download&id=" + fileId;

            // Resume screening
            String resumeText = resumeService.extractResumeText(cleanedUrl);
            double score = resumeService.calculateMatchScore(resumeText, job.getDescription());

            // Build application record
            AppliedJobs application = new AppliedJobs();
            application.setApplicantEmail(request.getApplicantEmail());
            application.setResumeUrl(resumeUrl);
            application.setPortfolioUrl(request.getPortfolioUrl());
            application.setExpectedSalary(request.getExpectedSalary());
            application.setNoticePeriod(request.getNoticePeriod());
            application.setCurrentLocation(request.getCurrentLocation());
            application.setExperienceLevel(request.getExperienceLevel());

            application.setPanCard(user.getPanCard());
            application.setGithubUrl(user.getGitHubUrl());
            application.setLinkedInUrl(user.getLinkedInUrl());

            application.setJobId(request.getJobId());
            application.setAppliedOn(LocalDateTime.now());

            String applicantName = user.getName();

            if (score >= 0.45) {
                emailService.sendHrEmail(
                        request.getApplicantEmail(), job, resumeUrl, job.getHrName()
                );
                application.setStatus(Status.REVIEWING);
            } else {
                emailService.sendRejectionEmail(
                        request.getApplicantEmail(), job, resumeUrl, applicantName
                );
                application.setStatus(Status.REJECTED);
                application.setBanExpiryDate(LocalDateTime.now().plusMonths(6));
                appliedJobsRepository.save(application);
                return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                        .body("Not eligible to apply for this job based on resume screening.");
            }

            // Increment applicant count & save
            jobService.increamentJobApplicant(request.getJobId());
            appliedJobsRepository.save(application);
            return ResponseEntity.ok("Application submitted successfully.");

        } catch (Exception e) {
            // Fallback: save as pending if something goes wrong
            AppliedJobs fallback = new AppliedJobs();
            fallback.setApplicantEmail(request.getApplicantEmail());
            fallback.setResumeUrl(request.getResumeUrl());
            fallback.setPortfolioUrl(request.getPortfolioUrl());
            fallback.setExpectedSalary(request.getExpectedSalary());
            fallback.setNoticePeriod(request.getNoticePeriod());
            fallback.setCurrentLocation(request.getCurrentLocation());
            fallback.setExperienceLevel(request.getExperienceLevel());

            fallback.setPanCard(user.getPanCard());
            fallback.setGithubUrl(user.getGitHubUrl());
            fallback.setLinkedInUrl(user.getLinkedInUrl());

            fallback.setJobId(request.getJobId());
            fallback.setAppliedOn(LocalDateTime.now());
            fallback.setStatus(Status.PENDING);

            appliedJobsRepository.save(fallback);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Application failed, saved as pending. Please try again later.");
        }
    }


    @Override
    public ResponseEntity<String> updateApplicationStatus(String applicantEmail, String jobId, String newStatus) {
        Status status;
        try {
            status = Status.valueOf(newStatus.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status: " + newStatus);
        }

        AppliedJobs existing = appliedJobsRepository.findByApplicantEmailAndJobId(applicantEmail, jobId)
                .orElse(null);
        if (existing == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Application not found");

        Job job = jobService.getJobById(jobId).getBody();
        if (job == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Job not found");

        User applicant = userService.getUser(applicantEmail).getBody();
        if (applicant == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");

        if (status == Status.REJECTED) {
            emailService.sendRejectionEmail(applicantEmail, job, existing.getResumeUrl(), applicant.getName());
            existing.setBanExpiryDate(LocalDateTime.now().plusMonths(6));
        }

        existing.setStatus(status);
        appliedJobsRepository.save(existing);
        return ResponseEntity.ok("Status updated to " + status);
    }
    @Override
    public ResponseEntity<String> deleteApplicationsByJobId(String jobId) {
        List<AppliedJobs> applications = appliedJobsRepository.findByJobId(jobId);
        boolean hasActiveApplications = applications.stream()
                .anyMatch(app -> app.getStatus() == Status.REVIEWING || app.getStatus() == Status.ACCEPTED);

        if (hasActiveApplications) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Cannot delete job with applications under review or accepted");
        }

        if (applications.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No applications found for this job");
        }
        appliedJobsRepository.deleteByJobId(jobId);
        return ResponseEntity.ok("All applications for job ID " + jobId + " deleted successfully.");
    }
    @Override
    public ResponseEntity<String> withDrawApplication(String id) {
        Optional<AppliedJobs> applicationOpt = appliedJobsRepository.findById(id);

        if (applicationOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Application not found");
        }

        AppliedJobs application = applicationOpt.get();

        if (application.getStatus() != Status.ACCEPTED) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only accepted applications can be withdrawn");
        }
        // Delete related offer letter if exists
        jobOfferRepository.findByApplicantEmailAndJobId(application.getApplicantEmail(), application.getJobId())
                .ifPresent(jobOfferRepository::delete);

        jobService.decreamentedApplicantsCount(application.getJobId());
        appliedJobsRepository.delete(application);

        jobService.decreamentedApplicantsCount(application.getJobId());
        appliedJobsRepository.delete(application);

        return ResponseEntity.ok("Application withdrawn successfully");
    }

    @Override
    public ResponseEntity<List<AppliedJobs>> getApplicantsForHr(String hrEmail) {
        List<Job> hrJobs = jobService.getJobsByEmail(hrEmail);
        if (hrJobs == null || hrJobs.isEmpty()) return ResponseEntity.ok(Collections.emptyList());

        List<AppliedJobs> reviewingApplicants = hrJobs.stream()
                .flatMap(job -> appliedJobsRepository.findByJobId(job.getId()).stream())
                .filter(applicant -> applicant.getStatus() == Status.REVIEWING)
                .collect(Collectors.toList());

        return ResponseEntity.ok(reviewingApplicants);
    }
    @Override
    public List<AppliedJobs> getAcceptedApplicantsByJobId(String jobId) {
        return appliedJobsRepository.findByJobIdAndStatus(jobId, Status.REVIEWING);
    }
    @Override
    public List<AppliedJobs> getAppliedJobsByApplicantEmail(String email) {
        return appliedJobsRepository.findByApplicantEmail(email);
    }
    @Override
    public ResponseEntity<String> sendRoomId(String hrEmail, String jobId, String applicantEmail, String roomId, String time) {
        Job job = jobService.getJobById(jobId).getBody();
        if (job == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Job not found");

        User applicant = userService.getUser(applicantEmail).getBody();
        if (applicant == null || applicant.getName() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Applicant not found");
        }

        return emailService.sendRoomEmail(hrEmail, job, applicantEmail, applicant.getName(), roomId, time);
    }
}
