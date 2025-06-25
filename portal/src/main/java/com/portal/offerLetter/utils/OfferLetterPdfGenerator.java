package com.portal.offerLetter.utils;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import com.portal.offerLetter.entity.JobOffer;
import lombok.extern.slf4j.Slf4j;


import java.io.ByteArrayOutputStream;

@Slf4j
public class OfferLetterPdfGenerator {

    public static ByteArrayOutputStream generatePdf(JobOffer offer) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            Font header = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Font normal = FontFactory.getFont(FontFactory.HELVETICA, 12);

            document.add(new Paragraph("Job Offer Letter", header));
            document.add(new Paragraph("Date: " + offer.getOfferDate(), normal));
            document.add(new Paragraph("\nDear " + offer.getCandidateName() + ",\n", normal));

            document.add(new Paragraph("We are pleased to offer you the position of " + offer.getJobTitle()
                    + " at our " + offer.getJobLocation() + " office, starting from " + offer.getStartDate() + ".", normal));

            document.add(new Paragraph("\nDetails:", header));
            document.add(new Paragraph("Salary: " + offer.getBaseSalary()));
            document.add(new Paragraph("Benefits: " + offer.getBenefits()));
            document.add(new Paragraph("Employment Type: " + offer.getEmploymentType()));
            document.add(new Paragraph("Probation Period: " + offer.getProbationPeriod()));
            document.add(new Paragraph("Notice Period: " + offer.getNoticePeriod()));

            document.add(new Paragraph("\nPlease respond by: " + offer.getResponseDeadline()));

            document.add(new Paragraph("\nSincerely,\n" + offer.getReportingManager(), normal));
            document.close();
        } catch (Exception e) {
            log.error("Error{}", String.valueOf(e));
        }
        return out;
    }
}

