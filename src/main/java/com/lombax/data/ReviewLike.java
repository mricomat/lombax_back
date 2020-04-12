package com.lombax.data;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "reviews_likes")
public class ReviewLike {

    private String id;
    private String userId;
    private String reviewId;

    public ReviewLike() {

    }

    public ReviewLike(String id, String userId, String reviewId) {
        this.id = id;
        this.userId = userId;
        this.reviewId = reviewId;
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

    public String getReviewId() {
        return reviewId;
    }

    public void setReviewId(String reviewId) {
        this.reviewId = reviewId;
    }
}
