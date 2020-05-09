package com.lombax.data;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "favorites")
public class FavoriteModel {

    private String id;
    private String userId;
    private String gameId;
    private Long date;

    public FavoriteModel() {

    }

    public FavoriteModel(String userId, String gameId, Long date) {
        this.userId = userId;
        this.gameId = gameId;
        this.date = date;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getGameId() {
        return gameId;
    }

    public void setGameId(String gameId) {
        this.gameId = gameId;
    }

    public Long getDate() {
        return date;
    }

    public void setDate(Long date) {
        this.date = date;
    }
}
