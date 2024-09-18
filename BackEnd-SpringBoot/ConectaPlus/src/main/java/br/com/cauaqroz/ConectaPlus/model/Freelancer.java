package br.com.cauaqroz.ConectaPlus.model;

import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Freelancer extends User {
    private String description;
    private String portfolio;
    private String education;
    private String areaOfExpertise;
    private int completedJobs = 0;
    private int onTimeDeliveries = 0;

    public Freelancer() {
        super();
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPortfolio() {
        return portfolio;
    }

    public void setPortfolio(String portfolio) {
        this.portfolio = portfolio;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public String getAreaOfExpertise() {
        return areaOfExpertise;
    }

    public void setAreaOfExpertise(String areaOfExpertise) {
        this.areaOfExpertise = areaOfExpertise;
    }

    public int getCompletedJobs() {
        return completedJobs;
    }

    public void setCompletedJobs(int completedJobs) {
        this.completedJobs = completedJobs;
    }

    public int getOnTimeDeliveries() {
        return onTimeDeliveries;
    }

    public void setOnTimeDeliveries(int onTimeDeliveries) {
        this.onTimeDeliveries = onTimeDeliveries;
    }

}