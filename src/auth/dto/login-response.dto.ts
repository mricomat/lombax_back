import { GenreEntity } from 'src/genres/genre.entity';
import { ApiResponseProperty } from '@nestjs/swagger';

import { RolesEnum } from "../../users/enums/roles.enum";

class RefreshTokenData {
  @ApiResponseProperty()
  sessionToken: string;

  @ApiResponseProperty()
  refreshToken: string;
}

class UserLoginData {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  lastName: string;

  @ApiResponseProperty()
  username: string;

  @ApiResponseProperty()
  email: string;

  @ApiResponseProperty({ enum: RolesEnum })
  role: RolesEnum;

  @ApiResponseProperty()
  interests: GenreEntity[];

  @ApiResponseProperty()
  totalFollowers: number;

  @ApiResponseProperty()
  totalFollowing: number;

  @ApiResponseProperty()
  totalReviews: number;

  @ApiResponseProperty()
  totalGames: number;

  @ApiResponseProperty()
  totalDiary: number;

  // @ApiResponseProperty()
  // totalLikes: number;

  // @ApiResponseProperty()
  // totalLists: number;

  // todo favorites and recent activity
}

export class LoginResponseDto extends RefreshTokenData {
  @ApiResponseProperty({ type: UserLoginData })
  user: UserLoginData;
}
