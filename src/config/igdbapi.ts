import { IGDBConfigInterface } from "../common/interfaces/igdb-config.interface";

const { IGDB_URL, IGDB_TOKEN, IGDB_CLIENT_ID, IGDB_CLIENT_SECRET } = process.env;

// export default {
//   igdbUrl: IGDB_URL,
//   igdbToken: IGDB_TOKEN,
//   igdbClientId: IGDB_CLIENT_ID,
//   igdbClientSecret: IGDB_CLIENT_SECRET,
// } as IGDBConfigInterface;
export default {
  igdbUrl: "https://api.igdb.com/v4",
  igdbToken: "https://id.twitch.tv/oauth2/token",
  igdbClientId: "wlakph670srij9zlzw1lnyan72c3ft",
  igdbClientSecret: "2b7wgrj4vef7hw8o0srkpba2id4hie",
} as IGDBConfigInterface;
