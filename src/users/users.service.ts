import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectConnection, InjectRepository } from "@nestjs/typeorm";
import { Brackets, Connection, DeleteResult, In, ObjectLiteral, Raw, Repository } from "typeorm";

import { UserEntity } from "./entity/user.entity";
import { GetUserProfileResponseDto } from "./dto/get-user-profile-response.dto";
import { ErrorMessages } from "../utils/error-messages";
import { DiaryEntity } from "src/diaries/diary.entity";
import { ReviewEntity } from "src/reviews/entities/review.entity";
import { GameFeelEntity } from "src/gameFeel/gameFeel.entity";
import { FollowEntity } from "src/follows/follow.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(DiaryEntity) private readonly diaryRepository: Repository<DiaryEntity>,
    @InjectRepository(ReviewEntity) private readonly reviewRepository: Repository<ReviewEntity>,
    @InjectRepository(GameFeelEntity) private readonly gameFeelRepository: Repository<GameFeelEntity>,
    @InjectRepository(FollowEntity) private readonly followsRepository: Repository<FollowEntity>,
  ) {}

  async getUserProfile(userId: string, userActive?: UserEntity): Promise<GetUserProfileResponseDto> {
    const baseFields = ["user.id", "user.name", "user.lastName", "user.username", "user.role", "avatarImage", "backgroundImage"];

    const user = await this.usersRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.avatarImage", "avatarImage")
      .leftJoinAndSelect("user.backgroundImage", "backgroundImage")
      .select(baseFields)
      .where({ id: userId })
      .getOne();

    if (!user) {
      throw new NotFoundException(ErrorMessages.UserNotFound);
    }

    return {
      ...user,
    };
  }

  async getTotalInfo(user: UserEntity): Promise<any> {
    const totalDiary = await this.getDiaryCount(user);
    const totalReviews = await this.getReviewsCount(user);
    const totalGames = await this.getGamesCount(user);
    const totalFollowers = await this.getFollowers(user);
    const totalFollowing = await this.getFollows(user);

    return { totalDiary, totalReviews, totalGames, totalFollowers, totalFollowing };
  }

  private async getDiaryCount(user: UserEntity): Promise<number> {
    return await this.diaryRepository.count({ user });
  }

  private async getReviewsCount(user: UserEntity): Promise<number> {
    return await this.reviewRepository.count({ user });
  }

  private async getGamesCount(user: UserEntity): Promise<any> {
    return await this.gameFeelRepository
      .createQueryBuilder("gameFeel")
      .select()
      .where("gameFeel.user.id = :userId ", { userId: user.id })
     //.distinctOn(["gameFeel.game"])
      .getCount();
  }

  private async getFollows(user: UserEntity): Promise<number> {
    return await this.followsRepository.count({ addressee: user });
  }

  private async getFollowers(user: UserEntity): Promise<number> {
    return await this.followsRepository.count({ requester: user });
  }
}
