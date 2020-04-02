package com.lombax.service.cover;

import com.lombax.data.CoverModel;

public interface CoverService {
    CoverModel save(CoverModel cover);

    CoverModel update(String coverId, String key, Object value);

}
