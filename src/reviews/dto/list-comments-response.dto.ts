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

export class ListCommentsResponseDto {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  text: string;

  @ApiResponseProperty({ type: UserData })
  user: UserData;

  @ApiResponseProperty({ type: [ListCommentsResponseDto] })
  childComments?: ListCommentsResponseDto[];
}
