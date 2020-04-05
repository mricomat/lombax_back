package com.lombax.data.game;

import org.springframework.data.mongodb.core.mapping.Field;

import java.util.ArrayList;

public class CompanyModel {

    @Field("id")
    private String id;
    private int country; // ISO 3166-1 country code
    private String description;

    @Field("developed")
    private ArrayList<String> developedGames = new ArrayList<>();

    @Field("published")
    private ArrayList<String> publishedGames = new ArrayList<>();
    private CompanyLogoModel logo;
    private String name;
    private String parent;
    private String slug;

    @Field("start_date")
    private Long startDate;
    private String url;
    //Websites

    public CompanyModel() {

    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getCountry() {
        return country;
    }

    public void setCountry(int country) {
        this.country = country;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ArrayList<String> getDevelopedGames() {
        return developedGames;
    }

    public void setDevelopedGames(ArrayList<String> developedGames) {
        this.developedGames = developedGames;
    }

    public ArrayList<String> getPublishedGames() {
        return publishedGames;
    }

    public void setPublishedGames(ArrayList<String> publishedGames) {
        this.publishedGames = publishedGames;
    }

    public CompanyLogoModel getLogo() {
        return logo;
    }

    public void setLogo(CompanyLogoModel logo) {
        this.logo = logo;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getParent() {
        return parent;
    }

    public void setParent(String parent) {
        this.parent = parent;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public Long getStartDate() {
        return startDate;
    }

    public void setStartDate(Long startDate) {
        this.startDate = startDate;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
