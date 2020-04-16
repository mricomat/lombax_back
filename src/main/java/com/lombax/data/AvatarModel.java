package com.lombax.data;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "avatars")
public class AvatarModel {

    private String id;
    private ObjectId imageId;
    private String userId;

    public AvatarModel() {

    }

    public AvatarModel(ObjectId imageId, String userId) {
        this.imageId = imageId;
        this.userId = userId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public ObjectId getImageId() {
        return imageId;
    }

    public void setImageId(ObjectId imageId) {
        this.imageId = imageId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
