package com.lombax.service.auth;

import com.lombax.data.AuthModel;
import com.lombax.data.AuthResponse;
import com.lombax.data.UserModel;
import com.lombax.exception.EntityNotFoundException;
import com.lombax.security.JwtTokenProvider;
import com.lombax.service.user.UserServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    AuthenticationManager mAuthenticationManager;

    @Autowired
    JwtTokenProvider mTokenProvider;

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final MongoTemplate mongoTemplate;

    @Autowired
    public AuthServiceImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }


    @Override
    public AuthResponse authenticateUser(AuthModel authModel) {
        Authentication authentication = mAuthenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authModel.getUsername(),
                        authModel.getPassword()
                )
        );

        logger.info(authentication.toString());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = mTokenProvider.generateToken(authentication);
        AuthResponse authResponse = new AuthResponse(jwt);


        UserModel user = mongoTemplate.findOne(new Query(Criteria.where("username").is(authModel.getUsername())), UserModel.class);

        if (user == null) {
            throw new EntityNotFoundException(UserModel.class, "user", authModel.getUsername());
        }

        authResponse.setUserId(user.getId());
        authResponse.setEmail(user.getEmail());
        authResponse.setUsername(user.getUsername());
        authResponse.setCoverId(user.getUsername());
        authResponse.setBackgroundId(user.getUsername());
        authResponse.setInterests(user.getInterests());
        authResponse.setFavorites(user.getFavorites());
        authResponse.setRatings(user.getRatings());
        authResponse.setFollowers(user.getFollowers());
        authResponse.setFollowing(user.getFollowing());
        authResponse.setWatchList(user.getWatchList());

        // TODO queries
        authResponse.setGamesPlayed(0);
        authResponse.setGamesPlaying(0);
        authResponse.setReviews(0);
        authResponse.setDiary(0);


        return authResponse;
    }
}
