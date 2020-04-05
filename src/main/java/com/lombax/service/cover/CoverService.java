package com.lombax.service.cover;

import com.lombax.data.game.CoverModel;

public interface CoverService {
    CoverModel save(CoverModel cover);

    CoverModel update(String coverId, String key, Object value);

}
