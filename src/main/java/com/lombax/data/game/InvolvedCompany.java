package com.lombax.data.game;

public class InvolvedCompany {

    private CompanyModel company;
    private boolean developer;
    private boolean porting;
    private boolean publisher;
    private boolean supporting;

    public InvolvedCompany() {

    }

    public CompanyModel getCompany() {
        return company;
    }

    public void setCompany(CompanyModel company) {
        this.company = company;
    }

    public boolean isDeveloper() {
        return developer;
    }

    public void setDeveloper(boolean developer) {
        this.developer = developer;
    }

    public boolean isPorting() {
        return porting;
    }

    public void setPorting(boolean porting) {
        this.porting = porting;
    }

    public boolean isPublisher() {
        return publisher;
    }

    public void setPublisher(boolean publisher) {
        this.publisher = publisher;
    }

    public boolean isSupporting() {
        return supporting;
    }

    public void setSupporting(boolean supporting) {
        this.supporting = supporting;
    }
}
