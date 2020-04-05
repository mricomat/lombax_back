package com.lombax.service.game;

import com.lombax.data.game.GameModel;
import org.springframework.data.domain.PageImpl;

public interface GameService {

    GameModel save(GameModel game);

    GameModel update(String gameId, String key, Object value);

    boolean delete(String id);

    PageImpl<GameModel> findAll(int page, int size);

    PageImpl<GameModel> findAllById(String id, int page, int size);
}
