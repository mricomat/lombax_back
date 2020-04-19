package com.lombax.data;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotBlank;
import java.util.ArrayList;

@Document(collection = "users")
public class UserModel {

    @Id
    private String id;

    @NotBlank
    private String name;

    @NotBlank
    private String username;

    @NotBlank
    private String email;

    @NotBlank
    private String password;

    private String coverId;

    private String backgroundId;

    private ArrayList<String> interests = new ArrayList<>();
    private ArrayList<String> favorites = new ArrayList<>();
    private ArrayList<String> ratings = new ArrayList<>();
    private ArrayList<String> followers = new ArrayList<>();
    private ArrayList<String> following = new ArrayList<>();
    private ArrayList<String> watchList = new ArrayList<>();

    public UserModel() {
    }

    public UserModel(@NotBlank String name, @NotBlank String username, @NotBlank String email, @NotBlank String password, ArrayList<String> interests) {
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password;
        this.interests = interests;
    }

    public UserModel(@NotBlank String username, @NotBlank String email, @NotBlank String password, ArrayList<String> interests) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.interests = interests;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public ArrayList<String> getRatings() {
        return ratings;
    }

    public void setRatings(ArrayList<String> ratings) {
        this.ratings = ratings;
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


    public ArrayList<String> getWatchList() {
        return watchList;
    }

    public void setWatchList(ArrayList<String> watchList) {
        this.watchList = watchList;
    }

    public boolean isValid() {
        return id != null && username != null && name != null;
    }
}
