import * as path from "path";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, NODE_ENV, DB_SSL } = process.env;

console.log(__dirname, [path.resolve(__dirname, "..", "**/**.entity!(*.d).{ts,js}")]);
export default {
  type: "postgres",
  database: DB_NAME,
  password: DB_PASSWORD,
  host: DB_HOST,
  username: DB_USER,
  entities: [path.resolve(__dirname, "..", "**/**.entity!(*.d).{ts,js}")],
  subscribers: [path.resolve(__dirname, "..", "**/**.subscriber!(*.d).{ts,js}")],
  synchronize: NODE_ENV === "local",
  logging: NODE_ENV === "local",
  ssl: DB_SSL === "true",
} as TypeOrmModuleOptions;
