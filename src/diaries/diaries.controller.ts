import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';

@ApiTags("Diaries")
@Controller("diaries")
export class DiariesController {
  constructor() {}
}
