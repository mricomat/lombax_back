package com.lombax.controller;

import com.lombax.data.game.GameModel;
import com.lombax.service.avatar.AvatarService;
import com.lombax.service.game.GameService;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.GridFSBuckets;
import com.mongodb.client.gridfs.model.GridFSUploadOptions;
import org.apache.tomcat.util.http.fileupload.ByteArrayOutputStream;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.ArrayList;

@RestController
@RequestMapping("/avatar")
public class AvatarController {

    private static final Logger LOGGER = LoggerFactory.getLogger(AvatarController.class);

    @Autowired
    private AvatarService avatarService;

    @GetMapping(value = "/{id}")
    void getImage(HttpServletResponse response, @PathVariable String id) throws IOException {
        byte[] imageBytes = avatarService.retrieveImage(id);

        response.setHeader("Accept-ranges", "bytes");
        response.setContentType("image/jpeg");
        response.setContentLength(imageBytes.length);
        response.setHeader("Expires", "0");
        response.setHeader("Cache-Control", "must-revalidate, post-check=0, pre-check=0");
        response.setHeader("Content-Description", "File Transfer");
        response.setHeader("Content-Transfer-Encoding:", "binary");

        OutputStream out = response.getOutputStream();
        out.write(imageBytes);
        out.flush();
        out.close();
    }

    @PostMapping("/save/cover")
    ResponseEntity<?> saveImage(@RequestParam("image") MultipartFile image, @RequestParam("userId") String userId) throws IOException {
        ObjectId objectId = avatarService.saveCover(image, userId);
        return ResponseEntity.ok(objectId);
    }

    @PostMapping("/save/background")
    ResponseEntity<?> saveBackground(@RequestParam("image") MultipartFile image, @RequestParam("userId") String userId) throws IOException {
        ObjectId objectId = avatarService.saveBackground(image, userId);
        return ResponseEntity.ok(objectId);
    }
}
