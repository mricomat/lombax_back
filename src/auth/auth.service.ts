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
import { v4, v5 } from "uuid";

import { UserEntity } from "../users/entity/user.entity";
import { RegisterRequestDto } from "./dto/register-request.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { ErrorMessages } from "../utils/error-messages";
import { USERS_FOLDER } from "../users/constants/users-folder.constants";
import { FileToUploadInterface } from "../files/interfaces/file-to-upload.interface";
import { FilesService } from "../files/files.service";
import { FileEntity } from "src/files/file.entity";
import { DocumentDto } from "src/common/dto/document.dto";

export class AuthService {
  private readonly applicationUrl: string;

  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly filesService: FilesService,
  ) {
    this.applicationUrl = this.configService.get("application.applicationUrl") as string;
  }

  async register(registerBody: RegisterRequestDto): Promise<SuccessResponseDto> {
    const { email, username, avatarImage, backgroundImage } = registerBody;
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

    await this.connection.transaction(
      async (entityManager): Promise<UserEntity> => {
        const usersTransactionalRepository = entityManager.getRepository(UserEntity);

        const newUser = await usersTransactionalRepository.save({ ...registerBody, avatarImage: avatarFile, backgroundImage: backgroundFile });

        return newUser;
      },
    );

    return {
      status: "successful",
    };
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
