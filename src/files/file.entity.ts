import { Column, Entity } from "typeorm";
import { Exclude } from "class-transformer";
import { ApiResponseProperty } from "@nestjs/swagger";

import { BaseEntityAbstract } from "../common/entities/base-entity.abstract";

@Entity("Files")
export class FileEntity extends BaseEntityAbstract {
  @ApiResponseProperty()
  @Column()
  name: string;

  @Exclude()
  @Column()
  path: string;

  @ApiResponseProperty()
  @Column()
  mimetype: string;

  @ApiResponseProperty()
  @Column()
  url: string;
}
