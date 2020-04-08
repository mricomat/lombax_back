package com.lombax.service.game;

import com.lombax.data.DiaryModel;
import com.lombax.data.game.GameModel;
import org.springframework.data.domain.PageImpl;

import java.util.ArrayList;

public interface GameService {

    GameModel save(GameModel game);

    GameModel update(String gameId, String key, Object value);

    boolean delete(String id);

    PageImpl<GameModel> findAll(int page, int size, ArrayList<String> includes, ArrayList<String> excludes);

    PageImpl<GameModel> findAllById(String id, int page, int size);

    GameModel findMainGame();

    PageImpl<GameModel> findPopularGames(int page, int size);

    PageImpl<GameModel> findTopGames(int page, int size);

    PageImpl<DiaryModel> findPopularFriends(int page, int size, String userId);

    PageImpl<GameModel> findActivityFriends(int page, int size);

    PageImpl<GameModel> findCollectionGames(int page, int size);

    PageImpl<GameModel> findGenreGames(int page, int size, int id);

    PageImpl<GameModel> findYourWatchlist(int page, int size, String userId);
}
