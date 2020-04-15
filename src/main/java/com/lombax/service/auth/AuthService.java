package com.lombax.service.auth;

import com.lombax.data.AuthModel;
import com.lombax.data.AuthResponse;

public interface AuthService {

    AuthResponse authenticateUser(AuthModel authModel);

}
