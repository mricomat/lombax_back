import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";
import {
  ConflictException,
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  SetMetadata,
  UnauthorizedException,
  Post,
} from "@nestjs/common";

import { GenresService } from "./genres.service";
import { GenreTypeEnum } from "./enum/genre-type.enum";
import { ListGenresResponseDto } from "./dto/list-genres-response.dto";
import { RolesEnum } from "../users/enums/roles.enum";
import { FilterByQuery } from "../common/queries/filter-by.query";
import { FilterByFieldTypeEnum } from "../common/enums/filter-by-field-type.enum";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { ValidationException } from "../common/exceptions/validation.exception";

@ApiTags("Genres")
@Controller("genres")
export class GenreController {
  constructor(private readonly genreService: GenresService) {}

  //@UseGuards(AuthGuard)
  @SetMetadata("roles", [RolesEnum.ADMIN, RolesEnum.USER])
  @ApiBearerAuth()
  @Get()
  @ApiOperation({
    description: "List tags",
  })
  @ApiQuery({
    name: "type",
    description: "Allows to filter by tag type. By default, it shows all the tags",
    type: "string",
    enum: GenreTypeEnum,
    required: false,
  })
  @ApiOkResponse({
    type: ListGenresResponseDto,
  })
  @ApiBadRequestResponse({
    type: BadRequestException,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedException,
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
  })
  listTags(
    @FilterByQuery({ field: "type", type: FilterByFieldTypeEnum.STRING, enumValue: GenreTypeEnum }) typeTag: GenreTypeEnum,
  ): Promise<ListGenresResponseDto> {
    return this.genreService.listTags(typeTag);
  }

  @SetMetadata("roles", [RolesEnum.ADMIN, RolesEnum.USER])
  @Post()
  @ApiOperation({
    description: "Register all genres",
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
  postGenres(): Promise<SuccessResponseDto> {
    return this.genreService.uploadListGenres();
  }
}
