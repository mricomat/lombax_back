import { IsAlphanumeric, IsDate, IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator";
import { Transform, Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { trimStringHelper } from "../../utils/transformers-helpers/trim-string-helper";
import { toLowerCaseStringHelper } from "../../utils/transformers-helpers/to-lower-case-string-helper";
import { ErrorMessages } from "../../utils/error-messages";
import { IsValidPassword } from "../../common/custom-validators/is-valid-password.custom-validator";
import { IsAlphaBlank } from "../../common/custom-validators/is-alpha-blank.custom-validator";

export class RegisterRequestDto {
  @ApiProperty()
  @Transform(trimStringHelper)
  @IsString()
  @IsAlphaBlank()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Transform(trimStringHelper)
  @IsString()
  @IsAlphaBlank()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  birthday: Date;

  @ApiProperty()
  @Transform(trimStringHelper)
  @Transform(toLowerCaseStringHelper)
  @IsString()
  @IsAlphanumeric()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @Transform(trimStringHelper)
  @Transform(toLowerCaseStringHelper)
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @Transform(trimStringHelper)
  @IsString()
  @IsAlphaBlank()
  @IsNotEmpty()
  summary: string;

  @ApiProperty()
  @IsString()
  @IsValidPassword({
    message: ErrorMessages.PasswordInvalid,
  })
  @IsNotEmpty()
  password: string;

  // TODO
  // Interests
  // avatar
  // background
}
