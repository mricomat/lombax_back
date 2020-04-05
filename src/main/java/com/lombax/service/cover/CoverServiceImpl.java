package com.lombax.service.cover;

import com.lombax.data.game.CoverModel;
import com.lombax.exception.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CoverServiceImpl implements CoverService {

    private static final Logger logger = LoggerFactory.getLogger(CoverServiceImpl.class);

    private final MongoTemplate mongoTemplate;

    @Autowired
    public CoverServiceImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }


    @Override
    public CoverModel save(CoverModel cover) {
        cover.setId(UUID.randomUUID().toString());
        logger.info("Cover saved: " + cover.getId());
        return mongoTemplate.save(cover);
    }

    @Override
    public CoverModel update(String coverId, String key, Object value) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(coverId));
        Update update = new Update();
        update.set(key, value);

        CoverModel result = mongoTemplate.findAndModify(query, update, CoverModel.class);

        if (result == null) {
            throw new EntityNotFoundException(CoverModel.class, "id", coverId);
        }

        logger.info("Cover UPDATE: " + result.getId());

        return result;
    }
}
