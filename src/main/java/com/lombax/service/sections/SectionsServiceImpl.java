package com.lombax.service.sections;

import com.lombax.data.DiaryModel;
import com.lombax.data.SectionModel;
import com.lombax.data.UserModel;
import com.lombax.data.game.GameModel;
import com.lombax.service.game.GameService;
import com.lombax.service.game.GameServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SectionsServiceImpl implements SectionsService {

    private static final Logger logger = LoggerFactory.getLogger(SectionsServiceImpl.class);

    private final MongoTemplate mongoTemplate;

    @Autowired
    private GameService gamesService;

    @Autowired
    public SectionsServiceImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public ArrayList<SectionModel> getSections(String userId, int genre) {
        ArrayList<SectionModel> result = new ArrayList<>();

        Query userQuery = new Query();
        userQuery.addCriteria(Criteria.where("id").is(userId));
        UserModel user = mongoTemplate.findOne(userQuery, UserModel.class);

        // HighLights
        List<GameModel> highLights = gamesService.findMainGames(genre);
        result.add(new SectionModel("HighLight", highLights, "highLight"));

        // Popular Games
        PageImpl<GameModel> popular = gamesService.findPopularGames(0, 15, genre);
        result.add(new SectionModel("Trending right now", popular.getContent(), "popular"));

        // Top Games
        PageImpl<GameModel> top = gamesService.findTopGames(0, 15, genre);
        result.add(new SectionModel("Top rating games of this year", top.getContent(), "top"));

        // Popular or Activity from friends
        if (user != null && user.getFollowing().size() > 2) {
            PageImpl<DiaryModel> friendsPopular = gamesService.findPopularFriends(0, 15, userId);
            if (friendsPopular.getContent().size() > 2) {
                result.add(new SectionModel("Popular from friends", friendsPopular.getContent(), "friends"));
            }
        } else {

        }

        // Collection Games
        PageImpl<GameModel> collections = gamesService.findCollectionGames(0, 10, genre);
        result.add(new SectionModel("Collection GAMES", collections.getContent(), "collections"));

        // WatchList
        if (user != null && user.getWatchList().size() > 0) {
            PageImpl<GameModel> watchList = gamesService.findYourWatchlist(0, 10, userId);
            if (watchList.getContent().size() > 2) {
                result.add(new SectionModel("Your Watchlist", watchList.getContent(), "watchlist"));
            }
        } else {

        }

        //  Genre 1
        List<Integer> genres = new ArrayList<>();
        genres.add(5);
        genres.add(genre);
        PageImpl<GameModel> shooters = gamesService.findGenreGames(0, 10, genres);
        result.add(new SectionModel("Shooters", shooters.getContent(), "genres"));

        //  Genre 2
        PageImpl<GameModel> indie = gamesService.findGenreGames(0, 10, genres);
        result.add(new SectionModel("Indie", indie.getContent(), "genres"));
        genres.clear();
        genres.add(32);
        genres.add(genre);

        //  Genre 3
        PageImpl<GameModel> strategy = gamesService.findGenreGames(0, 10, genres);
        result.add(new SectionModel("Strategy", strategy.getContent(), "genres"));
        genres.clear();
        genres.add(15);
        genres.add(genre);

        return result;
    }
}
