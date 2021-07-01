import { Repository } from "typeorm";
import { UserEntity } from "src/users/entity/user.entity";
import { ReviewEntity } from 'src/reviews/entities/review.entity';
import { IGDBService } from 'src/igdb/igdb.service';
import { IGDBSectionDto } from 'src/igdb/igdb-section.dto';
import { igdbSelect } from "src/igdb/igdb-game-fields";
import { GenreEntity } from "src/genres/genre.entity";
import { GameFeelEntity } from 'src/gameFeel/gameFeel.entity';
import { DiaryEntity } from 'src/diaries/diary.entity';
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(GenreEntity) private readonly genreRepository: Repository<GenreEntity>,
    @InjectRepository(ReviewEntity) private readonly reviewsRepository: Repository<ReviewEntity>,
    @InjectRepository(DiaryEntity) private readonly diaryRepository: Repository<DiaryEntity>,
    @InjectRepository(GameFeelEntity) private readonly gameFeelEntity: Repository<GameFeelEntity>,
    private readonly igdbService: IGDBService,
  ) {}

  // TODO Filter by genres and themes
  async getMainFeed(): Promise<IGDBSectionDto[]> {
    const main = await this.getMainSection();
    const top = await this.getTopRatedSection();
    const recentlyRevSec = await this.getRecentlyReviwed();

    return [main, top, recentlyRevSec];
  }

  async getSectionsFeed(userId: string): Promise<IGDBSectionDto[]> {
    let sections = [];

    if (userId) {
      const diaries = await this.getFriendsActivity(userId);
      const gameFeels = await this.getUserGamesActivity(userId); // TODO order
      const { interests } = await this.usersRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.interests", "interests")
        .where("user.id = :userId", { userId })
        .getOne();

      const genre1 = await this.getGenreGamesSection(interests[0]);
      const genre2 = await this.getGenreGamesSection(interests[1]);
      const genre3 = await this.getGenreGamesSection(interests[2]);

      sections = [diaries, gameFeels, genre1, genre2, genre3];
    } else {
      const genres = await this.genreRepository.createQueryBuilder("genre").where("genre.type = :type", { type: "GENRE" }).getMany();
      const genresSelected = await this.getListGenres(genres);

      const genre1 = await this.getGenreGamesSection(genresSelected[0]);
      const genre2 = await this.getGenreGamesSection(genresSelected[1]);
      const genre3 = await this.getGenreGamesSection(genresSelected[2]);
      sections = [genre1, genre2, genre3];
    }
    return [...sections];
  }

  async getMainSection(): Promise<IGDBSectionDto> {
    const today = new Date().getDate();
    const timeAgo = new Date().setDate(new Date().getDate() - 7 * 3);
    const query = `fields ${igdbSelect}; where release_dates.date > ${today} & release_dates.date < ${timeAgo} & themes != (42) & total_rating > 1 & cover.image_id != null; sort total_rating desc; limit 15;`;
    const { error, data } = await this.igdbService.getGames(query);
    return { title: "Most recently released", games: !error ? [...data] : [] };
  }

  async getTopRatedSection(): Promise<IGDBSectionDto> {
    const today = new Date().getDate();
    const timeAgo = new Date().setDate(new Date().getDate() - 7 * 12);
    const query = `fields ${igdbSelect}; where release_dates.date > ${today} & release_dates.date < ${timeAgo} & themes != (42) & total_rating > 1 & cover.image_id != null; sort total_rating desc; limit 15;`;
    const { error, data } = await this.igdbService.getGames(query);
    return { title: "Top rated of a year", games: !error ? [...data] : [] };
  }

  async getGenreGamesSection(genre: GenreEntity): Promise<IGDBSectionDto> {
    const today = new Date();
    const timeAgo = new Date().setFullYear(today.getFullYear() - 5);
    const query = `fields ${igdbSelect}; where release_dates.date > ${today.getDate()} & release_dates.date < ${timeAgo} & themes != (42) & genres = (${
      genre.idS
    }) & total_rating > 30 & cover.image_id != null; sort total_rating desc; limit 15;`;

    const { error, data } = await this.igdbService.getGames(query);
    return { title: `${genre.name} games`, games: !error ? [...data] : [] };
  }

  async getRecentlyReviwed(): Promise<IGDBSectionDto> {
    const startAt = new Date(new Date().setDate(new Date().getDate() - 7 * 12));
    const reviews = await this.reviewsRepository
      .createQueryBuilder("review")
      .leftJoinAndSelect("review.user", "user")
      .leftJoinAndSelect("review.game", "game")
      .where("review.createdAt > :startAt", { startAt })
      .limit(15)
      .getMany();

    return { title: "Recently reviwed", games: [], reviews };
  }

  async getFriendsActivity(userId: string): Promise<IGDBSectionDto> {
    const diaries = await this.diaryRepository
      .createQueryBuilder("diary")
      .leftJoin("diary.user", "user")
      .leftJoin("user.following", "following")
      .where("following.requester = :userId", { userId })
      .orderBy("diary.createdAt", "DESC")
      .limit(15)
      .getMany();

    return { title: "Recent friends activity", games: diaries };
  }

  async getUserGamesActivity(userId: string): Promise<IGDBSectionDto> {
    // TODO ORder by createdAt
    const gameFeels = await this.gameFeelEntity
      .createQueryBuilder("gameFeel")
      .leftJoin("gameFeel.user", "user")
      .leftJoin("gameFeel.game", "game")
      .select(["gameFeel.id", "gameFeel.createdAt", "gameFeel.gameStatus", "game.id"])
      .where("user.id = :userId", { userId })
      .distinctOn(["game"])
      .orderBy("game", "ASC")
      .addOrderBy("gameFeel.createdAt", "ASC")
      .limit(15)
      .getMany();

    return { title: "Your games activity", games: gameFeels };
  }

  async getListGenres(genres: GenreEntity[]) {
    const genresSelected = [];
    for (let i = 0; i < 3; i++) {
      const index = Math.floor(Math.random() * genres.length);
      genresSelected[i] = genres[index];
      genres.splice(index, 1);
    }

    return genresSelected;
  }
}
