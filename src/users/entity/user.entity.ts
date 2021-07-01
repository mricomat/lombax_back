import { BaseEntityAbstract } from "../../common/entities/base-entity.abstract";
import { IsAlphanumeric, IsBoolean, IsDate, IsEmail, IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, OneToMany } from "typeorm";
import { ApiResponseProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

import { IsAlphaBlank } from "../../common/custom-validators/is-alpha-blank.custom-validator";
import { RolesEnum } from "../enums/roles.enum";
import { FileEntity } from "../../files/file.entity";
import { GenreEntity } from "src/genres/genre.entity";
import { GameFeelEntity } from "src/gameFeel/gameFeel.entity";
import { ReviewEntity } from "src/reviews/entities/review.entity";
import { DiaryEntity } from "src/diaries/diary.entity";
import { FollowEntity } from "src/follows/follow.entity";

@Entity("Users")
export class UserEntity extends BaseEntityAbstract {
  @ApiResponseProperty()
  @IsString()
  @IsAlphaBlank()
  @IsNotEmpty()
  @Column()
  name: string;

  @ApiResponseProperty()
  @IsString()
  @IsAlphaBlank()
  @IsNotEmpty()
  @Column()
  lastName: string;

  @ApiResponseProperty()
  @IsString()
  @IsAlphanumeric()
  @IsNotEmpty()
  @Column({ unique: true })
  username: string;

  @ApiResponseProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Column({ unique: true })
  email: string;

  @Exclude({ toPlainOnly: true })
  @ApiResponseProperty()
  @IsString()
  @IsNotEmpty()
  @Column()
  password: string;

  @ApiResponseProperty()
  @IsString()
  @IsAlphaBlank()
  @Column()
  summary: string;

  @ApiResponseProperty()
  @OneToOne(() => FileEntity, { cascade: true, onDelete: "CASCADE" })
  @JoinColumn()
  avatarImage?: FileEntity;

  @ApiResponseProperty()
  @OneToOne(() => FileEntity, { cascade: true, onDelete: "CASCADE" })
  @JoinColumn()
  backgroundImage?: FileEntity;

  @ApiResponseProperty()
  @IsDate()
  @IsNotEmpty()
  @Column({ type: "timestamptz" })
  birthday: Date;

  @ApiResponseProperty({ enum: RolesEnum })
  @IsString()
  @IsEnum(RolesEnum)
  @IsNotEmpty()
  @Column({ enum: RolesEnum, default: RolesEnum.USER })
  role: RolesEnum;

  @ApiResponseProperty()
  @ManyToMany(() => GenreEntity, { cascade: true, onDelete: "CASCADE" })
  @JoinTable()
  interests: GenreEntity[];

  @OneToMany(() => GameFeelEntity, (gameFeel) => gameFeel.user)
  gameFeels?: GameFeelEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.user)
  reviews?: ReviewEntity[];

  @OneToMany(() => DiaryEntity, (diary) => diary.user)
  diary?: DiaryEntity[];

  @OneToMany(() => FollowEntity, (follow) => follow.requester)
  following?: FollowEntity[];

  @OneToMany(() => FollowEntity, (follow) => follow.addressee)
  followers?: FollowEntity[];

  @ApiResponseProperty()
  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  @Column({ default: false })
  isVerified: boolean;

  @ApiResponseProperty()
  @IsDate()
  @IsNotEmpty()
  @Column({ type: "timestamptz", nullable: true })
  lastLogin?: Date;
}
