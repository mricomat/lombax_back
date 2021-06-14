import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Diaries")
@Controller("diaries")
export class DiariesController {
  constructor() {}
}
