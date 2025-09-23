package com.portal.appliedJobs.service.impl;

import com.portal.appliedJobs.service.ResumeService;
import com.portal.jobs.entities.Job;
import org.apache.commons.text.similarity.JaroWinklerSimilarity;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URL;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ResumeServiceImpl implements ResumeService {

    private final JaroWinklerSimilarity similarity = new JaroWinklerSimilarity();

    @Override

    public String extractResumeText(String resumeUrl) throws IOException {
        InputStream inputStream = null;
        try {

            URL url = URI.create(resumeUrl).toURL();
            inputStream = url.openStream();

            PDDocument document = PDDocument.load(inputStream);
            PDFTextStripper pdfTextStripper = new PDFTextStripper();
            String text = pdfTextStripper.getText(document);
            document.close();

            return text;
        } catch (IOException e) {
            System.err.println("IOException occurred while processing the PDF from the URL: " + resumeUrl);
            return "Error Processing Resume";
        } catch (Exception e) {
            throw e;
        } finally {
            if (inputStream != null) {
                try {
                    inputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }



    @Override
    public double calculateMatchScore(String resumeText, Job job) {
        String preprocessedResume = preprocessText(resumeText);
        String preprocessedJobDesc = preprocessText(job.getDescription());
        String preprocessedJobSkills = preprocessText(String.valueOf(job.getSkills()));

        double baseSim = similarity.apply(preprocessedResume, preprocessedJobDesc + " " + preprocessedJobSkills);

        Set<String> resumeTokens = new HashSet<>(Arrays.asList(preprocessedResume.split("\\s+")));
        Set<String> jobSkillTokens = new HashSet<>(Arrays.asList(preprocessedJobSkills.split("\\s+")));

        int matchedSkills = 0;
        for (String skill : jobSkillTokens) {
            if (resumeTokens.contains(skill)) matchedSkills++;
        }

        double skillScore = (double) matchedSkills / jobSkillTokens.size();


        return 0.6 * baseSim + 0.4 * skillScore;
    }

    private String preprocessText(String text) {
        text = text.replaceAll("[^a-zA-Z0-9\\s]", "");
        text = text.toLowerCase();
        text = removeStopWords(text);
        return text;
    }

    private String removeStopWords(String text) {
        List<String> stopWords = Arrays.asList("the", "and", "is", "in", "to", "for", "of", "a", "an", "with");
        String[] words = text.split("\\s+");
        StringBuilder result = new StringBuilder();

        for (String word : words) {
            if (!stopWords.contains(word)) {
                result.append(word).append(" ");
            }
        }

        return result.toString().trim();
    }

}
