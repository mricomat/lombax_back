package com.lombax.controller;

import com.lombax.data.AuthModel;
import com.lombax.data.AuthResponse;
import com.lombax.security.JwtTokenProvider;
import com.lombax.service.auth.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import static com.lombax.security.JwtAuthenticationFilter.getJwtFromRequest;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody AuthModel authModel) {
        AuthResponse authResponse = authService.authenticateUser(authModel);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/autoLogin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestParam String userId, HttpServletRequest request) {
        AuthResponse authResponse = authService.authenticateToken(userId, request);
        return authResponse != null ? ResponseEntity.ok(authResponse) : new ResponseEntity<String>("Unauthorized", HttpStatus.UNAUTHORIZED);
    }
}
