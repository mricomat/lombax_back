package com.lombax.data;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "covers")
public class CoverModel {

    private String id;
    private String image_id;
    private String gameId;
    private boolean alpha_channel;
    private boolean animated;
    private int height;
    private int width;
    private String url;

    public CoverModel() {

    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public boolean isAlpha_channel() {
        return alpha_channel;
    }

    public void setAlpha_channel(boolean alpha_channel) {
        this.alpha_channel = alpha_channel;
    }

    public boolean isAnimated() {
        return animated;
    }

    public void setAnimated(boolean animated) {
        this.animated = animated;
    }

    public String getGameId() {
        return gameId;
    }

    public void setGameId(String gameId) {
        this.gameId = gameId;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public String getImage_id() {
        return image_id;
    }

    public void setImage_id(String image_id) {
        this.image_id = image_id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
