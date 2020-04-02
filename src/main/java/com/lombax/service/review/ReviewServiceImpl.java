package com.lombax.service.review;

import com.lombax.data.ReviewModel;
import com.lombax.data.UserModel;
import com.lombax.exception.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ReviewServiceImpl implements ReviewService {

    private static final Logger logger = LoggerFactory.getLogger(ReviewServiceImpl.class);

    private final MongoTemplate mongoTemplate;

    @Autowired
    public ReviewServiceImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public ReviewModel save(ReviewModel review) {
        review.setId(UUID.randomUUID().toString());
        logger.info("Review saved: " + review.getId());
        return mongoTemplate.save(review);
    }

    @Override
    public ReviewModel update(String reviewId, String key, Object value) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(reviewId));
        Update update = new Update();
        update.set(key, value);

        ReviewModel result = mongoTemplate.findAndModify(query, update, ReviewModel.class);

        if (result == null) {
            throw new EntityNotFoundException(ReviewModel.class, "id", reviewId);
        }

        logger.info("Review UPDATE: " + result.getId());

        return result;
    }

    @Override
    public boolean delete(String id) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(id));
        mongoTemplate.remove(query, UserModel.class);
        return true;
    }

    @Override
    public PageImpl<ReviewModel> findAll(int page, int size) {
        Query query = new Query();
        long count = mongoTemplate.count(query, ReviewModel.class);

        Pageable pageable = PageRequest.of(page, size);
        query.with(pageable);

        List<ReviewModel> result = mongoTemplate.find(query, ReviewModel.class);

        logger.info("Review find");

        return new PageImpl<>(result, pageable, count);
    }

    @Override
    public PageImpl<ReviewModel> findAllByGame(String gameId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Query query = new Query();

        query.with(pageable);
        query.addCriteria(Criteria.where("gameId").is(gameId));

        long count = mongoTemplate.count(query, ReviewModel.class);
        List<ReviewModel> result = mongoTemplate.find(query, ReviewModel.class);

        logger.info("Review game find");

        return new PageImpl<>(result, pageable, count);
    }

}
