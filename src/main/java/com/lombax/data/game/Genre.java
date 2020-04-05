package com.lombax.data.game;

import org.springframework.data.mongodb.core.mapping.Field;

public class Genre {

    @Field("id")
    private String id;
    private String name;
    private String slug;

    public Genre() {

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

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }
}
