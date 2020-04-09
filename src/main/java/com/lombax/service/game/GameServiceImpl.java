package com.lombax.service.game;

import com.lombax.data.DiaryModel;
import com.lombax.data.UserModel;
import com.lombax.data.game.GameModel;
import com.lombax.exception.EntityAlreadyExistsException;
import com.lombax.exception.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class GameServiceImpl implements GameService {

    private static final Logger logger = LoggerFactory.getLogger(GameServiceImpl.class);

    private final MongoTemplate mongoTemplate;

    @Autowired
    public GameServiceImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public GameModel save(GameModel game) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(game.getId()));
        if (mongoTemplate.exists(query, GameModel.class)) {
            throw new EntityAlreadyExistsException(GameModel.class, "id", game.getId());
        }

        query = new Query();
        query.addCriteria(Criteria.where("name").is(game.getName()));
        if (mongoTemplate.exists(query, GameModel.class)) {
            throw new EntityAlreadyExistsException(GameModel.class, "name", game.getName());
        }

        logger.info("Game REGISTERED: " + game.getName());
        return mongoTemplate.save(game);
    }

    @Override
    public GameModel update(String gameId, String key, Object value) {
        return null;
    }

    @Override
    public boolean delete(String id) {
        return false;
    }

    @Override
    public PageImpl<GameModel> findAll(int page, int size, ArrayList<String> includes, ArrayList<String> excludes) {
        Query query = new Query();
        long count = mongoTemplate.count(query, GameModel.class);

        Pageable pageable = PageRequest.of(page, size);
        query = mountQuery(pageable, includes, excludes);

        List<GameModel> result = mongoTemplate.find(query, GameModel.class);

        logger.info("Game find");

        return new PageImpl<>(result, pageable, count);
    }


    @Override
    public List<GameModel> findMainGames(int genre) {
        Query query = new Query();

        Date date = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DATE, -30);//2 weeks
        long unixToday = new Date().getTime() / 1000L;
        long unixTwoWeeksAgo = calendar.getTime().getTime() / 1000L;

        Pageable pageable = PageRequest.of(0, 10);
        query.with(pageable);

        if(genre != 0) {
            query.addCriteria(Criteria.where("genres").elemMatch(Criteria.where("id").is(genre)));
        }

        query.addCriteria(Criteria.where("first_release_date").gt(unixTwoWeeksAgo).lt(unixToday));

        List<GameModel> result = mongoTemplate.find(query, GameModel.class);

        logger.info("Game findMainGames: " );

        return result;
    }

    @Override
    public PageImpl<GameModel> findPopularGames(int page, int size, int genre) {
        Query query = new Query();
        long count = mongoTemplate.count(query, GameModel.class);

        long unixToday = new Date().getTime() / 1000L;

        Pageable pageable = PageRequest.of(page, size);
        query.with(pageable);
        query.addCriteria(Criteria.where("first_release_date").lt(unixToday));
        query.addCriteria(Criteria.where("themes.id").ne("42"));
        query.with(Sort.by(Sort.Direction.DESC, "popularity"));

        if(genre != 0) {
            query.addCriteria(Criteria.where("genres").elemMatch(Criteria.where("id").is(genre)));
        }

        List<GameModel> result = mongoTemplate.find(query, GameModel.class);

        logger.info("Game findPopularGames: ");

        return new PageImpl<>(result, pageable, count);
    }

    @Override
    public PageImpl<GameModel> findTopGames(int page, int size, int genre) {
        Query query = new Query();
        long count = mongoTemplate.count(query, GameModel.class);

        Pageable pageable = PageRequest.of(page, size);
        query.with(pageable);

        Date date = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DATE, -360);//2 weeks

        if(genre != 0) {
            query.addCriteria(Criteria.where("genres").elemMatch(Criteria.where("id").is(genre)));
        }

        long unixToday = new Date().getTime() / 1000L;
        long unixTwoWeeksAgo = calendar.getTime().getTime() / 1000L;

        query.addCriteria(Criteria.where("first_release_date").gt(unixTwoWeeksAgo).lt(unixToday));
        query.addCriteria(Criteria.where("total_rating").gt(75));
        query.addCriteria(Criteria.where("themes.id").ne("42"));
        query.with(Sort.by(Sort.Direction.DESC, "total_rating"));

        List<GameModel> result = mongoTemplate.find(query, GameModel.class);

        logger.info("Game findTopGames: ");

        return new PageImpl<>(result, pageable, count);
    }

    @Override
    public PageImpl<DiaryModel> findPopularFriends(int page, int size, String userId) {
        Query query = new Query();
        long count = mongoTemplate.count(query, GameModel.class);

        Pageable pageable = PageRequest.of(page, size);
        query.with(pageable);

        Query userQuery = new Query();
        userQuery.addCriteria(Criteria.where("id").is(userId));
        UserModel user = mongoTemplate.findOne(userQuery, UserModel.class);
        if (user == null || !user.isValid()) {
            throw new EntityNotFoundException(UserModel.class, "user", user.getId());
        }

        if (Objects.requireNonNull(user).getFollowing().size() == 0) {
            throw new EntityNotFoundException(UserModel.class, "Following", user.getFollowing().toString());
        }

        query.addCriteria(Criteria.where("userId").in(user.getFollowing()));
        query.addCriteria(Criteria.where("rating").gt(4));
        query.with(Sort.by(Sort.Direction.DESC, "date"));

        List<DiaryModel> result = mongoTemplate.find(query, DiaryModel.class);
        return new PageImpl<>(result, pageable, count);
    }

    @Override
    public PageImpl<GameModel> findActivityFriends(int page, int size) {
        return null;

    }

    @Override
    public PageImpl<GameModel> findCollectionGames(int page, int size, int genre) {
        Query query = new Query();
        long count = mongoTemplate.count(query, GameModel.class);
        Pageable pageable = PageRequest.of(page, size);
        query.with(pageable);

        if(genre != 0) {
            query.addCriteria(Criteria.where("genres").elemMatch(Criteria.where("id").is(genre)));
        }

        query.addCriteria(Criteria.where("category").is(3));
        query.addCriteria(Criteria.where("total_rating").gt(83));
        query.with(Sort.by(Sort.Direction.DESC, "total_rating"));

        List<GameModel> result = mongoTemplate.find(query, GameModel.class);

        logger.info("Game collections: ");

        return new PageImpl<>(result, pageable, count);
    }

    @Override
    public PageImpl<GameModel> findGenreGames(int page, int size, List<Integer> genres) {
        Query query = new Query();
        long count = mongoTemplate.count(query, GameModel.class);
        Pageable pageable = PageRequest.of(page, size);
        query.with(pageable);

        query.addCriteria(Criteria.where("genres").elemMatch(Criteria.where("id").in(genres)));
        query.with(Sort.by(Sort.Direction.DESC, "total_rating"));

        List<GameModel> result = mongoTemplate.find(query, GameModel.class);

        logger.info("Game genres: " + genres);

        return new PageImpl<>(result, pageable, count);
    }

    @Override
    public PageImpl<GameModel> findYourWatchlist(int page, int size, String userId) {
        Query query = new Query();
        long count = mongoTemplate.count(query, GameModel.class);

        Pageable pageable = PageRequest.of(page, size);
        query.with(pageable);

        Query userQuery = new Query();
        userQuery.addCriteria(Criteria.where("id").is(userId));
        UserModel user = mongoTemplate.findOne(userQuery, UserModel.class);

        if (user == null || !user.isValid()) {
            throw new EntityNotFoundException(UserModel.class, "user", user.getId());
        }
        logger.info("Game whatchlist: " + user.getWatchList());

        query.addCriteria(Criteria.where("id").in(user.getWatchList()));
        query.with(Sort.by(Sort.Direction.DESC, "total_rating"));

        List<GameModel> result = mongoTemplate.find(query, GameModel.class);

        return new PageImpl<>(result, pageable, count);
    }


    @Override
    public PageImpl<GameModel> findAllById(String id, int page, int size) {
        return null;
    }

    private Query mountQuery(Pageable pageable, ArrayList<String> includes, ArrayList<String> excludes) {
        Query query = new Query();

        if (includes != null && includes.size() > 0) {
            for (String in : includes) {
                logger.info("Game find" + in);
                query.fields().include(in);
            }
        }

        if (excludes != null && excludes.size() > 0) {
            for (String ex : excludes) {
                query.fields().exclude(ex);
            }
        }

        if (pageable != null) {
            query.with(pageable);
        }

        return query;
    }
}
