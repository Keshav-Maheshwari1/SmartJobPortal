package com.portal.offerLetter.service.impl;

import com.portal.appliedJobs.entity.AppliedJobs;
import com.portal.appliedJobs.repository.AppliedJobRepository;
import com.portal.appliedJobs.service.EmailService;
import com.portal.jobs.entities.Job;
import com.portal.jobs.service.JobService;
import com.portal.offerLetter.dto.OfferLetterRequest;
import com.portal.offerLetter.entity.JobOffer;
import com.portal.offerLetter.reposiory.JobOfferRepository;
import com.portal.offerLetter.service.JobOfferService;
import com.portal.offerLetter.utils.OfferLetterPdfGenerator;
import com.portal.user.Entities.User;
import com.portal.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class JobOfferServiceImpl implements JobOfferService {

    private final UserService userService;
    private final JobService jobService;
    private final AppliedJobRepository appliedJobRepository;
    private final JobOfferRepository jobOfferRepository;
    private final EmailService brevoEmailService;

    public JobOffer createAndSendOffer(OfferLetterRequest request) {
        User user = userService.getUser(request.getApplicantEmail()).getBody();
        Job job = jobService.getJobById(request.getJobId()).getBody();
        AppliedJobs applied = appliedJobRepository
                .findByApplicantEmailAndJobId(request.getApplicantEmail(), request.getJobId())
                .orElseThrow(() -> new RuntimeException("Application not found"));

        String startDate = LocalDateTime.now().plusMonths(3)
                .withDayOfMonth(1)
                .format(DateTimeFormatter.ofPattern("dd MMMM yyyy"));

        String responseDeadline = LocalDateTime.now().plusDays(
                        request.getNoticePeriod() == null || request.getNoticePeriod().isEmpty()
                                ? 15
                                : Integer.parseInt(request.getNoticePeriod()))
                .format(DateTimeFormatter.ofPattern("dd MMMM yyyy"));

        assert user != null;
        assert job != null;
        JobOffer offer = JobOffer.builder()
                .applicantEmail(applied.getApplicantEmail())
                .jobId(applied.getJobId())
                .candidateName(user.getName())
                .jobTitle(job.getTitle())
                .jobLocation(job.getLocation())
                .reportingManager(job.getHrName())
                .companyName(job.getCompanyName())
                .startDate(startDate)
                .responseDeadline(responseDeadline)

                .offerDate(request.getOfferDate())
                .baseSalary(request.getSalary()+"LPA")
                .bonus(request.getBonus())
                .benefits(request.getBenefits())
                .employmentType(request.getEmploymentType())
                .noticePeriod(request.getNoticePeriod())
                .probationPeriod(request.getProbationPeriod())

                .status("SENT")
                .createdAt(LocalDateTime.now())
                .build();

        jobOfferRepository.save(offer);

        ByteArrayOutputStream pdf = OfferLetterPdfGenerator.generatePdf(offer);

        brevoEmailService.sendOfferLetterEmail(
                user.getEmail(),
                user.getName(),
                job.getTitle(),
                startDate,
                request.getSalary(),
                request.getBenefits(),
                responseDeadline,
                job.getHrName(),
                job.getCompanyName(),
                pdf.toByteArray(),
                "Offer_Letter.pdf"
        );

        return offer;
    }
}
