package com.portal.jobs.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class Job {
    @Id
    private String id;
    private String hrName;
    private String title;
    private String description;
    private String eligibility;
    private String category;
    private String type;
    private String location;
    private String companyName;
    private String experienceLevel;
    private List<String> skills;
    private boolean isRemote;
    private String interviewMode;
    private String salary;
    private LocalDateTime deadline;
    private LocalDateTime createdAt;
    private String email;
    private String status;
    private List<String> tags;
    private int applicantsCount;

    public boolean getIsRemote() {
        return this.isRemote;
    }
    public void setIsRemote(boolean isRemote){
        this.isRemote = isRemote;
    }
}

