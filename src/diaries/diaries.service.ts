import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectRepository } from "@nestjs/typeorm";

import { UserEntity } from "src/users/entity/user.entity";
import { Connection, Repository } from "typeorm";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { DiaryEntity } from "./diary.entity";
import { DiaryRequestDto } from "./dto/diary-request.dto";

@Injectable()
export class DiariesService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async saveNewDiary(user: UserEntity, diaryBody: DiaryRequestDto): Promise<SuccessResponseDto> {
    await this.connection.transaction(
      async (entityManager): Promise<DiaryEntity> => {
        const diaryTransactionalRepository = entityManager.getRepository(DiaryEntity);

        const diary = await diaryTransactionalRepository.save({ ...diaryBody, game: diaryBody.game, user });

        return diary;
      },
    );

    return {
      status: "successful",
    };
  }
}
