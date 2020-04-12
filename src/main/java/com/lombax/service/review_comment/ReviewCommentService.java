package com.lombax.service.review_comment;

import com.lombax.data.ReviewComment;
import org.springframework.data.domain.PageImpl;

public interface ReviewCommentService {

    PageImpl<ReviewComment> getCommentsByReview(String reviewId, int page, int size);

    ReviewComment addReviewComment(ReviewComment reviewComment);

    boolean removeReviewComment(String commentId, String userId);


}
