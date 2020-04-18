package com.lombax.service.avatar;

import org.bson.types.ObjectId;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

public interface AvatarService {

    ObjectId uploadExample(String filePath, String name);

    ObjectId saveImage(MultipartFile image, String userId, String field);

    ObjectId saveCover(MultipartFile image, String userId);

    ObjectId save(MultipartFile image);

    ObjectId saveBackground(MultipartFile image, String userId);

    byte[] retrieveImage(String id);
}
