import app from './app';
import { APP_PORT } from "./utilities/secrets";
import logger from "./utilities/logger";

app
  .listen(process.env.PORT || 5000, () => {
    logger.info(`server running on port : ${process.env.PORT || 5000}`);
    console.log(`server running on port : ${process.env.PORT || 5000}`);
  })
  .on('error', (e) => logger.error(e));
