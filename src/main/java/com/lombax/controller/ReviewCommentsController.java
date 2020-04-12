package com.lombax.controller;

import com.lombax.data.ReviewComment;
import com.lombax.service.review_comment.ReviewCommentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.util.UriComponents;

@RestController
@RequestMapping("/reviews/comments")
public class ReviewCommentsController {

    private static final Logger LOGGER = LoggerFactory.getLogger(ReviewCommentsController.class);

    @Autowired
    private ReviewCommentService reviewCommentService;

    @RequestMapping(method = RequestMethod.POST, value = "/register", produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<?> addReviewComment(@RequestBody ReviewComment reviewComment) {
        ReviewComment review = reviewCommentService.addReviewComment(reviewComment);
        final UriComponents uriComponents = ServletUriComponentsBuilder
                .fromCurrentServletMapping().path("/reviews/comments/{id}").buildAndExpand(review.getId());
        return ResponseEntity.created(uriComponents.toUri()).body(review);
    }

    // TODO checkear si es un usuario con permisos
    @RequestMapping(method = RequestMethod.POST, value = "/delete", produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<?> deleteCommentReview(@RequestParam String id, @RequestParam String userId) {
        boolean result = reviewCommentService.removeReviewComment(id, userId);
        return ResponseEntity.ok(result);
    }

    @GetMapping(value = "/{reviewId}")
    ResponseEntity<?> getFriendsGameReview(@PathVariable String reviewId, @RequestParam(value = "page", defaultValue = "0") int page,
                                           @RequestParam(value = "size", defaultValue = "15") int size) {
        PageImpl<ReviewComment> result = reviewCommentService.getCommentsByReview(reviewId, page, size);
        return ResponseEntity.ok(result);
    }

}
