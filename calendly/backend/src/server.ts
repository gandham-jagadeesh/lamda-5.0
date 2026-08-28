import app from "./app.js";
import { PORT } from "./config/env.js";


async  function startServer() {
  app.listen(PORT, () => {
    console.log("[server] running on port : ", PORT);
  });
}

startServer().catch((err)=>{
  console.log("[server] Failed to run",err);
  process.exit(1);
});
