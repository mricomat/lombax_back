package com.lombax.data.game;

import org.springframework.data.mongodb.core.mapping.Field;

public class VideoModel {

    @Field("id")
    private String id;
    private String name;
    @Field("video_id")
    private String videoId;

    public VideoModel() {

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

    public String getVideoId() {
        return videoId;
    }

    public void setVideoId(String videoId) {
        this.videoId = videoId;
    }
}
