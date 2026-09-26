import express from "express";
import { Express } from "express";
import { errorHandler } from "./middlewares/error.handler.js";
import { noRouteHandler } from "./middlewares/path.handler.js";
import { userRouter } from "./routers/user.router.js";
import { eventTypeRouter } from "./routers/eventType.router.js"
import { availabilityRouter, exceptionRouter} from "../src/routers/availbility.router.js"

const app: Express = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    timeStamp: new Date().toISOString()
  });
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/eventType", eventTypeRouter);
app.use("/api/v1/availbilityRule", availabilityRouter);
app.use("/api/v1/availabilityException", exceptionRouter);

app.use(noRouteHandler);
app.use(errorHandler);

export default  app;
