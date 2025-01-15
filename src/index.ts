require("dotenv").config({ path: "/etc/twitter-service.env" });
import app from "./app";
import { logger } from "./logger";
import { cacheClient } from "./storage/redis";
import {
  resetGithubLimitJob,
  resetHotProfilesLimitJob,
  resetLimitJob,
  resetMentionsLimitJob,
  resetPriorityReplyLimitJob,
  resetTokenCreationLimitJob,
  resetTweetLimitJob,
} from "./workers/checkLimit";

const port = process.env.PORT || 5000;
// starting job
resetLimitJob();
resetTweetLimitJob();
resetHotProfilesLimitJob();
resetMentionsLimitJob();
resetTokenCreationLimitJob();
resetPriorityReplyLimitJob();
resetGithubLimitJob();

// event listner on connect
cacheClient.on("connect", function () {
  logger.info("Connected to redis!");
  app.listen(port, () => {
    /* eslint-disable no-console */
    console.log(`Listening: http://localhost:${port}`);
    /* eslint-enable no-console */
  });
});
// event listner on error
cacheClient.on("error", (err) => logger.error("Redis Client Error", err));
// connect redis
cacheClient.connect();
