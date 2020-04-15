package com.lombax.data;

import java.util.ArrayList;

public class AuthResponse {

    private String accessToken;
    private String tokenType = "Bearer";
    private String userId;
    private String username;
    private String email;

    private String coverId;
    private String backgroundId;

    private ArrayList<String> interests = new ArrayList<>();
    private ArrayList<String> favorites = new ArrayList<>();
    private ArrayList<String> followers = new ArrayList<>();
    private ArrayList<String> following = new ArrayList<>();
    private ArrayList<String> ratings = new ArrayList<>();
    private ArrayList<String> watchList = new ArrayList<>();


    private int gamesPlayed;
    private int gamesPlaying;
    private int reviews;
    private int diary;

    public AuthResponse(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCoverId() {
        return coverId;
    }

    public void setCoverId(String coverId) {
        this.coverId = coverId;
    }

    public String getBackgroundId() {
        return backgroundId;
    }

    public void setBackgroundId(String backgroundId) {
        this.backgroundId = backgroundId;
    }

    public ArrayList<String> getInterests() {
        return interests;
    }

    public void setInterests(ArrayList<String> interests) {
        this.interests = interests;
    }

    public ArrayList<String> getFavorites() {
        return favorites;
    }

    public void setFavorites(ArrayList<String> favorites) {
        this.favorites = favorites;
    }

    public ArrayList<String> getFollowers() {
        return followers;
    }

    public void setFollowers(ArrayList<String> followers) {
        this.followers = followers;
    }

    public ArrayList<String> getFollowing() {
        return following;
    }

    public void setFollowing(ArrayList<String> following) {
        this.following = following;
    }

    public ArrayList<String> getRatings() {
        return ratings;
    }

    public void setRatings(ArrayList<String> ratings) {
        this.ratings = ratings;
    }

    public int getGamesPlayed() {
        return gamesPlayed;
    }

    public void setGamesPlayed(int gamesPlayed) {
        this.gamesPlayed = gamesPlayed;
    }

    public int getGamesPlaying() {
        return gamesPlaying;
    }

    public void setGamesPlaying(int gamesPlaying) {
        this.gamesPlaying = gamesPlaying;
    }

    public int getReviews() {
        return reviews;
    }

    public void setReviews(int reviews) {
        this.reviews = reviews;
    }

    public ArrayList<String> getWatchList() {
        return watchList;
    }

    public void setWatchList(ArrayList<String> watchList) {
        this.watchList = watchList;
    }

    public int getDiary() {
        return diary;
    }

    public void setDiary(int diary) {
        this.diary = diary;
    }
}
