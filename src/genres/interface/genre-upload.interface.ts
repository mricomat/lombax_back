import { GenreTypeEnum } from "../enum/genre-type.enum";

export interface GenreUploadInterface {
  name: string;
  idS: string;
  slug: string;
  type: GenreTypeEnum;
}
