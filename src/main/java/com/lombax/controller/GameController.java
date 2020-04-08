package com.lombax.controller;

import com.lombax.data.game.GameModel;
import com.lombax.service.game.GameService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;


@RestController
@RequestMapping("/games")
public class GameController {

    private static final Logger LOGGER = LoggerFactory.getLogger(com.lombax.controller.GameController.class);

    @Autowired
    private GameService gameService;

    @GetMapping(value = "/all")
    ResponseEntity<?> getAllReviews(@RequestParam(value = "page", defaultValue = "0") int page,
                                    @RequestParam(value = "size", defaultValue = "15") int size,
                                    @RequestParam(value = "includes", defaultValue = "") ArrayList<String> includes,
                                    @RequestParam(value = "excludes", defaultValue = "") ArrayList<String> excludes) {
        PageImpl<GameModel> result = gameService.findAll(page, size, includes, excludes);
        return ResponseEntity.ok(result);
    }

    @GetMapping(value = "/main")
    ResponseEntity<?> getMainGame() {
        GameModel result = gameService.findMainGame();
        return ResponseEntity.ok(result);
    }

    @GetMapping(value = "/popular")
    ResponseEntity<?> getPopularGames(@RequestParam(value = "page", defaultValue = "0") int page,
                              @RequestParam(value = "size", defaultValue = "15") int size) {
        PageImpl<GameModel> result = gameService.findPopularGames(page, size);
        return ResponseEntity.ok(result);
    }

    @GetMapping(value = "/top")
    ResponseEntity<?> getTopGames(@RequestParam(value = "page", defaultValue = "0") int page,
                                      @RequestParam(value = "size", defaultValue = "15") int size) {
        PageImpl<GameModel> result = gameService.findTopGames(page, size);
        return ResponseEntity.ok(result);
    }

    @GetMapping(value = "/collections")
    ResponseEntity<?> getTopCollections(@RequestParam(value = "page", defaultValue = "0") int page,
                                  @RequestParam(value = "size", defaultValue = "15") int size) {
        PageImpl<GameModel> result = gameService.findCollectionGames(page, size);
        return ResponseEntity.ok(result);
    }

    @GetMapping(value = "/genres/{id}")
    ResponseEntity<?> getGamesByGenre(@PathVariable int id, @RequestParam(value = "page", defaultValue = "0") int page,
                                        @RequestParam(value = "size", defaultValue = "15") int size) {
        PageImpl<GameModel> result = gameService.findGenreGames(page, size, id);
        return ResponseEntity.ok(result);
    }

    @GetMapping(value = "/watchList/{userId}")
    ResponseEntity<?> getWatchList(@PathVariable String userId, @RequestParam(value = "page", defaultValue = "0") int page,
                                      @RequestParam(value = "size", defaultValue = "15") int size) {
        PageImpl<GameModel> result = gameService.findYourWatchlist(page, size, userId);
        return ResponseEntity.ok(result);
    }
}
