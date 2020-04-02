package com.lombax.service.review;

import com.lombax.data.ReviewModel;
import org.springframework.data.domain.PageImpl;

import java.util.List;

public interface ReviewService {

    ReviewModel save(ReviewModel review);

    ReviewModel update(String reviewId, String key, Object value);

    boolean delete(String id);

    PageImpl<ReviewModel> findAll(int page, int size);

    PageImpl<ReviewModel> findAllByGame(String gameId, int page, int size);

}
