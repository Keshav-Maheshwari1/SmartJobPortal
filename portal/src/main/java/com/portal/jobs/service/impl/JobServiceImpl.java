package com.portal.jobs.service.impl;

import com.portal.Role;
import com.portal.appliedJobs.Status;
import com.portal.appliedJobs.entity.AppliedJobs;
import com.portal.appliedJobs.service.AppliedJobsService;
import com.portal.jobs.entities.Job;
import com.portal.jobs.repository.JobRepository;
import com.portal.jobs.service.JobService;
import com.portal.user.Entities.User;
import com.portal.user.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class JobServiceImpl implements JobService {

    @Autowired
    private JobRepository jobRepository;

    private final AppliedJobsService appliedJobsService;
    private final UserService userService;

    public JobServiceImpl(@Lazy AppliedJobsService appliedJobsService, @Lazy UserService userService) {
        this.appliedJobsService = appliedJobsService;
        this.userService = userService;
    }

    private boolean isNotHR(User user) {
        return user == null || user.getRole() != Role.HR;
    }
    private boolean isProfileComplete(User user) {
        return user.getGitHubUrl() != null &&
                user.getLinkedInUrl() != null &&
                user.getPanCard() != null &&
                user.getCompanyName() != null;
    }


    @Override
    public ResponseEntity<String> createJob(Job job, String email) {
        User user = userService.getUser(email).getBody();
        if(!isProfileComplete(user)){
            return ResponseEntity.status(400).body("Please complete your profile before proceeding.");
        }

        if (isNotHR(user)) {
            logAction("warn", "Unauthorized job creation attempt by: {}", email);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only HR can create jobs");
        }
        job.setHrName(user.getName());
        job.setCompanyName(user.getCompanyName());
        job.setEmail(email);
        job.setCreatedAt(LocalDateTime.now());
        job.setApplicantsCount(0);
        job.setInterviewMode("ON PLATFORM");
        job.setStatus("OPEN");

        jobRepository.save(job);
        logAction("info", "Job created successfully by: {}", email);
        return ResponseEntity.ok("Job Created Successfully");
    }
    public void increamentJobApplicant(String id){
        Optional<Job> exisitng = jobRepository.findById(id);
        if(exisitng.isEmpty()){
            return;
        }
        Job updated = exisitng.get();
        updated.setApplicantsCount(updated.getApplicantsCount()+1);
        jobRepository.save(updated);
    }
    public void decreamentedApplicantsCount(String id){
        Optional<Job> existing = jobRepository.findById(id);
        if(existing.isEmpty()){
            return;
        }
        Job updated = existing.get();
        updated.setApplicantsCount(updated.getApplicantsCount()-1);
        jobRepository.save(updated);
    }

    @Override
    public List<Job> getJobsByEmail(String email) {
        return jobRepository.findByEmail(email);
    }

    @Override
    public List<Job> getAllJobs() {
        logAction("info", "Fetching all jobs");
        return jobRepository.findAll();
    }

    @Override
    public ResponseEntity<Job> getJobById(String id) {
        return jobRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    logAction("error", "Job not found with ID: {}", id);
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
                });
    }

    @Override
    public ResponseEntity<Job> updateJob(String id, Job updatedJob, String email) {
        User user = userService.getUser(email).getBody();

        if (isNotHR(user)) {
            logAction("warn", "Unauthorized job update attempt by: {}", email);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Job existing = jobRepository.findById(id).orElse(null);
        if (existing == null) {
            logAction("error", "Job not found with ID: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        existing.setTitle(updatedJob.getTitle());
        existing.setDescription(updatedJob.getDescription());
        existing.setEligibility(updatedJob.getEligibility());
        existing.setDeadline(updatedJob.getDeadline());
        existing.setLocation(updatedJob.getLocation());
        existing.setSalary(updatedJob.getSalary());
        existing.setType(updatedJob.getType());
        existing.setExperienceLevel(updatedJob.getExperienceLevel());
        existing.setSkills(updatedJob.getSkills());
        existing.setIsRemote(updatedJob.getIsRemote());
        existing.setCategory(updatedJob.getCategory());
        existing.setTags(updatedJob.getTags());

        Job saved = jobRepository.save(existing);
        logAction("info", "Job with ID {} updated by {}", id, email);
        return ResponseEntity.ok(saved);
    }


    @Override
    public ResponseEntity<String> deleteJob(String id, String email) {
        User user = userService.getUser(email).getBody();

        if (isNotHR(user)) {
            logAction("warn", "Unauthorized job delete attempt by: {}", email);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only HR can delete jobs");
        }

        return jobRepository.findById(id)
                .map(existing -> {
                    if (!existing.getEmail().equals(email)) {
                        logAction("warn", "User {} not allowed to delete job owned by {}", email, existing.getEmail());
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized to delete this job");
                    }

                    ResponseEntity<String> deleteApplicationsResponse = appliedJobsService.deleteApplicationsByJobId(id);
                    if (!deleteApplicationsResponse.getStatusCode().is2xxSuccessful()) {
                        logAction("warn", "Failed to delete applications for job {}: {}", id, deleteApplicationsResponse.getBody());
                        return deleteApplicationsResponse;
                    }

                    jobRepository.deleteById(id);
                    logAction("info", "Job deleted by {}", email);
                    return ResponseEntity.ok("Job Deleted Successfully");
                })
                .orElseGet(() -> {
                    logAction("error", "Job not found with ID: {}", id);
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
                });
    }



    private void logAction(String level, String message, Object... args) {
        switch (level.toLowerCase()) {
            case "info" -> log.info(message, args);
            case "warn" -> log.warn(message, args);
            case "error" -> log.error(message, args);
            default -> log.debug(message, args);
        }
    }
}
