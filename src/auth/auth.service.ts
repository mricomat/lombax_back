import { Connection, Repository } from "typeorm";
import { ConfigService } from "nestjs-config";
import { InjectConnection, InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";

import { UserEntity } from "../users/entity/user.entity";
import { RegisterRequestDto } from "./dto/register-request.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { ErrorMessages } from "../utils/error-messages";

export class AuthService {
  private readonly applicationUrl: string;

  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.applicationUrl = this.configService.get("application.applicationUrl") as string;
  }

  async register(registerBody: RegisterRequestDto): Promise<SuccessResponseDto> {
    console.log(registerBody);
    const { email, username } = registerBody;
    const [emailAlreadyExists, usernameAlreadyExists] = await Promise.all([
      this.checkIfEmailAlreadyExists(email),
      this.checkIfUsernameAlreadyExists(username),
    ]);

    if (emailAlreadyExists) {
      throw new ConflictException(ErrorMessages.UserEmailAlreadyExists);
    }

    if (usernameAlreadyExists) {
      throw new ConflictException(ErrorMessages.UsernameAlreadyExists);
    }

    await this.connection.transaction(
      async (entityManager): Promise<UserEntity> => {
        const usersTransactionalRepository = entityManager.getRepository(UserEntity);

        const newUser = await usersTransactionalRepository.save(registerBody);

        return newUser;
      },
    );

    return {
      status: "successful",
    };
  }

  private async checkIfEmailAlreadyExists(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ email }, { select: ["email"] });

    return !!user;
  }

  private async checkIfUsernameAlreadyExists(username: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ username }, { select: ["username"] });

    return !!user;
  }
}
