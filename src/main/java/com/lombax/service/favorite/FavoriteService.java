package com.lombax.service.favorite;

import com.lombax.data.FavoriteModel;

public interface FavoriteService {

    FavoriteModel save(String userId, String gameId);

}
