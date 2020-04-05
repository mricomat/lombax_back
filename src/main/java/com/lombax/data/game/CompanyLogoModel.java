package com.lombax.data.game;

import org.springframework.data.mongodb.core.mapping.Field;

public class CompanyLogoModel {

    private boolean animated;
    private int height;
    private int width;

    @Field("image_id")
    private String imageId;

    private String url;

    public CompanyLogoModel() {

    }

    public boolean isAnimated() {
        return animated;
    }

    public void setAnimated(boolean animated) {
        this.animated = animated;
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

    public String getImageId() {
        return imageId;
    }

    public void setImageId(String imageId) {
        this.imageId = imageId;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
