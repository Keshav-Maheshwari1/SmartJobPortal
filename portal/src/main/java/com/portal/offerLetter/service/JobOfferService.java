package com.portal.offerLetter.service;

import com.portal.offerLetter.dto.OfferLetterRequest;
import com.portal.offerLetter.entity.JobOffer;

public interface JobOfferService {
    JobOffer createAndSendOffer(OfferLetterRequest request);
}
