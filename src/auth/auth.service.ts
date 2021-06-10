import { Connection, Repository } from "typeorm";
import { ConfigService } from "nestjs-config";
import { InjectConnection, InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";

import { UserEntity } from "../users/entity/user.entity";
import { RegisterRequestDto } from "./dto/register-request.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";

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
    return {
      status: "successful",
    };
  }
}
