package com.lombax.service.game;

import com.lombax.data.game.GameModel;
import com.lombax.exception.EntityAlreadyExistsException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GameServiceImpl implements GameService {

    private static final Logger logger = LoggerFactory.getLogger(GameServiceImpl.class);

    private final MongoTemplate mongoTemplate;

    @Autowired
    public GameServiceImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public GameModel save(GameModel game) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(game.getId()));
        if (mongoTemplate.exists(query, GameModel.class)) {
            throw new EntityAlreadyExistsException(GameModel.class, "id", game.getId());
        }

        query = new Query();
        query.addCriteria(Criteria.where("name").is(game.getName()));
        if (mongoTemplate.exists(query, GameModel.class)) {
            throw new EntityAlreadyExistsException(GameModel.class, "name", game.getName());
        }

        logger.info("Game REGISTERED: " + game.getName());
        return mongoTemplate.save(game);
    }

    @Override
    public GameModel update(String gameId, String key, Object value) {
        return null;
    }

    @Override
    public boolean delete(String id) {
        return false;
    }

    @Override
    public PageImpl<GameModel> findAll(int page, int size) {
        Query query = new Query();
        long count = mongoTemplate.count(query, GameModel.class);
        //query.fields().exclude("_id");


        Pageable pageable = PageRequest.of(page, size);
        query.with(pageable);

        List<GameModel> result = mongoTemplate.find(query, GameModel.class);

        logger.info("Game find" +  mongoTemplate.find(query, GameModel.class));

        return new PageImpl<>(result, pageable, count);
    }

    @Override
    public PageImpl<GameModel> findAllById(String id, int page, int size) {
        return null;
    }
}
