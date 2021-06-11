import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectConnection, InjectRepository } from "@nestjs/typeorm";
import { Brackets, Connection, DeleteResult, In, ObjectLiteral, Raw, Repository } from "typeorm";

import { UserEntity } from "./entity/user.entity";
import { GetUserProfileResponseDto } from "./dto/get-user-profile-response.dto";
import { ErrorMessages } from "../utils/error-messages";

@Injectable()
export class UsersService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>,
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
}
