import express from "express";
import { Express } from "express";
import { errorHandler } from "./middlewares/error-handler.js";
import { userRouter } from "./routers/user.router.js";
const app: Express = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timeStamp: new Date().toISOString()
  });
});

app.use("/api/v1/user", userRouter);

// app.use(noRouteHandler);
app.use(errorHandler);

export default  app;
