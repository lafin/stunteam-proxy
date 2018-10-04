import http from "http";
import https from "https";
import url from "url";

import logger from "./logger";

const { URL = "https://browserleaks.com" } = process.env;

const action = (res: http.ServerResponse) => (message: http.IncomingMessage) => {
  message.on("data", (data) => res.write(data)).on("end", () => res.end());
};

logger.info(`URL: ${URL}`);
process.on("SIGTERM", () => process.exit(1));
process.on("SIGINT", () => process.exit(1));

http
  .createServer()
  .on("request", (req: http.IncomingMessage, res: http.ServerResponse) => {
    try {
      const urlMeta = url.parse(URL);
      logger.info(`Request URL: ${URL}${req.url}`);
      if (urlMeta.protocol === "https:") {
        https.get(`${URL}${req.url}`, action(res));
      } else if (urlMeta.protocol === "http:") {
        http.get(`${URL}${req.url}`, action(res));
      } else {
        logger.error(`Not supported protocol: ${urlMeta.protocol}`);
        res.statusCode = 400;
        res.end();
      }
    } catch (e) {
      logger.error(e.message);
      res.statusCode = 500;
      res.end();
    }
  })
  .listen(80);
