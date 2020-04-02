package com.lombax.controller;

import com.lombax.data.CoverModel;
import com.lombax.data.ReviewModel;
import com.lombax.service.review.ReviewService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.util.UriComponents;

import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    private static final Logger LOGGER = LoggerFactory.getLogger(com.lombax.controller.ReviewController.class);

    @Autowired
    private ReviewService reviewService;

    @RequestMapping(method = RequestMethod.POST, value = "/register", produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<?> registerReview(@RequestBody ReviewModel reviewModel) {
        ReviewModel review = reviewService.save(reviewModel);
        final UriComponents uriComponents = ServletUriComponentsBuilder
                .fromCurrentServletMapping().path("/reviews/{id}").buildAndExpand(review.getId());
        return ResponseEntity.created(uriComponents.toUri()).body(review);
    }

    @RequestMapping(method = RequestMethod.POST, value = "/update", produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<?> updateReview(@RequestParam String id, @RequestParam String key, @RequestParam Object value) {
        ReviewModel result = reviewService.update(id, key, value);
        return ResponseEntity.ok(result);
    }

    @GetMapping(value = "/all")
    ResponseEntity<?> getAllReviews(@RequestParam(value = "page", defaultValue = "0") int page,
                                    @RequestParam(value = "size", defaultValue = "15") int size) {
        PageImpl<ReviewModel> result = reviewService.findAll(page, size);
        return ResponseEntity.ok(result);
    }

    @GetMapping(value = "/game/{id}")
    ResponseEntity<?> getGamesReviews(@PathVariable String id, @RequestParam(value = "page", defaultValue = "0") int page,
                                      @RequestParam(value = "size", defaultValue = "15") int size) {
        PageImpl<ReviewModel> result = reviewService.findAllByGame(id, page, size);
        return ResponseEntity.ok(result);
    }
}