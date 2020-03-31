package com.lombax.data;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.UUID;

@Document(collection = "users")
public class UserModel {

    @Id
    @NotNull
    private UUID id;

    @NotBlank
    private String name;

    @NotBlank
    private String userName;

    @NotBlank
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    private String coverId;

    @NotBlank
    private String backgroundId;

    @NotBlank
    private ArrayList interests = new ArrayList();
    private ArrayList favorites = new ArrayList();;
    private ArrayList activity = new ArrayList();;
    private ArrayList ratings = new ArrayList();;
    private int games;
    private int followers;
    private int following;
    private int likes;
    private int reviews;
    private int watchList;
    private int diary;


    public UserModel() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public ArrayList getInterests() {
        return interests;
    }

    public void setInterests(ArrayList interests) {
        this.interests = interests;
    }

    public ArrayList getFavorites() {
        return favorites;
    }

    public void setFavorites(ArrayList favorites) {
        this.favorites = favorites;
    }

    public ArrayList getActivity() {
        return activity;
    }

    public void setActivity(ArrayList activity) {
        this.activity = activity;
    }

    public ArrayList getRatings() {
        return ratings;
    }

    public void setRatings(ArrayList ratings) {
        this.ratings = ratings;
    }

    public int getGames() {
        return games;
    }

    public void setGames(int games) {
        this.games = games;
    }

    public int getFollowers() {
        return followers;
    }

    public void setFollowers(int followers) {
        this.followers = followers;
    }

    public int getFollowing() {
        return following;
    }

    public void setFollowing(int following) {
        this.following = following;
    }

    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }

    public int getReviews() {
        return reviews;
    }

    public void setReviews(int reviews) {
        this.reviews = reviews;
    }

    public int getWatchList() {
        return watchList;
    }

    public void setWatchList(int watchList) {
        this.watchList = watchList;
    }

    public int getDiary() {
        return diary;
    }

    public void setDiary(int diary) {
        this.diary = diary;
    }
}
