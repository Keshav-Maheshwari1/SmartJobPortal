package com.portal.appliedJobs.controllers;

import com.portal.appliedJobs.dto.ApplyJobRequest;
import com.portal.appliedJobs.entity.AppliedJobs;
import com.portal.appliedJobs.service.AppliedJobsService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/applied-jobs")
@RequiredArgsConstructor
public class AppliedJobsController {

    private final AppliedJobsService appliedJobsService;

    // Endpoint for applying for a job
    @PostMapping("/apply")
    public ResponseEntity<String> applyForJob(@RequestBody ApplyJobRequest request) {
        return appliedJobsService.applyForJob(request);
    }


    // Endpoint for updating application status (e.g., ACCEPTED, REJECTED)
    @PutMapping("/update-status")
    public ResponseEntity<String> updateApplicationStatus(@RequestParam String applicantEmail,
                                                          @RequestParam String jobId,
                                                          @RequestParam String status) {
        return appliedJobsService.updateApplicationStatus(applicantEmail, jobId, status);
    }

    // Endpoint for HR to get all accepted applicants for a given jobId
    @GetMapping("/hr/job/{jobId}/accepted")
    public ResponseEntity<List<AppliedJobs>> getAcceptedApplicantsByJobId(@PathVariable String jobId) {
        List<AppliedJobs> acceptedApplicants = appliedJobsService.getAcceptedApplicantsByJobId(jobId);
        return ResponseEntity.ok(acceptedApplicants);
    }

    // Endpoint for getting applied jobs by applicant email
    @GetMapping("/user")
    public ResponseEntity<List<AppliedJobs>> getAppliedJobsByApplicantEmail(@RequestParam String email) {
        List<AppliedJobs> appliedJobs = appliedJobsService.getAppliedJobsByApplicantEmail(email);
        return ResponseEntity.ok(appliedJobs);
    }
    @GetMapping("/applicants/{hrEmail}")
    public ResponseEntity<List<AppliedJobs>> getApplicantsByHrEmail(@PathVariable String hrEmail) {
        return appliedJobsService.getApplicantsForHr(hrEmail);
    }
    @DeleteMapping("/withdraw")
    public ResponseEntity<String> withDrawApplication(@RequestParam String id){
        return appliedJobsService.withDrawApplication(id);
    }


    @PostMapping("/user")
    public ResponseEntity<String> sendRoomId(
            @RequestParam String hrEmail,
            @RequestParam String jobId,
            @RequestParam String applicantEmail,
            @RequestParam String roomId,
            @RequestParam String time) {
        Instant instant = Instant.parse(time);
        ZonedDateTime zonedDateTime = instant.atZone(ZoneId.of("Asia/Kolkata"));
        String formattedTime = zonedDateTime.format(DateTimeFormatter.ofPattern("dd MMMM yyyy, hh:mm a"));
        return appliedJobsService.sendRoomId(hrEmail,jobId,applicantEmail,roomId,formattedTime);
    }
}
