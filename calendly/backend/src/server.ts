import app from "./app.js";
import { PORT } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import { getTemporalClient, temporalHealthCheck } from "./config/temporal.js";
import { connectRedis } from "./config/redis.js"; 
async function startServer() {
  await connectDatabase();
  await getTemporalClient();
  await temporalHealthCheck();
  await connectRedis();
  app.listen(PORT, () => {
    console.log("[server] running on port : ", PORT);
  });
}

startServer().catch((err)=>{
  console.log("[server] Failed to run",err);
  process.exit(1);
});
