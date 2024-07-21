import cors from "cors";
import express from "express";
import http from "http";
import morgan from "morgan";
import { env } from "process";
import { errorHandler } from "./common/middlewares/error.handler.js";
import { AccessLogStream, Logger } from "./common/utils/logger.js";
import { runOldProjectAutomationJobAsync } from "./events/product-scheduler.js";
import { APP_CONFIG } from "./infrastruture/configs/index.js";
import { RedisClient } from "./infrastruture/connections/redis.js";
import { jobRouter, rootRouter } from "./routes/index.js";

env.TZ = "Asia/Ho_Chi_Minh";

const app = express();
const httpServer = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: APP_CONFIG.origin,
        credentials: APP_CONFIG.credential,
        allowedHeaders: "X-Requested-With, X-HTTP-Method-Override, X-Request-Id, Content-Type, Authorization, Accept",
        methods: "GET, POST, PUT, PATCH, DELETE",
    })
);

app.use(morgan("combined", { stream: new AccessLogStream() }));

// set custom headers
app.use(function (req, res, next) {
    next();
});

// disable get favicon with 404 error
app.get("/favicon.ico", (req, res) => res.status(204).end());

// handle API route here
app.use("/v1", jobRouter);
app.use(rootRouter);

// 404
app.use(function (req, res, next) {
    res.sendStatus(404);
});

// error
app.use(errorHandler);

const PORT = APP_CONFIG.appPort;

httpServer.listen(PORT, () => {
    Logger.info(`Server is listening on port:${PORT}`);
});

// init redis connection
// RedisClient.initRedisConnectionAsync();

runOldProjectAutomationJobAsync();
