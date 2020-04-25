package com.lombax.service.review;

import com.lombax.data.ReviewLike;
import com.lombax.data.ReviewModel;
import com.lombax.data.UserModel;
import com.lombax.exception.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
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
        if (!mongoTemplate.exists(new Query(Criteria.where("id").is(review.getUserId())), UserModel.class)) {
            throw new EntityNotFoundException(UserModel.class, "id", review.getUserId());
        }

        review.setId(UUID.randomUUID().toString());

        Query query = new Query();
        query.addCriteria(Criteria.where("userId").is(review.getUserId()));

        if (mongoTemplate.count(query, ReviewModel.class) != 0) {
            Update update = new Update();
            update.set("like", review.isLike());
            update.set("last", false);
            ReviewModel reviewResult = mongoTemplate.findAndModify(query, update, ReviewModel.class);

            if (reviewResult != null) {
                // TODO Exception
            }
        }

        logger.info("Review saved: " + review.getId());
        return mongoTemplate.save(review);
    }

    // TODO Hacer un methodo que haga update de todas las keys de golpe
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

        if (mongoTemplate.exists(query, ReviewModel.class)) {
            throw new EntityNotFoundException(ReviewModel.class, "id", id);
        }

        mongoTemplate.remove(query, UserModel.class);
        return true;
    }

    @Override
    public PageImpl<ReviewModel> getDiaryByUser(String userId, int page, int size) {
        Query query = new Query();
        query.addCriteria(Criteria.where("userId").is(userId).and("logged").is(true));
        long count = mongoTemplate.count(query, ReviewModel.class);
        Pageable pageable = PageRequest.of(page, size);
        query.with(pageable);
        query.with(Sort.by(Sort.Direction.DESC, "createdAt"));

        List<ReviewModel> reviews = mongoTemplate.find(query, ReviewModel.class);

        return new PageImpl<>(reviews, pageable, count);
    }

    @Override
    public PageImpl<ReviewModel> getReviews(int page, int size) {
        Query query = new Query();
        long count = mongoTemplate.count(query, ReviewModel.class);
        Pageable pageable = PageRequest.of(page, size);
        query.with(pageable);
        ArrayList<Sort.Order> orders = new ArrayList<>();
        orders.add(new Sort.Order(Sort.Direction.DESC, "createdAt"));
        orders.add(new Sort.Order(Sort.Direction.DESC, "likesCount"));

        query.with(Sort.by(orders));

        List<ReviewModel> reviews = mongoTemplate.find(query, ReviewModel.class);

        return new PageImpl<>(reviews, pageable, count);
    }

    @Override
    public PageImpl<ReviewModel> getReviewByGame(String gameId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Query query = new Query();

        query.with(pageable);
        query.addCriteria(Criteria.where("gameId").is(gameId));

        long count = mongoTemplate.count(query, ReviewModel.class);
        List<ReviewModel> result = mongoTemplate.find(query, ReviewModel.class);

        logger.info("Review game find");

        return new PageImpl<>(result, pageable, count);
    }

    @Override
    public PageImpl<ReviewModel> getFriendsReviewByGame(String gameId, String userId, int page, int size) {
        Query query = new Query();
        Query userQuery = new Query();
        userQuery.addCriteria(Criteria.where("id").is(userId));
        UserModel user = mongoTemplate.findOne(userQuery, UserModel.class);
        if (user == null || !user.isValid()) {
            throw new EntityNotFoundException(UserModel.class, "user", user.getId());
        }

        if (Objects.requireNonNull(user).getFollowing().size() == 0) {
            throw new EntityNotFoundException(UserModel.class, "Following", user.getFollowing().toString());
        }

        query.addCriteria(Criteria.where("userId").in(user.getFollowing()).and("gameId").is(gameId));

        long count = mongoTemplate.count(query, ReviewModel.class);
        Pageable pageable = PageRequest.of(page, size);
        query.with(pageable);
        query.with(Sort.by(Sort.Direction.DESC, "createdAt"));

        List<ReviewModel> result = mongoTemplate.find(query, ReviewModel.class);

        return new PageImpl<>(result, pageable, count);
    }

    @Override
    public PageImpl<ReviewModel> getOwnReviewByGame(String gameId, String userId, int page, int size) {
        Query query = new Query();
        query.addCriteria(Criteria.where("userId").is(userId).and("gameId").is(gameId));

        long count = mongoTemplate.count(query, ReviewModel.class);
        Pageable pageable = PageRequest.of(page, size);
        query.with(pageable);
        query.with(Sort.by(Sort.Direction.DESC, "createdAt"));

        List<ReviewModel> result = mongoTemplate.find(query, ReviewModel.class);

        return new PageImpl<>(result, pageable, count);
    }

    @Override
    public PageImpl<ReviewModel> getLikedReviewsByGame(String gameId, int page, int size) {

        // TODO Reviews al que has dado like en un juego
        return null;
    }

    @Override
    public boolean addLikeReview(String reviewId, String userId) {
        // Check if user exists
        checkIfUserExists(userId);

        // check if review exists
        checkIfReviewExists(reviewId);

        ReviewLike result = mongoTemplate.save(new ReviewLike(UUID.randomUUID().toString(), userId, reviewId));

        if(result == null) {
            // TODO Throw exception
        }

        Query query = new Query();
        query.addCriteria(Criteria.where("reviewId").is(reviewId));
        Update update = new Update();
        update.inc("likesCount");
        ReviewModel review = mongoTemplate.findAndModify(query, update, ReviewModel.class);

        return review != null;
    }

    @Override
    public boolean removeLikeReview(String reviewId, String userId) {
        // Check if user exists
        checkIfUserExists(userId);

        // check if review exists
        checkIfReviewExists(reviewId);

        Query query = new Query(Criteria.where("userId").is(userId));

        ReviewLike result = mongoTemplate.findAndRemove(query, ReviewLike.class);

        if(result == null) {
            // TODO Throw exception
        }

        query = new Query();
        query.addCriteria(Criteria.where("reviewId").is(reviewId));
        Update update = new Update();
        Number number = -1;
        update.inc("likesCount", number);
        ReviewModel review = mongoTemplate.findAndModify(query, update, ReviewModel.class);

        return review != null;
    }

    void checkIfUserExists(String userId) {
        UserModel user = mongoTemplate.findOne(new Query(Criteria.where("id").is(userId)), UserModel.class);
        if (user == null || !user.isValid()) {
            throw new EntityNotFoundException(UserModel.class, "user", user.getId());
        }
    }

    void checkIfReviewExists(String reviewId) {
        ReviewModel review = mongoTemplate.findOne(new Query(Criteria.where("id").is(reviewId)), ReviewModel.class);
        if (review == null) {
            throw new EntityNotFoundException(UserModel.class, "user", review.getId());
        }
    }


}
