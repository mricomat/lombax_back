import { ObjectLiteral, Repository, Connection } from "typeorm";
import axios from 'axios';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { GenreUploadInterface } from './interface/genre-upload.interface';
import { GenreEntity } from './genre.entity';
import { GenreTypeEnum } from "./enum/genre-type.enum";
import { ListGenresResponseDto } from "./dto/list-genres-response.dto";
import IGDBConfig from '../config/igdbapi';
import { SuccessResponseDto } from '../common/dto/success-response.dto';

@Injectable()
export class GenresService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectRepository(GenreEntity) private readonly genresRepository: Repository<GenreEntity>,
  ) {}

  async listTags(type: GenreTypeEnum): Promise<ListGenresResponseDto> {
    const where: ObjectLiteral = {};

    if (type) {
      where.type = type;
    }

    const genres = await this.genresRepository.find({ where, select: ["id", "name", "type"], order: { type: "ASC", name: "ASC" } });

    return {
      genres,
    };
  }

  async uploadListGenres(): Promise<SuccessResponseDto> {
    const genres = await this.post("/genres", `fields checksum,created_at,name,slug,updated_at,url;limit 500;`);
    const themes = await this.post("/themes", `fields checksum,created_at,name,slug,updated_at,url;limit 500;`);
    const dataList: GenreUploadInterface[] = [];
    genres.data.forEach((i) => dataList.push({ idS: i.id, name: i.name, type: GenreTypeEnum.GENRE, slug: i.slug }));
    themes.data.forEach((i) => dataList.push({ idS: i.id, name: i.name, type: GenreTypeEnum.THEME, slug: i.slug }));

    await this.connection.transaction(
      async (entityManager): Promise<void> => {
        const genresTransactionalRepository = entityManager.getRepository(GenreEntity);
        await genresTransactionalRepository.save(dataList);
      },
    );
    return {
      status: "successful",
    };
  }

  private async getToken(): Promise<string> {
    return await axios
      .post(
        IGDBConfig.igdbToken,
        {},
        { params: { client_id: IGDBConfig.igdbClientId, client_secret: IGDBConfig.igdbClientSecret, grant_type: "client_credentials" } },
      )
      .then((response) => response.data.access_token)
      .catch((err) => console.log(err));
  }

  private async post(endPoint: string, body: any) {
    const auth = await this.getToken();
    const headers = {
      "Client-ID": IGDBConfig.igdbClientId,
      Authorization: `Bearer ${auth}`,
      Accept: "application/json",
    };

    return await axios
      .post(`${IGDBConfig.igdbUrl}${endPoint}`, body, { headers })
      .then((response) => ({ error: false, data: response.data, url: endPoint }))
      .catch((err) => {
        console.log(err);
        const error = JSON.parse(JSON.stringify(err));
        // console.log(endPoint, error);
        return { error: true, data: error, url: endPoint };
      });
  }
}
