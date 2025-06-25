package com.portal.offerLetter.reposiory;

import com.portal.offerLetter.entity.JobOffer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobOfferRepository  extends MongoRepository<JobOffer,String> {
    Optional<JobOffer> findByApplicantEmailAndJobId(String email, String jobId);
    void deleteByJobId(String jobId);
}
