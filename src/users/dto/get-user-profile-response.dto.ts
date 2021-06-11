import { ApiResponseProperty } from "@nestjs/swagger";

import { RolesEnum } from "../enums/roles.enum";

export class GetUserProfileResponseDto {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  lastName: string;

  @ApiResponseProperty()
  email: string;

  @ApiResponseProperty()
  username: string;

  @ApiResponseProperty()
  summary: string;

  @ApiResponseProperty({ enum: RolesEnum })
  role: RolesEnum;

  @ApiResponseProperty()
  lastLogin?: Date;
}
