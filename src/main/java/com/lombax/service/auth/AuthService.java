package com.lombax.service.auth;

import com.lombax.data.AuthModel;
import com.lombax.data.AuthResponse;

import javax.servlet.http.HttpServletRequest;

public interface AuthService {

    AuthResponse authenticateUser(AuthModel authModel);

    AuthResponse authenticateToken(String userId, HttpServletRequest request);

}
