package com.lombax.controller;

import com.lombax.data.FavoriteModel;
import com.lombax.data.ReviewModel;
import com.lombax.data.game.GameModel;
import com.lombax.service.favorite.FavoriteService;
import com.lombax.service.game.GameService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("/games")
public class GameController {

    private static final Logger LOGGER = LoggerFactory.getLogger(com.lombax.controller.GameController.class);

    @Autowired
    private GameService gameService;

    @Autowired
    private FavoriteService favoriteService;

    @GetMapping(value = "/all")
    ResponseEntity<?> getAllGames(@RequestParam(value = "page", defaultValue = "0") int page,
                                  @RequestParam(value = "size", defaultValue = "15") int size,
                                  @RequestParam(value = "includes", defaultValue = "") ArrayList<String> includes,
                                  @RequestParam(value = "excludes", defaultValue = "") ArrayList<String> excludes) {
        PageImpl<GameModel> result = gameService.findAll(page, size, includes, excludes);
        return ResponseEntity.ok(result);
    }

    @GetMapping(value = "/main")
    ResponseEntity<?> getMainGame() {
        List<GameModel> result = gameService.findMainGames(0);
        return ResponseEntity.ok(result);
    }

    @GetMapping(value = "/popular")
    ResponseEntity<?> getPopularGames(@RequestParam(value = "page", defaultValue = "0") int page,
                                      @RequestParam(value = "size", defaultValue = "15") int size) {
        PageImpl<GameModel> result = gameService.findPopularGames(page, size, 0);
        return ResponseEntity.ok(result);
    }

    @GetMapping(value = "/top")
    ResponseEntity<?> getTopGames(@RequestParam(value = "page", defaultValue = "0") int page,
                                  @RequestParam(value = "size", defaultValue = "15") int size) {
        PageImpl<GameModel> result = gameService.findTopGames(page, size, 0);
        return ResponseEntity.ok(result);
    }

    @GetMapping(value = "/collections")
    ResponseEntity<?> getTopCollections(@RequestParam(value = "page", defaultValue = "0") int page,
                                        @RequestParam(value = "size", defaultValue = "15") int size) {
        PageImpl<GameModel> result = gameService.findCollectionGames(page, size, 0);
        return ResponseEntity.ok(result);
    }

    @GetMapping(value = "/genres/{id}")
    ResponseEntity<?> getGamesByGenre(@PathVariable int id, @RequestParam(value = "page", defaultValue = "0") int page,
                                      @RequestParam(value = "size", defaultValue = "15") int size) {
        List<Integer> genres = new ArrayList<>();
        genres.add(id);
        PageImpl<GameModel> result = gameService.findGenreGames(page, size, genres);
        return ResponseEntity.ok(result);
    }

    @GetMapping(value = "/ids")
    ResponseEntity<?> getGamesByIds( @RequestParam(value = "games") ArrayList<String> games) {
        List<GameModel> result = gameService.findByIds(games);
        return ResponseEntity.ok(result);
    }

    @GetMapping(value = "/watchList/{userId}")
    ResponseEntity<?> getWatchList(@PathVariable String userId, @RequestParam(value = "page", defaultValue = "0") int page,
                                   @RequestParam(value = "size", defaultValue = "15") int size) {
        PageImpl<GameModel> result = gameService.findYourWatchlist(page, size, userId);
        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.POST, value = "/favorite/register", produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<?> saveFavorite(@RequestParam String userId, @RequestParam String gameId) {
        FavoriteModel result = favoriteService.save(userId, gameId);
        return ResponseEntity.ok(result);
    }
}
