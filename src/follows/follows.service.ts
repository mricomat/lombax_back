import { Repository } from "typeorm";
import { ErrorMessages } from 'src/utils/error-messages';
import { UserEntity } from "src/users/entity/user.entity";
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { FollowEntity } from './follow.entity';
import { CreateFollowRequestDto } from './dto/create-follow-request.dto';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(FollowEntity) private readonly followsRepository: Repository<FollowEntity>,
    @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async createFollow(user: UserEntity, createFollowBody: CreateFollowRequestDto): Promise<SuccessResponseDto> {
    const { followId } = createFollowBody;

    if (followId === user.id) {
      throw new BadRequestException(ErrorMessages.FollowIdSameId);
    }

    const followUser = await this.usersRepository.findOne({ id: followId }, { select: ["id"] });

    if (!followUser) {
      throw new NotFoundException(ErrorMessages.UserNotFound);
    }

    await this.checkIfAlreadyFriends(user, followUser);

    await this.followsRepository.save({ requester: user, addressee: followUser });

    return {
      status: "successful",
    };
  }

  async deleteFollow(followId: string, user: UserEntity): Promise<SuccessResponseDto> {
    const followUser = await this.usersRepository.findOne({ id: followId }, { select: ["id"] });

    if (!followUser) {
      throw new NotFoundException(ErrorMessages.UserNotFound);
    }

    const queryParams = { userId: user.id, followId: followUser.id };

    const friendship = await this.followsRepository
      .createQueryBuilder("follow")
      .select("follow.id")
      .where("follow.requester.id = :userId AND follow.addressee.id = :followId", queryParams)
      .orWhere("follow.requester.id = :followId AND follow.addressee.id = :userId", queryParams)
      .getOne();

    if (!friendship) {
      throw new BadRequestException(ErrorMessages.NotFollowing);
    }

    await this.followsRepository.delete(friendship);

    return { status: "successful" };
  }

  private async checkIfAlreadyFriends(user: UserEntity, friend: UserEntity): Promise<void> {
    const alreadyFriends = await this.followsRepository.findOne({
      where: [
        {
          requester: user,
          addressee: friend,
        },
        {
          requester: friend,
          addressee: user,
        },
      ],
      select: ["id"],
    });

    if (!alreadyFriends) {
      return;
    }

    // if (!alreadyFriends.confirmed) {
    //   throw new BadRequestException(ErrorMessages.FriendInvitationAlreadyCreated);
    // }

    if (alreadyFriends) {
      throw new BadRequestException(ErrorMessages.AlreadyFollowing);
    }
  }
}
