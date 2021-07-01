import axios from "axios";
import { Injectable } from "@nestjs/common";

import IGDBConfig from "../config/igdbapi";

let auth = "";

axios.defaults.baseURL = IGDBConfig.igdbUrl;
axios.defaults.headers.common.Accept = "application/json";

@Injectable()
export class IGDBService {
  constructor() {}
  private async getToken(): Promise<any> {
    return await axios
      .post(
        IGDBConfig.igdbToken,
        {},
        { params: { client_id: IGDBConfig.igdbClientId, client_secret: IGDBConfig.igdbClientSecret, grant_type: "client_credentials" } },
      )
      .then((response) => {
        return response.data.access_token;
      })
      .catch((err) => console.log(err));
  }

  async getGames(query: any): Promise<{ error: boolean; data: any }> {
    if (auth === null || auth === "" || auth === undefined) auth = await this.getToken();
    const headers = {
      "Client-ID": IGDBConfig.igdbClientId,
      Authorization: `Bearer ${auth}`,
    };

    return await axios
      .post(`/games`, query, { headers })
      .then((response) => {
        return { error: false, data: response.data };
      })
      .catch((err) => {
        console.log(err);
        const error = JSON.parse(JSON.stringify(err));
        return { error: true, data: error };
      });
  }
}
