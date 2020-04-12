package com.lombax.service.review_comment;

import com.lombax.data.ReviewComment;
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
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ReviewCommentServiceImpl implements ReviewCommentService {

    private static final Logger logger = LoggerFactory.getLogger(ReviewCommentServiceImpl.class);

    private final MongoTemplate mongoTemplate;

    @Autowired
    public ReviewCommentServiceImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public PageImpl<ReviewComment> getCommentsByReview(String reviewId, int page, int size) {
        checkIfReviewExists(reviewId);

        Query query = new Query();
        query.addCriteria(Criteria.where("reviewId").is(reviewId));

        long count = mongoTemplate.count(query, ReviewModel.class);
        Pageable pageable = PageRequest.of(page, size);
        query.with(pageable);
        query.with(Sort.by(Sort.Direction.DESC, "date"));

        List<ReviewComment> result = mongoTemplate.find(query, ReviewComment.class);

        return new PageImpl<>(result, pageable, count);
    }

    @Override
    public ReviewComment addReviewComment(ReviewComment reviewComment) {
        checkIfReviewExists(reviewComment.getReviewId());

        // TODO check auth user
        checkIfUserExists(reviewComment.getUserId());

        reviewComment.setId(UUID.randomUUID().toString());

        return mongoTemplate.save(reviewComment, "reviews_comments");
    }

    @Override
    public boolean removeReviewComment(String commentId, String userId) {
        ReviewComment review = mongoTemplate.findOne(new Query(Criteria.where("id").is(commentId)), ReviewComment.class);
        if (review == null) {
            throw new EntityNotFoundException(UserModel.class, "user", review.getId());
        }

        checkIfUserExists(userId);

        // TODO check auth user

        ReviewComment reviewComment = mongoTemplate.findAndRemove(new Query(Criteria.where("id").is(commentId)), ReviewComment.class);

        return reviewComment != null;
    }

    void checkIfReviewExists(String reviewId) {
        ReviewModel review = mongoTemplate.findOne(new Query(Criteria.where("id").is(reviewId)), ReviewModel.class);
        if (review == null) {
            throw new EntityNotFoundException(UserModel.class, "user", review.getId());
        }
    }

    void checkIfUserExists(String userId) {
        UserModel user = mongoTemplate.findOne(new Query(Criteria.where("id").is(userId)), UserModel.class);
        if (user == null || !user.isValid()) {
            throw new EntityNotFoundException(UserModel.class, "user", user.getId());
        }
    }
}
