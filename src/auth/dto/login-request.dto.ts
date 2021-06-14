import { IsAlphanumeric, IsEmail, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { trimStringHelper } from '../../utils/transformers-helpers/trim-string-helper';
import { toLowerCaseStringHelper } from '../../utils/transformers-helpers/to-lower-case-string-helper';
import { ErrorMessages } from '../../utils/error-messages';
import { IsValidPassword } from '../../common/custom-validators/is-valid-password.custom-validator';

export class LoginRequestDto {
  @ApiPropertyOptional()
  @ValidateIf((dto: LoginRequestDto) => !dto.username)
  @Transform(trimStringHelper)
  @Transform(toLowerCaseStringHelper)
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @ApiPropertyOptional()
  @ValidateIf((dto: LoginRequestDto) => !dto.email)
  @Transform(trimStringHelper)
  @Transform(toLowerCaseStringHelper)
  @IsString()
  @IsAlphanumeric()
  @IsNotEmpty()
  username?: string;

  @ApiProperty()
  @IsString()
  @IsValidPassword({
    message: ErrorMessages.PasswordInvalid,
  })
  @IsNotEmpty()
  password: string;
}
