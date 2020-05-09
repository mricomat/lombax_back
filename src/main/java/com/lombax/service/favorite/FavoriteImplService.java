package com.lombax.service.favorite;

import com.lombax.data.FavoriteModel;
import com.lombax.data.UserModel;
import com.lombax.exception.EntityAlreadyExistsException;
import com.lombax.exception.EntityNotFoundException;
import com.lombax.service.auth.AuthServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class FavoriteImplService implements FavoriteService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final MongoTemplate mongoTemplate;

    @Autowired
    public FavoriteImplService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public FavoriteModel save(String userId, String gameId) {
        Query query = new Query();

        Query userQuery = new Query();
        userQuery.addCriteria(Criteria.where("id").is(userId));

        if (!mongoTemplate.exists(userQuery, UserModel.class)) {
            throw new EntityNotFoundException(UserModel.class, "user", userId);
        }

        query.addCriteria(
                new Criteria().andOperator(
                        Criteria.where("userId").is(userId),
                        Criteria.where("gameId").is(gameId)
                )
        );

        if (mongoTemplate.exists(query, FavoriteModel.class)) {
            throw new EntityAlreadyExistsException(FavoriteModel.class, "Favorite", gameId);
        }

        FavoriteModel favorite = new FavoriteModel(userId, gameId, new Date().getTime());
        return mongoTemplate.save(favorite, "favorites");
    }
}
