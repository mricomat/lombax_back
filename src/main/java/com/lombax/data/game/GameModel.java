package com.lombax.data.game;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.gson.annotations.SerializedName;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.ArrayList;

@Document(collection = "games")
public class GameModel {

    private String id;
    //age_ratings
    //aggregated_rating
    //aggregated_rating_count

    @Field("alternative_names")
    private ArrayList<AlternativeNamesModel> alternativeNames = new ArrayList<>();
    private ArrayList<CoverModel> artworks = new ArrayList<>();
    private ArrayList<String> bundles = new ArrayList<>();
    private int category;
    private ArrayList<String> collection = new ArrayList<>();
    private CoverModel cover;

    @Field("create_at")
    private Long createAt;
    private ArrayList<String> dlcs = new ArrayList<>();
    private ArrayList<String> expansions = new ArrayList<>();
    //external_games

    @Field("first_release_date")
    private Long firstReleaseDate;
    private int follows;
    private ArrayList<String> franchises = new ArrayList<>();
    @Field("game_engines")
    private ArrayList<String> gameEngines = new ArrayList<>();
    @Field("game_modes")
    private ArrayList<String> gameModes = new ArrayList<>();
    private ArrayList<Genre> genres = new ArrayList<>();
    private int hypes;

    @Field("involved_companies")
    private ArrayList<InvolvedCompany> involvedCompanies = new ArrayList<>();
    private ArrayList<KeywordModel> keywords = new ArrayList<>();
    //multiplayer_modes
    private String name;

    @Field("parent_game")
    private String parentGame;

    private ArrayList<PlatformModel> platforms = new ArrayList<>();
    @Field("player_perspectives")
    private ArrayList<String> playerPerspectives = new ArrayList<>();
    private double popularity;
    @Field("pulse_count")
    private int pulseCount;
    @Field("rating_count")
    private int ratingCount;
    private ArrayList<CoverModel> screenshots = new ArrayList<>();
    @Field("similar_games")
    private ArrayList<String> similarGames = new ArrayList<>();
    private String slug;
    @Field("standalone_expansions")
    private ArrayList<String> standaloneExpansions = new ArrayList<>();
    private int status;
    private String storyline;
    private String summary;
    //tags
    private ArrayList<Genre> themes = new ArrayList<>();
    @Field("time_to_beat")
    private TimeToBeatModel timeToBeat;
    @Field("total_rating")
    private double totalRating;
    @Field("total_rating_count")
    private int totalRatingCount;
    @Field("version_parent")
    private String versionParent;
    @Field("version_title")
    private String versionTitle;
    private ArrayList<VideoModel> videos = new ArrayList<>();
    //websites

    public GameModel() {

    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public ArrayList<AlternativeNamesModel> getAlternativeNames() {
        return alternativeNames;
    }

    public void setAlternativeNames(ArrayList<AlternativeNamesModel> alternativeNames) {
        this.alternativeNames = alternativeNames;
    }

    public ArrayList<CoverModel> getArtworks() {
        return artworks;
    }

    public void setArtworks(ArrayList<CoverModel> artworks) {
        this.artworks = artworks;
    }

    public ArrayList<String> getBundles() {
        return bundles;
    }

    public void setBundles(ArrayList<String> bundles) {
        this.bundles = bundles;
    }

    public int getCategory() {
        return category;
    }

    public void setCategory(int category) {
        this.category = category;
    }

    public ArrayList<String> getCollection() {
        return collection;
    }

    public void setCollection(ArrayList<String> collection) {
        this.collection = collection;
    }

    public CoverModel getCover() {
        return cover;
    }

    public void setCover(CoverModel cover) {
        this.cover = cover;
    }

    public Long getCreateAt() {
        return createAt;
    }

    public void setCreateAt(Long createAt) {
        this.createAt = createAt;
    }

    public ArrayList<String> getDlcs() {
        return dlcs;
    }

    public void setDlcs(ArrayList<String> dlcs) {
        this.dlcs = dlcs;
    }

    public ArrayList<String> getExpansions() {
        return expansions;
    }

    public void setExpansions(ArrayList<String> expansions) {
        this.expansions = expansions;
    }

    public Long getFirstReleaseDate() {
        return firstReleaseDate;
    }

    public void setFirstReleaseDate(Long firstReleaseDate) {
        this.firstReleaseDate = firstReleaseDate;
    }

    public int getFollows() {
        return follows;
    }

    public void setFollows(int follows) {
        this.follows = follows;
    }

    public ArrayList<String> getFranchises() {
        return franchises;
    }

    public void setFranchises(ArrayList<String> franchises) {
        this.franchises = franchises;
    }

    public ArrayList<String> getGameEngines() {
        return gameEngines;
    }

    public void setGameEngines(ArrayList<String> gameEngines) {
        this.gameEngines = gameEngines;
    }

    public ArrayList<String> getGameModes() {
        return gameModes;
    }

    public void setGameModes(ArrayList<String> gameModes) {
        this.gameModes = gameModes;
    }

    public ArrayList<Genre> getGenres() {
        return genres;
    }

    public void setGenres(ArrayList<Genre> genres) {
        this.genres = genres;
    }

    public int getHypes() {
        return hypes;
    }

    public void setHypes(int hypes) {
        this.hypes = hypes;
    }

    public ArrayList<InvolvedCompany> getInvolvedCompanies() {
        return involvedCompanies;
    }

    public void setInvolvedCompanies(ArrayList<InvolvedCompany> involvedCompanies) {
        this.involvedCompanies = involvedCompanies;
    }

    public ArrayList<KeywordModel> getKeywords() {
        return keywords;
    }

    public void setKeywords(ArrayList<KeywordModel> keywords) {
        this.keywords = keywords;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getParentGame() {
        return parentGame;
    }

    public void setParentGame(String parentGame) {
        this.parentGame = parentGame;
    }

    public ArrayList<PlatformModel> getPlatforms() {
        return platforms;
    }

    public void setPlatforms(ArrayList<PlatformModel> platforms) {
        this.platforms = platforms;
    }

    public ArrayList<String> getPlayerPerspectives() {
        return playerPerspectives;
    }

    public void setPlayerPerspectives(ArrayList<String> playerPerspectives) {
        this.playerPerspectives = playerPerspectives;
    }

    public double getPopularity() {
        return popularity;
    }

    public void setPopularity(double popularity) {
        this.popularity = popularity;
    }

    public int getPulseCount() {
        return pulseCount;
    }

    public void setPulseCount(int pulseCount) {
        this.pulseCount = pulseCount;
    }

    public int getRatingCount() {
        return ratingCount;
    }

    public void setRatingCount(int ratingCount) {
        this.ratingCount = ratingCount;
    }

    public ArrayList<CoverModel> getScreenshots() {
        return screenshots;
    }

    public void setScreenshots(ArrayList<CoverModel> screenshots) {
        this.screenshots = screenshots;
    }

    public ArrayList<String> getSimilarGames() {
        return similarGames;
    }

    public void setSimilarGames(ArrayList<String> similarGames) {
        this.similarGames = similarGames;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public ArrayList<String> getStandaloneExpansions() {
        return standaloneExpansions;
    }

    public void setStandaloneExpansions(ArrayList<String> standaloneExpansions) {
        this.standaloneExpansions = standaloneExpansions;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getStoryline() {
        return storyline;
    }

    public void setStoryline(String storyline) {
        this.storyline = storyline;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public ArrayList<Genre> getThemes() {
        return themes;
    }

    public void setThemes(ArrayList<Genre> themes) {
        this.themes = themes;
    }

    public TimeToBeatModel getTimeToBeat() {
        return timeToBeat;
    }

    public void setTimeToBeat(TimeToBeatModel timeToBeat) {
        this.timeToBeat = timeToBeat;
    }

    public double getTotalRating() {
        return totalRating;
    }

    public void setTotalRating(double totalRating) {
        this.totalRating = totalRating;
    }

    public int getTotalRatingCount() {
        return totalRatingCount;
    }

    public void setTotalRatingCount(int totalRatingCount) {
        this.totalRatingCount = totalRatingCount;
    }

    public String getVersionParent() {
        return versionParent;
    }

    public void setVersionParent(String versionParent) {
        this.versionParent = versionParent;
    }

    public String getVersionTitle() {
        return versionTitle;
    }

    public void setVersionTitle(String versionTitle) {
        this.versionTitle = versionTitle;
    }

    public ArrayList<VideoModel> getVideos() {
        return videos;
    }

    public void setVideos(ArrayList<VideoModel> videos) {
        this.videos = videos;
    }
}

