package com.lombax.data;

import java.util.ArrayList;
import java.util.List;

public class SectionModel {

    private String title;
    private List<?> games = new ArrayList<>();
    private String type;

    public SectionModel() {

    }

    public SectionModel(String title, List<?> games, String type) {
        this.title = title;
        this.games = games;
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<?> getGames() {
        return games;
    }

    public void setGames(List<?> games) {
        this.games = games;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
