package com.lombax.service.review;

import com.lombax.data.ReviewModel;
import org.springframework.data.domain.PageImpl;

import java.util.List;

public interface ReviewService {

    ReviewModel save(ReviewModel review);

    ReviewModel update(String reviewId, String key, Object value);

    boolean delete(String id);

    PageImpl<ReviewModel> getDiaryByUser(String userId, int page, int size);

    PageImpl<ReviewModel> getReviews(int page, int size);

    PageImpl<ReviewModel> getReviewByGame(String gameId, int page, int size);

    PageImpl<ReviewModel> getFriendsReviewByGame(String gameId, String userId, int page, int size);

    PageImpl<ReviewModel> getOwnReviewByGame(String gameId, String userId, int page, int size);

    PageImpl<ReviewModel> getLikedReviewsByGame(String gameId, int page, int size);

    boolean addLikeReview(String reviewId, String userId);

    boolean removeLikeReview(String reviewId, String userId);

}
