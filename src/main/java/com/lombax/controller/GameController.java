package com.lombax.controller;

import com.lombax.data.game.GameModel;
import com.lombax.service.game.GameService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/games")
public class GameController {

    private static final Logger LOGGER = LoggerFactory.getLogger(com.lombax.controller.GameController.class);

    @Autowired
    private GameService gameService;

    @GetMapping(value = "/all")
    ResponseEntity<?> getAllReviews(@RequestParam(value = "page", defaultValue = "0") int page,
                                    @RequestParam(value = "size", defaultValue = "15") int size) {
        PageImpl<GameModel> result = gameService.findAll(page, size);
        return ResponseEntity.ok(result);
    }
}
