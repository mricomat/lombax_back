import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

import { trimStringHelper } from "../../utils/transformers-helpers/trim-string-helper";

export class CreateFollowRequestDto {
  @ApiProperty()
  @Transform(trimStringHelper)
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  followId: string;
}
