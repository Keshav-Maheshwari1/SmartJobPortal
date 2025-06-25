package com.portal.appliedJobs.service;

import com.portal.appliedJobs.dto.ApplyJobRequest;
import com.portal.appliedJobs.entity.AppliedJobs;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface AppliedJobsService {

    ResponseEntity<String> applyForJob(ApplyJobRequest request);

    ResponseEntity<String> updateApplicationStatus(String applicantEmail, String jobId, String newStatus);

    ResponseEntity<String> deleteApplicationsByJobId(String jobId);

    ResponseEntity<String> withDrawApplication(String id);

    ResponseEntity<List<AppliedJobs>> getApplicantsForHr(String hrEmail);

    List<AppliedJobs> getAcceptedApplicantsByJobId(String jobId);

    List<AppliedJobs> getAppliedJobsByApplicantEmail(String email);

    ResponseEntity<String> sendRoomId(String hrEmail, String jobId, String applicantEmail, String roomId, String time);
}
