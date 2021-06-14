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
import { ValidationException } from "../common/exceptions/validation.exception";
import { LoginResponseDto } from "./dto/login-response.dto";
import { LoginRequestDto } from "./dto/login-request.dto";

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

  @Post("login")
  @HttpCode(200)
  @ApiOperation({
    description: "Login a user",
  })
  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedException,
  })
  @ApiForbiddenResponse({
    type: ForbiddenException,
  })
  @ApiUnprocessableEntityResponse({
    type: ValidationException,
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
  })
  login(@Body() loginBody: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.login(loginBody);
  }
}
