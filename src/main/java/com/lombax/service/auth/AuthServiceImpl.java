package com.lombax.service.auth;

import com.lombax.data.AuthModel;
import com.lombax.data.AuthResponse;
import com.lombax.data.UserModel;
import com.lombax.exception.EntityNotFoundException;
import com.lombax.security.JwtTokenProvider;
import com.lombax.service.game.GameService;
import com.lombax.service.review.ReviewService;
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
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletRequest;

import static com.lombax.security.JwtAuthenticationFilter.getJwtFromRequest;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    AuthenticationManager mAuthenticationManager;

    @Autowired
    GameService gameService;

    @Autowired
    ReviewService reviewService;

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
        return fillSectionsResponse(authResponse, user);
    }

    @Override
    public AuthResponse authenticateToken(String userId, HttpServletRequest request) {
        String jwt = getJwtFromRequest(request);
        if (StringUtils.hasText(jwt) && mTokenProvider.validateToken(jwt)) {
            String requestUserId = mTokenProvider.getUserIdFromJWT(jwt);
            if (requestUserId.equals(userId)) {
                UserModel user = mongoTemplate.findOne(new Query(Criteria.where("id").is(userId)), UserModel.class);

                if (user == null) {
                    throw new EntityNotFoundException(UserModel.class, "user", userId);
                }

                return fillSectionsResponse(new AuthResponse(jwt), user);
            }
        }
        return null;
    }


    private AuthResponse fillSectionsResponse(AuthResponse authResponse, UserModel user) {
        authResponse.setUserId(user.getId());
        authResponse.setEmail(user.getEmail());
        authResponse.setUsername(user.getUsername());
        authResponse.setCoverId(user.getCoverId());
        authResponse.setBackgroundId(user.getBackgroundId());
        authResponse.setInterests(user.getInterests());

        authResponse.setFavorites(gameService.findFavoriteGames(0, 15, user.getId()).getContent());
        authResponse.setReviews(reviewService.getDiaryByUser(user.getId(), 0, 15).getContent());

        authResponse.setRatings(user.getRatings());
        authResponse.setFollowers(user.getFollowers());
        authResponse.setFollowing(user.getFollowing());
        authResponse.setWatchList(user.getWatchList());

        // TODO queries
        authResponse.setGamesPlayed(0);
        authResponse.setGamesPlaying(0);

        return authResponse;
    }
}
