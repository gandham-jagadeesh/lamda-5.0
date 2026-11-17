import { Connection, Client } from "@temporalio/client";
import { TEMPORAL_ADDRESS, TEMPORAL_NAMESPACE } from "./env.js";

let client: Client | null = null;

//try to get health check from the frontend worker service and then check whether its valid or not if its valid then its okay
export async function temporalHealthCheck() {
  const healthCheck = client ? await client.workflowService.getSystemInfo({}) : null ;
  console.log('[temporal] connected : cluster Info ', healthCheck);
}
export async function getTemporalClient() {
  if (client) {
    return client;
  }
  const connection = await  Connection.connect({
    address: TEMPORAL_ADDRESS
  });

  client = new Client({
    connection,
    namespace: TEMPORAL_NAMESPACE
  })
  return client;
}

export async function disconnectTemporal() {
  if (client) {
    await client.connection.close();
    client = null;
  }
}
