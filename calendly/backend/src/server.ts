import app from "./app.js";
import { PORT } from "./config/env.js";
import { connectDatabase } from "./config/database.js";

async function startServer() {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log("[server] running on port : ", PORT);
  });
}

startServer().catch((err)=>{
  console.log("[server] Failed to run",err);
  process.exit(1);
});
