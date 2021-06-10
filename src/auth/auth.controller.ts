import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Query,
  UnauthorizedException,
} from "@nestjs/common";

import { AuthService } from "./auth.service";
import { RegisterRequestDto } from "./dto/register-request.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { ValidationException } from '../common/exceptions/validation.exception';

@ApiTags("Auth")
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({
    description: "Registers a new user",
  })
  @ApiCreatedResponse({
    type: SuccessResponseDto,
  })
  @ApiConflictResponse({
    type: ConflictException,
  })
  @ApiUnprocessableEntityResponse({
    type: ValidationException,
  })
  @ApiBadRequestResponse({
    type: BadRequestException,
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
  })
  register(@Body() registerBody: RegisterRequestDto): Promise<SuccessResponseDto> {
    return this.authService.register(registerBody);
  }
}
