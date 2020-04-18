package com.lombax.service.avatar;

import com.lombax.data.AvatarModel;
import com.lombax.data.UserModel;
import com.lombax.exception.EntityNotFoundException;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.GridFSBuckets;
import com.mongodb.client.gridfs.model.GridFSFile;
import com.mongodb.client.gridfs.model.GridFSUploadOptions;
import com.mongodb.client.model.Filters;
import org.apache.tomcat.util.http.fileupload.ByteArrayOutputStream;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;

@Service
public class AvatarServiceImpl implements AvatarService {

    private static final Logger logger = LoggerFactory.getLogger(AvatarServiceImpl.class);

    private final MongoTemplate mongoTemplate;

    @Autowired
    public AvatarServiceImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public ObjectId uploadExample(String filePath, String name) {
        ObjectId fileId = null;

        MongoDatabase avatarDB = mongoTemplate.getMongoDbFactory().getDb("lombax_avatars");
        GridFSBucket gridBucket = GridFSBuckets.create(avatarDB);

        try {
            InputStream inStream = new FileInputStream(new File(filePath));

            GridFSUploadOptions uploadOptions = new GridFSUploadOptions().metadata(new Document("type", "image").append("content_type", "image/jpg"));
            fileId = gridBucket.uploadFromStream(name, inStream, uploadOptions);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        return fileId;
    }

    @Override
    public ObjectId saveImage(MultipartFile image, String userId, String field) {
        checkIfUserExists(userId);

        ObjectId fileId = null;

        MongoDatabase avatarDB = mongoTemplate.getMongoDbFactory().getDb("lombax_avatars");
        GridFSBucket gridBucket = GridFSBuckets.create(avatarDB);

        try {
            InputStream inStream = image.getInputStream();

            GridFSUploadOptions uploadOptions = new GridFSUploadOptions().metadata(new Document("type", "image").append("content_type", "image/jpg"));
            fileId = gridBucket.uploadFromStream(image.getName(), inStream, uploadOptions);
        } catch (IOException e) {
            e.printStackTrace();
        }

        if (fileId != null) {
            AvatarModel avatar = new AvatarModel(fileId, userId);
            mongoTemplate.save(avatar, "avatars");
            Update update = new Update();
            update.set(field, fileId.toString());

            mongoTemplate.findAndModify(new Query(Criteria.where("id").is(userId)), update, UserModel.class);

        }

        return fileId;
    }

    @Override
    public ObjectId saveCover(MultipartFile image, String userId) {
        return saveImage(image, userId, "coverId");
    }

    @Override
    public ObjectId save(MultipartFile image) {

        ObjectId fileId = null;

        MongoDatabase avatarDB = mongoTemplate.getMongoDbFactory().getDb("lombax_avatars");
        GridFSBucket gridBucket = GridFSBuckets.create(avatarDB);

        try {
            InputStream inStream = image.getInputStream();

            GridFSUploadOptions uploadOptions = new GridFSUploadOptions().metadata(new Document("type", "image").append("content_type", "image/jpg"));
            fileId = gridBucket.uploadFromStream(image.getName(), inStream, uploadOptions);
        } catch (IOException e) {
            e.printStackTrace();
        }

        if (fileId != null) {
            AvatarModel avatar = new AvatarModel(fileId, "");
            mongoTemplate.save(avatar, "avatars");
        }

        return fileId;
    }

    @Override
    public ObjectId saveBackground(MultipartFile image, String userId) {
        return saveImage(image, userId, "backgroundId");
    }

    @Override
    public byte[] retrieveImage(String id) {
        MongoDatabase avatarDB = mongoTemplate.getMongoDbFactory().getDb("lombax_avatars");
        GridFSBucket gridBucket = GridFSBuckets.create(avatarDB);

        GridFSFile gridFSFile = gridBucket.find(Filters.eq(new ObjectId(id))).first();
        GridFsResource gridFsResource = new GridFsResource(gridFSFile, GridFSBuckets.create(avatarDB).openDownloadStream(gridFSFile.getObjectId()));
        try {
            InputStream is = gridFsResource.getInputStream();

            Image image = ImageIO.read(is);

            BufferedImage bi = this.createResizedCopy(image, image.getWidth(null), image.getHeight(null), true);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(bi, "png", baos);

            return baos.toByteArray();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }

    BufferedImage createResizedCopy(Image originalImage, int scaledWidth, int scaledHeight, boolean preserveAlpha) {
        int imageType = preserveAlpha ? BufferedImage.TYPE_INT_RGB : BufferedImage.TYPE_INT_ARGB;
        BufferedImage scaledBI = new BufferedImage(scaledWidth, scaledHeight, imageType);
        Graphics2D g = scaledBI.createGraphics();
        if (preserveAlpha) {
            g.setComposite(AlphaComposite.Src);
        }
        g.drawImage(originalImage, 0, 0, scaledWidth, scaledHeight, null);
        g.dispose();
        return scaledBI;
    }

    void checkIfUserExists(String userId) {
        UserModel user = mongoTemplate.findOne(new Query(Criteria.where("id").is(userId)), UserModel.class);
        if (user == null || !user.isValid()) {
            throw new EntityNotFoundException(UserModel.class, "user", user.getId());
        }
    }

}
