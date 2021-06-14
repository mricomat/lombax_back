import { Connection, Repository, In } from "typeorm";
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
import { v4, v5 } from "uuid";
import { compare } from "bcrypt";

import { UserEntity } from "../users/entity/user.entity";
import { RegisterRequestDto } from "./dto/register-request.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { ErrorMessages } from "../utils/error-messages";
import { USERS_FOLDER } from "../users/constants/users-folder.constants";
import { FileToUploadInterface } from "../files/interfaces/file-to-upload.interface";
import { FilesService } from "../files/files.service";
import { FileEntity } from "src/files/file.entity";
import { DocumentDto } from "src/common/dto/document.dto";
import { GenreEntity } from "src/genres/genre.entity";
import { LoginRequestDto } from "src/auth/dto/login-request.dto";
import { TokenInterface } from "../common/interfaces/token.interface";
import { SESSION_TOKEN_EXPIRATION, SESSION_TOKEN_METHOD } from "./constants/session-token.constants";
import { LoginResponseDto } from "./dto/login-response.dto";
import { RefreshTokenEntity } from "./refresh-token.entity";
import { REFRESH_TOKEN_METHOD } from "./constants/refresh-token.constants";
import { CreateSessionAndRefreshTokensResponseInterface } from "./interfaces/create-session-and-refresh-tokens-response.interface";

export class AuthService {
  private readonly applicationUrl: string;

  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(GenreEntity) private readonly genreRepository: Repository<GenreEntity>,
    @InjectRepository(RefreshTokenEntity) private readonly refreshTokensRepository: Repository<RefreshTokenEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly filesService: FilesService,
  ) {
    this.applicationUrl = this.configService.get("application.applicationUrl") as string;
  }

  async register(registerBody: RegisterRequestDto): Promise<SuccessResponseDto> {
    const { email, username, avatarImage, backgroundImage, interests } = registerBody;
    const [emailAlreadyExists, usernameAlreadyExists] = await Promise.all([
      this.checkIfEmailAlreadyExists(email),
      this.checkIfUsernameAlreadyExists(username),
    ]);

    const avatarFile: FileEntity = await this.uploadFile(avatarImage, username);
    const backgroundFile: FileEntity = await this.uploadFile(backgroundImage, username);

    if (emailAlreadyExists) {
      throw new ConflictException(ErrorMessages.UserEmailAlreadyExists);
    }

    if (usernameAlreadyExists) {
      throw new ConflictException(ErrorMessages.UsernameAlreadyExists);
    }

    let interestsPromise: Promise<GenreEntity[]>;

    if (interests && interests.length) {
      interestsPromise = this.genreRepository.find({ where: { id: In(interests) }, select: ["id"] });
    }

    const [newGenres] = await Promise.all([interestsPromise]);

    await this.connection.transaction(
      async (entityManager): Promise<UserEntity> => {
        const usersTransactionalRepository = entityManager.getRepository(UserEntity);

        const newUser = await usersTransactionalRepository.save({
          ...registerBody,
          avatarImage: avatarFile,
          backgroundImage: backgroundFile,
          interests: newGenres,
        });

        return newUser;
      },
    );

    return {
      status: "successful",
    };
  }

  async login(loginBody: LoginRequestDto): Promise<LoginResponseDto> {
    const { email, username, password } = loginBody;

    const where: Partial<UserEntity> = {};

    if (email) {
      where.email = email;
    } else if (username) {
      where.username = username;
    }

    const user = await this.usersRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.avatarImage", "avatarImage")
      .where(where)
      .select([
        "user.id",
        "user.name",
        "user.lastName",
        "user.username",
        "user.email",
        "user.password",
        "user.role",
        "user.isVerified",
        "user.birthday",
      ])
      .getOne();

    const prevRefreshTokenPromise = this.refreshTokensRepository.findOne({ user }, { select: ["id", "token"] });

    if (!user) {
      throw new UnauthorizedException(ErrorMessages.WrongCredentials);
    }

    if (!user.isVerified) {
      throw new ForbiddenException(ErrorMessages.AccountNotVerified);
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException(ErrorMessages.WrongCredentials);
    }

    delete user.password;

    const tokensPromise = await this.createSessionAndRefreshTokens(user);

    const [tokens, prevRefreshToken] = await Promise.all([tokensPromise, prevRefreshTokenPromise]);

    await Promise.all([
      this.refreshTokensRepository.save({ ...prevRefreshToken, token: tokens.refreshToken, user }),
      this.usersRepository.save(user),
    ]);

    return {
      ...tokens,
      user,
    };
  }

  private async createSessionAndRefreshTokens(user: UserEntity): Promise<CreateSessionAndRefreshTokensResponseInterface> {
    const sessionTokenPayload: TokenInterface = {
      method: SESSION_TOKEN_METHOD,
      userId: user.id,
    };
    const sessionTokenPromise = this.jwtService.signAsync(sessionTokenPayload, { expiresIn: SESSION_TOKEN_EXPIRATION });

    const refreshTokenPayload: TokenInterface = {
      method: REFRESH_TOKEN_METHOD,
      userId: user.id,
    };

    const newRefreshTokenPromise = this.jwtService.signAsync(refreshTokenPayload);

    const [sessionToken, newRefreshToken] = await Promise.all([sessionTokenPromise, newRefreshTokenPromise]);

    return {
      sessionToken,
      refreshToken: newRefreshToken,
    };
  }

  async verifySessionToken(authorizationHeader: string): Promise<UserEntity> {
    const payload = await this.checkToken(authorizationHeader, SESSION_TOKEN_METHOD);

    const user = await this.usersRepository.findOne(
      { id: payload.userId },
      {
        select: ["id", "isVerified", "role", "username", "email", "name", "lastName"],
      },
    );

    if (!user) {
      throw new UnauthorizedException(ErrorMessages.UnauthorizedUser);
    }

    if (!user.isVerified) {
      throw new BadRequestException(ErrorMessages.AccountNotVerified);
    }

    return user;
  }

  private async checkToken(authorizationHeader: string, allowedMethod: string | string[]): Promise<TokenInterface> {
    if (!authorizationHeader) {
      throw new BadRequestException(ErrorMessages.AuthorizationHeaderNotFound);
    }

    if (!Array.isArray(allowedMethod)) {
      allowedMethod = [allowedMethod];
    }

    const [bearer, token] = authorizationHeader.split(" ");

    if (bearer.toLowerCase() !== "bearer" || !token) {
      throw new BadRequestException(ErrorMessages.AuthorizationHeaderBadFormed);
    }

    let payload: TokenInterface;

    try {
      payload = await this.jwtService.verifyAsync<TokenInterface>(token);
    } catch (e) {
      throw new UnauthorizedException(ErrorMessages.BadJwtToken);
    }

    if (!payload.userId || !payload.method || !allowedMethod.includes(payload.method)) {
      throw new UnauthorizedException(ErrorMessages.BadJwtToken);
    }

    return { ...payload, token };
  }

  private async uploadFile(newFile: DocumentDto, key: string): Promise<FileEntity> {
    const fileUniqueName = v5(key, v4());
    const folder = `${USERS_FOLDER}/${fileUniqueName}`;

    const file: FileToUploadInterface = {
      name: newFile.name,
      content: newFile.content,
      folder,
    };

    const [fileUploaded] = await this.filesService.uploadFiles([file]);

    return fileUploaded;
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
