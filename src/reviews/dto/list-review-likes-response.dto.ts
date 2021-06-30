import { ApiResponseProperty } from '@nestjs/swagger';

import { FileEntity } from '../../files/file.entity';

class UserData {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  lastName: string;

  @ApiResponseProperty()
  username: string;

  @ApiResponseProperty()
  avatarImage?: FileEntity;
}

export class ListReviewLikesResponseDto {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty({ type: UserData })
  user: UserData;
}
