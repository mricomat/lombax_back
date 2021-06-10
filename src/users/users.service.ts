import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectConnection, InjectRepository } from "@nestjs/typeorm";
import { Brackets, Connection, DeleteResult, In, ObjectLiteral, Raw, Repository } from "typeorm";

import { UserEntity } from "./entity/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>,
  ) {}
}
