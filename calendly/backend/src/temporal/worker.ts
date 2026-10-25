import { NativeConnection , Worker } from "@temporalio/worker"
import { TEMPORAL_ADDRESS , TEMPORAL_NAMESPACE , TEMPORAL_TASK_QUEUE} from "../config/env.js"
import * as activites from "./activites/index.js";
import { fileURLToPath } from "node:url";
import { extname } from "path";

const workflowsExtension = extname(fileURLToPath(import.meta.url));
async function run() {
  const connection = await NativeConnection.connect({
    address: TEMPORAL_ADDRESS
  });
  const worker = await Worker.create({
    connection,
    namespace: TEMPORAL_NAMESPACE,
    activities:activites,
    taskQueue: TEMPORAL_TASK_QUEUE,
    workflowsPath: fileURLToPath(new URL(`./workflows/index${workflowsExtension}`, import.meta.url))
  });
  console.log(`[temporal] worker started for task queue :${TEMPORAL_TASK_QUEUE}`);
  await worker.run();
}

run().catch((err) => {
  console.error(`[temporal] Error starting worker`, err);
  process.exit(1);
})
